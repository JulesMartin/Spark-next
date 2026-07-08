import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { getBlacklistedEmails } from '@/lib/brevo'
import {
  SHEET_TAB,
  getSheetAccessToken,
  readSheet,
  appendRows,
  batchUpdateCells,
} from '@/lib/google-sheets'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

type Subscriber = {
  email: string
  campaigns: string[] | null
  social_handle: string | null
  created_at: string
  unsubscribed: boolean
  phone: string | null
}

async function fetchAllSubscribers(
  supabase: ReturnType<typeof createServiceClient>,
): Promise<Subscriber[]> {
  const all: Subscriber[] = []
  const pageSize = 1000
  let from = 0
  while (true) {
    const { data, error } = await supabase
      .from('email_subscribers')
      .select('email, campaigns, social_handle, created_at, unsubscribed, phone')
      .order('created_at', { ascending: true })
      .range(from, from + pageSize - 1)
    if (error) throw new Error(`Supabase select: ${error.message}`)
    const rows = (data ?? []) as Subscriber[]
    all.push(...rows)
    if (rows.length < pageSize) break
    from += pageSize
  }
  return all
}

export async function GET(request: NextRequest) {
  if (
    process.env.CRON_SECRET &&
    request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()

  // --- Étape A : Brevo (source de vérité désabo) → Supabase ---
  let newlyUnsubscribed = 0
  const blacklist = await getBlacklistedEmails()
  if (blacklist.size > 0) {
    const subs = await fetchAllSubscribers(supabase)
    const toMark = subs
      .filter(s => !s.unsubscribed && blacklist.has(s.email.toLowerCase()))
      .map(s => s.email)
    const batchSize = 200
    for (let i = 0; i < toMark.length; i += batchSize) {
      const batch = toMark.slice(i, i + batchSize)
      const { error } = await supabase
        .from('email_subscribers')
        .update({ unsubscribed: true, unsubscribed_at: new Date().toISOString() })
        .in('email', batch)
      if (error) throw new Error(`Supabase update unsubscribed: ${error.message}`)
    }
    newlyUnsubscribed = toMark.length
  }

  // --- Étape B : Supabase → Sheet (append-only + maj du flag unsubscribed) ---
  const token = await getSheetAccessToken()
  if (!token) {
    return NextResponse.json({ ok: true, newlyUnsubscribed, sheet: 'skipped (no token)' })
  }

  const subscribers = await fetchAllSubscribers(supabase)
  const sheetRows = await readSheet(token)

  // Map email (lowercase) → { row (1-based), unsubscribedCell }
  const sheetMap = new Map<string, { row: number; unsub: string }>()
  sheetRows.forEach((r, i) => {
    const email = (r[0] ?? '').toLowerCase().trim()
    if (!email || email === 'email') return
    sheetMap.set(email, { row: i + 1, unsub: r[5] ?? '' })
  })

  const now = new Date().toISOString()
  const newRows: string[][] = []
  const flagUpdates: { range: string; values: string[][] }[] = []

  for (const s of subscribers) {
    const key = s.email.toLowerCase().trim()
    const campaigns = (s.campaigns ?? []).join(',')
    const unsub = s.unsubscribed ? 'TRUE' : ''
    const existing = sheetMap.get(key)
    if (!existing) {
      newRows.push([s.email, campaigns, s.social_handle ?? '', s.created_at, now, unsub, s.phone ?? ''])
    } else if (s.unsubscribed && existing.unsub !== 'TRUE') {
      flagUpdates.push({ range: `${SHEET_TAB}!F${existing.row}`, values: [['TRUE']] })
    }
  }

  await appendRows(token, newRows)
  await batchUpdateCells(token, flagUpdates)

  return NextResponse.json({
    ok: true,
    newlyUnsubscribed,
    appended: newRows.length,
    flagsUpdated: flagUpdates.length,
    sheetTotal: sheetMap.size + newRows.length,
  })
}
