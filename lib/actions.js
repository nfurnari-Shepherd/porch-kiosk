'use server'

import { supabase } from '@/lib/supabase'
import { appendRegistration } from '@/lib/sheets'
import { translateServiceToSpanish } from '@/lib/translate'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Anthropic from '@anthropic-ai/sdk'
import { sendSMS } from '@/lib/twilio'
import { sendEmail } from '@/lib/resend'

export async function registerForService(prevState, formData) {
  const name = formData.get('name')?.toString().trim()
  const zipCode = formData.get('zip_code')?.toString().trim()
  const phone = formData.get('phone')?.toString().trim() || null
  const email = formData.get('email')?.toString().trim() || null
  const serviceId = formData.get('service_id')?.toString()
  const serviceName = formData.get('service_name')?.toString()

  if (!name || !zipCode) {
    return { error: 'Name and zip code are required.' }
  }

  const { error } = await supabase.from('registrations').insert({
    name,
    zip_code: zipCode,
    phone,
    email,
    service_id: serviceId,
    service_name: serviceName,
  })

  if (error) {
    console.error('Registration error:', error)
    return { error: 'Something went wrong. Please try again.' }
  }

  try {
    await appendRegistration({ name, service: serviceName, zipCode, phone })
  } catch (err) {
    console.error('Google Sheets sync failed:', err)
  }

  // Fetch service notification contacts
  const { data: service } = await supabase
    .from('services')
    .select('notification_phone, notification_email')
    .eq('id', serviceId)
    .single()

  const notifyNumber = service?.notification_phone || process.env.STAFF_PHONE_NUMBER
  const notifyEmail = service?.notification_email || null
  const date = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })

  try {
    if (phone) {
      await sendSMS(phone, `Shepherd Community Center: Thanks for signing up for ${serviceName} at The Porch! A staff member will follow up with you soon. Reply STOP to opt out.`)
    }
    if (notifyNumber) {
      await sendSMS(notifyNumber, `The Porch: New sign-up — ${name} for ${serviceName}.${phone ? ` Phone: ${phone}.` : ''} Please follow up when available.`)
    }
  } catch (err) {
    console.error('SMS failed:', err)
  }

  const vars = { name, service: serviceName, phone: phone || '—', email: email || '—', date }
  try {
    if (email) {
      await sendEmail(email, 'neighbor_signup', vars)
    }
    if (notifyEmail) {
      await sendEmail(notifyEmail, 'staff_signup', vars)
    }
  } catch (err) {
    console.error('Email failed:', err)
  }

  redirect(`/confirm?name=${encodeURIComponent(name)}&service=${encodeURIComponent(serviceName)}`)
}

export async function adminLogin(prevState, formData) {
  const password = formData.get('password')?.toString()

  if (password === process.env.ADMIN_PASSWORD) {
    const cookieStore = await cookies()
    cookieStore.set('admin_session', password, {
      httpOnly: true,
      maxAge: 60 * 60 * 8,
      path: '/',
    })
    redirect('/admin/registrations')
  }

  return { error: 'Incorrect password.' }
}

export async function adminLogout() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_session')
  redirect('/admin')
}

export async function updateService(id, prevState, formData) {
  const cookieStore = await cookies()
  if (cookieStore.get('admin_session')?.value !== process.env.ADMIN_PASSWORD) {
    redirect('/admin')
  }

  const name = formData.get('name')
  const description = formData.get('description') || null
  const details = formData.get('details') || null
  const hours = formData.get('hours') || null
  const what_to_bring = formData.get('what_to_bring') || null

  let translations = {}
  try {
    translations = await translateServiceToSpanish({ name, description, details, hours, what_to_bring })
  } catch (err) {
    console.error('Auto-translation failed:', err)
  }

  const { error } = await supabase
    .from('services')
    .update({
      name,
      icon: formData.get('icon'),
      description,
      details,
      phone: formData.get('phone') || null,
      hours,
      what_to_bring,
      is_active: formData.get('is_active') === 'true',
      sort_order: parseInt(formData.get('sort_order') || '0'),
      notification_phone: formData.get('notification_phone') || null,
      name_es: translations.name || null,
      description_es: translations.description || null,
      details_es: translations.details || null,
      hours_es: translations.hours || null,
      what_to_bring_es: translations.what_to_bring || null,
    })
    .eq('id', id)

  if (error) {
    console.error('Update service error:', error)
    return { error: 'Failed to save changes.' }
  }

  redirect('/admin/services')
}

export async function checkIn(prevState, formData) {
  const name = formData.get('name')?.toString().trim() || null
  const phone = formData.get('phone')?.toString().trim() || null

  if (!name && !phone) {
    return { error: 'Please enter your name or phone number.' }
  }

  // Look up most recent registration by name or phone
  let query = supabase
    .from('registrations')
    .select('name, service_name, service_id, phone')
    .order('created_at', { ascending: false })
    .limit(1)

  if (phone) {
    query = query.ilike('phone', `%${phone.replace(/\D/g, '').slice(-10)}%`)
  } else {
    query = query.ilike('name', `%${name}%`)
  }

  const { data } = await query
  const registration = data?.[0]

  if (!registration) {
    return {
      error: phone
        ? 'We couldn\'t find a registration under that number. Please see a staff member.'
        : 'We couldn\'t find a registration under that name. Please see a staff member.',
    }
  }

  // Get notification contacts for this service
  const { data: service } = await supabase
    .from('services')
    .select('notification_phone, notification_email')
    .eq('id', registration.service_id)
    .single()

  const notifyNumber = service?.notification_phone || process.env.STAFF_PHONE_NUMBER
  const notifyEmail = service?.notification_email || null
  const date = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })

  try {
    if (notifyNumber) {
      await sendSMS(notifyNumber, `The Porch: ${registration.name} has arrived for ${registration.service_name}. Please greet them at the front desk!`)
    }
  } catch (err) {
    console.error('Check-in SMS failed:', err)
  }

  const vars = { name: registration.name, service: registration.service_name, phone: registration.phone || '—', date }
  try {
    if (notifyEmail) {
      await sendEmail(notifyEmail, 'staff_checkin', vars)
    }
  } catch (err) {
    console.error('Check-in email failed:', err)
  }

  return { success: true }
}

export async function updateEmailTemplate(slug, prevState, formData) {
  const cookieStore = await cookies()
  if (cookieStore.get('admin_session')?.value !== process.env.ADMIN_PASSWORD) {
    redirect('/admin')
  }

  const { error } = await supabase
    .from('email_templates')
    .update({
      subject: formData.get('subject'),
      body: formData.get('body'),
      updated_at: new Date().toISOString(),
    })
    .eq('slug', slug)

  if (error) {
    console.error('Update template error:', error)
    return { error: 'Failed to save template.' }
  }

  redirect('/admin/emails')
}

export async function updateOfficeSetting(prevState, formData) {
  const cookieStore = await cookies()
  if (cookieStore.get('admin_session')?.value !== process.env.ADMIN_PASSWORD) {
    redirect('/admin')
  }

  const { error } = await supabase
    .from('settings')
    .upsert({ key: 'office_email', value: formData.get('office_email')?.toString().trim() })

  if (error) {
    console.error('Update setting error:', error)
    return { error: 'Failed to save.' }
  }

  return { success: true }
}

export async function voiceChat(messages, services) {
  const client = new Anthropic()

  const servicesList = services
    .map(s => `ID: ${s.id} | Name: "${s.name}" | About: "${s.description || 'Community resource'}"`)
    .join('\n')

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 300,
    system: `You are a warm, compassionate helper at The Porch, a resource center at Shepherd Community Center in Indianapolis, Indiana. You help neighbors who are struggling find the right resources.

Available services:
${servicesList}

Instructions:
- Respond in the same language the person is speaking (English or Spanish)
- Be gentle, warm, and encouraging — like a trusted friend, never clinical
- Keep your response to 2-3 sentences
- When you identify relevant services, end your message with exactly: "Tap one of the service cards below to get started." (in Spanish: "Toca una de las tarjetas de servicio a continuación para comenzar.")
- If the person says they are here to check in, have an appointment, or are returning for a service, set checkIn to true and say something like: "Welcome back! Tap the button below to let your provider know you've arrived." (in Spanish: "¡Bienvenido de nuevo! Toca el botón de abajo para avisar a tu proveedor que llegaste.")
- If nothing clearly matches, ask one gentle clarifying question

Return ONLY valid JSON, no other text:
{"message": "your warm response", "serviceIds": ["id1", "id2"], "checkIn": false}

Use [] for serviceIds if no services match. IDs must exactly match the list above. Set checkIn to true only when the person wants to check in for an existing appointment.`,
    messages,
  })

  const text = response.content[0].text.trim()
  const match = text.match(/\{[\s\S]*\}/)
  if (!match) return { message: text, serviceIds: [] }
  return JSON.parse(match[0])
}
