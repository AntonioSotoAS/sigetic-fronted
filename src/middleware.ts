import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Rutas públicas que no requieren autenticación
  // const publicRoutes = ['/login']
  
  // Rutas protegidas que requieren autenticación
  // const protectedRoutes = ['/dashboard']
  
  // Verificar si la ruta actual es pública
  // const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
  
  // Verificar si la ruta actual es protegida
  // const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  
  // Obtener el token del localStorage (esto se maneja en el cliente)
  // El middleware no puede acceder directamente al localStorage del cliente
  // Por eso usamos el AuthGuard en el cliente
  
  // Si es la ruta raíz, permitir que el AuthGuard maneje la redirección
  if (pathname === '/') {
    return NextResponse.next()
  }
  
  // Para rutas públicas y protegidas, permitir que el AuthGuard maneje la lógica
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
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
