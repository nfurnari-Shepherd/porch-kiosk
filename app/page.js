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
    <div className="min-h-full flex flex-col bg-amber-50">
      <header className="bg-amber-600 text-white text-center py-6 px-4 shadow-md">
        <p className="text-lg font-semibold tracking-wide uppercase opacity-80">
          Shepherd Community Center
        </p>
        <h1 className="text-4xl font-bold mt-1">Welcome to The Porch</h1>
        <p className="text-xl mt-2 opacity-90">How can we help you today?</p>
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
                className="bg-white rounded-3xl shadow-lg p-6 flex flex-col items-center justify-center gap-3 min-h-44 active:scale-95 transition-transform border-2 border-transparent hover:border-amber-400"
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
