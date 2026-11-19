import type { Metadata } from 'next'
import SiteShell from '@/components/public/SiteShell'

export const metadata: Metadata = {
  title: 'Politique de confidentialité — Spark',
  robots: { index: false },
}

export default function ConfidentialitePage() {
  return (
    <SiteShell>
      <article className="doc legal">
        <h1 className="in0">
          Politique de confidentialité
        </h1>
        <p className="upd in0" style={{ marginTop: -24, marginBottom: 0 }}>
          Mise à jour : juin 2026
        </p>

        <Section title="Responsable du traitement">
          <p>
            Jules Martin — Entreprise Individuelle (EI)<br />
            SIREN : 988 699 591<br />
            32 Rue de la Beurelière, 17740 Sainte-Marie-de-Ré, France<br />
            Contact : <a href="mailto:contact@jules-api.xyz">contact@jules-api.xyz</a>
          </p>
        </Section>

        <Section title="Données collectées">
          <p>Spark collecte uniquement les données que tu fournis volontairement via les formulaires du site :</p>
          <ul>
            <li>Prénom et adresse email (formulaires de capture et lead magnet)</li>
            <li>Numéro de téléphone (formulaires de capture et lead magnet)</li>
          </ul>
          <p>
            Des données de navigation anonymisées sont également collectées via PostHog (voir section Analytics).
          </p>
        </Section>

        <Section title="Finalités et base légale">
          <p>Tes données sont utilisées pour :</p>
          <ul>
            <li>L&apos;envoi de la ressource demandée par email <em>(exécution d&apos;un contrat)</em></li>
            <li>L&apos;envoi de contenus éducatifs et d&apos;actualités Spark <em>(consentement)</em></li>
            <li>Te recontacter par téléphone ou par message au sujet des ressources demandées et des offres Spark <em>(consentement)</em></li>
          </ul>
        </Section>

        <Section title="Analytics">
          <p>
            Ce site utilise <strong>PostHog</strong> pour mesurer l&apos;audience et améliorer l&apos;expérience utilisateur. PostHog collecte des données anonymisées (pages visitées, interactions) sans cookie de tracking publicitaire. Les données sont hébergées en Europe (région EU).
          </p>
          <p>
            En savoir plus : <a href="https://posthog.com/privacy" target="_blank" rel="noopener noreferrer">posthog.com/privacy</a>
          </p>
        </Section>

        <Section title="Sous-traitants">
          <p>Les données sont transmises aux services suivants, tous conformes au RGPD :</p>
          <ul>
            <li><strong>Brevo</strong> — envoi d&apos;emails et gestion des listes (France/UE)</li>
            <li><strong>Supabase</strong> — stockage sécurisé des données</li>
            <li><strong>Resend</strong> — notifications internes</li>
            <li><strong>Vercel</strong> — hébergement du site</li>
            <li><strong>PostHog</strong> — analytics anonymisées (hébergement EU)</li>
          </ul>
        </Section>

        <Section title="Durée de conservation">
          <p>
            Les données sont conservées tant que tu es abonné à la newsletter.
          </p>
          <p>
            Tu peux demander la suppression de tes données à tout moment.
          </p>
        </Section>

        <Section title="Tes droits">
          <p>
            Conformément au RGPD, tu disposes d&apos;un droit d&apos;accès, de rectification, de suppression, de limitation et de portabilité de tes données.
          </p>
          <p>
            Pour exercer ces droits, écris à{' '}
            <a href="mailto:contact@jules-api.xyz">
              contact@jules-api.xyz
            </a>. Nous répondrons dans un délai de 30 jours.
          </p>
          <p>
            Chaque email envoyé contient un lien de désinscription. Tu peux également te désabonner à tout moment en nous contactant directement.
          </p>
          <p>
            En cas de litige non résolu, tu as le droit de saisir la <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">CNIL</a>.
          </p>
        </Section>
      </article>
    </SiteShell>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2>{title}</h2>
      <div className="body">{children}</div>
    </section>
  )
}
