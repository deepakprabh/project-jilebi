import createMiddleware from 'next-intl/middleware'
import { locales } from './src/i18n/locales'

export default createMiddleware({
  locales,
  defaultLocale: 'de',
})

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
