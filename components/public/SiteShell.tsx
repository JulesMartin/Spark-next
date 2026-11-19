import type { ReactNode } from 'react'
import { albertSans, montserrat } from '@/app/fonts'
import { treeSVG } from '@/lib/skool-art'
import Header from './Header'
import Footer from './Footer'
import SiteMotion from './SiteMotion'

type Blob = { w: number; left?: number; right?: number; top: number; s?: boolean }

const BLOBS: Blob[] = [
  { w: 540, left: -230, top: -170, s: true },
  { w: 580, right: -150, top: -60 },
  { w: 440, left: -160, top: 1150, s: true },
  { w: 520, right: -180, top: 2350 },
  { w: 470, left: -190, top: 3700, s: true },
  { w: 500, right: -170, top: 5000 },
]

// Arbre de la « clairière », dessiné juste avant le pied de page.
const CLEARING = treeSVG(9, 4, { line: '#8752B8', dots: ['#8752B8', '#4B1369', '#A57CD9'], r: 7, lw: 1.1 })

// Coquille commune des pages publiques : polices et couleurs de la charte, blobs, en-tête, pied de page,
// animations. `tree` = arbre de points (dans .treebox de .hero-tree ; 'soft' = en transparence derrière le texte) ; `nav={false}` + `back` = barre simple des pages formulaires.
export default function SiteShell({ children, tree = false, nav = true, back, clearing = true }: {
  children: ReactNode
  tree?: boolean | 'soft'
  nav?: boolean
  back?: { href: string; label: string }
  clearing?: boolean
}) {
  return (
    <div className={`site ${montserrat.variable} ${albertSans.variable}`} id="top">
      {BLOBS.map(({ w, s, ...pos }, i) => (
        <i key={i} className={s ? 'blob s' : 'blob'} style={{ width: w, height: w, ...pos }} aria-hidden="true"><b /></i>
      ))}
      <SiteMotion tree={tree} />
      <Header nav={nav} back={back} />
      <main id="page">{children}</main>
      {clearing && <div className="clearing" aria-hidden="true" dangerouslySetInnerHTML={{ __html: CLEARING }} />}
      <Footer />
    </div>
  )
}
