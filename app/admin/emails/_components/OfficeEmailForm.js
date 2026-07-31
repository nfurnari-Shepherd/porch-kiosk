'use client'

import { useActionState } from 'react'

export default function OfficeEmailForm({ currentEmail, action }) {
  const [state, formAction, pending] = useActionState(action, null)

  return (
    <form action={formAction} className="bg-white rounded-2xl shadow p-6 flex items-end gap-3">
      <div className="flex-1">
        <label className="block text-sm font-medium text-stone-600 mb-1">Office email address</label>
        <input
          type="email"
          name="office_email"
          defaultValue={currentEmail}
          className="w-full border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500"
          placeholder="office@shepherdcommunity.org"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-5 py-2 rounded-lg transition-colors disabled:opacity-60"
      >
        {pending ? 'Saving…' : 'Save'}
      </button>
      {state?.success && <span className="text-green-600 text-sm">Saved!</span>}
      {state?.error && <span className="text-red-600 text-sm">{state.error}</span>}
    </form>
  )
}
