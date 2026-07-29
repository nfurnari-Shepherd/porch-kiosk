'use client'

import { useActionState } from 'react'
import { adminLogin } from '@/lib/actions'

export default function AdminLoginForm() {
  const [state, action, pending] = useActionState(adminLogin, null)

  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-stone-600 mb-1">
          Staff Password
        </label>
        <input
          type="password"
          name="password"
          required
          autoFocus
          className="w-full border border-stone-300 rounded-lg px-4 py-3 text-lg focus:outline-none"
        />
      </div>

      {state?.error && (
        <p className="text-red-600 text-sm">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-60"
        style={{background: 'var(--brand)'}}
      >
        {pending ? 'Logging in…' : 'Log In'}
      </button>
    </form>
  )
}
