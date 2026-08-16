'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

const VIEWS = [
  { key: null, label: 'Website' },
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'app', label: 'Mobile app' },
] as const

// Shown on the storefront when arriving from the landing page's "see how
// your store would look" flow (?preview_name=...&preview_email=...). The
// storefront itself now actually swaps its displayed brand name to `name`
// (see src/app/store/[slug]/page.tsx) — this banner makes the preview
// framing explicit, offers tabs into the themed dashboard/mobile-app mockups
// (see ThemedDashboardMock / ThemedMobileAppMock, switched via ?view=),
// and hands off into a signup prefilled with everything the visitor already
// gave us, so there's nothing left to retype.
export function PreviewBanner() {
  const params = useSearchParams()
  const name = params.get('preview_name')
  if (!name) return null

  const email = params.get('preview_email') ?? ''
  const theme = params.get('theme') ?? ''
  const currentView = params.get('view')
  const signupHref = `/auth/signup?email=${encodeURIComponent(email)}&brand=${encodeURIComponent(name)}${theme ? `&theme=${encodeURIComponent(theme)}` : ''}`

  function hrefForView(viewKey: string | null) {
    const p = new URLSearchParams(params.toString())
    if (viewKey) p.set('view', viewKey)
    else p.delete('view')
    return `?${p.toString()}`
  }

  return (
    <div style={{ background: '#111827', color: '#fff' }}>
      <div style={{ padding: '10px 16px', textAlign: 'center', fontSize: 13 }}>
        🎉 This is <strong>{name}</strong> — a live preview of your store on Instastarz —{' '}
        <Link href={signupHref} style={{ color: '#F9A8D4', fontWeight: 700, textDecoration: 'underline' }}>
          claim this store, it&apos;s free →
        </Link>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, padding: '0 16px 10px' }}>
        {VIEWS.map(v => {
          const active = (currentView ?? null) === v.key
          return (
            <Link
              key={v.label}
              href={hrefForView(v.key)}
              style={{
                fontSize: 12, fontWeight: 600, padding: '6px 14px', borderRadius: 9999,
                textDecoration: 'none', color: active ? '#111827' : 'rgba(255,255,255,0.75)',
                background: active ? '#fff' : 'rgba(255,255,255,0.1)',
              }}
            >
              {v.label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
