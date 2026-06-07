import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'
import GuestForm from '@/components/public/GuestForm'

export const metadata = {
  title: 'Devenir un invité — Spark',
  description: 'Candidatez pour participer à une interview Spark et partager votre histoire avec notre audience.',
}

export default function DevenirInvitePage() {
  return (
    <main className="min-h-screen bg-bg">
      <Header />

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24 grid md:grid-cols-[1fr_1.4fr] gap-16 md:gap-24 items-start">

        {/* Left — context */}
        <div className="md:sticky md:top-24">
          <span className="font-body text-xs font-medium tracking-[0.25em] uppercase text-accent">
            Candidature
          </span>
          <h1 className="font-display font-black text-4xl md:text-5xl text-cream mt-4 leading-tight">
            Devenir<br />un invité
          </h1>
          <p className="font-body text-base text-muted mt-6 leading-relaxed">
            Spark s'adresse aux entrepreneurs et créateurs qui construisent des projets solides. Si vous avez traversé des obstacles réels, développé des méthodes qui fonctionnent, et que vous souhaitez inspirer d'autres bâtisseurs — cette interview est pour vous.
          </p>

          <div className="mt-10 border-t border-edge pt-8 space-y-5">
            {[
              {
                title: 'Format',
                desc: 'Entretien vidéo de 45–90 min, en visio ou en présentiel (Paris)',
              },
              {
                title: 'Diffusion',
                desc: 'YouTube, podcast, newsletter et mise en avant sur le site',
              },
              {
                title: 'Délai',
                desc: 'Réponse sous 7 jours ouvrés après réception',
              },
            ].map(({ title, desc }) => (
              <div key={title} className="flex gap-4">
                <span className="text-accent font-bold shrink-0 mt-0.5">—</span>
                <div>
                  <span className="font-body text-sm font-semibold text-cream">{title} </span>
                  <span className="font-body text-sm text-muted">{desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — form */}
        <div className="pt-7">
          <GuestForm />
        </div>

      </div>

      <Footer />
    </main>
  )
}
