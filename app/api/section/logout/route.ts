import { NextRequest, NextResponse } from 'next/server'
import { SECTION_COOKIE, revokeSession, sameOrigin } from '@/lib/section-access'

// Déconnexion : la session est révoquée en base (le cookie ne marche plus nulle part), puis retour à la page d'entrée.
export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return new NextResponse('Interdit', { status: 403 })
  await revokeSession(request.cookies.get(SECTION_COOKIE)?.value)
  const response = NextResponse.redirect(new URL('/section/', request.url), 303)
  response.cookies.delete(SECTION_COOKIE)
  return response
}
