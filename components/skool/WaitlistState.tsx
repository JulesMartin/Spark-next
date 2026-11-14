'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { EARLY_SPOTS, WAITLIST_DEADLINE, isWaitlistClosed, type WaitlistTier } from '@/lib/waitlist'

export type WaitlistResult = { position: number; tier: WaitlistTier; already: boolean }

type State = {
  remaining: number
  closed: boolean
  result: WaitlistResult | null
  setResult: (r: WaitlistResult) => void
}

const Ctx = createContext<State | null>(null)

export function useWaitlist() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useWaitlist outside WaitlistProvider')
  return v
}

export function WaitlistProvider({
  initialRemaining,
  initialClosed,
  children,
}: {
  initialRemaining: number
  initialClosed: boolean
  children: React.ReactNode
}) {
  const [remaining, setRemaining] = useState(initialRemaining)
  const [closed, setClosed] = useState(initialClosed)
  const [result, setResultState] = useState<WaitlistResult | null>(null)

  useEffect(() => {
    const delay = isWaitlistClosed() ? 0 : new Date(WAITLIST_DEADLINE).getTime() - Date.now() + 500
    const id = setTimeout(() => setClosed(true), delay)
    return () => clearTimeout(id)
  }, [])

  function setResult(r: WaitlistResult) {
    setResultState(r)
    if (!r.already) setRemaining((n) => Math.min(n, Math.max(0, EARLY_SPOTS - r.position)))
  }

  return <Ctx.Provider value={{ remaining, closed, result, setResult }}>{children}</Ctx.Provider>
}
