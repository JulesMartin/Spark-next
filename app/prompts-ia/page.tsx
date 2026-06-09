import type { Metadata } from 'next'
import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'
import SubscribeForm from '@/components/public/SubscribeForm'

export const metadata: Metadata = {
  title: '233 Prompts IA + 10 Skills Claude — Spark',
  description: 'Reçois gratuitement 233 prompts IA et 10 skills Claude pour aller 10x plus vite dans ton business.',
}

const ITEMS = [
  {
    label: '233 prompts IA',
    desc: 'Classés par cas d\'usage — rédaction, stratégie, analyse, SEO, code. Utilisables sur ChatGPT, Claude, Gemini.',
  },
  {
    label: '10 skills Claude',
    desc: 'Des workflows prêts à l\'emploi dans Claude pour automatiser les tâches répétitives de ton business.',
  },
]

export default function PromptsIAPage() {
  return (
    <main className="min-h-screen bg-bg">
      <Header />

      <section className="max-w-7xl mx-auto px-6 md:px-12 pt-20 pb-32 md:pt-28 md:pb-40">

        <div className="grid md:grid-cols-[1fr_1fr] gap-16 md:gap-24 items-start">

          {/* Left — offer */}
          <div>
            <span className="font-body text-xs font-medium tracking-[0.25em] uppercase text-accent">
              Ressource gratuite
            </span>

            <h1 className="font-display font-black text-5xl md:text-6xl lg:text-7xl text-ink-900 mt-5">
              <span className="block pb-[2px]">Reçois</span>
              <span className="block text-accent pb-[2px]">233 prompts</span>
              <span className="block pb-[2px]">IA &amp; 10 skills</span>
              <span className="block">Claude</span>
            </h1>

            {/* What's inside */}
            <div className="mt-8 space-y-6">
              {ITEMS.map(({ label, desc }) => (
                <div key={label} className="flex gap-4">
                  <span className="text-accent font-bold shrink-0 mt-0.5">—</span>
                  <div>
                    <span className="font-body text-sm font-semibold text-ink-900">{label} </span>
                    <span className="font-body text-sm text-muted">{desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div className="md:sticky md:top-28 md:pt-2">
            <div className="bg-surface border border-edge p-8 md:p-10">
              <p className="font-body text-xs font-medium tracking-[0.2em] uppercase text-muted mb-6">
                Accès immédiat · Gratuit
              </p>

              <h2 className="font-display font-bold text-2xl md:text-3xl text-ink-900 leading-tight mb-8">
                Entre ton email pour recevoir les ressources
              </h2>

              <SubscribeForm />
            </div>

            <p className="mt-4 font-body text-xs text-ink-500 text-center">
              Déjà +120 personnes ont téléchargé
            </p>
          </div>

        </div>

      </section>

      <Footer />
    </main>
  )
}
