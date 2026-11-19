import { DARK, LIGHT, SHAPES, decoSVG } from '@/lib/skool-art'
import { CALENDLY_URL, Deco } from './site-ui'

const COACHING_FEATURES = [
  'Sessions en visio, individuelles ou en équipe, à ton rythme',
  'Programme 100% adapté à ton niveau et tes objectifs',
  'Claude, automatisations N8N, agents IA, workflows, autres outils selon tes besoins',
  'Création de workflows que les entreprises adorent',
  "Accès à mes prompts et templates prêts à l'emploi",
]

const SETUP_FEATURES = [
  'Audit de tes processus et identification des tâches répétitives',
  'Mise en place de workflows (Claude, N8N, Make…)',
  'Connexion de tes outils : email, agenda, facturation, CRM…',
  'Respect des normes de sécurité, RGPD et données clients',
]

const SETUP_EXTRA = [
  'Suivi, itérations et optimisation dans la durée',
  "Création de site web / modification du site existant si nécessaire afin d'intégrer les automatisations",
  'Création de dashboard pour un meilleur suivi des métriques de ton business',
]

const SITE_FEATURES = [
  'Site vitrine, landing page ou MVP fonctionnel, conçu de A à Z',
  'Design moderne, responsive et optimisé pour le SEO et la vitesse',
  'Mise en ligne complète : nom de domaine, hébergement, déploiement',
]

const SITE_EXTRA = [
  'Automatisations intégrées directement dans ton site',
  'Connexion à tes outils : paiement, prise de rendez-vous, CRM…',
  'Évolutions et maintenance après le lancement',
]

const OFFERS: {
  title: string; subtitle: string; features: string[]; extra?: string[]; audience: string; deco: string; dark?: boolean
}[] = [
  {
    title: "Mise en place d'automatisation",
    subtitle: 'Je construis tes automatisations à ta place',
    features: SETUP_FEATURES,
    extra: SETUP_EXTRA,
    audience: 'Pour les indépendants comme pour les entreprises.',
    deco: decoSVG(SHAPES.one, LIGHT, 41),
  },
  {
    title: 'Coaching automatisation',
    subtitle: 'Apprends à automatiser, seul ou avec ton équipe',
    features: COACHING_FEATURES,
    audience: 'Disponible en individuel ou pour ton équipe.',
    deco: decoSVG(SHAPES.two, DARK, 43),
    dark: true,
  },
  {
    title: 'Création de site web / MVP',
    subtitle: 'Je conçois ton site ou ton produit de A à Z',
    features: SITE_FEATURES,
    extra: SITE_EXTRA,
    audience: "Pour lancer une présence en ligne ou valider une idée de produit.",
    deco: decoSVG(SHAPES.side, LIGHT, 47),
  },
]

function Ticks({ items }: { items: string[] }) {
  return <ul className="ticks">{items.map((f) => <li key={f}>{f}</li>)}</ul>
}

export default function ServicesOffers() {
  return (
    <div className="offers">
      {OFFERS.map((o) => (
        <div className={`offer card ${o.dark ? 'deepc' : 'lavc'}`} key={o.title}>
          <Deco html={o.deco} />
          <h2 className="dot-title">{o.title}</h2>
          <h3>{o.subtitle}</h3>
          <Ticks items={o.features} />
          {o.extra && (
            <>
              <p className="extra-lb">Services supplémentaires :</p>
              <div className="extra"><Ticks items={o.extra} /></div>
            </>
          )}
          <p className="aud">{o.audience}</p>
          <div className="acts">
            <a className="btn big i-cal" href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">Réserver un appel</a>
          </div>
        </div>
      ))}
    </div>
  )
}
