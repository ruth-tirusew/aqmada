import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { Locale, i18n } from '@/i18n.config'
import { CustomMiddleware } from './chain'
import axios from 'axios'

const protectedPaths = ['/dashboard', '/admin', '/password']

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
    // Create a response object to pass down the chain
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

    if (!token && protectedPathsWithLocale.includes(pathname)) {
      const signInUrl = new URL('/api/auth/signin', request.url)
      signInUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(signInUrl)
    }
    if (token && protectedPathsWithLocale.includes(pathname)) {
      try {
        const res = await axios.get(`/api/auth/me`)
        if (res?.data?.isSuperuser) {
          const adminUrl = new URL('/admin', request.url)
          return NextResponse.redirect(adminUrl)
        }
        if (!res?.data?.passwordChanged) {
          const passwordChangeUrl = new URL('/password', request.url)
          return NextResponse.redirect(passwordChangeUrl)
        }
        if (!res?.data?.companyId && !res?.data?.isSuperuser) {
          const onboardingUrl = new URL('/onboarding', request.url)
          return NextResponse.redirect(onboardingUrl)
        }
        if (!res?.data?.isSuperuser && (request.url ==='/admin')) {
          const dashboardUrl = new URL('/dashboard', request.url)
          return NextResponse.redirect(dashboardUrl)
        }
      } catch (error) {

      }
    }

    return middleware(request, event, response)
  }
}

