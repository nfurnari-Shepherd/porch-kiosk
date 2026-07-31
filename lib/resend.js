import nodemailer from 'nodemailer'
import { supabase } from '@/lib/supabase'

function fill(template, vars) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? '')
}

export async function sendEmail(to, slug, vars, { cc } = {}) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.error('GMAIL_USER or GMAIL_APP_PASSWORD not set')
    return
  }
  if (!to) return

  const [{ data: tpl }, { data: setting }] = await Promise.all([
    supabase.from('email_templates').select('subject, body').eq('slug', slug).single(),
    supabase.from('settings').select('value').eq('key', 'office_email').single(),
  ])

  if (!tpl) { console.error(`Email template not found: ${slug}`); return }

  const officeEmail = setting?.value || null
  const ccList = [cc, officeEmail].filter(Boolean)

  const bodyText = fill(tpl.body, vars)
  const bodyHtml = bodyText
    .split('\n\n')
    .map(p => `<p style="margin:0 0 16px">${p.replace(/\n/g, '<br>')}</p>`)
    .join('')

  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  })

  try {
    await transport.sendMail({
      from: `The Porch <${process.env.GMAIL_USER}>`,
      to,
      ...(ccList.length ? { cc: ccList.join(', ') } : {}),
      subject: fill(tpl.subject, vars),
      text: bodyText,
      html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#333">${bodyHtml}</div>`,
    })
  } catch (err) {
    console.error('Email send error:', err)
  }
}
