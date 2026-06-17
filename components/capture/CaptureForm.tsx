'use client'

import { useState } from 'react'
import posthog from 'posthog-js'

export default function CaptureForm({ campaign }: { campaign: string }) {
  const [email, setEmail] = useState('')
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
          email: email.trim().toLowerCase(),
          campaign,
          social_handle: socialHandle.trim() || undefined,
          website,
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error ?? 'Une erreur est survenue.')
        setStatus('error')
      } else {
        posthog.identify(email.trim().toLowerCase(), { email: email.trim().toLowerCase() })
        posthog.capture('capture_form_submitted', { campaign, has_social_handle: !!socialHandle.trim() })
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
        <p className="text-sm text-black/70" style={{ fontFamily: 'var(--font-assistant)' }}>
          Vérifie tes mails — ça arrive dans quelques minutes.
        </p>
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

      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="ton@email.com"
        className="w-full border-2 border-black px-4 py-3 text-sm text-black placeholder:text-black/40 outline-none focus:border-black bg-white mb-3"
        style={{ fontFamily: 'var(--font-assistant)' }}
      />

      <input
        type="text"
        value={socialHandle}
        onChange={(e) => setSocialHandle(e.target.value)}
        placeholder="@ton_pseudo (Instagram, TikTok…)"
        className="w-full border-2 border-black px-4 py-3 text-sm text-black placeholder:text-black/40 outline-none focus:border-black bg-white mb-3"
        style={{ fontFamily: 'var(--font-assistant)' }}
      />

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
