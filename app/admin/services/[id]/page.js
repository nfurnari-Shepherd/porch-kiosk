import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireAdmin } from '@/lib/admin-auth'
import { supabase } from '@/lib/supabase'
import ServiceEditForm from '@/app/admin/_components/ServiceEditForm'

export default async function EditServicePage({ params }) {
  await requireAdmin()
  const { id } = await params

  const { data: service } = await supabase
    .from('services')
    .select('*')
    .eq('id', id)
    .single()

  if (!service) notFound()

  return (
    <div className="min-h-full bg-stone-100">
      <header className="bg-white border-b border-stone-200 px-6 py-4 flex items-center gap-4">
        <Link href="/admin/services" className="text-stone-500 hover:text-stone-800 text-sm">
          ← Services
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{service.icon}</span>
          <h1 className="text-xl font-bold text-stone-800">Edit: {service.name}</h1>
        </div>
      </header>

      <main className="p-6 max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow p-6">
          <ServiceEditForm service={service} />
        </div>
      </main>
    </div>
  )
}
