'use client'

import { useState } from 'react'
import posthog from 'posthog-js'

const CALENDLY_URL = 'https://calendly.com/jules-api/new-meeting'

export default function SubscribeForm({ dark = false }: { dark?: boolean }) {
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
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
        body: JSON.stringify({
          first_name: firstName.trim(),
          email,
          website,
          source: 'prompts-ia',
          phone: phone.trim(),
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error ?? 'Une erreur est survenue.')
        setStatus('error')
      } else {
        posthog.identify(email.trim().toLowerCase(), { email: email.trim().toLowerCase() })
        posthog.capture('lead_magnet_subscribed', { source: 'prompts-ia' })
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
        <p style={{ fontSize: 13, color: mutedColor ?? '#6E6E6E', lineHeight: 1.5, marginBottom: 10 }}>
          Vérifie ta boîte mail — les 233 prompts et les 10 skills Claude arrivent dans quelques minutes.
        </p>
        <div
          style={{
            background: dark ? 'rgba(255,255,255,.06)' : '#F2F1EC',
            borderRadius: 10,
            padding: '14px 16px',
            marginBottom: 14,
            width: 'calc(100% + 6px)',
            marginInline: '-3px',
            boxSizing: 'border-box' as const,
          }}
        >
          <p style={{ fontSize: 14, color: dark ? 'rgba(255,255,255,.85)' : '#1C1C1C', lineHeight: 1.5 }}>
            Si tu souhaites faire un <strong>audit gratuit</strong> de ton business,{' '}
            <strong>apprendre</strong> les <strong>automatisations</strong>, ou <strong>créer</strong>{' '}
            un <strong>site web/MVP</strong>, on peut organiser un appel de 30 min.
          </p>
        </div>
        <a
          href={CALENDLY_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            background: '#FFFFFF',
            color: '#1C1C1C',
            border: `1.5px solid ${dark ? 'rgba(255,255,255,.15)' : '#E9E9E9'}`,
            borderRadius: 10,
            padding: '12px 20px',
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: '-0.01em',
            textDecoration: 'none',
          }}
        >
          Réserver un appel →
        </a>
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
        <div>
          <p style={{ fontSize: 12, color: mutedColor ?? '#6E6E6E', marginBottom: 6 }}>Prénom *</p>
          <input
            type="text"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Ton prénom"
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
        </div>

        <div className="flex flex-col min-[480px]:flex-row" style={{ gap: 10 }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 12, color: mutedColor ?? '#6E6E6E', marginBottom: 6 }}>Email *</p>
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
          </div>

          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 12, color: mutedColor ?? '#6E6E6E', marginBottom: 6 }}>Téléphone *</p>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="06 12 34 56 78"
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
          </div>
        </div>

        <p style={{ fontSize: 10, color: mutedColor ?? '#6E6E6E', lineHeight: 1.4, textAlign: 'center' as const }}>
          Informations utilisées uniquement pour t&apos;envoyer le guide et te recontacter si besoin.
          <br />
          Jamais revendues. Jamais de spam.{' '}
          <a
            href="/confidentialite"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: mutedColor ?? '#6E6E6E', textDecoration: 'underline' }}
          >
            Politique de confidentialité
          </a>
        </p>

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
