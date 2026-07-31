import Link from 'next/link'
import { cookies } from 'next/headers'
import ConfirmTimer from '@/app/_components/ConfirmTimer'
import { t } from '@/lib/i18n'

export default async function ConfirmPage({ searchParams }) {
  const { name, service } = await searchParams
  const cookieStore = await cookies()
  const lang = cookieStore.get('lang')?.value || 'en'

  return (
    <div className="min-h-full flex flex-col items-center justify-center p-8 text-center" style={{background: 'var(--background)'}}>
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-lg w-full space-y-6">
        <div className="text-8xl">✅</div>

        <h1 className="text-4xl font-bold text-stone-800">
          {name ? `${t(lang, 'thankYou')}, ${name}!` : t(lang, 'confirmed')}
        </h1>

        {service && (
          <p className="text-2xl text-stone-600">
            {t(lang, 'noted')} <strong>{service}</strong>.
          </p>
        )}

        <p className="text-xl text-stone-500">
          {t(lang, 'followUp')}
        </p>

        <ConfirmTimer seconds={15} lang={lang} />

        <Link
          href="/"
          className="block active:scale-95 text-white text-2xl font-bold py-5 rounded-2xl transition-all"
          style={{background: 'var(--brand)'}}
        >
          {t(lang, 'backToHome')}
        </Link>
      </div>
    </div>
  )
}
