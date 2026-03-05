'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-bg/95 backdrop-blur-md border-b border-accent/30'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-16">
        <Link
          href="/"
          className="font-display text-2xl font-black text-cream tracking-tight hover:text-accent transition-colors"
        >
          Spark
        </Link>

        <nav className="flex items-center gap-8">
          <Link
            href="/"
            className="font-body text-xs font-medium tracking-[0.15em] uppercase text-muted hover:text-cream transition-colors"
          >
            Interviews
          </Link>
          <Link
            href="/blog"
            className="font-body text-xs font-medium tracking-[0.15em] uppercase text-muted hover:text-cream transition-colors"
          >
            Blog
          </Link>
          <Link
            href="/a-propos"
            className="font-body text-xs font-medium tracking-[0.15em] uppercase text-muted hover:text-cream transition-colors"
          >
            À propos
          </Link>
        </nav>
      </div>
    </header>
  )
}
