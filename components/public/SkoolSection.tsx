const BENEFITS = [
  {
    icon: '📚',
    title: 'Toutes les ressources gratuites centralisées',
    desc: 'Prompts, guides, templates et outils IA réunis en un seul endroit.',
  },
  {
    icon: '🎯',
    title: 'Contenu inédit',
    desc: 'Des formations et insights exclusifs que vous ne trouverez nulle part ailleurs.',
  },
  {
    icon: '💬',
    title: 'Pose tes questions',
    desc: 'Accès direct pour poser vos questions et obtenir des réponses concrètes.',
  },
  {
    icon: '🤝',
    title: "Crée des liens avec d'autres professionnels",
    desc: "Rejoignez une communauté d'entrepreneurs et TPE qui utilisent l'IA au quotidien.",
  },
]

export default function SkoolSection() {
  return (
    <section
      style={{
        maxWidth: 1200,
        marginInline: 'auto',
        paddingInline: 'clamp(20px,5vw,56px)',
        paddingBottom: 'clamp(48px,6vw,80px)',
      }}
    >
      <div
        style={{
          background: '#1C1C1C',
          borderRadius: 32,
          padding: 'clamp(40px,5vw,72px)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Accent blob */}
        <div
          style={{
            position: 'absolute',
            top: -80,
            right: -80,
            width: 320,
            height: 320,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(234,175,72,.18) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Header */}
        <div style={{ marginBottom: 'clamp(32px,4vw,52px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '.08em',
                textTransform: 'uppercase' as const,
                color: '#EAAF48',
              }}
            >
              Communauté gratuite
            </span>
          </div>
          <h2
            style={{
              fontSize: 'clamp(26px,3.5vw,42px)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              color: '#fff',
              maxWidth: 600,
            }}
            className="font-display"
          >
            Rejoignez la communauté Spark 100% gratuite sur Skool
          </h2>
          <p
            style={{
              color: 'rgba(255,255,255,.5)',
              fontSize: 17,
              lineHeight: 1.6,
              marginTop: 16,
              maxWidth: 500,
            }}
          >
            Un espace pour aller plus loin ensemble — ressources, questions, entraide.
          </p>
        </div>

        {/* Benefits grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 'clamp(16px,2vw,24px)',
            marginBottom: 'clamp(36px,4vw,52px)',
          }}
          className="skool-grid"
        >
          {BENEFITS.map((b) => (
            <div
              key={b.title}
              style={{
                background: 'rgba(255,255,255,.05)',
                border: '1px solid rgba(255,255,255,.1)',
                borderRadius: 16,
                padding: 'clamp(20px,2.5vw,28px)',
              }}
            >
              <span style={{ fontSize: 26 }}>{b.icon}</span>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: '#fff',
                  marginTop: 12,
                  marginBottom: 6,
                  letterSpacing: '-0.01em',
                }}
              >
                {b.title}
              </div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,.45)', lineHeight: 1.55 }}>
                {b.desc}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <a
          href="https://www.skool.com/spark-1953"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            background: '#EAAF48',
            color: '#1C1C1C',
            fontSize: 15,
            fontWeight: 700,
            padding: '14px 30px',
            borderRadius: 12,
            textDecoration: 'none',
            letterSpacing: '-0.01em',
          }}
        >
          Rejoindre gratuitement
          <svg viewBox="0 0 16 16" fill="none" width="16" height="16" style={{ flexShrink: 0 }}>
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .skool-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
