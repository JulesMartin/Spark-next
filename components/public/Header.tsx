'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Header() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // progress 0 = top, 1 = fully collapsed (after 80px of scroll)
  const progress = Math.min(scrollY / 80, 1)

  const headerHeight = Math.round(88 - 24 * progress)   // 88px → 64px
  const logoSize    = 2.25 - 0.75 * progress            // 2.25rem → 1.5rem
  const navFontSize = 1 - 0.25 * progress               // 1rem → 0.75rem
  const navGap      = 4 - 1.5 * progress                // 4rem → 2.5rem

  // nav color: grey (#888) → cream (#F0EDE8)
  const navR = Math.round(136 + 104 * progress)
  const navG = Math.round(136 + 101 * progress)
  const navB = Math.round(136 +  96 * progress)
  const navColor = `rgb(${navR}, ${navG}, ${navB})`


  return (
    <header
      style={{ height: `${headerHeight}px` }}
      className="sticky top-0 z-50 overflow-hidden"
    >
      {/* Dark layer: fades out as you scroll */}
      <div
        className="absolute inset-0 bg-bg pointer-events-none"
        style={{ opacity: 1 - progress }}
      />
      {/* Blur layer: fades in as you scroll */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backdropFilter: `blur(${progress * 24}px)` }}
      />
      <div
        className="relative max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between"
        style={{ height: `${headerHeight}px` }}
      >
        <Link
          href="/"
          className="font-display font-black tracking-tight text-cream"
          style={{ fontSize: `${logoSize}rem`, lineHeight: 1.1 }}
        >
          Spark
        </Link>

        <nav className="flex items-center" style={{ gap: `${navGap}rem` }}>
          {[
            { href: '/',         label: 'Interviews' },
            { href: '/blog',     label: 'Blog' },
            { href: '/a-propos', label: 'À propos' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="font-body font-medium tracking-[0.15em] uppercase hover:opacity-100 transition-opacity"
              style={{ fontSize: `${navFontSize}rem`, color: navColor }}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
