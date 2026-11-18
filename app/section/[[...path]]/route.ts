import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { SECTION_BUCKET, SECTION_COOKIE, hasAccess } from '@/lib/section-access'

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

  const connected = hasAccess(request.cookies.get(SECTION_COOKIE)?.value)
  // L'accueil (/section/) est la page d'entrée : il s'affiche toujours, avec le champ du mot de passe tant qu'on n'est pas connecté.
  const isHome = /^\/section\/?$/.test(pathname)
  if (!connected && !isHome) {
    const home = new URL('/section/', request.url)
    home.searchParams.set('next', pathname)
    return NextResponse.redirect(home, 307)
  }

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
  }
  if (ext === 'zip') headers['Content-Disposition'] = `attachment; filename="${last}"`

  // Accueil : on marque la page « connecté » pour qu'elle masque le champ du mot de passe et ouvre les vidéos.
  if (isHome && ext === 'html') {
    const html = (await data.text()).replace('<html lang="fr">', connected ? '<html lang="fr" data-acces="1">' : '<html lang="fr">')
    return new NextResponse(html, { headers })
  }

  return new NextResponse(data.stream(), { headers })
}
