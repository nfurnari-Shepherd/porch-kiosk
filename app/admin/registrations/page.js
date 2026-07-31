import Link from 'next/link'
import { requireAdmin } from '@/lib/admin-auth'
import { supabase } from '@/lib/supabase'
import { adminLogout } from '@/lib/actions'

export default async function RegistrationsPage({ searchParams }) {
  await requireAdmin()

  const { service: filterService } = await searchParams

  let query = supabase
    .from('registrations')
    .select('*')
    .order('created_at', { ascending: false })

  if (filterService) {
    query = query.eq('service_name', filterService)
  }

  const { data: registrations } = await query

  const { data: services } = await supabase
    .from('services')
    .select('name')
    .order('sort_order')

  const serviceNames = [...new Set(services?.map(s => s.name) || [])]

  return (
    <div className="min-h-full bg-stone-100">
      <header className="bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-stone-800">Porch Kiosk Admin</h1>
          <nav className="flex gap-2">
            <span className="bg-amber-100 text-amber-700 font-semibold px-3 py-1 rounded-lg text-sm">
              Registrations
            </span>
            <Link href="/admin/services" className="text-stone-500 hover:text-stone-800 px-3 py-1 rounded-lg text-sm">
              Services
            </Link>
            <Link href="/admin/emails" className="text-stone-500 hover:text-stone-800 px-3 py-1 rounded-lg text-sm">
              Emails
            </Link>
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

      <main className="p-6 max-w-5xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-stone-700">
            {registrations?.length || 0} registration{registrations?.length !== 1 ? 's' : ''}
            {filterService && ` · ${filterService}`}
          </h2>
          <div className="flex items-center gap-2">
            <label className="text-sm text-stone-500">Filter by service:</label>
            <form>
              <select
                name="service"
                defaultValue={filterService || ''}
                className="border border-stone-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-amber-500"
              >
                <option value="">All services</option>
                {serviceNames.map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
              <button type="submit" className="ml-2 text-sm text-amber-600 hover:text-amber-800">
                Filter
              </button>
            </form>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow overflow-hidden">
          {(!registrations || registrations.length === 0) ? (
            <div className="p-8 text-center text-stone-400">
              No registrations yet{filterService ? ` for ${filterService}` : ''}.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-stone-600">Name</th>
                  <th className="text-left px-4 py-3 font-semibold text-stone-600">Service</th>
                  <th className="text-left px-4 py-3 font-semibold text-stone-600">Zip</th>
                  <th className="text-left px-4 py-3 font-semibold text-stone-600">Phone</th>
                  <th className="text-left px-4 py-3 font-semibold text-stone-600">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {registrations.map(reg => (
                  <tr key={reg.id} className="hover:bg-amber-50">
                    <td className="px-4 py-3 font-medium text-stone-800">{reg.name}</td>
                    <td className="px-4 py-3 text-stone-600">{reg.service_name}</td>
                    <td className="px-4 py-3 text-stone-500">{reg.zip_code}</td>
                    <td className="px-4 py-3 text-stone-500">{reg.phone || '—'}</td>
                    <td className="px-4 py-3 text-stone-400">
                      {new Date(reg.created_at).toLocaleString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric',
                        hour: 'numeric', minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  )
}
