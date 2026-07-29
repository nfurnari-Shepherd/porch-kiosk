import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default async function Home() {
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
        <h1 className="text-4xl font-extrabold" style={{color: 'var(--brand)'}}>Welcome to The Porch</h1>
        <p className="text-xl mt-1 text-stone-500 font-semibold">How can we help you today?</p>
      </header>

      <main className="flex-1 p-6">
        {(!services || services.length === 0) ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-2xl text-stone-500 text-center">
              Services are being set up.<br />Please ask a staff member for help.
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
                  {service.name}
                </span>
                {service.description && (
                  <span className="text-base text-stone-500 text-center">
                    {service.description}
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </main>

      <footer className="text-center py-4 text-stone-400 text-sm">
        Tap a tile to get started · Ask a staff member if you need help
      </footer>
    </div>
  )
}
