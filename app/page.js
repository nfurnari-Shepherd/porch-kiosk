import Link from 'next/link'
import { cookies } from 'next/headers'
import { supabase } from '@/lib/supabase'
import LanguageToggle from '@/app/_components/LanguageToggle'
import { t } from '@/lib/i18n'

export default async function Home() {
  const cookieStore = await cookies()
  const lang = cookieStore.get('lang')?.value || 'en'

  const { data: services, error } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')

  if (error) {
    console.error('Failed to load services:', error)
  }

  return (
    <div className="min-h-full flex flex-col" style={{background: 'var(--background)'}}>
      <header className="bg-white text-center py-5 px-4 shadow-sm border-b-4" style={{borderColor: 'var(--brand)'}}>
        <img
          src="/shepherd-logo.png"
          alt="Shepherd Community Center"
          className="h-12 mx-auto mb-3"
        />
        <h1 className="text-4xl font-extrabold" style={{color: 'var(--brand)'}}>{t(lang, 'welcome')}</h1>
        <p className="text-xl mt-1 text-stone-500 font-semibold">{t(lang, 'tagline')}</p>
        <div className="flex justify-center">
          <LanguageToggle currentLang={lang} />
        </div>
      </header>

      <main className="flex-1 p-6">
        {(!services || services.length === 0) ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-2xl text-stone-500 text-center whitespace-pre-line">
              {t(lang, 'noServices')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5 max-w-2xl mx-auto">
            {services.map((service) => (
              <Link
                key={service.id}
                href={`/service/${service.id}`}
                className="service-card bg-white rounded-3xl shadow-lg p-6 flex flex-col items-center justify-center gap-3 min-h-44 active:scale-95 transition-all border-2 border-transparent hover:shadow-xl"
              >
                <span className="text-7xl leading-none">{service.icon}</span>
                <span className="text-2xl font-bold text-stone-800 text-center leading-tight">
                  {lang === 'es' && service.name_es ? service.name_es : service.name}
                </span>
                {(service.description || service.description_es) && (
                  <span className="text-base text-stone-500 text-center">
                    {lang === 'es' && service.description_es ? service.description_es : service.description}
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </main>

      <div className="px-6 pb-6 max-w-2xl mx-auto w-full">
        <Link
          href="/check-in"
          className="flex items-center justify-center gap-3 w-full bg-white border-2 rounded-3xl shadow-md active:scale-95 transition-all py-5 px-6 text-2xl font-bold"
          style={{ borderColor: 'var(--brand)', color: 'var(--brand)' }}
        >
          <span className="text-3xl">📋</span>
          {lang === 'es' ? 'Ya llegué — Registrarme' : 'I\'m here — Check In'}
        </Link>
      </div>

      <footer className="text-center pb-24 pt-2 text-stone-400 text-sm">
        {t(lang, 'footer')}
      </footer>
    </div>
  )
}
