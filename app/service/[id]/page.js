import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import RegistrationForm from '@/app/_components/RegistrationForm'

export default async function ServicePage({ params }) {
  const { id } = await params

  const { data: service } = await supabase
    .from('services')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (!service) notFound()

  return (
    <div className="min-h-full flex flex-col bg-amber-50">
      <header className="bg-amber-600 text-white px-6 py-4 flex items-center gap-4 shadow-md">
        <Link
          href="/"
          className="text-white bg-amber-700 hover:bg-amber-800 rounded-2xl px-5 py-2 text-xl font-bold active:scale-95 transition-transform"
        >
          ← Home
        </Link>
        <div className="flex items-center gap-3 flex-1">
          <span className="text-4xl">{service.icon}</span>
          <h1 className="text-3xl font-bold leading-tight">{service.name}</h1>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-2xl mx-auto w-full space-y-6">
        {service.description && (
          <p className="text-2xl text-stone-600">{service.description}</p>
        )}

        {(service.details || service.phone || service.hours || service.what_to_bring) && (
          <div className="bg-white rounded-3xl shadow p-6 space-y-4">
            {service.details && (
              <p className="text-xl text-stone-700 leading-relaxed">{service.details}</p>
            )}
            {service.phone && (
              <div className="flex items-center gap-3">
                <span className="text-2xl">📞</span>
                <span className="text-xl font-semibold text-stone-700">{service.phone}</span>
              </div>
            )}
            {service.hours && (
              <div className="flex items-center gap-3">
                <span className="text-2xl">🕐</span>
                <span className="text-xl text-stone-700">{service.hours}</span>
              </div>
            )}
            {service.what_to_bring && (
              <div className="flex items-start gap-3">
                <span className="text-2xl">📋</span>
                <div>
                  <p className="text-lg font-semibold text-stone-600">Bring with you:</p>
                  <p className="text-xl text-stone-700">{service.what_to_bring}</p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="bg-white rounded-3xl shadow p-6">
          <h2 className="text-2xl font-bold text-stone-800 mb-5">
            Sign up for help with {service.name}
          </h2>
          <RegistrationForm serviceId={service.id} serviceName={service.name} />
        </div>
      </main>
    </div>
  )
}
