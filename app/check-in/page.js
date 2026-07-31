import { cookies } from 'next/headers'
import { t } from '@/lib/i18n'
import CheckInForm from '@/app/_components/CheckInForm'

export default async function CheckInPage() {
  const cookieStore = await cookies()
  const lang = cookieStore.get('lang')?.value || 'en'

  return (
    <div className="min-h-full flex flex-col items-center justify-center p-8" style={{ background: 'var(--background)' }}>
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-lg w-full space-y-6">
        <div className="text-center">
          <div className="text-6xl mb-4">📋</div>
          <h1 className="text-4xl font-bold text-stone-800">
            {lang === 'es' ? 'Registrarse' : 'Check In'}
          </h1>
          <p className="text-xl text-stone-500 mt-2">
            {lang === 'es'
              ? 'Ingresa tu nombre o número de teléfono para avisar a tu proveedor que llegaste.'
              : 'Enter your name or phone number to let your provider know you\'re here.'}
          </p>
        </div>
        <CheckInForm lang={lang} />
      </div>
    </div>
  )
}
