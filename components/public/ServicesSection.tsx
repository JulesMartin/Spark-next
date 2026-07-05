'use client'

import { useState } from 'react'
import Link from 'next/link'

type Audience = 'solo' | 'team'

const COACHING_FEATURES = [
  'Sessions individuelles en visio, à ton rythme',
  'Programme 100% adapté à ton niveau et tes objectifs',
  'Claude, automatisations, agents IA, workflows',
  'Exercices pratiques et suivi entre chaque session',
]

const AUTOMATION_SOLO_FEATURES = [
  'Identification des tâches répétitives à automatiser',
  'Mise en place de workflows (Claude, N8N, Make…)',
  'Connexion de tes outils : email, agenda, facturation, CRM…',
]

const B2B_AUTO_FEATURES = [
  "Audit de vos processus et identification des gains",
  "Intégration d'outils IA adaptés à votre secteur",
  "Respect des normes de sécurité, RGPD, données clients",
  "Suivi, itérations et optimisation dans la durée",
]

const WEBSITE_SOLO_FEATURES = [
  'Site vitrine ou landing page sur-mesure',
  "Implémentation des automatisations qu'il te faut",
  "Formulaire de contact, capture d'emails et analytics intégrés si nécessaire",
  'Optimisation SEO si nécessaire',
]

const WEBSITE_B2B_FEATURES = [
  "Implémentation des automatisations qu'il vous faut",
  'Design adapté à votre charte graphique',
  'Formulaires, analytics et intégrations CRM inclus',
  'Optimisation SEO si nécessaire',
]



function FeatureList({ features, light }: { features: string[]; light?: boolean }) {
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: '24px 0 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
      {features.map(f => (
        <li
          key={f}
          style={{ display: 'flex', gap: 11, alignItems: 'flex-start', fontSize: 15, color: light ? '#474747' : 'rgba(255,255,255,.8)', lineHeight: 1.5 }}
        >
          <span style={{ color: '#EAAF48', fontWeight: 700, flexShrink: 0, marginTop: 1 }}>→</span>
          {f}
        </li>
      ))}
    </ul>
  )
}

function ServiceCard({ title, subtitle, features, cta, ctaHref, light }: {
  title: string
  subtitle: string
  features: string[]
  cta: string
  ctaHref: string
  light?: boolean
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ background: '#EAAF48', padding: 'clamp(16px,2vw,24px) clamp(24px,3vw,40px)' }}>
        <h2
          style={{ fontSize: 'clamp(18px,2vw,26px)', fontWeight: 700, letterSpacing: '-0.03em', color: '#1C1C1C', lineHeight: 1.1, margin: 0 }}
          className="font-display"
        >
          {title}
        </h2>
      </div>
      <div
        style={{
          background: light ? '#fff' : '#1C1C1C',
          padding: 'clamp(24px,3vw,40px)',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }}
      >
        <h3
          style={{ fontSize: 'clamp(14px,1.6vw,20px)', fontWeight: 700, letterSpacing: '-0.02em', color: light ? '#1C1C1C' : '#fff', marginTop: 0, lineHeight: 1.2 }}
          className="font-display"
        >
          {subtitle}
        </h3>
        <FeatureList features={features} light={light} />
        <div style={{ marginTop: 'auto', paddingTop: 32 }}>
          <Link
            href={ctaHref}
            style={{
              display: 'inline-block',
              background: light ? '#1C1C1C' : '#EAAF48',
              color: light ? '#fff' : '#1C1C1C',
              fontSize: 15,
              fontWeight: 700,
              padding: '13px 26px',
              textDecoration: 'none',
              letterSpacing: '-0.01em',
              borderRadius: 8,
            }}
          >
            {cta} →
          </Link>
        </div>
      </div>
    </div>
  )
}

const AUDIENCES: { key: Audience; label: string; sub: string }[] = [
  { key: 'solo', label: 'Je travaille seul·e', sub: 'Individuel · freelance · solopreneur · créateur' },
  { key: 'team', label: "J'ai une équipe", sub: 'TPE · PME · startup' },
]

export default function ServicesSection() {
  const [audience, setAudience] = useState<Audience>('solo')
  const [animKey, setAnimKey] = useState(0)
  const [animDir, setAnimDir] = useState<'right' | 'left'>('right')

  function switchTo(next: Audience) {
    if (next === audience) return
    setAnimDir(next === 'team' ? 'right' : 'left')
    setAnimKey(k => k + 1)
    setAudience(next)
  }

  return (
    <>
      <section
        style={{
          maxWidth: 1200,
          marginInline: 'auto',
          paddingInline: 'clamp(20px,5vw,56px)',
          paddingBottom: 'clamp(64px,9vw,120px)',
        }}
      >
        <p
          style={{
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '.08em',
            textTransform: 'uppercase',
            color: '#888',
            marginBottom: 16,
          }}
        >
          Cliquez sur ce qui vous correspond
        </p>

        <div style={{ background: '#EBEBEB', borderRadius: 16, padding: 10 }}>

          {/* Tabs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 24 }} className="audience-grid">
            {AUDIENCES.map(({ key, label, sub }) => (
              <button
                key={key}
                onClick={() => switchTo(key)}
                style={{
                  background: audience === key ? '#1C1C1C' : '#E0DED8',
                  border: `2.5px solid ${audience === key ? '#EAAF48' : 'transparent'}`,
                  borderRadius: 10,
                  padding: 'clamp(16px,2vw,24px) clamp(20px,3vw,36px)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'border-color .2s ease',
                }}
              >
                <span
                  className="font-display"
                  style={{
                    display: 'block',
                    fontSize: 'clamp(17px,1.8vw,22px)',
                    fontWeight: 700,
                    color: audience === key ? '#EAAF48' : '#1C1C1C',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.2,
                    transition: 'color .2s',
                  }}
                >
                  {label}
                </span>
                <span
                  style={{
                    display: 'block',
                    fontSize: 12,
                    color: audience === key ? 'rgba(234,175,72,.7)' : '#888',
                    marginTop: 6,
                    lineHeight: 1.5,
                    transition: 'color .2s',
                  }}
                >
                  {sub}
                </span>
              </button>
            ))}
          </div>

          {/* Cards */}
          <div style={{ overflow: 'hidden', borderRadius: 8 }}>
            <div
              key={animKey}
              style={{
                display: 'grid',
                gridTemplateColumns: audience === 'solo' ? '1fr 1fr 1fr' : '1fr 1fr',
                gap: 10,
                animation: animKey > 0 ? `svc-slide-${animDir} .28s cubic-bezier(.25,.46,.45,.94) both` : undefined,
              }}
              className={`services-grid ${audience === 'solo' ? 'services-grid-3' : ''}`}
            >
              {audience === 'solo' ? (
                <>
                  <ServiceCard
                    title="Coaching individuel"
                    subtitle="Apprends l'automatisation IA à ton rythme"
                    features={COACHING_FEATURES}
                    cta="Réserver un appel"
                    ctaHref="https://calendly.com/jules-api/new-meeting"
                  />
                  <ServiceCard
                    title="Automatisation"
                    subtitle="Automatise tes tâches répétitives, gagne du temps"
                    features={AUTOMATION_SOLO_FEATURES}
                    cta="Réserver un appel"
                    ctaHref="https://calendly.com/jules-api/new-meeting"
                    light
                  />
                  <ServiceCard
                    title="Création de site web automatisé"
                    subtitle="Obtiens un site sur-mesure, livré rapidement"
                    features={WEBSITE_SOLO_FEATURES}
                    cta="Réserver un appel"
                    ctaHref="https://calendly.com/jules-api/new-meeting"
                  />
                </>
              ) : (
                <>
                  <ServiceCard
                    title="Implémentation d'automatisation"
                    subtitle="Intégrez l'automatisation dans vos process"
                    features={B2B_AUTO_FEATURES}
                    cta="Réserver un appel"
                    ctaHref="https://calendly.com/jules-api/new-meeting"
                    light
                  />
                  <ServiceCard
                    title="Création de site web automatisé"
                    subtitle="Un site professionnel pour votre entreprise"
                    features={WEBSITE_B2B_FEATURES}
                    cta="Réserver un appel"
                    ctaHref="https://calendly.com/jules-api/new-meeting"
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes svc-slide-right {
          from { opacity: 0; transform: translateX(28px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes svc-slide-left {
          from { opacity: 0; transform: translateX(-28px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @media (max-width: 1050px) {
          .services-grid-3 { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 900px) {
          .services-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 540px) {
          .audience-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
