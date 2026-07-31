'use client'

import { useActionState } from 'react'
import { updateService } from '@/lib/actions'

export default function ServiceEditForm({ service }) {
  const updateWithId = updateService.bind(null, service.id)
  const [state, action, pending] = useActionState(updateWithId, null)

  return (
    <form action={action} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1">Service Name</label>
          <input
            type="text"
            name="name"
            defaultValue={service.name}
            required
            className="w-full border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1">Icon (emoji)</label>
          <input
            type="text"
            name="icon"
            defaultValue={service.icon}
            required
            className="w-full border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-600 mb-1">
          Short Description <span className="text-stone-400">(shown on home tile)</span>
        </label>
        <input
          type="text"
          name="description"
          defaultValue={service.description || ''}
          className="w-full border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500"
          placeholder="e.g. Help paying your electric bill"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-600 mb-1">
          Details <span className="text-stone-400">(shown on service page)</span>
        </label>
        <textarea
          name="details"
          defaultValue={service.details || ''}
          rows={3}
          className="w-full border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500"
          placeholder="Explain what this service is and how it helps neighbors..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1">Phone Number</label>
          <input
            type="text"
            name="phone"
            defaultValue={service.phone || ''}
            className="w-full border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500"
            placeholder="317-555-0000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1">Hours</label>
          <input
            type="text"
            name="hours"
            defaultValue={service.hours || ''}
            className="w-full border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500"
            placeholder="Mon–Fri 9am–5pm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-600 mb-1">What to Bring</label>
        <input
          type="text"
          name="what_to_bring"
          defaultValue={service.what_to_bring || ''}
          className="w-full border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500"
          placeholder="e.g. Photo ID, recent utility bill"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1">
            Staff Notification Phone <span className="text-stone-400">(texted on sign-up & check-in)</span>
          </label>
          <input
            type="text"
            name="notification_phone"
            defaultValue={service.notification_phone || ''}
            className="w-full border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500"
            placeholder="+13175551234"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1">
            Staff Notification Email <span className="text-stone-400">(emailed on sign-up & check-in)</span>
          </label>
          <input
            type="email"
            name="notification_email"
            defaultValue={service.notification_email || ''}
            className="w-full border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500"
            placeholder="provider@example.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1">Sort Order</label>
          <input
            type="number"
            name="sort_order"
            defaultValue={service.sort_order ?? 0}
            className="w-full border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1">Visible on Kiosk?</label>
          <select
            name="is_active"
            defaultValue={service.is_active ? 'true' : 'false'}
            className="w-full border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500"
          >
            <option value="true">Yes — show this service</option>
            <option value="false">No — hide this service</option>
          </select>
        </div>
      </div>

      {state?.error && (
        <p className="text-red-600 text-sm">{state.error}</p>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 py-3 rounded-lg transition-colors disabled:opacity-60"
        >
          {pending ? 'Saving…' : 'Save Changes'}
        </button>
        <a
          href="/admin/services"
          className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium px-6 py-3 rounded-lg transition-colors"
        >
          Cancel
        </a>
      </div>
    </form>
  )
}
