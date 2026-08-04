import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cookies } from 'next/headers'
import { supabase } from '@/lib/supabase'
import RegistrationForm from '@/app/_components/RegistrationForm'
import { t } from '@/lib/i18n'

export default async function ServicePage({ params }) {
  const { id } = await params
  const cookieStore = await cookies()
  const lang = cookieStore.get('lang')?.value || 'en'

  const { data: service } = await supabase
    .from('services')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (!service) notFound()

  const name = lang === 'es' && service.name_es ? service.name_es : service.name
  const description = lang === 'es' && service.description_es ? service.description_es : service.description
  const details = lang === 'es' && service.details_es ? service.details_es : service.details
  const hours = lang === 'es' && service.hours_es ? service.hours_es : service.hours
  const whatToBring = lang === 'es' && service.what_to_bring_es ? service.what_to_bring_es : service.what_to_bring

  return (
    <div className="min-h-full flex flex-col" style={{background: 'var(--background)'}}>
      <header className="bg-white px-6 py-4 flex items-center gap-4 shadow-sm border-b-4" style={{borderColor: 'var(--brand)'}}>
        <Link
          href="/"
          className="rounded-2xl px-5 py-2 text-xl font-bold active:scale-95 transition-transform text-white"
          style={{background: 'var(--brand)'}}
        >
          {t(lang, 'backHome')}
        </Link>
        <div className="flex items-center gap-3 flex-1">
          {service.icon_url
            ? <img src={service.icon_url} alt={name} className="w-10 h-10 object-contain" />
            : <span className="text-4xl">{service.icon}</span>
          }
          <h1 className="text-3xl font-bold leading-tight" style={{color: 'var(--brand)'}}>{name}</h1>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-2xl mx-auto w-full space-y-6">
        {description && (
          <p className="text-2xl text-stone-600">{description}</p>
        )}

        {(details || service.phone || hours || whatToBring) && (
          <div className="bg-white rounded-3xl shadow p-6 space-y-4">
            {details && (
              <p className="text-xl text-stone-700 leading-relaxed">{details}</p>
            )}
            {service.phone && (
              <div className="flex items-center gap-3">
                <span className="text-2xl">📞</span>
                <span className="text-xl font-semibold text-stone-700">{service.phone}</span>
              </div>
            )}
            {hours && (
              <div className="flex items-center gap-3">
                <span className="text-2xl">🕐</span>
                <span className="text-xl text-stone-700">{hours}</span>
              </div>
            )}
            {whatToBring && (
              <div className="flex items-start gap-3">
                <span className="text-2xl">📋</span>
                <div>
                  <p className="text-lg font-semibold text-stone-600">{t(lang, 'bringWith')}</p>
                  <p className="text-xl text-stone-700">{whatToBring}</p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="bg-white rounded-3xl shadow p-6">
          <h2 className="text-2xl font-bold text-stone-800 mb-5">
            {t(lang, 'signUpFor')} {name}
          </h2>
          <RegistrationForm serviceId={service.id} serviceName={service.name} lang={lang} />
        </div>
      </main>
    </div>
  )
}
