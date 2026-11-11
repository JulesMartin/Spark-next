import { NextRequest, NextResponse } from 'next/server'
import {
  ATELIER_COOKIE,
  ATELIER_COOKIE_MAX_AGE,
  accessToken,
  passwordMatches,
  safeNext,
} from '@/lib/atelier-access'

export async function POST(request: NextRequest) {
  const form = await request.formData()
  const password = String(form.get('password') ?? '')
  const next = safeNext(form.get('next'))

  if (!accessToken() || !passwordMatches(password)) {
    // Ralentit les essais en rafale
    await new Promise((r) => setTimeout(r, 1000))
    const url = new URL('/atelier-acces', request.url)
    url.searchParams.set('erreur', '1')
    url.searchParams.set('next', next)
    return NextResponse.redirect(url, 303)
  }

  const response = NextResponse.redirect(new URL(next, request.url), 303)
  response.cookies.set(ATELIER_COOKIE, accessToken()!, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: ATELIER_COOKIE_MAX_AGE,
  })
  return response
}
