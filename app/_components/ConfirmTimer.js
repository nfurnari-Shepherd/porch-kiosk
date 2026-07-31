'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { t } from '@/lib/i18n'

export default function ConfirmTimer({ seconds = 15, lang = 'en' }) {
  const [remaining, setRemaining] = useState(seconds)
  const router = useRouter()

  useEffect(() => {
    if (remaining <= 0) {
      router.push('/')
      return
    }
    const timer = setTimeout(() => setRemaining(r => r - 1), 1000)
    return () => clearTimeout(timer)
  }, [remaining, router])

  return (
    <p className="text-stone-400 text-lg">
      {t(lang, 'returning')} {remaining} {remaining !== 1 ? t(lang, 'seconds') : t(lang, 'second')}…
    </p>
  )
}
