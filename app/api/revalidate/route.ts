import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

// Route ouverte auparavant : chaque appel force un re-render de l'accueil et un
// refetch du flux RSS YouTube, donc un déni de service bon marché en boucle.
// Refus par défaut : sans secret configuré, personne ne passe.
export async function POST(request: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  revalidatePath('/')
  revalidatePath('/interviews/[slug]', 'page')
  revalidatePath('/blog/[slug]', 'page')
  return NextResponse.json({ revalidated: true })
}
