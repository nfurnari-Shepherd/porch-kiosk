'use server'

import { supabase } from '@/lib/supabase'
import { appendRegistration } from '@/lib/sheets'
import { translateServiceToSpanish } from '@/lib/translate'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Anthropic from '@anthropic-ai/sdk'

export async function registerForService(prevState, formData) {
  const name = formData.get('name')?.toString().trim()
  const zipCode = formData.get('zip_code')?.toString().trim()
  const phone = formData.get('phone')?.toString().trim() || null
  const serviceId = formData.get('service_id')?.toString()
  const serviceName = formData.get('service_name')?.toString()

  if (!name || !zipCode) {
    return { error: 'Name and zip code are required.' }
  }

  const { error } = await supabase.from('registrations').insert({
    name,
    zip_code: zipCode,
    phone,
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

export async function voiceChat(messages, services) {
  const client = new Anthropic()

  const servicesList = services
    .map(s => `ID: ${s.id} | Name: "${s.name}" | About: "${s.description || 'Community resource'}"`)
    .join('\n')

  const response = await client.messages.create({
    model: 'claude-opus-5',
    max_tokens: 300,
    system: `You are a warm, compassionate helper at The Porch, a resource center at Shepherd Community Center in Indianapolis, Indiana. You help neighbors who are struggling find the right resources.

Available services:
${servicesList}

Instructions:
- Respond in the same language the person is speaking (English or Spanish)
- Be gentle, warm, and encouraging — like a trusted friend, never clinical
- Keep your response to 2-3 sentences
- When you identify relevant services, end your message with exactly: "Tap one of the service cards below to get started." (in Spanish: "Toca una de las tarjetas de servicio a continuación para comenzar.")
- If nothing clearly matches, ask one gentle clarifying question

Return ONLY valid JSON, no other text:
{"message": "your warm response", "serviceIds": ["id1", "id2"]}

Use [] if no services match. IDs must exactly match the list above.`,
    messages,
  })

  const text = response.content[0].text.trim()
  const match = text.match(/\{[\s\S]*\}/)
  if (!match) return { message: text, serviceIds: [] }
  return JSON.parse(match[0])
}
