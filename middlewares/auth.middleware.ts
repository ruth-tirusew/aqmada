import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { Locale, i18n } from '@/i18n.config'
import { CustomMiddleware } from './chain'
import axios from 'axios'

const protectedPaths = ['/dashboard', '/admin']

function getProtectedRoutes(protectedPaths: string[], locales: Locale[]) {
  let protectedPathsWithLocale = [...protectedPaths]

  protectedPaths.forEach(route => {
    locales.forEach(
      locale =>
        (protectedPathsWithLocale = [
          ...protectedPathsWithLocale,
          `/${locale}${route}`
        ])
    )
  })

  return protectedPathsWithLocale
}

export function withAuthMiddleware(middleware: CustomMiddleware) {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const response = NextResponse.next()

    const token = await getToken({ req: request })


    // @ts-ignore
    request.nextauth = request.nextauth || {}
    // @ts-ignore
    request.nextauth.token = token
    const pathname = request.nextUrl.pathname

    const protectedPathsWithLocale = getProtectedRoutes(protectedPaths, [
      ...i18n.locales
    ])
    if (!token && protectedPathsWithLocale.includes(pathname) ||!token && pathname.includes('password') ) {
      const signInUrl = new URL('/api/auth/signin', request.url)
      signInUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(signInUrl)
    }
    if (token && protectedPathsWithLocale.includes(pathname)) {
      try {
        // @ts-ignore
        if (!token.user.company_id) {
          const onboardingUrl = new URL('/onboarding', request.url)
          return NextResponse.redirect(onboardingUrl)
        }
          // @ts-ignore
        if (!token.user.passwordChanged) {
          const passwordChangeUrl = new URL('/password', request.url)
          return NextResponse.redirect(passwordChangeUrl)
        }
       // @ts-ignore
        if (!token.user.isSuperuser && (request.url === '/admin')) {
          const onboardingUrl = new URL('/onboarding', request.url)
          return NextResponse.redirect(onboardingUrl)
        }
      } catch (error) {
      }
    }

    return middleware(request, event, response)
  }
}


