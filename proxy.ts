import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default async function proxy(req: NextRequest) {
  const res = NextResponse.next()

  // Rotas públicas que não precisam de autenticação
  const publicRoutes = ['/login', '/signup', '/']
  const isPublicRoute = publicRoutes.some(route =>
    req.nextUrl.pathname === route || req.nextUrl.pathname.startsWith(route + '/')
  )

  // Procurar por cookies do Supabase (formato: sb-<project-ref>-auth-token)
  const allCookies = req.cookies.getAll()
  const supabaseAuthCookie = allCookies.find(cookie =>
    cookie.name.includes('sb-') && cookie.name.includes('-auth-token')
  )

  const hasAuthToken = !!supabaseAuthCookie?.value

  // Console logs para debug (remover depois)
  console.log('[Proxy] Path:', req.nextUrl.pathname)
  console.log('[Proxy] Has auth token:', hasAuthToken)
  console.log('[Proxy] Is public route:', isPublicRoute)

  // APENAS proteger rotas privadas - não redirecionar de rotas públicas
  // O redirecionamento de /login e /signup quando autenticado será feito no client-side
  if (!hasAuthToken && !isPublicRoute) {
    console.log('[Proxy] Redirecting to /login - no auth token')
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/login'
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
