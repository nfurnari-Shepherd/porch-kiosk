'use client'

import { useRouter } from 'next/navigation'

export default function LanguageToggle({ currentLang }) {
  const router = useRouter()

  function switchLang(lang) {
    document.cookie = `lang=${lang}; path=/; max-age=31536000`
    router.refresh()
  }

  return (
    <div className="flex flex-col items-center gap-2 mt-3">
      <p className="text-sm font-semibold text-stone-400 uppercase tracking-widest">🌐 Select Language / Seleccionar Idioma</p>
      <div className="flex items-center bg-stone-100 rounded-2xl p-1 gap-1">
        <button
          onClick={() => switchLang('en')}
          className={`px-6 py-2.5 rounded-xl text-lg font-bold transition-all active:scale-95 ${
            currentLang === 'en'
              ? 'text-white shadow'
              : 'text-stone-500 hover:text-stone-700'
          }`}
          style={currentLang === 'en' ? {background: 'var(--brand)'} : {}}
        >
          🇺🇸 English
        </button>
        <button
          onClick={() => switchLang('es')}
          className={`px-6 py-2.5 rounded-xl text-lg font-bold transition-all active:scale-95 ${
            currentLang === 'es'
              ? 'text-white shadow'
              : 'text-stone-500 hover:text-stone-700'
          }`}
          style={currentLang === 'es' ? {background: 'var(--brand)'} : {}}
        >
          🇲🇽 Español
        </button>
      </div>
    </div>
  )
}
