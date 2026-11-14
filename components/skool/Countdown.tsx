'use client'

import { useEffect, useState } from 'react'
import { WAITLIST_DEADLINE } from '@/lib/waitlist'
import { useWaitlist } from './WaitlistState'

const pad = (n: number) => String(n).padStart(2, '0')

const LABELS = ['Jours', 'Heures', 'Minutes', 'Secondes']

export default function Countdown() {
  const { closed } = useWaitlist()
  const [now, setNow] = useState<number | null>(null)

  useEffect(() => {
    const tick = () => setNow(Date.now())
    const first = setTimeout(tick, 0)
    const id = setInterval(tick, 1000)
    return () => { clearTimeout(first); clearInterval(id) }
  }, [])

  if (closed) return null

  const left = now === null ? null : Math.max(0, new Date(WAITLIST_DEADLINE).getTime() - now)
  const values = left === null
    ? null
    : [
        Math.floor(left / 86_400_000),
        Math.floor(left / 3_600_000) % 24,
        Math.floor(left / 60_000) % 60,
        Math.floor(left / 1000) % 60,
      ]

  return (
    <div className="cd rvb" role="timer" aria-live="off" data-d="200">
      <ul className="cd-boxes" aria-hidden={values === null}>
        {LABELS.map((label, i) => (
          <li className="cd-box" key={label}>
            <b>{values ? (i === 0 ? values[i] : pad(values[i])) : '··'}</b>
            <small>{label}</small>
          </li>
        ))}
      </ul>
      <p className="cd-text">avant que la liste d&apos;attente ne ferme.</p>
    </div>
  )
}
