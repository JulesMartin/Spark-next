'use client'

import { useState } from 'react'
import posthog from 'posthog-js'

export default function UnsubscribeForm({ email, token }: { email: string; token: string }) {
  const [confirmed, setConfirmed] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, confirm: confirmed }),
      })
      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error ?? 'Une erreur est survenue.')
        setStatus('error')
      } else {
        posthog.capture('unsubscribe_form_submitted')
        setStatus('success')
      }
    } catch {
      setErrorMsg('Une erreur est survenue. Réessayez.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div
        className="border-2 border-black p-8 text-center"
        style={{ background: '#FEE04F', boxShadow: '4px 4px 0 #1A1A1A' }}
      >
        <p
          className="text-2xl font-black uppercase tracking-tight text-black mb-2"
          style={{ fontFamily: 'var(--font-raleway)' }}
        >
          C&apos;est fait.
        </p>
        <p className="text-sm text-black/70 mb-5" style={{ fontFamily: 'var(--font-assistant)' }}>
          <strong>{email}</strong> ne recevra plus aucun email de ma part. Merci d&apos;être passé
          par là — la porte reste ouverte si tu changes d&apos;avis.
        </p>
        <a
          href="/"
          className="inline-block border-2 border-black px-6 py-3 text-sm font-black uppercase tracking-widest text-black transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          style={{
            background: '#FFFFFF',
            boxShadow: '3px 3px 0 #1A1A1A',
            fontFamily: 'var(--font-raleway)',
          }}
        >
          Retour au site
        </a>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <p className="text-xs text-black mb-1" style={{ fontFamily: 'var(--font-assistant)' }}>
        Adresse concernée
      </p>
      <div
        className="w-full border-2 border-black px-4 py-3 text-sm text-black mb-4 break-all"
        style={{ background: '#FCFCD0', fontFamily: 'var(--font-assistant)' }}
      >
        {email}
      </div>

      <label
        className="flex items-start gap-3 border-2 border-black p-4 mb-4 cursor-pointer bg-white"
        style={{ fontFamily: 'var(--font-assistant)' }}
      >
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
          className="mt-[2px] h-4 w-4 shrink-0 accent-black cursor-pointer"
        />
        <span className="text-sm text-black leading-snug">
          Je confirme vouloir me désinscrire et ne plus recevoir aucun email.
        </span>
      </label>

      <button
        type="submit"
        disabled={!confirmed || status === 'loading'}
        className="w-full border-2 border-black py-3 text-sm font-black uppercase tracking-widest text-black transition-all disabled:opacity-40 disabled:cursor-not-allowed active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer"
        style={{
          background: '#FEE04F',
          boxShadow: '3px 3px 0 #1A1A1A',
          fontFamily: 'var(--font-raleway)',
        }}
      >
        {status === 'loading' ? 'En cours…' : 'Confirmer la désinscription'}
      </button>

      {status === 'error' && (
        <p className="mt-2 text-xs text-red-600" style={{ fontFamily: 'var(--font-assistant)' }}>
          {errorMsg}
        </p>
      )}
    </form>
  )
}
