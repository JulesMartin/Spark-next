import { NextRequest, NextResponse } from 'next/server'
import {
  ATELIER_COOKIE,
  ATELIER_COOKIE_MAX_AGE,
  accessLevel,
  cookieForLevel,
  levelForPassword,
  requiredLevelForPath,
  safeNext,
} from '@/lib/atelier-access'

export async function POST(request: NextRequest) {
  const form = await request.formData()
  const password = String(form.get('password') ?? '')
  const next = safeNext(form.get('next'))

  const entered = levelForPassword(password)

  if (!entered) {
    // Ralentit les essais en rafale
    await new Promise((r) => setTimeout(r, 1000))
    const url = new URL('/atelier-acces', request.url)
    url.searchParams.set('erreur', '1')
    url.searchParams.set('next', next)
    return NextResponse.redirect(url, 303)
  }

  // On garde le palier le plus haut déjà obtenu (un ancien mot de passe ne fait jamais redescendre).
  const current = accessLevel(request.cookies.get(ATELIER_COOKIE)?.value)
  const level = Math.max(entered, current)

  // Le mot de passe saisi n'ouvre pas la page demandée : on le dit au lieu de tourner en rond.
  if (level < requiredLevelForPath(next)) {
    await new Promise((r) => setTimeout(r, 1000))
    const url = new URL('/atelier-acces', request.url)
    url.searchParams.set('erreur', 'palier')
    url.searchParams.set('next', next)
    return NextResponse.redirect(url, 303)
  }

  const response = NextResponse.redirect(new URL(next, request.url), 303)
  response.cookies.set(ATELIER_COOKIE, cookieForLevel(level)!, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: ATELIER_COOKIE_MAX_AGE,
  })
  return response
}
