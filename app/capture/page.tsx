import type { Metadata } from 'next'
import CaptureForm from '@/components/capture/CaptureForm'

export const metadata: Metadata = {
  title: 'Ressource gratuite — Spark',
  description: 'Reçois ta ressource gratuite directement dans ta boîte mail.',
  robots: { index: false },
}

export default async function CapturePage({
  searchParams,
}: {
  searchParams: Promise<{ c?: string }>
}) {
  const params = await searchParams
  const campaign = params.c ?? 'default'

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FCFCD0' }}>
      {/* Nav */}
      <nav className="px-6 py-4 border-b-2 border-black flex items-center justify-between">
        <a
          href="/"
          className="text-sm font-black uppercase tracking-[0.2em] text-black"
          style={{ fontFamily: 'var(--font-raleway)' }}
        >
          SPARK
        </a>
        <a
          href="/"
          className="text-xs text-black/50 hover:text-black transition-colors"
          style={{ fontFamily: 'var(--font-assistant)' }}
        >
          ← Retour au site
        </a>
      </nav>

      {/* Main */}
      <main className="flex-1 flex items-start justify-center px-4 py-16 min-h-0">
        <div className="w-full max-w-md">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-6">
            <span
              className="text-xs font-black uppercase tracking-[0.2em] text-black px-3 py-1 border-2 border-black"
              style={{ background: '#FEE04F', fontFamily: 'var(--font-raleway)' }}
            >
              ✦ Ressource gratuite
            </span>
          </div>

          {/* Headline */}
          <h1
            className="text-4xl sm:text-5xl font-black uppercase leading-[1.05] tracking-tight text-black mb-4"
            style={{ fontFamily: 'var(--font-raleway)' }}
          >
            Reçois ta ressource dans ta boîte.
          </h1>

          <p
            className="text-base text-black/60 mb-8"
            style={{ fontFamily: 'var(--font-assistant)' }}
          >
            En 30 secondes. Directement dans ta boîte mail.
          </p>

          {/* Form card */}
          <div
            className="bg-white border-2 border-black p-6"
            style={{ boxShadow: '6px 6px 0 #1A1A1A' }}
          >
            <CaptureForm campaign={campaign} />
          </div>
        </div>
      </main>
    </div>
  )
}
