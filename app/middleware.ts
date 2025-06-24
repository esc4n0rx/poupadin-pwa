// middleware.ts
import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Se tentar acessar páginas principais sem passar pela verificação PWA
  const protectedRoutes = ['/dashboard', '/analytics', '/expense', '/categories', '/profile', '/app']
  
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    // Verificar se tem cookie de verificação PWA
    const pwaMockChecked = request.cookies.get('pwa-checked')
    
    if (!pwaMockChecked) {
      // Redirecionar para verificação PWA
      return NextResponse.redirect(new URL('/pwa-check', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - sw.js (service worker)
     * - manifest.json (PWA manifest)
     * - icons (PWA icons)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sw.js|manifest.json|icon-.*\\.png).*)',
  ],
}