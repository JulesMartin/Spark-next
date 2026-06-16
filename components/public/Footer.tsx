import Link from 'next/link'

const COLS = [
  {
    heading: 'Explorer',
    links: ['Vidéos', 'Services', 'Blog', 'À propos', 'Chaîne YouTube'],
    hrefs: ['/', '/services', '/blog', '/a-propos', 'https://www.youtube.com/@Z-Start-Web'],
  },
  {
    heading: 'Spark',
    links: ['Ressource gratuite', 'Communauté Skool', 'TikTok', 'Instagram'],
    hrefs: ['/#lead-magnet', 'https://www.skool.com/spark-1953', 'https://www.tiktok.com/@Z-Start-Web', 'https://www.instagram.com/Z-Start-Web'],
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
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap' as const,
          gap: 14,
          fontSize: 13.5,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' as const }}>
          <span>© {new Date().getFullYear()} Spark Média. Tous droits réservés.</span>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            {/* Instagram */}
            <a
              href="https://www.instagram.com/Z-Start-Web"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              style={{ color: 'rgba(255,255,255,.55)', display: 'flex', alignItems: 'center', transition: 'color 150ms' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4.5"/>
                <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/>
              </svg>
            </a>
            {/* TikTok */}
            <a
              href="https://www.tiktok.com/@Z-Start-Web"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              style={{ color: 'rgba(255,255,255,.55)', display: 'flex', alignItems: 'center', transition: 'color 150ms' }}
            >
              <svg width="16" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.73z"/>
              </svg>
            </a>
            {/* YouTube */}
            <a
              href="https://www.youtube.com/@Z-Start-Web"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              style={{ color: 'rgba(255,255,255,.55)', display: 'flex', alignItems: 'center', transition: 'color 150ms' }}
            >
              <svg width="20" height="15" viewBox="0 0 24 17" fill="currentColor">
                <path d="M23.5 2.6s-.3-2-1.2-2.7C21.1-.9 19.7-.9 19 -1c-3.4-.3-8.5-.3-8.5-.3s-5.1 0-8.5.2C1.3-.9-.1-.9-1-.2-1.9.5-2.2 2.6-2.2 2.6S-2.5 5-2.5 7.4v2.2c0 2.4.3 4.8.3 4.8s.3 2 1.2 2.7c1.2.8 2.7.8 3.4.8 2.4.2 10.6.3 10.6.3s5.1 0 8.5-.3c.7-.1 2.1-.1 3-1 .9-.7 1.2-2.7 1.2-2.7s.3-2.4.3-4.8V7.4c0-2.4-.3-4.8-.3-4.8zM9.7 11.5V5.2l6.6 3.2-6.6 3.1z"/>
              </svg>
            </a>
          </div>
        </div>
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
