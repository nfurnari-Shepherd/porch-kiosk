import { supabase } from '@/lib/supabase'

function fill(template, vars) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? '')
}

export async function sendEmail(to, slug, vars, { cc } = {}) {
  if (!process.env.SENDGRID_API_KEY || !process.env.SENDGRID_FROM) {
    console.error('SENDGRID_API_KEY or SENDGRID_FROM not set')
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

  const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [{
        to: [{ email: to }],
        ...(ccList.length ? { cc: ccList.map(e => ({ email: e })) } : {}),
      }],
      from: { email: process.env.SENDGRID_FROM, name: 'The Porch' },
      subject: fill(tpl.subject, vars),
      content: [
        { type: 'text/plain', value: bodyText },
        { type: 'text/html', value: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#333">${bodyHtml}</div>` },
      ],
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('SendGrid error:', err)
  }
}
