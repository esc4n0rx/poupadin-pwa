// proxy.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'

export default async function proxy(req: NextRequest) {
  const res = NextResponse.next()

  // Rotas públicas que não precisam de autenticação
  const publicRoutes = ['/login', '/signup', '/']
  
  // Rotas de API de autenticação são sempre públicas
  const isAuthApiRoute = req.nextUrl.pathname.startsWith('/api/auth')
  
  const isPublicRoute = publicRoutes.some(route =>
    req.nextUrl.pathname === route || req.nextUrl.pathname.startsWith(route + '/')
  )

  // Pegar o token JWT do cookie
  const token = req.cookies.get('auth-token')?.value
  const hasAuthToken = !!token
  
  // Verificar se o token é válido
  let isValidToken = false
  if (token) {
    const decoded = verifyToken(token)
    isValidToken = !!decoded
  }

  // Console logs para debug
  console.log('[Proxy] Path:', req.nextUrl.pathname)
  console.log('[Proxy] Has auth token:', hasAuthToken)
  console.log('[Proxy] Is valid token:', isValidToken)
  console.log('[Proxy] Is public route:', isPublicRoute)
  console.log('[Proxy] Is auth API route:', isAuthApiRoute)

  // Permitir rotas de API de autenticação
  if (isAuthApiRoute) {
    return res
  }

  // APENAS proteger rotas privadas - não redirecionar de rotas públicas
  if (!isValidToken && !isPublicRoute) {
    console.log('[Proxy] Redirecting to /login - no valid auth token')
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