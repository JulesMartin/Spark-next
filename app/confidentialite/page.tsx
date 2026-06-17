import type { Metadata } from 'next'
import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'

export const metadata: Metadata = {
  title: 'Politique de confidentialité — Spark',
  robots: { index: false },
}

export default function ConfidentialitePage() {
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
          color: '#1C1C1C',
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
          Politique de confidentialité
        </h1>

        <Section title="Données collectées">
          <p>
            Spark collecte uniquement les données que vous fournissez volontairement via les formulaires du site :
          </p>
          <ul style={{ paddingLeft: 20, marginTop: 8, marginBottom: 0, listStyleType: 'disc' }}>
            <li style={{ marginBottom: 4 }}>Adresse email</li>
            <li style={{ marginBottom: 4 }}>Pseudo sur les réseaux sociaux (optionnel)</li>
            <li style={{ marginBottom: 4 }}>Informations de candidature (nom, type d&apos;activité, chiffres d&apos;affaires, motivation)</li>
          </ul>
          <p>Aucun cookie de tracking ou de publicité n&apos;est utilisé.</p>
        </Section>

        <Section title="Finalités">
          <p>Vos données sont utilisées pour :</p>
          <ul style={{ paddingLeft: 20, marginTop: 8, marginBottom: 0, listStyleType: 'disc' }}>
            <li style={{ marginBottom: 4 }}>L&apos;envoi de la ressource demandée par email</li>
            <li style={{ marginBottom: 4 }}>L&apos;envoi de contenus éducatifs et d&apos;actualités Spark (newsletter)</li>
            <li style={{ marginBottom: 4 }}>Le traitement des candidatures pour devenir invité sur la chaîne</li>
          </ul>
        </Section>

        <Section title="Sous-traitants">
          <p>Les données sont traitées par les services suivants :</p>
          <ul style={{ paddingLeft: 20, marginTop: 8, marginBottom: 0, listStyleType: 'disc' }}>
            <li style={{ marginBottom: 4 }}><strong style={{ color: '#1C1C1C' }}>Brevo</strong> — envoi d&apos;emails et gestion des listes</li>
            <li style={{ marginBottom: 4 }}><strong style={{ color: '#1C1C1C' }}>Supabase</strong> — stockage sécurisé des données</li>
            <li style={{ marginBottom: 4 }}><strong style={{ color: '#1C1C1C' }}>Resend</strong> — notifications internes (candidatures)</li>
          </ul>
          <p>Ces sous-traitants sont conformes au RGPD.</p>
        </Section>

        <Section title="Durée de conservation">
          <p>
            Les données sont conservées tant que vous êtes abonné. Vous pouvez demander leur suppression à tout moment.
          </p>
        </Section>

        <Section title="Vos droits">
          <p>
            Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression de vos données. Pour exercer ces droits, écrivez à{' '}
            <a href="mailto:contact@jules-api.xyz" style={{ color: '#EAAF48' }}>
              contact@jules-api.xyz
            </a>.
          </p>
          <p>
            Chaque email envoyé contient un lien de désinscription. Vous pouvez également vous désinscrire à tout moment en nous contactant directement.
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
