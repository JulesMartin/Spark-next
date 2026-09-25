import { NextRequest, NextResponse } from 'next/server'
import { runSequence } from '@/lib/sequence'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

// Déclenchement manuel de la séquence (tests, rattrapage).
// L'envoi quotidien réel passe par /api/cron/sync-sheet : l'offre Vercel Hobby
// est limitée à deux crons, tous deux déjà utilisés.
export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret || request.headers.get('authorization') !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const sequence = await runSequence()
  return NextResponse.json({ ok: true, sequence })
}
