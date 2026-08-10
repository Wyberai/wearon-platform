'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

// Shown on the storefront when arriving from the landing page's "see how
// your store would look" flow (?preview_name=...&preview_email=...). The
// underlying storefront is still the seeded demo (Priya's Boutique) — this
// banner carries the "imagine this is yours" framing rather than trying to
// rewrite the real header, which would need server-side searchParams that
// layouts don't receive in the App Router.
export function PreviewBanner() {
  const params = useSearchParams()
  const name = params.get('preview_name')
  if (!name) return null

  const email = params.get('preview_email') ?? ''
  const dashboardHref = `/preview/dashboard?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`

  return (
    <div style={{ background: '#111827', color: '#fff', padding: '10px 16px', textAlign: 'center', fontSize: 13 }}>
      🎉 This is a live preview of what <strong>{name}</strong>&apos;s store could look like on WearOn —{' '}
      <Link href={dashboardHref} style={{ color: '#F9A8D4', fontWeight: 700, textDecoration: 'underline' }}>
        see your dashboard →
      </Link>
    </div>
  )
}
