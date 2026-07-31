'use client'

import { useActionState } from 'react'
import { checkIn } from '@/lib/actions'

export default function CheckInForm({ lang = 'en' }) {
  const [state, action, pending] = useActionState(checkIn, null)

  if (state?.success) {
    return (
      <div className="text-center space-y-4">
        <div className="text-6xl">✅</div>
        <p className="text-2xl font-bold text-stone-800">
          {lang === 'es' ? '¡Listo!' : "You're checked in!"}
        </p>
        <p className="text-xl text-stone-500">
          {lang === 'es'
            ? 'Le avisamos a tu proveedor que llegaste. Por favor espera.'
            : "We've let your provider know you're here. Please have a seat!"}
        </p>
        <a
          href="/"
          className="block text-center mt-4 active:scale-95 text-white text-xl font-bold py-4 rounded-2xl transition-all"
          style={{ background: 'var(--brand)' }}
        >
          {lang === 'es' ? '← Inicio' : '← Home'}
        </a>
      </div>
    )
  }

  return (
    <form action={action} className="space-y-5">
      <div>
        <label className="block text-xl font-semibold text-stone-700 mb-2">
          {lang === 'es' ? 'Mi nombre es:' : 'My name is:'}
        </label>
        <input
          type="text"
          name="name"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="words"
          className="w-full text-2xl border-2 border-stone-300 rounded-2xl px-5 py-4 focus:outline-none bg-white"
          placeholder={lang === 'es' ? 'Nombre y apellido' : 'First and last name'}
        />
      </div>

      <div>
        <label className="block text-xl font-semibold text-stone-700 mb-2">
          {lang === 'es' ? 'O mi número de teléfono:' : 'Or my phone number:'}
        </label>
        <input
          type="tel"
          name="phone"
          inputMode="tel"
          autoComplete="off"
          className="w-full text-2xl border-2 border-stone-300 rounded-2xl px-5 py-4 focus:outline-none bg-white"
          placeholder="317-555-1234"
        />
      </div>

      {state?.error && (
        <p className="text-red-600 text-lg font-medium">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full active:scale-95 text-white text-2xl font-bold py-5 rounded-2xl transition-all disabled:opacity-60"
        style={{ background: 'var(--brand)' }}
      >
        {pending
          ? (lang === 'es' ? 'Buscando…' : 'Looking you up…')
          : (lang === 'es' ? 'Registrarme →' : 'Check In →')}
      </button>

      <a
        href="/"
        className="block text-center text-stone-400 text-lg"
      >
        {lang === 'es' ? '← Inicio' : '← Home'}
      </a>
    </form>
  )
}
