'use client'

import { useActionState } from 'react'

const VARIABLES = ['{{name}}', '{{service}}', '{{phone}}', '{{email}}', '{{date}}']

export default function EditTemplateForm({ template, action }) {
  const [state, formAction, pending] = useActionState(action, null)

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <p className="text-sm text-stone-500 mb-3">
          Available variables:{' '}
          {VARIABLES.map(v => (
            <code key={v} className="bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded text-xs mr-1">{v}</code>
          ))}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-600 mb-1">Subject line</label>
        <input
          type="text"
          name="subject"
          defaultValue={template.subject}
          required
          className="w-full border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-600 mb-1">Body</label>
        <textarea
          name="body"
          defaultValue={template.body}
          required
          rows={12}
          className="w-full border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500 font-mono text-sm"
        />
        <p className="text-xs text-stone-400 mt-1">Plain text. Blank lines between paragraphs become paragraph breaks in the email.</p>
      </div>

      {state?.error && <p className="text-red-600 text-sm">{state.error}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 py-2.5 rounded-lg transition-colors disabled:opacity-60"
        >
          {pending ? 'Saving…' : 'Save Template'}
        </button>
        <a href="/admin/emails" className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium px-6 py-2.5 rounded-lg transition-colors">
          Cancel
        </a>
      </div>
    </form>
  )
}
