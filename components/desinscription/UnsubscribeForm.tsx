'use client'

import { useState } from 'react'
import Link from 'next/link'
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
      setErrorMsg('Une erreur est survenue. Réessaie.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="done" role="status">
        <h2>C&apos;est fait.</h2>
        <p>
          <strong>{email}</strong> ne recevra plus aucun email de ma part. Merci d&apos;être passé
          par là — la porte reste ouverte si tu changes d&apos;avis.
        </p>
        <div className="acts">
          <Link className="btn i-back" href="/">Retour au site</Link>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="fm">
      <div>
        <span className="lb">Adresse concernée</span>
        <div className="box">{email}</div>
      </div>

      <label className="check">
        <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} />
        <span>Je confirme vouloir me désinscrire et ne plus recevoir aucun email.</span>
      </label>

      <button type="submit" className="go" disabled={!confirmed || status === 'loading'}>
        {status === 'loading' ? 'En cours…' : 'Confirmer la désinscription'}
      </button>

      {status === 'error' && <p className="err">{errorMsg}</p>}
    </form>
  )
}
