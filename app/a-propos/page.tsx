import Image from 'next/image'
import type { CSSProperties } from 'react'
import SiteShell from '@/components/public/SiteShell'
import SkoolSection from '@/components/public/SkoolSection'
import { Deco, SectionTitle, YOUTUBE_URL } from '@/components/public/site-ui'
import { LIGHT, SHAPES, decoSVG } from '@/lib/skool-art'

export const revalidate = 60

const PRINCIPLES = [
  {
    title: 'Du contenu pratique avant tout',
    body: "Chaque vidéo montre comment utiliser un outil concret dans un contexte réel. Pas de théorie sans application.",
  },
  {
    title: 'Les vraies avancées, testées',
    body: "Je teste les dernières sorties — Claude, Hermes Agent, les nouveaux modèles — avant d'en parler.",
  },
  {
    title: 'Orienté résultats business',
    body: "L'IA ne sert que si elle génère des gains concrets. Mon contenu est calibré pour les professionnels et indépendants, pas pour les chercheurs.",
  },
]

// Panneau de la citation : un arbre à une seule branche, comme tout premier panneau lavande.
const DECO_QUOTE = decoSVG(SHAPES.one, LIGHT, 12)
const d = (ms: number) => ({ '--d': ms }) as CSSProperties

export default function AProposPage() {
  return (
    <SiteShell>
      <section className="about">
        <div>
          <span className="eyebrow in0" style={d(60)}>À propos de Jules-API</span>
          <h1 className="in0" style={d(140)}>Créateur de contenu IA pour les professionnels</h1>
          <p className="lead in0" style={d(260)}>
            Je crée du contenu éducatif sur l&apos;intelligence artificielle — Claude, les agents IA,
            l&apos;automatisation — pour aider les TPE et professionnels à intégrer ces outils dans leur activité.
          </p>
          <div className="acts in0" style={d(380)}>
            <a className="btn solid big i-play" href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer">
              Voir la chaîne YouTube
            </a>
          </div>
        </div>

        <div className="portrait in0" style={d(300)}>
          <div className="portrait-frame">
            <Image src="/jules-hero.png" alt="Jules-API" fill priority sizes="(max-width: 960px) 92vw, 44vw" />
          </div>
        </div>
      </section>

      <SectionTitle num="01" eyebrow="Mon approche">Trois principes, dans chaque vidéo</SectionTitle>
      <ul className="lines">
        {PRINCIPLES.map(({ title, body }) => (
          <li key={title}>
            <h3 className="dot-title">{title}</h3>
            <p>{body}</p>
          </li>
        ))}
      </ul>

      <div className="panel quote card">
        <Deco html={DECO_QUOTE} />
        <blockquote>
          «&nbsp;L&apos;IA n&apos;est pas réservée aux grandes entreprises. Avec les bons outils, un professionnel
          solo peut se doter de la puissance d&apos;une équipe entière.&nbsp;»
        </blockquote>
      </div>

      <SkoolSection num="02" compact />
    </SiteShell>
  )
}
