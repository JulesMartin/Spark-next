'use client'

import { useId, useState } from 'react'
import { EARLY_SPOTS, LAUNCH_PRICE } from '@/lib/waitlist'
import { useWaitlist, type WaitlistResult } from './WaitlistState'

const PLATFORMS = [
  ['instagram', 'Instagram', <path key="i" d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 1.8A3.7 3.7 0 0 0 3.8 7.5v9a3.7 3.7 0 0 0 3.7 3.7h9a3.7 3.7 0 0 0 3.7-3.7v-9a3.7 3.7 0 0 0-3.7-3.7h-9ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4Zm5.3-2.6a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4Z" />],
  ['tiktok', 'TikTok', <path key="t" d="M16.6 2h-3.2v13.3a2.9 2.9 0 1 1-2.9-2.9c.3 0 .6 0 .9.1V9.2a6.2 6.2 0 1 0 5.2 6.1V8.7a7.8 7.8 0 0 0 4.5 1.4V6.9a4.6 4.6 0 0 1-4.5-4.9Z" />],
  ['youtube', 'YouTube', <path key="y" d="M21.6 7.2a2.6 2.6 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.6 2.6 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.6 2.6 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.6 2.6 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8ZM10 15V9l5.2 3L10 15Z" />],
] as const

function Done({ r }: { r: WaitlistResult }) {
  const prefix = r.already ? `Tu es déjà inscrit (n° ${r.position}). ` : `Tu es n° ${r.position}. `
  if (r.tier === 'founder')
    return (
      <div className="done" role="status">
        <h3>Bravo, tu es dans les 50 premiers.</h3>
        <p>
          {prefix}Ton prix de {LAUNCH_PRICE} €/mois à vie est réservé, avec le skill pour définir ton offre
          et, si tu en as envie, un call 1-1 offert. Tu reçois par e-mail la sélection d&apos;opportunités de business IA. Regarde bien tes promotions et spam.
        </p>
      </div>
    )
  if (r.tier === 'early')
    return (
      <div className="done" role="status">
        <h3>Bravo, tu es dans les 100 premiers.</h3>
        <p>
          {prefix}Ton prix de {LAUNCH_PRICE} €/mois à vie est réservé. Tu reçois par e-mail la sélection
          d&apos;opportunités de business IA et le skill pour définir ton offre, puis ton lien d&apos;accès le jour J. Regarde bien tes promotions et spam.
        </p>
      </div>
    )
  return (
    <div className="done" role="status">
      <h3>Mince, tu y étais presque.</h3>
      <p>
        {prefix}Les {EARLY_SPOTS} premières places sont parties. Mais je t&apos;envoie quand même par e-mail
        la sélection d&apos;opportunités de business IA et le skill pour définir ton offre. Regarde bien tes promotions et spam.
      </p>
    </div>
  )
}

export default function WaitlistForm() {
  const { closed, result, setResult } = useWaitlist()
  const [email, setEmail] = useState('')
  const [platform, setPlatform] = useState<(typeof PLATFORMS)[number][0]>('instagram')
  const [handle, setHandle] = useState('')
  const [website, setWebsite] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [error, setError] = useState('')
  const id = useId()

  if (result) return <Done r={result} />

  if (closed)
    return (
      <div className="done" role="status">
        <h3>La liste d&apos;attente est fermée.</h3>
        <p>Merci à tous ceux qui se sont inscrits. Ouverture très prochainement.</p>
      </div>
    )

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setError('')
    const q = new URLSearchParams(window.location.search)
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          platform,
          handle,
          website,
          utm_source: q.get('utm_source'),
          utm_medium: q.get('utm_medium'),
          utm_campaign: q.get('utm_campaign'),
          referrer: document.referrer || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Une erreur est survenue. Réessaie.')
        setStatus('error')
        return
      }
      setResult({ position: data.position, tier: data.tier, already: data.already })
    } catch {
      setError('Une erreur est survenue. Réessaie.')
      setStatus('error')
    }
  }

  const cta = 'Je rejoins la liste d’attente'

  return (
    <form className="wl" onSubmit={submit}>
      <p className="wl-title">Rejoins la liste d&apos;attente</p>
      <label htmlFor={`${id}-email`} className="sr">Ton adresse e-mail</label>
      <input
        id={`${id}-email`}
        type="email"
        name="email"
        required
        autoComplete="email"
        inputMode="email"
        placeholder="ton@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-invalid={status === 'error' || undefined}
      />
      <div className="wl-social">
        <div className="wl-plat" role="radiogroup" aria-label="Ton réseau principal">
          {PLATFORMS.map(([v, l, icon]) => (
            <button
              key={v}
              type="button"
              role="radio"
              aria-checked={platform === v}
              aria-label={l}
              title={l}
              className={platform === v ? 'on' : undefined}
              onClick={() => setPlatform(v)}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">{icon}</svg>
            </button>
          ))}
        </div>
        <label htmlFor={`${id}-handle`} className="sr">Ton nom d&apos;utilisateur</label>
        <input
          id={`${id}-handle`}
          type="text"
          name="handle"
          required
          maxLength={60}
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          placeholder="@ton_nom_d_utilisateur"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
        />
      </div>
      <div className="hp" aria-hidden="true">
        <label htmlFor={`${id}-website`}>Site web</label>
        <input id={`${id}-website`} type="text" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>
      <button className="btn ghost" type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Inscription…' : cta}
      </button>
      <p className="rgpd">Regarde bien tes promotions et spam après ton inscription.</p>
      {error && <p className="wl-err" role="alert">{error}</p>}
      <p className="rgpd"><a href="/confidentialite">Politique de confidentialité</a></p>
    </form>
  )
}
