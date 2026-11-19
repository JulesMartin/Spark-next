import Image from 'next/image'
import type { CSSProperties } from 'react'
import { YouTubeVideo } from '@/lib/youtube-feed'
import { SKOOL_URL } from './site-ui'

const d = (ms: number) => ({ '--d': ms }) as CSSProperties

function timeAgo(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diffMs / 86_400_000)
  if (days === 0) return "aujourd'hui"
  if (days === 1) return 'il y a 1 j'
  if (days < 7) return `il y a ${days} j`
  const weeks = Math.floor(days / 7)
  if (weeks === 1) return 'il y a 1 sem'
  if (weeks < 5) return `il y a ${weeks} sem`
  const months = Math.floor(days / 30)
  if (months === 1) return 'il y a 1 mois'
  return `il y a ${months} mois`
}

// Ouverture de l'accueil : texte à gauche, portrait « Dernière vidéo » à droite.
// L'arbre de points (canvas de SiteMotion) pousse en transparence derrière le texte et éclate au scroll.
export default function HeroSection({ featured }: { featured: YouTubeVideo | null }) {
  return (
    <section className="hero-home hero-tree">
      <div className="hero-text">
        <div className="treebox" aria-hidden="true" />
        <h1 className="in0" style={d(80)}>Maîtrise l&apos;IA pour ton business</h1>
        <p className="lead in0" data-avoid style={d(220)}>
          Vidéos pratiques sur Claude, les agents IA et l&apos;automatisation — pour que tu puisses intégrer ces
          outils dans ton activité, dès aujourd&apos;hui.
        </p>
        <div className="acts in0" data-avoid style={d(360)}>
          <a className="btn solid big i-go" href={SKOOL_URL} target="_blank" rel="noopener noreferrer">
            Rejoindre le Skool
          </a>
        </div>
      </div>

      <div className="portrait in0" data-avoid style={d(260)}>
        <div className="portrait-frame">
          <Image src="/jules-hero.png" alt="Jules Martin" fill priority sizes="(max-width: 960px) 92vw, 460px" />
          <div className="cap">
            <span className="eyebrow">Dernière vidéo</span>
            <b>{featured?.title ?? 'Spark'}</b>
          </div>
        </div>
        <div className="toast">
          <i aria-hidden="true">
            <svg width="12" height="13" viewBox="0 0 11 13" fill="#fff"><path d="M0 0l11 6.5L0 13V0z" /></svg>
          </i>
          <span>
            <small>YouTube{featured?.publishedAt ? ` · ${timeAgo(featured.publishedAt)}` : ''}</small>
            <b>Nouvel épisode en ligne</b>
          </span>
        </div>
      </div>
    </section>
  )
}
