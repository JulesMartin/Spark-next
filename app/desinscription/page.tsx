import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
import UnsubscribeForm from '@/components/desinscription/UnsubscribeForm'
import SiteShell from '@/components/public/SiteShell'
import { verifyUnsubscribeToken } from '@/lib/unsubscribe-token'

export const metadata: Metadata = {
  title: 'Se désinscrire — Spark',
  description: 'Gère tes préférences de réception des emails Spark.',
  robots: { index: false },
}

export default async function DesinscriptionPage({
  searchParams,
}: {
  searchParams: Promise<{ t?: string }>
}) {
  const params = await searchParams
  const token = params.t ?? ''
  const email = verifyUnsubscribeToken(token)

  return (
    <SiteShell nav={false} back={{ href: '/', label: 'Accéder au site' }} clearing={false}>
      <section className="formpage" style={{ maxWidth: 600 }}>
        <span className="badge in0">Désinscription</span>
        <h1 className="in0" style={{ '--d': 100 } as CSSProperties}>Ne plus recevoir mes emails</h1>
        <p className="lead in0" style={{ '--d': 200 } as CSSProperties}>
          {email
            ? 'Confirme ci-dessous et tu es retiré de la séquence immédiatement. Aucune justification à donner.'
            : 'Ce lien de désinscription est invalide ou incomplet.'}
        </p>

        <div className="formcard in0" style={{ '--d': 320 } as CSSProperties}>
          {email ? (
            <UnsubscribeForm email={email} token={token} />
          ) : (
            <div className="fm">
              <p>
                Utilise le lien « Se désinscrire » présent en bas de n&apos;importe lequel de mes
                emails. S&apos;il ne fonctionne toujours pas, écris-moi et je te retire à la main.
              </p>
              <div className="acts" style={{ marginTop: 6 }}>
                <a className="btn solid big" href="mailto:contact@jules-api.xyz?subject=Désinscription">Écrire à Jules</a>
              </div>
            </div>
          )}
        </div>
      </section>
    </SiteShell>
  )
}
