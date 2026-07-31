import { supabase } from '@/lib/supabase'

const API_KEY = process.env.RESEND_API_KEY
const FROM = process.env.RESEND_FROM || 'The Porch <onboarding@resend.dev>'

function fill(template, vars) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? '')
}

export async function sendEmail(to, slug, vars, { cc } = {}) {
  if (!API_KEY) { console.error('RESEND_API_KEY not set'); return }
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

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM,
      to: [to],
      ...(ccList.length ? { cc: ccList } : {}),
      subject: fill(tpl.subject, vars),
      html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#333">${bodyHtml}</div>`,
      text: bodyText,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('Resend error:', err)
  }
}
