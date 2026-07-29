import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminLoginForm from './_components/AdminLoginForm'

export default async function AdminPage() {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')?.value
  if (session === process.env.ADMIN_PASSWORD) {
    redirect('/admin/registrations')
  }

  return (
    <div className="min-h-full flex items-center justify-center bg-stone-100 p-8">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm space-y-6">
        <div className="text-center">
          <p className="text-stone-500 text-sm uppercase tracking-wide">Staff Only</p>
          <h1 className="text-2xl font-bold text-stone-800 mt-1">Porch Kiosk Admin</h1>
        </div>
        <AdminLoginForm />
        <a href="/" className="block text-center text-stone-400 text-sm hover:text-stone-600">
          ← Back to kiosk
        </a>
      </div>
    </div>
  )
}
