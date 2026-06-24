import Link from 'next/link'

const COACHING_FEATURES = [
  'Sessions en visio, individuelles ou en équipe, à votre rythme',
  'Programme 100% adapté à votre niveau et vos objectifs',
  'Claude, automatisations N8N, agents IA, workflows, autres outils selon vos besoins',
  'Exercices pratiques et suivi tout le long de la formation',
]

const SETUP_FEATURES = [
  'Audit de vos processus et identification des tâches répétitives',
  'Mise en place de workflows (Claude, N8N, Make…)',
  'Connexion de vos outils : email, agenda, facturation, CRM…',
  'Respect des normes de sécurité, RGPD et données clients',
]

const SETUP_EXTRA = [
  'Suivi, itérations et optimisation dans la durée',
  "Création de site web / modification du site existant si nécessaire afin d'intégrer les automatisations",
  'Création de dashboard pour un meilleur suivi des métriques de votre business',
]

function FeatureList({ features, light, margin = '24px 0 0' }: { features: string[]; light?: boolean; margin?: string }) {
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin, display: 'flex', flexDirection: 'column', gap: 12 }}>
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

function OfferCard({ title, subtitle, features, extraLabel, extraFeatures, audience, cta, ctaHref, light }: {
  title: string
  subtitle: string
  features: string[]
  extraLabel?: string
  extraFeatures?: string[]
  audience: string
  cta: string
  ctaHref: string
  light?: boolean
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ background: '#EAAF48', padding: 'clamp(18px,2.2vw,28px) clamp(24px,3vw,40px)' }}>
        <h2
          style={{ fontSize: 'clamp(22px,2.4vw,30px)', fontWeight: 700, letterSpacing: '-0.03em', color: '#1C1C1C', lineHeight: 1.1, margin: 0 }}
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
          style={{ fontSize: 'clamp(15px,1.7vw,21px)', fontWeight: 700, letterSpacing: '-0.02em', color: light ? '#1C1C1C' : '#fff', marginTop: 0, lineHeight: 1.2 }}
          className="font-display"
        >
          {subtitle}
        </h3>
        <FeatureList features={features} light={light} />
        {extraFeatures && (
          <>
            <p
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: light ? '#1C1C1C' : '#fff',
                marginTop: 20,
                marginBottom: 0,
              }}
            >
              {extraLabel}
            </p>
            <div
              style={{
                background: light ? '#F2F1EC' : 'rgba(255,255,255,.06)',
                borderRadius: 10,
                padding: 'clamp(16px,2vw,22px)',
                marginTop: 12,
              }}
            >
              <FeatureList features={extraFeatures} light={light} margin="0" />
            </div>
          </>
        )}
        <p
          style={{
            fontSize: 14,
            color: light ? '#6E6E6E' : 'rgba(255,255,255,.55)',
            marginTop: 24,
            lineHeight: 1.5,
          }}
        >
          {audience}
        </p>
        <div style={{ marginTop: 'auto', paddingTop: 28 }}>
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

export default function ServicesOffers() {
  return (
    <section
      style={{
        maxWidth: 1200,
        marginInline: 'auto',
        paddingInline: 'clamp(20px,5vw,56px)',
        paddingBottom: 'clamp(64px,9vw,120px)',
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="offers-grid">
        <OfferCard
          title="Mise en place d'automatisation"
          subtitle="Je construis vos automatisations à votre place"
          features={SETUP_FEATURES}
          extraLabel="Services supplémentaires :"
          extraFeatures={SETUP_EXTRA}
          audience="Pour les indépendants comme pour les entreprises."
          cta="Réserver un appel"
          ctaHref="/reserver?type=automatisation"
          light
        />
        <OfferCard
          title="Coaching automatisation"
          subtitle="Apprenez à automatiser, seul ou avec votre équipe"
          features={COACHING_FEATURES}
          audience="Disponible en individuel ou pour votre équipe."
          cta="Réserver un appel"
          ctaHref="/reserver?type=coaching"
        />
      </div>

      <style>{`
        @media (max-width: 800px) {
          .offers-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
