'use client'

import { useState } from 'react'

export default function SubscribeForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  // Honeypot
  const [website, setWebsite] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, website, source: 'prompts-ia' }),
      })
      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error ?? 'Une erreur est survenue.')
        setStatus('error')
      } else {
        setStatus('success')
      }
    } catch {
      setErrorMsg('Une erreur est survenue. Réessayez.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="border border-accent bg-gold-wash px-6 py-8 text-center">
        <p className="font-display font-bold text-xl text-ink-900 mb-2">C'est parti.</p>
        <p className="font-body text-sm text-muted">
          Vérifie ta boîte mail — les 233 prompts et les 10 skills Claude arrivent dans quelques minutes.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {/* Honeypot — hidden from real users */}
      <input
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        className="hidden"
        tabIndex={-1}
        aria-hidden="true"
        autoComplete="off"
      />

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ton@email.com"
          className="flex-1 bg-surface border border-edge px-4 py-3 font-body text-sm text-ink-900 placeholder:text-ink-500 outline-none focus:border-accent transition-colors"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="bg-accent hover:bg-accent-hover text-ink-900 font-body font-semibold text-sm px-6 py-3 transition-colors disabled:opacity-60 whitespace-nowrap cursor-pointer"
        >
          {status === 'loading' ? 'Envoi…' : 'Recevoir gratuitement →'}
        </button>
      </div>

      {status === 'error' && (
        <p className="mt-3 font-body text-xs text-red-600">{errorMsg}</p>
      )}

      <p className="mt-3 font-body text-xs text-ink-500">
        Gratuit. Zéro spam. Désinscription en 1 clic.
      </p>
    </form>
  )
}
