import Link from 'next/link'
import { requireAdmin } from '@/lib/admin-auth'
import { supabase } from '@/lib/supabase'
import { adminLogout, updateOfficeSetting } from '@/lib/actions'
import OfficeEmailForm from './_components/OfficeEmailForm'

export default async function EmailsAdminPage() {
  await requireAdmin()

  const { data: templates } = await supabase
    .from('email_templates')
    .select('slug, name, subject, updated_at')
    .order('slug')

  const { data: setting } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'office_email')
    .single()

  const DESCRIPTIONS = {
    neighbor_signup: 'Sent to the neighbor when they sign up for a service (if they provided their email).',
    staff_signup: 'Sent to the service provider when a new neighbor registers.',
    staff_checkin: 'Sent to the service provider when a neighbor checks in for their appointment.',
  }

  return (
    <div className="min-h-full bg-stone-100">
      <header className="bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-stone-800">Porch Kiosk Admin</h1>
          <nav className="flex gap-2">
            <Link href="/admin/registrations" className="text-stone-500 hover:text-stone-800 px-3 py-1 rounded-lg text-sm">
              Registrations
            </Link>
            <Link href="/admin/services" className="text-stone-500 hover:text-stone-800 px-3 py-1 rounded-lg text-sm">
              Services
            </Link>
            <span className="bg-amber-100 text-amber-700 font-semibold px-3 py-1 rounded-lg text-sm">
              Emails
            </span>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-stone-400 hover:text-stone-600 text-sm">View kiosk →</Link>
          <form action={adminLogout}>
            <button type="submit" className="text-stone-500 hover:text-red-600 text-sm">Log out</button>
          </form>
        </div>
      </header>

      <main className="p-6 max-w-3xl mx-auto space-y-6">
        <div>
          <h2 className="text-base font-semibold text-stone-700 mb-3">Email Templates</h2>
          <p className="text-sm text-stone-500 mb-4">
            Edit the subject and body of each automated email. Use <code className="bg-stone-100 px-1 rounded text-amber-700">{'{{name}}'}</code>, <code className="bg-stone-100 px-1 rounded text-amber-700">{'{{service}}'}</code>, <code className="bg-stone-100 px-1 rounded text-amber-700">{'{{phone}}'}</code>, <code className="bg-stone-100 px-1 rounded text-amber-700">{'{{email}}'}</code>, <code className="bg-stone-100 px-1 rounded text-amber-700">{'{{date}}'}</code> as placeholders.
          </p>
          <div className="bg-white rounded-2xl shadow overflow-hidden divide-y divide-stone-100">
            {(!templates || templates.length === 0) ? (
              <div className="p-8 text-center text-stone-400">No templates found. Run the Supabase SQL setup first.</div>
            ) : templates.map(tpl => (
              <div key={tpl.slug} className="flex items-center justify-between px-6 py-4">
                <div className="flex-1">
                  <p className="font-semibold text-stone-800">{tpl.name}</p>
                  <p className="text-sm text-stone-500 mt-0.5">{DESCRIPTIONS[tpl.slug]}</p>
                  <p className="text-xs text-stone-400 mt-1">Subject: {tpl.subject}</p>
                </div>
                <Link
                  href={`/admin/emails/${tpl.slug}`}
                  className="ml-4 text-sm font-medium text-amber-600 hover:text-amber-800"
                >
                  Edit →
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-base font-semibold text-stone-700 mb-1">Office Email (CC)</h2>
          <p className="text-sm text-stone-500 mb-3">
            This address is CC'd on all staff notification emails so office staff can manually schedule calendar invites.
          </p>
          <OfficeEmailForm currentEmail={setting?.value || ''} action={updateOfficeSetting} />
        </div>
      </main>
    </div>
  )
}
