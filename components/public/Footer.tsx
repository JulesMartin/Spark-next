import Link from 'next/link'
import { Emblem, SKOOL_URL, YOUTUBE_URL } from './site-ui'

const INSTAGRAM_URL = 'https://www.instagram.com/Z-Start-Web'
const TIKTOK_URL = 'https://www.tiktok.com/@Z-Start-Web'

const COLS: { heading: string; links: [string, string][] }[] = [
  {
    heading: 'Explorer',
    links: [['Accueil', '/'], ['Services', '/services'], ['Blog', '/blog'], ['À propos', '/a-propos'], ['Chaîne YouTube', YOUTUBE_URL]],
  },
  {
    heading: 'Spark',
    links: [['Communauté Claude to Client', SKOOL_URL], ['Instagram', INSTAGRAM_URL], ['YouTube', YOUTUBE_URL], ['TikTok', TIKTOK_URL]],
  },
]

export const SocialIcon = {
  instagram: (s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.4" />
      <circle cx="17.4" cy="6.6" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  ),
  tiktok: (s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.73z" />
    </svg>
  ),
  youtube: (s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12a31 31 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
    </svg>
  ),
}

export default function Footer() {
  return (
    <footer className="end">
      <div className="end-in">
        <div className="end-grid">
          <div className="end-b">
            <Link className="end-brand" href="/">
              <Emblem light />
              <span>Spark<small>Jules Martin</small></span>
            </Link>
            <p className="end-about">
              Contenu éducatif sur l&apos;IA pour les entrepreneurs et TPE. Une nouvelle vidéo tous les deux jours.
            </p>
          </div>

          {COLS.map(({ heading, links }, i) => (
            <div className={`end-col c${i + 1}`} key={heading}>
              <h4>{heading}</h4>
              <ul>
                {links.map(([label, href]) => (
                  <li key={label}>
                    {href.startsWith('http')
                      ? <a href={href} target="_blank" rel="noopener noreferrer">{label}</a>
                      : <Link href={href}>{label}</Link>}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="end-up"><a className="btn i-up" href="#top">Haut de page</a></div>
        </div>

        <div className="end-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <span>© {new Date().getFullYear()} Spark. Tous droits réservés.</span>
            <span className="soc">
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram">{SocialIcon.instagram()}</a>
              <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer" aria-label="YouTube">{SocialIcon.youtube(20)}</a>
              <a href={TIKTOK_URL} target="_blank" rel="noopener noreferrer" aria-label="TikTok">{SocialIcon.tiktok(17)}</a>
            </span>
          </div>
          <span className="legal-links">
            <Link href="/mentions-legales">Mentions légales</Link>
            <Link href="/confidentialite">Confidentialité</Link>
          </span>
        </div>

        <div className="mark" aria-hidden="true"><span>Spark</span></div>
      </div>
    </footer>
  )
}
