import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { count } = await supabase
    .from('email_subscribers')
    .select('*', { count: 'exact', head: true })

  return NextResponse.json({ ok: true, subscribers: count ?? 0 })
}
