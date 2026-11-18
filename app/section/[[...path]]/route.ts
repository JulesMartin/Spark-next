import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { AFTER_LOGIN, SECTION_BUCKET, SECTION_COOKIE, hasSession } from '@/lib/section-access'

export const dynamic = 'force-dynamic'

const TYPES: Record<string, string> = {
  html: 'text/html; charset=utf-8',
  md: 'text/plain; charset=utf-8',
  txt: 'text/plain; charset=utf-8',
  json: 'application/json; charset=utf-8',
  svg: 'image/svg+xml',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
  mp4: 'video/mp4',
  pdf: 'application/pdf',
  zip: 'application/zip',
}

export async function GET(request: NextRequest) {
  const { pathname } = request.nextUrl

  const connected = await hasSession(request.cookies.get(SECTION_COOKIE)?.value)
  // /section/ est la page d'entrée (le mot de passe, rien d'autre) : visible quand on n'est pas connecté.
  // Une fois connecté, on n'y reste pas : direction la page des ressources.
  // Sans session, toute autre page (même un lien direct vers un hub) renvoie vers la page d'entrée.
  const isEntry = /^\/section\/?$/.test(pathname)
  if (isEntry && connected) return NextResponse.redirect(new URL(AFTER_LOGIN, request.url), 307)
  if (!connected && !isEntry) return NextResponse.redirect(new URL('/section/', request.url), 307)

  // Les liens relatifs des pages (images, autres pages) exigent un slash final sur les dossiers.
  let rel: string
  try {
    rel = decodeURIComponent(pathname.replace(/^\/section\/?/, ''))
  } catch {
    return new NextResponse('Introuvable', { status: 404 })
  }
  const last = rel.split('/').pop() ?? ''
  if (rel.split('/').includes('..')) return new NextResponse('Introuvable', { status: 404 })
  if (!pathname.endsWith('/') && (rel === '' || !last.includes('.'))) {
    return NextResponse.redirect(new URL(`${pathname}/`, request.url), 308)
  }

  const key = rel === '' || rel.endsWith('/') ? `${rel}index.html` : rel
  const ext = key.split('.').pop()!.toLowerCase()

  const { data, error } = await createServiceClient().storage.from(SECTION_BUCKET).download(key)
  if (error || !data) return new NextResponse('Introuvable', { status: 404 })

  const headers: Record<string, string> = {
    'Content-Type': TYPES[ext] ?? 'application/octet-stream',
    'Cache-Control': 'private, no-cache',
    'X-Robots-Tag': 'noindex, nofollow',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  }
  if (ext === 'zip') headers['Content-Disposition'] = `attachment; filename="${last}"`

  return new NextResponse(data.stream(), { headers })
}
