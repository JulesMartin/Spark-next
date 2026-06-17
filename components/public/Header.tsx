'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  { href: '/', label: 'Vidéos' },
  { href: '/services', label: 'Mes services' },
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
        background: 'rgba(245,245,245,.85)',
        backdropFilter: 'blur(16px) saturate(140%)',
        WebkitBackdropFilter: 'blur(16px) saturate(140%)',
        borderBottom: '1px solid #E9E9E9',
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          marginInline: 'auto',
          paddingInline: 'clamp(20px,5vw,56px)',
          paddingBlock: 'clamp(9px,1.5vw,15px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 32,
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
            flexShrink: 0,
          }}
        >
          <span
            className="w-[8px] h-[8px] sm:w-[10px] sm:h-[10px]"
            style={{
              borderRadius: 2,
              background: '#EAAF48',
              transform: 'rotate(45deg)',
              display: 'inline-block',
              flexShrink: 0,
            }}
          />
          <span
            className="font-display"
            style={{
              fontSize: 'clamp(13px, 2.5vw, 17px)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: '#1C1C1C',
            }}
          >
            Spark
          </span>
        </Link>

        {/* Nav links */}
        <nav style={{ display: 'flex', gap: 'clamp(10px, 2.5vw, 30px)', minWidth: 0, flex: 1, justifyContent: 'flex-end', overflow: 'hidden' }}>
          {NAV_LINKS.map(({ href, label }) => {
            const active =
              href === '/' ? pathname === '/' : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                style={{
                  fontSize: 'clamp(11px, 2vw, 15px)',
                  fontWeight: 500,
                  color: active ? '#1C1C1C' : '#6E6E6E',
                  borderBottom: active
                    ? '2px solid #EAAF48'
                    : '2px solid transparent',
                  paddingBottom: 3,
                  textDecoration: 'none',
                  transition: 'color 150ms ease',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  minWidth: 0,
                  flexShrink: 1,
                }}
              >
                {label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
