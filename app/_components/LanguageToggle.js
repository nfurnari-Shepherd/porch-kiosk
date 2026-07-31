'use client'

import { useRouter } from 'next/navigation'

export default function LanguageToggle({ currentLang }) {
  const router = useRouter()

  function switchLang(lang) {
    document.cookie = `lang=${lang}; path=/; max-age=31536000`
    router.refresh()
  }

  return (
    <div className="flex items-center gap-1 mt-3">
      <button
        onClick={() => switchLang('en')}
        className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
          currentLang === 'en'
            ? 'text-white'
            : 'text-stone-400 hover:text-stone-600'
        }`}
        style={currentLang === 'en' ? {background: 'var(--brand)'} : {}}
      >
        English
      </button>
      <button
        onClick={() => switchLang('es')}
        className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
          currentLang === 'es'
            ? 'text-white'
            : 'text-stone-400 hover:text-stone-600'
        }`}
        style={currentLang === 'es' ? {background: 'var(--brand)'} : {}}
      >
        Español
      </button>
    </div>
  )
}
