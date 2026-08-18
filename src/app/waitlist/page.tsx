import { getLocale } from '@/lib/i18n/get-locale'
import { LOCALES, type Locale } from '@/lib/i18n/config'
import { WaitlistClient } from './WaitlistClient'

// Server component so locale can come from the ?lang= URL param directly —
// the middleware's Set-Cookie for a first-ever ad click isn't visible to
// this same request's cookies() read, but the URL param always is. Falls
// back to the cookie for regular (non-ad) navigation within the site.
export default async function WaitlistPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>
}) {
  const params = await searchParams
  const urlLang = params.lang
  const locale: Locale = (LOCALES as readonly string[]).includes(urlLang ?? '')
    ? (urlLang as Locale)
    : await getLocale()

  return <WaitlistClient locale={locale} />
}
