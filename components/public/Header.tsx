'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  { href: '/', label: 'Interviews' },
  { href: '/blog', label: 'Blog' },
  { href: '/a-propos', label: 'À propos' },
]

export default function Header() {
  const pathname = usePathname()

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '15px clamp(20px,5vw,56px)',
        background: 'rgba(245,245,245,.85)',
        backdropFilter: 'blur(16px) saturate(140%)',
        WebkitBackdropFilter: 'blur(16px) saturate(140%)',
        borderBottom: '1px solid #E9E9E9',
      }}
    >
      {/* Wordmark */}
      <Link
        href="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 9,
          textDecoration: 'none',
        }}
      >
        <span
          style={{
            width: 12,
            height: 12,
            borderRadius: 3,
            background: '#EAAF48',
            transform: 'rotate(45deg)',
            display: 'inline-block',
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: '-0.03em',
            color: '#1C1C1C',
          }}
          className="font-display"
        >
          Spark
        </span>
      </Link>

      {/* Nav links */}
      <nav style={{ display: 'flex', gap: 30 }}>
        {NAV_LINKS.map(({ href, label }) => {
          const active =
            href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              style={{
                fontSize: 15,
                fontWeight: 500,
                color: active ? '#1C1C1C' : '#6E6E6E',
                borderBottom: active
                  ? '2px solid #EAAF48'
                  : '2px solid transparent',
                paddingBottom: 3,
                textDecoration: 'none',
                transition: 'color 150ms ease',
              }}
            >
              {label}
            </Link>
          )
        })}
      </nav>

      {/* CTA */}
      <a
        href="https://www.youtube.com/@Z-Start-Web"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          background: '#1C1C1C',
          color: '#fff',
          fontSize: 14,
          fontWeight: 600,
          padding: '8px 18px',
          borderRadius: 10,
          textDecoration: 'none',
          letterSpacing: '-0.01em',
          boxShadow:
            '0 1px 2px rgba(0,0,0,.15), inset 0 1px 0 rgba(255,255,255,.08)',
        }}
      >
        S&apos;abonner
      </a>
    </header>
  )
}
