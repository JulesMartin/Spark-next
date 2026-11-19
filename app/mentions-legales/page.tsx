import type { Metadata } from 'next'
import SiteShell from '@/components/public/SiteShell'

export const metadata: Metadata = {
  title: 'Mentions légales — Spark',
  robots: { index: false },
}

export default function MentionsLegalesPage() {
  return (
    <SiteShell>
      <article className="doc legal">
        <h1 className="in0">
          Mentions légales
        </h1>

        <Section title="Éditeur du site">
          <p><strong>Jules Martin</strong></p>
          <p>Entreprise Individuelle (EI)</p>
          <p>SIREN : 988 699 591</p>
          <p>32 Rue de la Beurelière<br />17740 Sainte-Marie-de-Ré<br />France</p>
          <p>Contact : <a href="mailto:contact@jules-api.xyz">contact@jules-api.xyz</a></p>
        </Section>

        <Section title="Directeur de la publication">
          <p>Jules Martin</p>
        </Section>

        <Section title="Hébergement">
          <p>Ce site est hébergé par :</p>
          <ul>
            <li>Vercel Inc.</li>
            <li>440 N Barranca Ave #4133, Covina, CA 91723, États-Unis</li>
            <li>
              <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">
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
