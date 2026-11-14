import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase/service'
import { DARK, SHAPES, decoSVG, treeSVG } from '@/lib/skool-art'
import { EARLY_SPOTS, FOUNDER_SPOTS, LAUNCH_PRICE, isWaitlistClosed } from '@/lib/waitlist'
import { WaitlistProvider } from '@/components/skool/WaitlistState'
import WaitlistForm from '@/components/skool/WaitlistForm'
import Countdown from '@/components/skool/Countdown'
import { MastButton } from '@/components/skool/SpotsLeft'
import SkoolMotion from '@/components/skool/SkoolMotion'
import Vsl from '@/components/skool/Vsl'

export const revalidate = 60

const TITLE = "Claude to Client · Liste d'attente"
const DESCRIPTION =
  'Décroche ton premier client grâce à Claude : apprends à identifier des opportunités, créer des prestations commercialisables et trouver des clients prêts à payer pour tes compétences.'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://jules-api.com'),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/skool' },
  openGraph: { title: TITLE, description: DESCRIPTION, type: 'website', locale: 'fr_FR', url: '/skool' },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
}

async function countSignups(): Promise<number> {
  try {
    const { count, error } = await createServiceClient()
      .from('ai_lab_waitlist')
      .select('id', { count: 'exact', head: true })
    if (error) throw error
    return count ?? 0
  } catch (e) {
    console.error('Waitlist count error:', e)
    return 0
  }
}

function Emblem({ light = false }: { light?: boolean }) {
  const [stroke, top, left, right] = light
    ? ['#D6C2F5', '#FDF6FF', '#D6C2F5', '#B89BE6']
    : ['#4B1369', '#8752B8', '#4B1369', '#A57CD9']
  return (
    <svg className="emblem" width="24" height="31" viewBox="0 0 28 36" aria-hidden="true">
      <path d="M14 35V15M14 24L7.5 14.5M14 19.5l7-8.5M14 15V7" stroke={stroke} strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <circle className="e1" cx="14" cy="5.2" r="3.7" fill={top} />
      <circle className="e2" cx="6.4" cy="12.6" r="3.1" fill={left} />
      <circle className="e3" cx="22" cy="9.4" r="3.3" fill={right} />
    </svg>
  )
}

const Deco = ({ html }: { html: string }) => (
  <svg className="deco" viewBox="0 0 200 260" fill="none" strokeLinecap="round" aria-hidden="true" dangerouslySetInnerHTML={{ __html: html }} />
)

const DECO_RADAR = decoSVG(SHAPES.two, DARK, 8)
const DECO_BUILD = decoSVG(SHAPES.side, DARK, 13)
const DECO_CLIENT = decoSVG(SHAPES.one, DARK, 21)
const CLEARING = treeSVG(5, 4, { line: '#8752B8', dots: ['#8752B8', '#4B1369', '#A57CD9'], r: 7, lw: 1.1 })

const STEPS = [
  ['Discover', 'Repérer une opportunité'],
  ['Build', 'Construire ta prestation'],
  ['Target', 'Choisir ta cible et ton approche'],
  ['Launch', 'Prospecter'],
  ['Correct', 'Analyser tes blocages avec des retours'],
  ['Improve', 'Améliorer à partir de tes résultats'],
]

const GIVES = [
  `Accès à la communauté pour ${LAUNCH_PRICE} €/mois à vie`,
  'Une sélection d’opportunités de business IA',
  'Un pack de messages de prospection',
  'Un call 1-1 offert (optionnel)',
]

const YOUTUBE = 'https://www.youtube.com/channel/UCbfucDBGTg_qarA8qJpMe-A'

export default async function SkoolPage() {
  const signups = await countSignups()
  const remaining = Math.max(0, EARLY_SPOTS - signups)

  return (
    <WaitlistProvider initialRemaining={remaining} initialClosed={isWaitlistClosed()}>
      <SkoolMotion />

      <header className="hero" id="top">
        <i className="blob s" style={{ width: 520, height: 520, left: -220, top: -160 }}><b /></i>
        <div className="mast">
          <a className="brand" href="#top" aria-label="Claude to Client, revenir en haut">
            <Emblem />
            <span>Claude to Client<small>Communauté Skool</small></span>
          </a>
          <MastButton />
        </div>
        <div className="treebox" aria-hidden="true" />
      </header>

      <main id="page">
        <i className="blob" style={{ width: 560, height: 560, right: -120, top: -160 }}><b /></i>
        <i className="blob s" style={{ width: 420, height: 420, left: -140, top: 900 }}><b /></i>
        <i className="blob" style={{ width: 520, height: 520, right: -160, top: 2300 }}><b /></i>
        <i className="blob s" style={{ width: 460, height: 460, left: -180, top: 3700 }}><b /></i>

        <Countdown />

        <h1 data-d="500">
          Décroche ton premier client grâce à{' '}
          <span className="cl-word">
            <Image className="cl-card" src="/skool/claude-logo.png" alt="" width={160} height={148} priority />
            Claude
          </span>
        </h1>
        <p className="sub" data-d="650">
          Apprends à identifier des opportunités, créer des prestations commercialisables et trouver des clients
          prêts à payer pour tes compétences
        </p>

        <div className="rvb vsl-wrap" data-d="800"><Vsl /></div>

        <ul className="gives" aria-label="Ce que tu reçois en t'inscrivant">
          {GIVES.map((t) => (
            <li className="give" key={t}><b>{t}</b></li>
          ))}
        </ul>

        <div className="rvb hero-form" id="inscription" data-d="950">
          <WaitlistForm />
        </div>

        {/* 02 · DANS LE LAB */}
        <h2 id="s02">Tu es tenu par la main jusqu&apos;à tes premiers résultats</h2>
        <div className="cards dark">
          <div className="card">
            <Deco html={DECO_RADAR} />
            <h3>Opportunity Radar</h3>
            <p>
              Je trie ce qui sort et je ne garde que ce qui peut devenir une prestation : le problème réglé,
              qui paierait, quoi proposer.
            </p>
          </div>
          <div className="card">
            <Deco html={DECO_BUILD} />
            <h3>Build &amp; Learn</h3>
            <p>
              Tutos, démos, exemples d&apos;automatisations et templates.
            </p>
          </div>
          <div className="card core">
            <Deco html={DECO_CLIENT} />
            <h3>Client Acquisition</h3>
            <p>
              Choisir ta cible, construire ton offre, choisir ton canal et corriger
              tes erreurs jusqu&apos;aux rendez-vous. Pas de méthode unique : elle dépend de ta cible et de ta prestation.
            </p>
          </div>
        </div>

        <div className="rvb path-wrap">
          <p className="eyebrow">Processus</p>
          <ol className="path">
            {STEPS.map(([k, v]) => (
              <li key={k}><i aria-hidden="true" /><b>{k}</b><span>{v}</span></li>
            ))}
          </ol>
        </div>

        <div className="rvb prog">
          <p className="eyebrow">Au programme</p>
          <ul>
            <li>Des sprints de 30 jours, à suivre si tu veux</li>
            <li>Des retours sur ton travail : technique, business et commercial</li>
            <li>Un live chaque semaine</li>
            <li>Des templates et des ressources</li>
          </ul>
        </div>

      </main>

      <div className="clearing" aria-hidden="true" dangerouslySetInnerHTML={{ __html: CLEARING }} />

      <footer className="end">
        <div className="end-grid">
          <a className="end-brand" href="#top">
            <Emblem light />
            <span>Claude to Client<small>Communauté Skool</small></span>
          </a>
          <div className="end-col">
            <h4>Le lab</h4>
            <ul>
              <li><a href="#s02">Dans le lab</a></li>
            </ul>
          </div>
          <div className="end-col">
            <h4>Jules</h4>
            <ul>
              <li><a href={YOUTUBE} target="_blank" rel="noopener noreferrer">Chaîne YouTube Z-Start-Web</a></li>
              <li><Link href="/">jules-api.com</Link></li>
              <li><a href="/mentions-legales">Mentions légales</a></li>
              <li><a href="/confidentialite">Confidentialité</a></li>
            </ul>
          </div>
          <div className="end-up"><a className="btn up" href="#top">Haut de page</a></div>
        </div>
        <div className="mark" aria-hidden="true"><span>Claude to Client</span></div>
      </footer>
    </WaitlistProvider>
  )
}
