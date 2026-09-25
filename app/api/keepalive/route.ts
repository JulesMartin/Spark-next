import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Requête minimale : le but est d'empêcher la mise en pause du projet Supabase.
  // Le nombre d'abonnés ne sort pas d'ici — la route est publique.
  await supabase.from('email_subscribers').select('id', { count: 'exact', head: true })

  return NextResponse.json({ ok: true })
}
