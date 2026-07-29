'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ConfirmTimer({ seconds = 15 }) {
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
      Returning to home in {remaining} second{remaining !== 1 ? 's' : ''}…
    </p>
  )
}
