import { getRequestConfig } from 'next-intl/server'
import { locales } from './locales'

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = locales.includes(requested as (typeof locales)[number])
    ? (requested as string)
    : 'de'

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
