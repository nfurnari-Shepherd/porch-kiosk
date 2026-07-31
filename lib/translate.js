import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

export async function translateServiceToSpanish({ name, description, details, hours, what_to_bring }) {
  const fields = { name, description, details, hours, what_to_bring }
  const nonEmpty = Object.entries(fields).filter(([, v]) => v && v.trim())
  if (nonEmpty.length === 0) return {}

  const input = nonEmpty.map(([k, v]) => `${k}: ${v}`).join('\n')

  const message = await client.messages.create({
    model: 'claude-opus-5',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `Translate the following community service information from English to Spanish. Return ONLY a JSON object with the same keys but Spanish values. Keep phone numbers, zip codes, and proper nouns (like "The Porch") unchanged. Use plain, simple Spanish appropriate for a general community audience.

${input}

Return only valid JSON, no explanation.`,
      },
    ],
  })

  const raw = message.content[0].text.trim()
  const jsonMatch = raw.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('No JSON in translation response')
  return JSON.parse(jsonMatch[0])
}
