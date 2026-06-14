'use client'

import { useState } from 'react'

export default function SubscribeForm({ dark = false }: { dark?: boolean }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
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

  const mutedColor = dark ? 'rgba(255,255,255,.45)' : undefined

  if (status === 'success') {
    return (
      <div style={{
        padding: '20px 24px',
        borderRadius: 12,
        background: dark ? 'rgba(255,255,255,.07)' : '#F7F7F5',
        border: `1px solid ${dark ? 'rgba(255,255,255,.12)' : '#E9E9E9'}`,
        textAlign: 'center' as const,
      }}>
        <p style={{ fontWeight: 700, fontSize: 16, color: dark ? '#fff' : '#1C1C1C', marginBottom: 6 }}>
          C&apos;est parti !
        </p>
        <p style={{ fontSize: 13, color: mutedColor ?? '#6E6E6E', lineHeight: 1.5 }}>
          Vérifie ta boîte mail — les 233 prompts et les 10 skills Claude arrivent dans quelques minutes.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      {/* Honeypot */}
      <input
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        style={{ display: 'none' }}
        tabIndex={-1}
        aria-hidden="true"
        autoComplete="off"
      />

      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ton@email.com"
          style={{
            width: '100%',
            background: dark ? 'rgba(255,255,255,.07)' : '#fff',
            border: `1.5px solid ${dark ? 'rgba(255,255,255,.15)' : '#E9E9E9'}`,
            borderRadius: 10,
            padding: '12px 16px',
            fontSize: 14,
            color: dark ? '#fff' : '#1C1C1C',
            outline: 'none',
            boxSizing: 'border-box' as const,
          }}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          style={{
            background: '#EAAF48',
            color: '#1C1C1C',
            border: 'none',
            borderRadius: 10,
            padding: '13px 20px',
            fontSize: 14,
            fontWeight: 700,
            cursor: status === 'loading' ? 'not-allowed' : 'pointer',
            opacity: status === 'loading' ? 0.6 : 1,
            letterSpacing: '-0.01em',
            transition: 'opacity 150ms',
          }}
        >
          {status === 'loading' ? 'Envoi…' : 'Recevoir gratuitement →'}
        </button>
      </div>

      {status === 'error' && (
        <p style={{ marginTop: 8, fontSize: 12, color: '#ef4444' }}>{errorMsg}</p>
      )}

      <p style={{ marginTop: 10, fontSize: 12, color: mutedColor ?? '#ADADAD' }}>
        Gratuit. Zéro spam. Désinscription en 1 clic.
      </p>
    </form>
  )
}
