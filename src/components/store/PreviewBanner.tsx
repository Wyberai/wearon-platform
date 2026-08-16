'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

// Shown on the storefront when arriving from the landing page's "see how
// your store would look" flow (?preview_name=...&preview_email=...). The
// storefront itself now actually swaps its displayed brand name to `name`
// (see src/app/store/[slug]/page.tsx) — this banner just makes the preview
// framing explicit and hands off into a signup prefilled with everything
// the visitor already gave us, so there's nothing left to retype.
export function PreviewBanner() {
  const params = useSearchParams()
  const name = params.get('preview_name')
  if (!name) return null

  const email = params.get('preview_email') ?? ''
  const theme = params.get('theme') ?? ''
  const signupHref = `/auth/signup?email=${encodeURIComponent(email)}&brand=${encodeURIComponent(name)}${theme ? `&theme=${encodeURIComponent(theme)}` : ''}`

  return (
    <div style={{ background: '#111827', color: '#fff', padding: '10px 16px', textAlign: 'center', fontSize: 13 }}>
      🎉 This is <strong>{name}</strong> — a live preview of your store on WearOn —{' '}
      <Link href={signupHref} style={{ color: '#F9A8D4', fontWeight: 700, textDecoration: 'underline' }}>
        claim this store, it&apos;s free →
      </Link>
    </div>
  )
}
