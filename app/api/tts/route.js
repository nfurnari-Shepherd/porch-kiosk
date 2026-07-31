export async function POST(request) {
  const { text, lang } = await request.json()

  const response = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'tts-1',
      voice: lang === 'es' ? 'nova' : 'nova',
      input: text,
      response_format: 'mp3',
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    console.error('OpenAI TTS error:', err)
    return new Response('TTS failed', { status: 500 })
  }

  const audio = await response.arrayBuffer()
  return new Response(audio, {
    headers: { 'Content-Type': 'audio/mpeg' },
  })
}
