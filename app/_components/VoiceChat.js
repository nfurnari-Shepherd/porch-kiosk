'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { voiceChat } from '@/lib/actions'

const GREETING = {
  en: "Hi! How can I help you today? Tell me what you need and I'll help direct you to the right resources.",
  es: '¡Hola! ¿En qué puedo ayudarte hoy? Cuéntame qué necesitas y te ayudaré a encontrar los recursos correctos.',
}

export default function VoiceChat({ services = [], lang = 'en' }) {
  const [isOpen, setIsOpen] = useState(false)
  const [chatState, setChatState] = useState('idle')
  const [messages, setMessages] = useState([])
  const [transcript, setTranscript] = useState('')
  const [matched, setMatched] = useState([])
  const [errorMsg, setErrorMsg] = useState('')
  const messagesRef = useRef([])
  const audioCtxRef = useRef(null)

  // Fetch TTS audio and decode it — returns AudioBuffer or null
  async function fetchAudio(text) {
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, lang }),
      })
      if (!response.ok) return null
      const arrayBuffer = await response.arrayBuffer()
      const ctx = audioCtxRef.current
      if (!ctx) return null
      if (ctx.state === 'suspended') await ctx.resume()
      return await ctx.decodeAudioData(arrayBuffer)
    } catch (err) {
      console.error('TTS fetch error:', err)
      return null
    }
  }

  // Play a decoded AudioBuffer through AudioContext with volume boost
  async function playBuffer(audioBuffer) {
    const ctx = audioCtxRef.current
    if (!ctx || !audioBuffer) return
    if (ctx.state === 'suspended') await ctx.resume()
    await new Promise(resolve => {
      const gain = ctx.createGain()
      gain.gain.value = 1.8
      const source = ctx.createBufferSource()
      source.buffer = audioBuffer
      source.connect(gain)
      gain.connect(ctx.destination)
      source.onended = resolve
      source.start(0)
    })
  }

  async function openChat() {
    // Unlock AudioContext synchronously on user gesture — must happen before any await
    const AC = window.AudioContext || window.webkitAudioContext
    if (AC) {
      audioCtxRef.current = new AC()
      await audioCtxRef.current.resume()
    }
    setIsOpen(true)
    messagesRef.current = []
    setMessages([])
    setMatched([])
    setChatState('greeting')
    const greetingText = GREETING[lang] || GREETING.en
    messagesRef.current = [{ role: 'assistant', content: greetingText }]
    setMessages([...messagesRef.current])
    const audioBuffer = await fetchAudio(greetingText)
    await playBuffer(audioBuffer)
    setChatState('idle')
  }

  function closeChat() {
    setIsOpen(false)
    setChatState('idle')
    messagesRef.current = []
    setMessages([])
    setMatched([])
    setTranscript('')
    setErrorMsg('')
  }

  function startListening() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) {
      alert('Voice input is not supported on this browser. Please use Chrome or Safari.')
      return
    }

    let interim = ''
    const recognition = new SR()
    recognition.lang = lang === 'es' ? 'es-MX' : 'en-US'
    recognition.continuous = false
    recognition.interimResults = true

    recognition.onstart = () => setChatState('listening')

    recognition.onresult = (event) => {
      let text = ''
      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript
      }
      interim = text
      setTranscript(text)
    }

    recognition.onend = async () => {
      setTranscript('')
      const final = interim.trim()
      if (!final) { setChatState('idle'); return }

      const userMsg = { role: 'user', content: final }
      const forClaude = [
        ...messagesRef.current.filter((m, i) => !(i === 0 && m.role === 'assistant')),
        userMsg,
      ]
      messagesRef.current = [...messagesRef.current, userMsg]
      setMessages([...messagesRef.current])
      setChatState('thinking')

      try {
        const result = await voiceChat(
          forClaude,
          services.map(s => ({ id: s.id, name: s.name, description: s.description || '' }))
        )

        // Start TTS fetch immediately — runs in parallel while we update UI
        const audioPromise = fetchAudio(result.message)

        const assistantMsg = { role: 'assistant', content: result.message }
        messagesRef.current = [...messagesRef.current, assistantMsg]
        setMessages([...messagesRef.current])

        if (result.serviceIds?.length) {
          const hits = services.filter(s =>
            result.serviceIds.some(id => String(id) === String(s.id))
          )
          setMatched(hits)
        }

        setChatState('responding')
        const audioBuffer = await audioPromise
        await playBuffer(audioBuffer)
        setChatState('idle')
      } catch (err) {
        console.error('Voice chat error:', err)
        setErrorMsg(`Error: ${err?.message || 'Something went wrong. Please try again.'}`)
        setChatState('idle')
      }
    }

    recognition.onerror = (e) => {
      console.error('Speech recognition error:', e.error)
      setTranscript('')
      setChatState('idle')
    }

    recognition.start()
  }

  const buttonLabel = {
    listening:  lang === 'es' ? '🎙️ Escuchando…'     : '🎙️ Listening…',
    thinking:   lang === 'es' ? '⏳ Pensando…'        : '⏳ Thinking…',
    responding: lang === 'es' ? '🔊 Hablando…'        : '🔊 Speaking…',
    greeting:   '🔊 …',
    idle:       lang === 'es' ? '🎙️ Toca para hablar' : '🎙️ Tap to Speak',
  }

  if (!isOpen) {
    const hasHistory = messages.length > 0
    return (
      <button
        onClick={hasHistory ? () => setIsOpen(true) : openChat}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 text-white text-xl font-bold px-8 py-4 rounded-full shadow-2xl active:scale-95 transition-all"
        style={{ background: 'var(--brand)' }}
      >
        {hasHistory
          ? (lang === 'es' ? '💬 Retomar Chat' : '💬 Resume Chat')
          : (lang === 'es' ? '🎙️ Hablar Conmigo' : '🎙️ Talk to Me')}
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-stone-900">
      <div className="flex-1 overflow-y-auto p-5 space-y-4 pt-8">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-sm rounded-3xl px-5 py-3 text-xl leading-snug ${
                msg.role === 'user' ? 'bg-white text-stone-800' : 'text-white'
              }`}
              style={msg.role === 'assistant' ? { background: 'var(--brand)' } : {}}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {transcript && (
          <div className="flex justify-end">
            <div className="max-w-sm rounded-3xl px-5 py-3 text-xl bg-white/20 text-white/80 italic">
              {transcript}…
            </div>
          </div>
        )}

        {chatState === 'thinking' && (
          <div className="flex justify-start">
            <div className="rounded-3xl px-5 py-3 text-white text-xl" style={{ background: 'var(--brand)', opacity: 0.6 }}>
              {lang === 'es' ? 'Pensando…' : 'Thinking…'}
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="flex justify-start">
            <div className="rounded-3xl px-5 py-3 text-white text-base bg-red-600">
              {errorMsg}
            </div>
          </div>
        )}
      </div>

      {matched.length > 0 && (
        <div className="px-5 py-3 border-t border-white/10">
          <p className="text-white/50 text-sm mb-2 uppercase tracking-wide">
            {lang === 'es' ? 'Recursos sugeridos' : 'Suggested resources'}
          </p>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {matched.map(s => (
              <Link
                key={s.id}
                href={`/service/${s.id}`}
                onClick={() => setIsOpen(false)}
                className="flex-shrink-0 bg-white rounded-2xl px-4 py-3 flex items-center gap-2 active:scale-95 transition-all shadow-lg"
              >
                <span className="text-3xl">{s.icon}</span>
                <span className="font-bold text-stone-800 text-lg">
                  {lang === 'es' && s.name_es ? s.name_es : s.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="p-5 flex items-center gap-3 border-t border-white/10">
        <button
          onClick={closeChat}
          className="bg-white/15 text-white font-bold px-5 py-4 rounded-2xl active:scale-95 transition-all text-xl"
        >
          ✕
        </button>
        <button
          onClick={startListening}
          disabled={chatState !== 'idle'}
          className={`flex-1 flex items-center justify-center gap-3 text-white text-xl font-bold py-4 rounded-2xl transition-all disabled:opacity-50 ${
            chatState === 'listening' ? 'animate-pulse' : 'active:scale-95'
          }`}
          style={{ background: 'var(--brand)' }}
        >
          {buttonLabel[chatState]}
        </button>
      </div>
    </div>
  )
}
