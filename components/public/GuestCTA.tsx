import Link from 'next/link'

export default function GuestCTA() {
  return (
    <section className="border-t border-edge">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
        {/* Left — text */}
        <div>
          <span className="font-body text-xs font-medium tracking-[0.25em] uppercase text-accent">
            Passer à l&apos;antenne
          </span>
          <h2 className="font-display font-black text-4xl md:text-5xl text-cream mt-4 leading-tight">
            Vous intégrez l&apos;IA<br />dans votre activité ?
          </h2>
          <p className="font-body text-base text-muted mt-6 leading-relaxed max-w-md">
            Je cherche des entrepreneurs, indépendants et dirigeants de TPE qui utilisent concrètement l&apos;IA dans leur travail. Si vous avez une expérience à partager, je veux vous interviewer.
          </p>
        </div>

        {/* Right — CTA block */}
        <div className="border border-edge p-8 md:p-10 flex flex-col gap-6">
          <ul className="space-y-3">
            {[
              'Un entretien vidéo en format long',
              'Diffusé sur YouTube, TikTok et Instagram',
              'Mise en avant sur le site pendant 1 mois',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="text-accent font-bold mt-0.5 shrink-0">—</span>
                <span className="font-body text-sm text-muted">{item}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/devenir-invite"
            className="inline-flex items-center justify-center gap-3 bg-accent text-bg font-body font-semibold text-sm tracking-wide px-8 py-4 hover:bg-accent/90 transition-colors duration-200 w-full md:w-auto"
          >
            Candidater comme invité
            <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 shrink-0">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
