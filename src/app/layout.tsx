import type { Metadata } from 'next'
import { Fraunces, Inter, Inter_Tight } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-display', weight: ['400', '500', '600'], style: ['normal', 'italic'] })
const inter = Inter({ subsets: ['latin'], variable: '--font-body' })
// Marketing-only display face — deliberately a SEPARATE variable from
// --font-display (Fraunces), which per-tenant storefronts still depend on
// (e.g. the August theme's --a-serif fallback chain). Never repoint
// --font-display itself, or every live seller store using it breaks.
const interTight = Inter_Tight({ subsets: ['latin'], variable: '--font-marketing', weight: ['400', '500', '600'] })

const TITLE = 'Instastarz — Your Branded Boutique App for Instagram Sellers'
const DESCRIPTION = 'Give your Instagram buyers a proper branded fashion store — your logo, your colors, WhatsApp ordering. Live in 10 minutes. Free.'

export const metadata: Metadata = {
  metadataBase: new URL('https://instastarz.in'),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: 'https://instastarz.in',
    siteName: 'Instastarz',
    images: [{ url: '/icon.svg', width: 512, height: 512 }],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/icon.svg'],
  },
}

// instastarz.in is owned/operated by Signalpulse Technologies — Instastarz is the
// product name, so the entity behind it needs to be in the structured data,
// not just implied by the brand.
const ORG_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Instastarz',
  legalName: 'Signalpulse Technologies',
  url: 'https://instastarz.in',
  logo: 'https://instastarz.in/icon.svg',
}

const WEBSITE_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Instastarz',
  url: 'https://instastarz.in',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} ${interTight.variable}`}>
      <body className="min-h-full">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSON_LD) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_JSON_LD) }} />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
