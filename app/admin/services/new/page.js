import Link from 'next/link'
import { requireAdmin } from '@/lib/admin-auth'
import { adminLogout } from '@/lib/actions'
import ServiceCreateForm from './_components/ServiceCreateForm'

export default async function NewServicePage() {
  await requireAdmin()

  return (
    <div className="min-h-full bg-stone-100">
      <header className="bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-stone-800">Porch Kiosk Admin</h1>
          <nav className="flex gap-2">
            <Link href="/admin/registrations" className="text-stone-500 hover:text-stone-800 px-3 py-1 rounded-lg text-sm">Registrations</Link>
            <Link href="/admin/services" className="bg-amber-100 text-amber-700 font-semibold px-3 py-1 rounded-lg text-sm">Services</Link>
            <Link href="/admin/emails" className="text-stone-500 hover:text-stone-800 px-3 py-1 rounded-lg text-sm">Emails</Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-stone-400 hover:text-stone-600 text-sm">View kiosk →</Link>
          <form action={adminLogout}>
            <button type="submit" className="text-stone-500 hover:text-red-600 text-sm">Log out</button>
          </form>
        </div>
      </header>

      <main className="p-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <Link href="/admin/services" className="text-stone-400 hover:text-stone-600 text-sm">← Services</Link>
          <span className="text-stone-300">/</span>
          <span className="text-sm text-stone-600">New Service</span>
        </div>
        <div className="bg-white rounded-2xl shadow p-6">
          <ServiceCreateForm />
        </div>
      </main>
    </div>
  )
}
