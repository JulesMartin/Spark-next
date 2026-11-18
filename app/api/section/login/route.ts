import { NextRequest, NextResponse } from 'next/server'
import {
  OLD_COOKIES,
  SECTION_COOKIE,
  SECTION_COOKIE_MAX_AGE,
  AFTER_LOGIN,
  clientIp,
  login,
  safeNext,
  sameOrigin,
} from '@/lib/section-access'

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return new NextResponse('Interdit', { status: 403 })

  const form = await request.formData()
  const password = String(form.get('password') ?? '').trim().slice(0, 256)
  const next = safeNext(form.get('next'))

  const result = await login(password, clientIp(request.headers), request.headers.get('user-agent') ?? '')

  if (!result.ok) {
    // Ralentit les essais ratés
    if (result.reason === 'mauvais') await new Promise((r) => setTimeout(r, 800))
    const url = new URL('/section/', request.url)
    url.searchParams.set('erreur', result.reason === 'mauvais' ? '1' : result.reason)
    if (next !== AFTER_LOGIN) url.searchParams.set('next', next)
    return NextResponse.redirect(url, 303)
  }

  const response = NextResponse.redirect(new URL(next, request.url), 303)
  response.cookies.set(SECTION_COOKIE, result.token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: SECTION_COOKIE_MAX_AGE,
  })
  for (const old of OLD_COOKIES) response.cookies.delete(old)
  return response
}
