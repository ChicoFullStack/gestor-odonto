import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicRoutes = ['/login']
const apiRoutes = ['/api']
const staticRoutes = ['/_next', '/favicon.ico']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Ignorar rotas estáticas e da API
  if (staticRoutes.some(route => pathname.startsWith(route)) || apiRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Verificar se é uma rota pública
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  // Obter token do cookie
  const token = request.cookies.get('token')?.value

  // Se não tem token e não é rota pública, redireciona para login
  if (!token && !isPublicRoute) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Se tem token e está tentando acessar rota pública, redireciona para home
  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
} 