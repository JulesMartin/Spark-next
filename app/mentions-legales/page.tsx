import type { Metadata } from 'next'
import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'

export const metadata: Metadata = {
  title: 'Mentions légales — Spark',
  robots: { index: false },
}

export default function MentionsLegalesPage() {
  return (
    <main className="min-h-screen bg-bg">
      <Header />

      <article
        style={{
          maxWidth: 720,
          marginInline: 'auto',
          paddingInline: 'clamp(20px,5vw,56px)',
          paddingTop: 'clamp(52px,7vw,100px)',
          paddingBottom: 'clamp(64px,9vw,120px)',
        }}
      >
        <h1
          className="font-display"
          style={{
            fontSize: 'clamp(32px,4vw,48px)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            lineHeight: 1.08,
            color: '#1C1C1C',
            marginBottom: 48,
          }}
        >
          Mentions légales
        </h1>

        <Section title="Éditeur du site">
          <p><strong style={{ color: '#1C1C1C' }}>Jules Martin</strong></p>
          <p>Entreprise Individuelle (EI)</p>
          <p>SIREN : 988 699 591</p>
          <p>32 Rue de la Beurelière<br />17740 Sainte-Marie-de-Ré<br />France</p>
          <p>Contact : <a href="mailto:contact@jules-api.xyz" style={{ color: '#EAAF48' }}>contact@jules-api.xyz</a></p>
        </Section>

        <Section title="Directeur de la publication">
          <p>Jules Martin</p>
        </Section>

        <Section title="Hébergement">
          <p>Ce site est hébergé par :</p>
          <ul style={{ paddingLeft: 20, marginTop: 4, listStyleType: 'disc' }}>
            <li style={{ marginBottom: 4 }}>Vercel Inc.</li>
            <li style={{ marginBottom: 4 }}>440 N Barranca Ave #4133, Covina, CA 91723, États-Unis</li>
            <li style={{ marginBottom: 4 }}>
              <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" style={{ color: '#EAAF48' }}>
                vercel.com
              </a>
            </li>
          </ul>
        </Section>

        <Section title="Propriété intellectuelle">
          <p>
            L&apos;ensemble des contenus publiés sur Spark (textes, images, vidéos) sont la propriété exclusive de Jules Martin, sauf mention contraire. Toute reproduction ou diffusion sans autorisation écrite préalable est interdite.
          </p>
        </Section>

        <Section title="Liens externes">
          <p>
            Spark peut contenir des liens vers des sites tiers. Ces sites sont indépendants et Jules Martin ne peut être tenu responsable de leur contenu.
          </p>
        </Section>
      </article>

      <Footer />
    </main>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 40 }}>
      <h2
        style={{
          fontSize: 14,
          fontWeight: 600,
          letterSpacing: '.08em',
          textTransform: 'uppercase',
          color: '#EAAF48',
          marginBottom: 14,
        }}
      >
        {title}
      </h2>
      <div
        style={{
          fontSize: 16,
          color: '#1C1C1C',
          lineHeight: 1.7,
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}
      >
        {children}
      </div>
    </section>
  )
}
