import SubscribeForm from './SubscribeForm'

export default function Newsletter() {
  return (
    <section
      id="lead-magnet"
      style={{
        maxWidth: 1200,
        marginInline: 'auto',
        paddingInline: 'clamp(20px,5vw,56px)',
        paddingBottom: 'clamp(56px,7vw,96px)',
      }}
    >
      <div
        style={{
          background: '#1C1C1C',
          borderRadius: 32,
          padding: 'clamp(34px,5vw,64px)',
          display: 'grid',
          gridTemplateColumns: '1.1fr .9fr',
          gap: 40,
          alignItems: 'center',
        }}
        className="newsletter-grid"
      >
        {/* Left */}
        <div>
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '.08em',
              textTransform: 'uppercase' as const,
              color: '#EAAF48',
            }}
          >
            Ressource gratuite
          </span>
          <h2
            style={{
              color: '#fff',
              fontSize: 'clamp(24px,3vw,34px)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              marginTop: 14,
              maxWidth: 440,
              lineHeight: 1.25,
            }}
            className="font-display"
          >
            233 prompts IA et mes 10 skills Claude préférés
          </h2>
          <p
            style={{
              color: 'rgba(255,255,255,.55)',
              fontSize: 15,
              marginTop: 16,
              maxWidth: 400,
              lineHeight: 1.6,
            }}
          >
            La boîte à outils que j&apos;utilise au quotidien, condensée en un guide gratuit envoyé directement dans ta boîte mail.
          </p>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              '233 prompts classés par usage',
              'Mes 10 skills Claude pour travailler 10× plus vite',
              'Accès immédiat, 100% gratuit',
            ].map((item) => (
              <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <span style={{ color: '#EAAF48', fontWeight: 700, flexShrink: 0 }}>—</span>
                <span style={{ color: 'rgba(255,255,255,.65)', fontSize: 14, lineHeight: 1.5 }}>{item}</span>
              </li>
            ))}
          </ul>
          <SubscribeForm dark />
        </div>
      </div>

      <style>{`
        @media (max-width: 700px) {
          .newsletter-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
