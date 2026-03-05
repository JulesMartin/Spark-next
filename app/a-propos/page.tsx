import Header from '@/components/public/Header'

export default function AProposPage() {
  return (
    <main className="min-h-screen bg-bg">
      <Header />

      <div className="max-w-2xl mx-auto px-6 md:px-12 py-16 md:py-24">
        <h1 className="font-display text-4xl md:text-5xl font-black text-cream mb-10">
          À propos
        </h1>

        <div className="font-body text-cream/80 text-base leading-relaxed space-y-6">
          <p>
            <span className="text-accent font-semibold">Spark</span> est un média indépendant dédié aux interviews longues et approfondies avec des entrepreneurs, créatifs et visionnaires qui façonnent notre époque.
          </p>
          <p>
            Ici, pas de questions creuses ni de storytelling formaté. Chaque conversation cherche à aller au fond des choses — les doutes, les décisions difficiles, les convictions profondes.
          </p>
          <p>
            Le contenu est entièrement gratuit, sans publicité, sans algorithme à satisfaire.
          </p>
        </div>

        <div className="mt-16 pt-10 border-t border-edge">
          <p className="font-body text-xs uppercase tracking-[0.2em] text-muted mb-4">Contact</p>
          <a
            href="mailto:contact@spark.media"
            className="font-body text-cream hover:text-accent transition-colors text-sm"
          >
            contact@spark.media
          </a>
        </div>
      </div>
    </main>
  )
}
