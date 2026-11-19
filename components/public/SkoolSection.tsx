import Image from 'next/image'
import { DARK, LIGHT, SHAPES, decoSVG } from '@/lib/skool-art'
import { Deco, SKOOL_URL, SectionTitle } from './site-ui'

// Panneau lavande : toujours un arbre à une seule branche (règle de la charte).
const DECO_PANEL = decoSVG(SHAPES.one, LIGHT, 4)
const DECO_RADAR = decoSVG(SHAPES.two, DARK, 17)
const DECO_BUILD = decoSVG(SHAPES.side, DARK, 23)
const DECO_CLIENT = decoSVG(SHAPES.one, DARK, 31)

const LAB = [
  {
    title: 'Opportunity Radar',
    text: 'Je trie ce qui sort et je ne garde que ce qui peut devenir une prestation : le problème réglé, qui paierait, quoi proposer.',
    deco: DECO_RADAR,
  },
  {
    title: 'Build & Learn',
    text: "Tutos, démos, exemples d'automatisations et templates.",
    deco: DECO_BUILD,
  },
  {
    title: 'Client Acquisition',
    text: "Choisir ta cible, construire ton offre, choisir ton canal et corriger tes erreurs jusqu'aux rendez-vous. Pas de méthode unique : elle dépend de ta cible et de ta prestation.",
    deco: DECO_CLIENT,
    core: true,
  },
]

// La communauté Claude to Client (Skool). `compact` = le panneau seul, sans les trois cartes du lab.
export default function SkoolSection({ num, compact = false }: { num: string; compact?: boolean }) {
  return (
    <>
      <SectionTitle id="communaute" num={num} eyebrow="Communauté Skool">
        Rejoins la communauté Claude to Client
      </SectionTitle>

      <div className="panel card">
        <Deco html={DECO_PANEL} />
        <span className="lgs" aria-hidden="true">
          <Image src="/skool/claude-logo.png" alt="" width={92} height={85} />
          <Image src="/skool/skool-logo.png" alt="" width={92} height={92} />
        </span>
        <h3 className="dot-title">Décroche ton premier client grâce à Claude</h3>
        <p>
          Apprends à identifier des opportunités, créer des prestations commercialisables et trouver des clients
          prêts à payer pour tes compétences.
        </p>
        <div className="acts">
          <a className="btn solid big i-go" href={SKOOL_URL} target="_blank" rel="noopener noreferrer">
            Rejoindre Claude to Client
          </a>
        </div>
      </div>

      {!compact && (
        <div className="dark">
          {LAB.map(({ title, text, deco, core }) => (
            <div className={core ? 'card core' : 'card'} key={title}>
              <Deco html={deco} />
              <h3 className="dot-title">{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
