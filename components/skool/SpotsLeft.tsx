'use client'

import { useWaitlist } from './WaitlistState'

export function MastButton() {
  const { closed } = useWaitlist()
  if (closed) return null
  return <a className="btn" href="#inscription">Rejoindre la liste</a>
}
