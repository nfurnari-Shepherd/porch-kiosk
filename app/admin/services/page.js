import Link from 'next/link'
import { requireAdmin } from '@/lib/admin-auth'
import { supabase } from '@/lib/supabase'
import { adminLogout } from '@/lib/actions'

export default async function ServicesAdminPage() {
  await requireAdmin()

  const { data: services } = await supabase
    .from('services')
    .select('*')
    .order('sort_order')

  return (
    <div className="min-h-full bg-stone-100">
      <header className="bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-stone-800">Porch Kiosk Admin</h1>
          <nav className="flex gap-2">
            <Link href="/admin/registrations" className="text-stone-500 hover:text-stone-800 px-3 py-1 rounded-lg text-sm">
              Registrations
            </Link>
            <span className="bg-amber-100 text-amber-700 font-semibold px-3 py-1 rounded-lg text-sm">
              Services
            </span>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-stone-400 hover:text-stone-600 text-sm">
            View kiosk →
          </Link>
          <form action={adminLogout}>
            <button type="submit" className="text-stone-500 hover:text-red-600 text-sm">
              Log out
            </button>
          </form>
        </div>
      </header>

      <main className="p-6 max-w-3xl mx-auto space-y-4">
        <p className="text-sm text-stone-500">
          Click a service to edit its name, icon, description, phone, hours, and what to bring. Changes appear on the kiosk immediately.
        </p>

        <div className="bg-white rounded-2xl shadow overflow-hidden">
          {(!services || services.length === 0) ? (
            <div className="p-8 text-center text-stone-400">No services yet.</div>
          ) : (
            <ul className="divide-y divide-stone-100">
              {services.map(service => (
                <li key={service.id}>
                  <Link
                    href={`/admin/services/${service.id}`}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-amber-50 transition-colors"
                  >
                    <span className="text-3xl">{service.icon}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-stone-800">{service.name}</p>
                      {service.description && (
                        <p className="text-sm text-stone-500">{service.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${service.is_active ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-500'}`}>
                        {service.is_active ? 'Visible' : 'Hidden'}
                      </span>
                      <span className="text-stone-400 text-sm">Edit →</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  )
}
