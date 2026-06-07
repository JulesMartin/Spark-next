import Link from 'next/link'

const COLS = [
  {
    heading: 'Explorer',
    links: ['Interviews', 'Blog', 'À propos', 'Chaîne YouTube'],
    hrefs: ['/', '/blog', '/a-propos', 'https://www.youtube.com/@Z-Start-Web'],
  },
  {
    heading: 'Spark',
    links: ['Ressource gratuite', 'Proposer un invité', 'TikTok', 'Instagram'],
    hrefs: ['/#lead-magnet', '/devenir-invite', 'https://www.tiktok.com/@Z-Start-Web', 'https://www.instagram.com/Z-Start-Web'],
  },
]

export default function Footer() {
  return (
    <footer style={{ background: '#1C1C1C', color: 'rgba(255,255,255,.7)', marginTop: 0 }}>
      {/* Top grid */}
      <div
        style={{
          maxWidth: 1200,
          marginInline: 'auto',
          paddingInline: 'clamp(20px,5vw,56px)',
          paddingTop: 64,
          paddingBottom: 40,
          display: 'grid',
          gridTemplateColumns: '1.6fr 1fr 1fr',
          gap: 40,
        }}
        className="footer-grid"
      >
        {/* Brand column */}
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}>
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: 3,
                background: '#EAAF48',
                transform: 'rotate(45deg)',
                display: 'inline-block',
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: '-0.03em',
                color: '#fff',
              }}
              className="font-display"
            >
              Spark
            </span>
          </div>
          <p
            style={{
              marginTop: 16,
              fontSize: 15,
              lineHeight: 1.6,
              maxWidth: 280,
            }}
          >
            Contenu éducatif sur l&apos;IA pour les entrepreneurs et TPE. Une nouvelle
            vidéo tous les deux jours.
          </p>
        </div>

        {/* Link columns */}
        {COLS.map(({ heading, links, hrefs }) => (
          <div key={heading}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '.08em',
                textTransform: 'uppercase' as const,
                color: '#EAAF48',
              }}
            >
              {heading}
            </div>
            <ul
              style={{
                listStyle: 'none',
                margin: '16px 0 0',
                padding: 0,
                display: 'grid',
                gap: 11,
              }}
            >
              {links.map((label, i) => {
                const href = hrefs[i]
                const isExternal = href.startsWith('http')
                return (
                  <li key={label}>
                    {isExternal ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: 'rgba(255,255,255,.7)',
                          fontSize: 14.5,
                          textDecoration: 'none',
                        }}
                      >
                        {label}
                      </a>
                    ) : (
                      <Link
                        href={href}
                        style={{
                          color: 'rgba(255,255,255,.7)',
                          fontSize: 14.5,
                          textDecoration: 'none',
                        }}
                      >
                        {label}
                      </Link>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div
        style={{
          maxWidth: 1200,
          marginInline: 'auto',
          paddingInline: 'clamp(20px,5vw,56px)',
          borderTop: '1px solid rgba(255,255,255,.12)',
          paddingTop: 22,
          paddingBottom: 40,
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap' as const,
          gap: 14,
          fontSize: 13.5,
        }}
      >
        <span>© {new Date().getFullYear()} Spark Média. Tous droits réservés.</span>
        <span style={{ display: 'flex', gap: 22 }}>
          <Link
            href="/mentions-legales"
            style={{ color: 'rgba(255,255,255,.7)', textDecoration: 'none' }}
          >
            Mentions légales
          </Link>
          <Link
            href="/confidentialite"
            style={{ color: 'rgba(255,255,255,.7)', textDecoration: 'none' }}
          >
            Confidentialité
          </Link>
        </span>
      </div>

      <style>{`
        @media (max-width: 700px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 440px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  )
}
