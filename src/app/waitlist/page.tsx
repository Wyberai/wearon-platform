import type { Metadata } from 'next'
import { getLocale } from '@/lib/i18n/get-locale'
import { LOCALES, type Locale } from '@/lib/i18n/config'
import { WaitlistClient } from './WaitlistClient'

export const metadata: Metadata = {
  title: 'Join the Waitlist — Instastarz',
  description: 'Turn your Instagram into a full online store. Get early access to Instastarz — branded mobile app, AI buyer, virtual try-on, and more.',
  openGraph: {
    title: 'Join the Instastarz Waitlist',
    description: 'Turn your Instagram into a full online store with a branded mobile app, AI buyer, virtual try-on, and one-click Reels import.',
    url: 'https://instastarz.in/waitlist',
    siteName: 'Instastarz',
    images: [{ url: 'https://instastarz.in/og-image.png', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Join the Instastarz Waitlist',
    description: 'Your Instagram store with a branded app, AI buyer & virtual try-on.',
    images: ['https://instastarz.in/og-image.png'],
  },
}

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
