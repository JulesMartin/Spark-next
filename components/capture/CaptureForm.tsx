'use client'

import { useState } from 'react'
import posthog from 'posthog-js'
import PhoneInput from '@/components/shared/PhoneInput'
import { DEFAULT_PHONE_COUNTRY } from '@/lib/phone-country-codes'
import { getCampaignConfig, redirectUrl } from '@/lib/campaigns'

const CALENDLY_URL = 'https://calendly.com/jules-api/new-meeting'

export default function CaptureForm({ campaign }: { campaign: string }) {
  const config = getCampaignConfig(campaign)
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [dialCode, setDialCode] = useState(DEFAULT_PHONE_COUNTRY.dial)
  const [socialHandle, setSocialHandle] = useState('')
  const [website, setWebsite] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: firstName.trim(),
          email: email.trim().toLowerCase(),
          campaign,
          social_handle: socialHandle.trim() || undefined,
          website,
          ...(config ? {} : { phone: `${dialCode.trim()} ${phone.trim()}` }),
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error ?? 'Une erreur est survenue.')
        setStatus('error')
      } else {
        posthog.identify(email.trim().toLowerCase(), { email: email.trim().toLowerCase() })
        posthog.capture('capture_form_submitted', {
          campaign,
          has_social_handle: !!socialHandle.trim(),
        })
        setStatus('success')
        if (config) window.location.assign(redirectUrl(config, data.emailSent !== false))
      }
    } catch {
      setErrorMsg('Une erreur est survenue. Réessaie.')
      setStatus('error')
    }
  }

  const apInput: React.CSSProperties = {
    fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
    background: 'rgba(0,0,0,0.28)',
    color: '#f2ebdd',
    border: '1px solid rgba(242,235,221,0.16)',
    borderRadius: 14,
  }
  const apLabel: React.CSSProperties = { fontFamily: 'var(--font-dm-sans), system-ui, sans-serif', color: '#f2ebdd' }

  if (status === 'success' && config) {
    return (
      <p
        role="status"
        className="text-center text-xl uppercase tracking-wide py-6"
        style={{ fontFamily: 'var(--font-anton), Impact, sans-serif', color: '#f2ebdd' }}
      >
        C&apos;est noté, on continue…
      </p>
    )
  }

  if (status === 'success') {
    return (
      <div className="done" role="status">
        <h2>C&apos;est dans ta boîte.</h2>
        <p>Vérifie tes mails — c&apos;est probablement dans ton onglet spam ou promotion.</p>
        <p>
          Si tu souhaites faire un <strong>audit gratuit</strong> de ton business ou te{' '}
          <strong>former</strong> à vendre des <strong>automatisations</strong> et{' '}
          <strong>sites web</strong>, tu peux réserver un appel avec moi.
        </p>
        <div className="acts">
          <a className="btn solid big i-cal" href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">Réserver un appel</a>
        </div>
      </div>
    )
  }

  if (config) {
    return (
      <form onSubmit={handleSubmit} className="w-full">
        {/* Honeypot */}
        <input type="text" name="website" value={website} onChange={(e) => setWebsite(e.target.value)} className="hidden" tabIndex={-1} aria-hidden="true" autoComplete="off" />
        <div className="grid grid-cols-1 gap-5 mb-6">
          <label className="block">
            <span className="block text-sm font-semibold mb-2" style={apLabel}>Prénom *</span>
            <input type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Ton prénom" className="w-full px-5 py-4 text-base outline-none placeholder:text-[#f2ebdd]/40 focus:!border-[#ffa17f]" style={apInput} />
          </label>
          <label className="block">
            <span className="block text-sm font-semibold mb-2" style={apLabel}>Email *</span>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ton@email.com" className="w-full px-5 py-4 text-base outline-none placeholder:text-[#f2ebdd]/40 focus:!border-[#ffa17f]" style={apInput} />
          </label>
        </div>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full min-h-[64px] px-8 text-lg disabled:opacity-60 cursor-pointer transition-transform hover:-translate-y-0.5"
          style={{ background: '#ffa17f', color: '#00223e', borderRadius: 999, border: '2px solid transparent', fontFamily: 'var(--font-dm-sans), system-ui, sans-serif', fontWeight: 700 }}
        >
          {status === 'loading' ? 'Envoi…' : config.button}
        </button>
        <p className="mt-5 text-xs text-center" style={{ color: 'rgba(242,235,221,0.6)', fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>
          {config.consent ? `${config.consent} ` : ''}Informations jamais revendues.{' '}
          <a href="/confidentialite" target="_blank" rel="noopener noreferrer" className="underline">Politique de confidentialité</a>
        </p>
        {status === 'error' && (
          <p className="mt-3 text-sm text-center" style={{ color: '#ffb4a0' }}>{errorMsg}</p>
        )}
      </form>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="fm">
      {/* Honeypot */}
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

      <div className="row">
        <div>
          <label htmlFor="cf-first">Prénom *</label>
          <input id="cf-first" type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Ton prénom" autoComplete="given-name" />
        </div>
        <div>
          <label htmlFor="cf-handle">Pseudo</label>
          <input id="cf-handle" type="text" value={socialHandle} onChange={(e) => setSocialHandle(e.target.value)} placeholder="@ton_pseudo" />
        </div>
      </div>

      <div>
        <label htmlFor="cf-email">Email *</label>
        <input id="cf-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ton@email.com" autoComplete="email" />
      </div>

      {/* min-width:0 : sans lui, la largeur propre du champ téléphone fait déborder la colonne sur mobile */}
      <div style={{ minWidth: 0 }}>
        <span className="lb">Téléphone *</span>
        <PhoneInput
          variant="violet"
          value={phone}
          onChange={setPhone}
          dialCode={dialCode}
          onDialCodeChange={setDialCode}
        />
      </div>

      <button type="submit" className="go" disabled={status === 'loading'}>
        {status === 'loading' ? 'Envoi…' : 'Recevoir gratuitement'}
      </button>

      {status === 'error' && <p className="err">{errorMsg}</p>}

      <p className="rgpd">
        Informations jamais revendues.{' '}
        <a href="/confidentialite" target="_blank" rel="noopener noreferrer">Politique de confidentialité</a>
      </p>
    </form>
  )
}
