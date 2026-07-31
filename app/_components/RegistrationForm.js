'use client'

import { useActionState } from 'react'
import { registerForService } from '@/lib/actions'
import { t } from '@/lib/i18n'

export default function RegistrationForm({ serviceId, serviceName, lang = 'en' }) {
  const [state, action, pending] = useActionState(registerForService, null)

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="service_id" value={serviceId} />
      <input type="hidden" name="service_name" value={serviceName} />

      <div>
        <label className="block text-xl font-semibold text-stone-700 mb-2">
          {t(lang, 'nameLabel')}
        </label>
        <input
          type="text"
          name="name"
          required
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="words"
          className="w-full text-2xl border-2 border-stone-300 rounded-2xl px-5 py-4 focus:outline-none bg-white"
          placeholder={t(lang, 'namePlaceholder')}
        />
      </div>

      <div>
        <label className="block text-xl font-semibold text-stone-700 mb-2">
          {t(lang, 'zipLabel')}
        </label>
        <input
          type="text"
          name="zip_code"
          required
          inputMode="numeric"
          pattern="[0-9]{5}"
          maxLength={5}
          autoComplete="off"
          className="w-full text-2xl border-2 border-stone-300 rounded-2xl px-5 py-4 focus:outline-none bg-white"
          placeholder={t(lang, 'zipPlaceholder')}
        />
      </div>

      <div>
        <label className="block text-xl font-semibold text-stone-700 mb-2">
          {t(lang, 'phoneLabel')} <span className="font-normal text-stone-400">{t(lang, 'phoneOptional')}</span>
        </label>
        <input
          type="tel"
          name="phone"
          inputMode="tel"
          autoComplete="off"
          className="w-full text-2xl border-2 border-stone-300 rounded-2xl px-5 py-4 focus:outline-none bg-white"
          placeholder={t(lang, 'phonePlaceholder')}
        />
      </div>

      {state?.error && (
        <p className="text-red-600 text-lg font-medium">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full active:scale-95 text-white text-2xl font-bold py-5 rounded-2xl transition-all disabled:opacity-60 mt-2"
        style={{background: 'var(--brand)'}}
      >
        {pending ? t(lang, 'submitting') : t(lang, 'submitButton')}
      </button>
    </form>
  )
}
