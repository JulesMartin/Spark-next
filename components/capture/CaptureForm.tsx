'use client'

import { useState } from 'react'
import posthog from 'posthog-js'

const CALENDLY_URL = 'https://calendly.com/jules-api/new-meeting'

export default function CaptureForm({ campaign }: { campaign: string }) {
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
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
          phone: phone.trim(),
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
          C&apos;est dans ta boîte.
        </p>
        <p className="text-sm text-black/70 mb-4" style={{ fontFamily: 'var(--font-assistant)' }}>
          Vérifie tes mails — ça arrive dans quelques minutes.
        </p>
        <div
          className="border-2 border-black px-4 py-3 mb-5"
          style={{ background: '#FCFCD0', width: 'calc(100% + 40px)', marginInline: '-20px' }}
        >
          <p
            className="text-black"
            style={{ fontFamily: 'var(--font-assistant)', fontSize: '15px', lineHeight: 1.5 }}
          >
            Si tu souhaites faire un <strong>audit gratuit</strong> de ton business,{' '}
            <strong>apprendre</strong> les <strong>automatisations</strong>, ou <strong>créer</strong>{' '}
            un <strong>site web/MVP</strong>, on peut organiser un appel de 30 min.
          </p>
        </div>
        <a
          href={CALENDLY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block border-2 border-black px-6 py-3 text-sm font-black uppercase tracking-widest text-black transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          style={{ background: '#FFFFFF', boxShadow: '3px 3px 0 #1A1A1A', fontFamily: 'var(--font-raleway)' }}
        >
          Réserver un appel →
        </a>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
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

      <div className="w-full mb-3 flex flex-col min-[480px]:flex-row gap-3">
        <div className="flex-1">
          <p className="text-xs text-black mb-1" style={{ fontFamily: 'var(--font-assistant)' }}>
            Prénom *
          </p>
          <input
            type="text"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Ton prénom"
            className="w-full border-2 border-black px-4 py-3 text-sm text-black placeholder:text-black/40 outline-none focus:border-black bg-white"
            style={{ fontFamily: 'var(--font-assistant)' }}
          />
        </div>

        <div className="flex-1">
          <p className="text-xs text-black mb-1" style={{ fontFamily: 'var(--font-assistant)' }}>
            Pseudo
          </p>
          <input
            type="text"
            value={socialHandle}
            onChange={(e) => setSocialHandle(e.target.value)}
            placeholder="@ton_pseudo"
            className="w-full border-2 border-black px-4 py-3 text-sm text-black placeholder:text-black/40 outline-none focus:border-black bg-white"
            style={{ fontFamily: 'var(--font-assistant)' }}
          />
        </div>
      </div>

      <div className="w-full mb-3 flex flex-col min-[480px]:flex-row gap-3">
        <div className="flex-1">
          <p className="text-xs text-black mb-1" style={{ fontFamily: 'var(--font-assistant)' }}>
            Email *
          </p>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ton@email.com"
            className="w-full border-2 border-black px-4 py-3 text-sm text-black placeholder:text-black/40 outline-none focus:border-black bg-white"
            style={{ fontFamily: 'var(--font-assistant)' }}
          />
        </div>

        <div className="flex-1">
          <p className="text-xs text-black mb-1" style={{ fontFamily: 'var(--font-assistant)' }}>
            Téléphone *
          </p>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="06 12 34 56 78"
            className="w-full border-2 border-black px-4 py-3 text-sm text-black placeholder:text-black/40 outline-none focus:border-black bg-white"
            style={{ fontFamily: 'var(--font-assistant)' }}
          />
        </div>
      </div>

      <p className="text-[10px] text-black/60 mb-3 text-center" style={{ fontFamily: 'var(--font-assistant)' }}>
        Informations utilisées uniquement pour t&apos;envoyer le guide et te recontacter si besoin.
        <br />
        Jamais revendues. Jamais de spam.{' '}
        <a href="/confidentialite" target="_blank" rel="noopener noreferrer" className="underline">
          Politique de confidentialité
        </a>
      </p>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full border-2 border-black py-3 text-sm font-black uppercase tracking-widest text-black transition-all disabled:opacity-60 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer"
        style={{
          background: '#FEE04F',
          boxShadow: '3px 3px 0 #1A1A1A',
          fontFamily: 'var(--font-raleway)',
        }}
      >
        {status === 'loading' ? 'Envoi…' : 'Recevoir gratuitement →'}
      </button>

      {status === 'error' && (
        <p className="mt-2 text-xs text-red-600" style={{ fontFamily: 'var(--font-assistant)' }}>
          {errorMsg}
        </p>
      )}

    </form>
  )
}
