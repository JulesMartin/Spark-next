import { NextRequest, NextResponse } from 'next/server'
import {
  SECTION_COOKIE,
  SECTION_COOKIE_MAX_AGE,
  accessCookieValue,
  passwordMatches,
  safeNext,
} from '@/lib/section-access'

export async function POST(request: NextRequest) {
  const form = await request.formData()
  const password = String(form.get('password') ?? '')
  const next = safeNext(form.get('next'))

  const cookie = accessCookieValue()
  if (!cookie || !passwordMatches(password)) {
    // Ralentit les essais en rafale
    await new Promise((r) => setTimeout(r, 1000))
    const url = new URL('/section/', request.url)
    url.searchParams.set('erreur', '1')
    if (next !== '/section/') url.searchParams.set('next', next)
    return NextResponse.redirect(url, 303)
  }

  const response = NextResponse.redirect(new URL(next, request.url), 303)
  response.cookies.set(SECTION_COOKIE, cookie, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: SECTION_COOKIE_MAX_AGE,
  })
  return response
}
