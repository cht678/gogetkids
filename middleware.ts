import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  const isPublicPath = path === '/' || path === '/login' || path === '/signup'

  const token = request.cookies.get('token')?.value || ''

  const protectedRoutes = ['/dashboard', '/system-admin-dashboard', '/transport-admin-dashboard'];

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.nextUrl))
  }

  if (protectedRoutes.includes(path) && !token) {
    return NextResponse.redirect(new URL('/login', request.nextUrl))
  }
  /*
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/dashboard', request.nextUrl))
  } */
}

export const config = {
  matcher: [
    '/',
    '/profile',
    '/login',
    '/signup',
  ]
}
