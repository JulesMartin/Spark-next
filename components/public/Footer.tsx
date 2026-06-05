import Link from 'next/link'

const socials = [
  {
    href: 'https://youtube.com/@spark',
    label: 'YouTube',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 shrink-0">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
        <polygon fill="currentColor" stroke="none" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
      </svg>
    ),
  },
  {
    href: 'https://instagram.com/spark',
    label: 'Instagram',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 shrink-0">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    href: 'https://x.com/spark',
    label: 'X',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    href: 'https://linkedin.com/company/spark',
    label: 'LinkedIn',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 shrink-0">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
        <rect x="2" y="9" width="4" height="12"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>
    ),
  },
]

export default function Footer() {
  return (
    <footer className="bg-bg border-t border-accent mt-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 pl-[200px]">

        {/* Brand — full width top */}
        <div className="mb-14 text-center">
          <Link href="/" className="font-display font-black text-3xl text-text-primary tracking-tight leading-none">
            Spark
          </Link>
          <p className="mt-3 font-body text-sm text-text-secondary leading-relaxed mx-auto max-w-sm">
            Des conversations profondes avec des esprits qui façonnent le monde de demain.
          </p>
        </div>

        {/* 3 columns */}
        <div className="flex flex-row gap-12 pb-16">

          {/* Col 1 — Navigation */}
          <div className="flex-1 text-right">
            <h4 className="font-display font-bold text-base text-accent mb-6">
              Navigation
            </h4>
            <ul className="space-y-2">
              {[
                { href: '/',         label: 'Interviews' },
                { href: '/blog',           label: 'Blog' },
                { href: '/devenir-invite', label: 'Devenir invité' },
                { href: '/a-propos',       label: 'À propos' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="font-body text-sm text-text-secondary hover:text-accent transition-colors inline-block">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

{/* Col 3 — Réseaux */}
          <div className="flex-1">
            <h4 className="font-display font-bold text-base text-accent mb-6">
              Réseaux sociaux
            </h4>
            <ul className="space-y-4">
              {socials.map(({ href, label, icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 text-text-primary hover:text-accent transition-colors group"
                  >
                    {icon}
                    <span className="font-body text-sm text-text-secondary group-hover:text-accent transition-colors">
                      {label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-10 pb-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-text-secondary">
            © {new Date().getFullYear()} Spark. Tous droits réservés.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/mentions-legales" className="font-body text-xs text-text-secondary hover:text-accent transition-colors inline-block">
              Mentions légales
            </Link>
            <Link href="/confidentialite" className="font-body text-xs text-text-secondary hover:text-accent transition-colors inline-block">
              Confidentialité
            </Link>
          </div>
        </div>

      </div>
    </footer>
  )
}
