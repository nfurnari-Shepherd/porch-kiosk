import Link from 'next/link'
import ConfirmTimer from '@/app/_components/ConfirmTimer'

export default async function ConfirmPage({ searchParams }) {
  const { name, service } = await searchParams

  return (
    <div className="min-h-full flex flex-col items-center justify-center bg-amber-50 p-8 text-center">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-lg w-full space-y-6">
        <div className="text-8xl">✅</div>

        <h1 className="text-4xl font-bold text-stone-800">
          {name ? `Thank you, ${name}!` : "You're all set!"}
        </h1>

        {service && (
          <p className="text-2xl text-stone-600">
            We've noted your interest in <strong>{service}</strong>.
          </p>
        )}

        <p className="text-xl text-stone-500">
          A staff member will follow up with you soon. Please let someone at the front desk know you're here.
        </p>

        <ConfirmTimer seconds={15} />

        <Link
          href="/"
          className="block bg-amber-600 hover:bg-amber-700 active:scale-95 text-white text-2xl font-bold py-5 rounded-2xl transition-all"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}
