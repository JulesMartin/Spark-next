const SOCIALS = [
  {
    label: 'jules_api',
    href: 'https://www.instagram.com/Z-Start-Web',
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <circle cx="12" cy="12" r="4.5"/>
        <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    label: 'jules_api',
    href: 'https://www.tiktok.com/@Z-Start-Web',
    icon: (
      <svg width="42" height="48" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.73z"/>
      </svg>
    ),
  },
  {
    label: 'jules_api',
    href: 'https://www.youtube.com/@Z-Start-Web',
    icon: (
      <svg width="56" height="40" viewBox="0 0 24 17" fill="currentColor">
        <path d="M23.5 2.6s-.3-2-1.2-2.7C21.1-.9 19.7-.9 19-1c-3.4-.3-8.5-.3-8.5-.3s-5.1 0-8.5.2C1.3-.9-.1-.9-1-.2-1.9.5-2.2 2.6-2.2 2.6S-2.5 5-2.5 7.4v2.2c0 2.4.3 4.8.3 4.8s.3 2 1.2 2.7c1.2.8 2.7.8 3.4.8 2.4.2 10.6.3 10.6.3s5.1 0 8.5-.3c.7-.1 2.1-.1 3-1 .9-.7 1.2-2.7 1.2-2.7s.3-2.4.3-4.8V7.4c0-2.4-.3-4.8-.3-4.8zM9.7 11.5V5.2l6.6 3.2-6.6 3.1z"/>
      </svg>
    ),
  },
]

export default function SocialLinks() {
  return (
    <section
      style={{
        maxWidth: 1200,
        marginInline: 'auto',
        paddingInline: 'clamp(20px,5vw,56px)',
        paddingBottom: 'clamp(48px,6vw,80px)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 'clamp(40px,8vw,100px)',
          alignItems: 'center',
          flexWrap: 'wrap' as const,
          padding: 'clamp(36px,5vw,60px)',
          background: '#F7F7F5',
          borderRadius: 24,
        }}
      >
        {SOCIALS.map(({ label, href, icon }) => (
          <a
            key={href}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              flexDirection: 'column' as const,
              alignItems: 'center',
              gap: 12,
              color: '#1C1C1C',
              textDecoration: 'none',
              transition: 'opacity 150ms',
            }}
            className="social-link"
          >
            {icon}
            <span
              style={{
                fontSize: 15,
                fontWeight: 600,
                letterSpacing: '.03em',
                color: '#6E6E6E',
              }}
            >
              {label}
            </span>
          </a>
        ))}
      </div>

      <style>{`
        .social-link:hover { opacity: 0.55; }
      `}</style>
    </section>
  )
}
