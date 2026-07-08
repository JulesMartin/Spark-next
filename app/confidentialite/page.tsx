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
            marginBottom: 8,
          }}
        >
          Politique de confidentialité
        </h1>
        <p style={{ color: '#888', fontSize: 14, marginBottom: 48 }}>
          Mise à jour : juin 2026
        </p>

        <Section title="Responsable du traitement">
          <p>
            Jules Martin — Entreprise Individuelle (EI)<br />
            SIREN : 988 699 591<br />
            32 Rue de la Beurelière, 17740 Sainte-Marie-de-Ré, France<br />
            Contact : <a href="mailto:contact@jules-api.xyz" style={{ color: '#EAAF48' }}>contact@jules-api.xyz</a>
          </p>
        </Section>

        <Section title="Données collectées">
          <p>Spark collecte uniquement les données que vous fournissez volontairement via les formulaires du site :</p>
          <ul style={{ paddingLeft: 20, marginTop: 8, marginBottom: 0, listStyleType: 'disc' }}>
            <li style={{ marginBottom: 4 }}>Adresse email (formulaires de capture et lead magnet)</li>
            <li style={{ marginBottom: 4 }}>Numéro de téléphone (formulaires de capture et lead magnet)</li>
            <li style={{ marginBottom: 4 }}>Nom, type d&apos;activité, chiffre d&apos;affaires et motivation (formulaire candidature invité)</li>
          </ul>
          <p style={{ marginTop: 12 }}>
            Des données de navigation anonymisées sont également collectées via PostHog (voir section Analytics).
          </p>
        </Section>

        <Section title="Finalités et base légale">
          <p>Vos données sont utilisées pour :</p>
          <ul style={{ paddingLeft: 20, marginTop: 8, marginBottom: 0, listStyleType: 'disc' }}>
            <li style={{ marginBottom: 4 }}>L&apos;envoi de la ressource demandée par email <em style={{ color: '#888' }}>(exécution d&apos;un contrat)</em></li>
            <li style={{ marginBottom: 4 }}>L&apos;envoi de contenus éducatifs et d&apos;actualités Spark <em style={{ color: '#888' }}>(consentement)</em></li>
            <li style={{ marginBottom: 4 }}>Vous recontacter par téléphone lorsque vous en faites la demande via un formulaire <em style={{ color: '#888' }}>(consentement)</em></li>
            <li style={{ marginBottom: 4 }}>Le traitement des candidatures pour devenir invité sur la chaîne <em style={{ color: '#888' }}>(intérêt légitime)</em></li>
          </ul>
        </Section>

        <Section title="Analytics">
          <p>
            Ce site utilise <strong style={{ color: '#1C1C1C' }}>PostHog</strong> pour mesurer l&apos;audience et améliorer l&apos;expérience utilisateur. PostHog collecte des données anonymisées (pages visitées, interactions) sans cookie de tracking publicitaire. Les données sont hébergées en Europe (région EU).
          </p>
          <p>
            En savoir plus : <a href="https://posthog.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#EAAF48' }}>posthog.com/privacy</a>
          </p>
        </Section>

        <Section title="Sous-traitants">
          <p>Les données sont transmises aux services suivants, tous conformes au RGPD :</p>
          <ul style={{ paddingLeft: 20, marginTop: 8, marginBottom: 0, listStyleType: 'disc' }}>
            <li style={{ marginBottom: 4 }}><strong style={{ color: '#1C1C1C' }}>Brevo</strong> — envoi d&apos;emails et gestion des listes (France/UE)</li>
            <li style={{ marginBottom: 4 }}><strong style={{ color: '#1C1C1C' }}>Supabase</strong> — stockage sécurisé des données</li>
            <li style={{ marginBottom: 4 }}><strong style={{ color: '#1C1C1C' }}>Resend</strong> — notifications internes (candidatures uniquement)</li>
            <li style={{ marginBottom: 4 }}><strong style={{ color: '#1C1C1C' }}>Vercel</strong> — hébergement du site</li>
            <li style={{ marginBottom: 4 }}><strong style={{ color: '#1C1C1C' }}>PostHog</strong> — analytics anonymisées (hébergement EU)</li>
          </ul>
        </Section>

        <Section title="Durée de conservation">
          <p>
            Les données sont conservées tant que vous êtes abonné à la newsletter ou que votre candidature est en cours d&apos;examen. Les candidatures non retenues sont supprimées dans un délai de 12 mois.
          </p>
          <p>
            Vous pouvez demander la suppression de vos données à tout moment.
          </p>
        </Section>

        <Section title="Vos droits">
          <p>
            Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification, de suppression, de limitation et de portabilité de vos données.
          </p>
          <p>
            Pour exercer ces droits, écrivez à{' '}
            <a href="mailto:contact@jules-api.xyz" style={{ color: '#EAAF48' }}>
              contact@jules-api.xyz
            </a>. Nous répondrons dans un délai de 30 jours.
          </p>
          <p>
            Chaque email envoyé contient un lien de désinscription. Vous pouvez également vous désabonner à tout moment en nous contactant directement.
          </p>
          <p>
            En cas de litige non résolu, vous avez le droit de saisir la <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" style={{ color: '#EAAF48' }}>CNIL</a>.
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
