import type { ReactNode } from 'react'

// Petits éléments de la charte « hub » partagés par les pages publiques (server components).

export const SKOOL_URL = 'https://www.skool.com/claude-to-client-7826/about'
export const CALENDLY_URL = 'https://calendly.com/jules-api/new-meeting'
export const YOUTUBE_URL = 'https://www.youtube.com/@Z-Start-Web'

export function Emblem({ light = false, size = 24 }: { light?: boolean; size?: number }) {
  const [stroke, top, left, right] = light
    ? ['#D6C2F5', '#FDF6FF', '#D6C2F5', '#B89BE6']
    : ['#4B1369', '#8752B8', '#4B1369', '#A57CD9']
  return (
    <svg className="emblem" width={size} height={Math.round(size * 1.29)} viewBox="0 0 28 36" aria-hidden="true">
      <path d="M14 35V15M14 24L7.5 14.5M14 19.5l7-8.5M14 15V7" stroke={stroke} strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <circle className="e1" cx="14" cy="5.2" r="3.7" fill={top} />
      <circle className="e2" cx="6.4" cy="12.6" r="3.1" fill={left} />
      <circle className="e3" cx="22" cy="9.4" r="3.3" fill={right} />
    </svg>
  )
}

// Arbre dessiné d'une carte (généré par decoSVG) : il plie et ses graines s'envolent au survol de la carte.
export function Deco({ html }: { html: string }) {
  return (
    <svg className="deco" viewBox="0 0 200 260" fill="none" strokeLinecap="round" aria-hidden="true" dangerouslySetInnerHTML={{ __html: html }} />
  )
}

// Ouverture de section : filet noir, petit sur-titre, titre, grand numéro violet à droite.
export function SectionTitle({ id, num, eyebrow, children, action }: {
  id?: string
  num: string
  eyebrow?: string
  children: ReactNode
  action?: ReactNode
}) {
  return (
    <header className="sh rvb" id={id}>
      <span className="num" aria-hidden="true">{num}</span>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2>{children}</h2>
      {action && <div className="acts">{action}</div>}
    </header>
  )
}

export function PlayDisc() {
  return (
    <span className="play" aria-hidden="true">
      <svg viewBox="0 0 24 24"><path d="M5 3.5v17L20.5 12z" fill="currentColor" /></svg>
    </span>
  )
}

export function formatDate(iso?: string, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('fr-FR', opts)
}
