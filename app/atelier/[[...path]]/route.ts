import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { ATELIER_BUCKET, ATELIER_COOKIE, hasAccess } from '@/lib/atelier-access'

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

  if (!hasAccess(request.cookies.get(ATELIER_COOKIE)?.value)) {
    const login = new URL('/atelier-acces', request.url)
    login.searchParams.set('next', pathname)
    return NextResponse.redirect(login, 307)
  }

  // Les liens relatifs des pages (images, autres pages) exigent un slash final sur les dossiers.
  const rel = decodeURIComponent(pathname.replace(/^\/atelier\/?/, ''))
  const last = rel.split('/').pop() ?? ''
  if (rel.split('/').includes('..')) return new NextResponse('Introuvable', { status: 404 })
  if (rel !== '' && !rel.endsWith('/') && !last.includes('.')) {
    return NextResponse.redirect(new URL(`${pathname}/`, request.url), 308)
  }

  const key = rel === '' || rel.endsWith('/') ? `${rel}index.html` : rel
  const ext = key.split('.').pop()!.toLowerCase()

  const { data, error } = await createServiceClient().storage.from(ATELIER_BUCKET).download(key)
  if (error || !data) return new NextResponse('Introuvable', { status: 404 })

  const headers: Record<string, string> = {
    'Content-Type': TYPES[ext] ?? 'application/octet-stream',
    'Cache-Control': 'private, no-cache',
    'X-Robots-Tag': 'noindex, nofollow',
  }
  if (ext === 'zip') headers['Content-Disposition'] = `attachment; filename="${last}"`

  return new NextResponse(data.stream(), { headers })
}
