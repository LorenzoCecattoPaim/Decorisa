// src/middleware.ts
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // Admin-only routes
    if (pathname.startsWith('/admin') && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        // Public routes that don't need auth
        if (
          pathname.startsWith('/api/auth') ||
          pathname.startsWith('/api/produtos') ||
          pathname.startsWith('/api/frete') ||
          pathname.startsWith('/api/cupons/validate') ||
          pathname.startsWith('/api/contato') ||
          pathname.startsWith('/api/webhooks') ||
          pathname === '/' ||
          pathname.startsWith('/loja') ||
          pathname.startsWith('/produto') ||
          pathname.startsWith('/sobre') ||
          pathname.startsWith('/contato') ||
          pathname.startsWith('/login') ||
          pathname.startsWith('/cadastro') ||
          pathname.startsWith('/carrinho') ||
          pathname.startsWith('/checkout')
        ) {
          return true
        }
        // Protected: /cliente, /admin, /pedido
        return !!token
      },
    },
  }
)

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
