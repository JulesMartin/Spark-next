'use client'

import { useState } from 'react'

const BUSINESS_TYPES = [
  'Agence (marketing, web, conseil...)',
  'SaaS / Produit tech',
  'E-commerce / Dropshipping',
  'Freelance / Consulting',
  'Coaching / Formation / Infoproduit',
  'Marketplace / Plateforme',
  'Industrie / Commerce physique',
  'Autre',
]

const MONTHLY_REVENUES = [
  'Moins de 1 000 €',
  '1 000 – 5 000 €',
  '5 000 – 15 000 €',
  '15 000 – 50 000 €',
  '50 000 – 100 000 €',
  'Plus de 100 000 €',
]

const MONTHLY_CLIENTS = [
  'Moins de 5 clients',
  '5 – 20 clients',
  '20 – 50 clients',
  '50 – 200 clients',
  'Plus de 200 clients',
  'Non applicable (B2C / volume)',
]

type FormState = 'idle' | 'loading' | 'success' | 'error'

function SelectField({
  label,
  name,
  options,
  value,
  onChange,
  required,
}: {
  label: string
  name: string
  options: string[]
  value: string
  onChange: (v: string) => void
  required?: boolean
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-body text-xs font-medium tracking-[0.15em] uppercase text-muted">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      <div className="border border-edge hover:border-accent/60 focus-within:border-accent transition-colors duration-200">
        <select
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="w-full bg-transparent font-body text-sm text-cream px-4 py-3 outline-none cursor-pointer appearance-none"
          style={{ backgroundImage: 'none' }}
        >
          <option value="" className="bg-bg text-muted">Sélectionner...</option>
          {options.map((opt) => (
            <option key={opt} value={opt} className="bg-bg text-cream">{opt}</option>
          ))}
        </select>
      </div>
    </div>
  )
}

function InputField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  required,
  placeholder,
}: {
  label: string
  name: string
  type?: string
  value: string
  onChange: (v: string) => void
  required?: boolean
  placeholder?: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-body text-xs font-medium tracking-[0.15em] uppercase text-muted">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="bg-transparent border border-edge hover:border-accent/60 focus:border-accent outline-none font-body text-sm text-cream px-4 py-3 transition-colors duration-200 placeholder:text-muted/50"
      />
    </div>
  )
}

export default function GuestForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [businessType, setBusinessType] = useState('')
  const [monthlyRevenue, setMonthlyRevenue] = useState('')
  const [monthlyClients, setMonthlyClients] = useState('')
  const [motivation, setMotivation] = useState('')
  const [state, setState] = useState<FormState>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState('loading')
    setErrorMessage('')

    try {
      const formEl = e.currentTarget
      const honeypot = (formEl.elements.namedItem('website') as HTMLInputElement)?.value

      const res = await fetch('/api/candidature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          businessType,
          monthlyRevenue,
          monthlyClients,
          motivation,
          website: honeypot, // honeypot field
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setState('error')
        setErrorMessage(data.error ?? 'Une erreur est survenue.')
        return
      }

      setState('success')
    } catch {
      setState('error')
      setErrorMessage('Impossible de soumettre le formulaire. Vérifiez votre connexion.')
    }
  }

  if (state === 'success') {
    return (
      <div className="border border-accent/40 p-10 text-center">
        <div className="w-12 h-12 border border-accent flex items-center justify-center mx-auto mb-6">
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-accent">
            <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="font-display font-bold text-2xl text-cream mb-3">Candidature reçue</h3>
        <p className="font-body text-sm text-muted max-w-sm mx-auto leading-relaxed">
          Merci pour votre intérêt. Nous examinons chaque candidature avec soin et reviendrons vers vous sous 7 jours.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      {/* Honeypot — hidden from real users, bots fill it */}
      <input
        type="text"
        name="website"
        defaultValue=""
        tabIndex={-1}
        aria-hidden="true"
        className="absolute opacity-0 pointer-events-none h-0 w-0 overflow-hidden"
        autoComplete="off"
      />

      {/* Identity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Nom complet"
          name="name"
          value={name}
          onChange={setName}
          required
          placeholder="Jules Martin"
        />
        <InputField
          label="Adresse email"
          name="email"
          type="email"
          value={email}
          onChange={setEmail}
          required
          placeholder="jules@monentreprise.fr"
        />
      </div>

      {/* Business qualifiers */}
      <SelectField
        label="Type de business"
        name="businessType"
        options={BUSINESS_TYPES}
        value={businessType}
        onChange={setBusinessType}
        required
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SelectField
          label="Revenu mensuel"
          name="monthlyRevenue"
          options={MONTHLY_REVENUES}
          value={monthlyRevenue}
          onChange={setMonthlyRevenue}
          required
        />
        <SelectField
          label="Clients par mois"
          name="monthlyClients"
          options={MONTHLY_CLIENTS}
          value={monthlyClients}
          onChange={setMonthlyClients}
          required
        />
      </div>

      {/* Motivation */}
      <div className="flex flex-col gap-2">
        <label className="font-body text-xs font-medium tracking-[0.15em] uppercase text-muted">
          Pourquoi vouloir participer ?{' '}
          <span className="normal-case text-muted/60">(optionnel)</span>
        </label>
        <textarea
          name="motivation"
          value={motivation}
          onChange={(e) => setMotivation(e.target.value)}
          rows={4}
          maxLength={2000}
          placeholder="Parlez-nous de votre parcours, de ce qui vous a mené ici, de ce que vous aimeriez partager..."
          className="bg-transparent border border-edge hover:border-accent/60 focus:border-accent outline-none font-body text-sm text-cream px-4 py-3 transition-colors duration-200 resize-none placeholder:text-muted/50"
        />
        <span className="font-body text-xs text-muted/50 text-right">{motivation.length}/2000</span>
      </div>

      {/* Error */}
      {state === 'error' && (
        <p className="font-body text-sm text-red-400 border border-red-400/30 px-4 py-3">
          {errorMessage}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={state === 'loading'}
        className="bg-accent text-bg font-body font-semibold text-sm tracking-wide px-8 py-4 hover:bg-accent/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
      >
        {state === 'loading' ? (
          <>
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Envoi en cours...
          </>
        ) : (
          <>
            Envoyer ma candidature
            <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 shrink-0">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </>
        )}
      </button>

      <p className="font-body text-xs text-muted/60 text-center">
        Vos données sont utilisées uniquement pour traiter votre candidature et ne sont jamais partagées.
      </p>
    </form>
  )
}
