'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Emblem } from './site-ui'

const NAV_LINKS = [
  { href: '/', label: 'Accueil' },
  { href: '/services', label: 'Mes services' },
  { href: '/blog', label: 'Blog' },
  { href: '/a-propos', label: 'À propos' },
]

// En-tête de la charte hub : marque à gauche, liens en pastilles à droite.
// Sans `nav`, une simple barre « marque + bouton retour » (pages formulaires).
export default function Header({ nav = true, back }: { nav?: boolean; back?: { href: string; label: string } }) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)

  // Fond flouté dès qu'on quitte le haut de page ; la barre se range quand on descend, revient quand on remonte.
  useEffect(() => {
    let last = scrollY
    const on = () => {
      const y = scrollY, dy = y - last
      setScrolled(y > 8)
      if (y < 140) setHidden(false)
      else if (dy > 6) setHidden(true)
      else if (dy < -6) setHidden(false)
      if (Math.abs(dy) > 6 || y < 140) last = y
    }
    on()
    addEventListener('scroll', on, { passive: true })
    return () => removeEventListener('scroll', on)
  }, [])

  return (
    <header className={`mast${scrolled ? ' scrolled' : ''}${hidden ? ' hide' : ''}`}>
      <div className="mast-in">
        <Link className="brand" href="/" aria-label="Spark, accueil">
          <Emblem />
          <span>Spark<small>Jules Martin</small></span>
        </Link>

        {nav && (
          <nav className="nav" aria-label="Navigation principale">
            {NAV_LINKS.map(({ href, label }) => {
              const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
              return (
                <Link key={href} href={href} aria-current={active ? 'page' : undefined}>
                  <i aria-hidden="true" />
                  {label}
                </Link>
              )
            })}
          </nav>
        )}

        {back && (
          <Link className="btn i-back" href={back.href}>{back.label}</Link>
        )}
      </div>
    </header>
  )
}
