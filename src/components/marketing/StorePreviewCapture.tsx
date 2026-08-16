'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FLAGSHIP_DEMO_SLUG } from '@/lib/themes'

const ACCENT = '#A6134A'
const INK = '#111010'

// THEME_TILES pass their demo store's slug (e.g. 'august'), but the real
// theme_id a signup needs to apply is the registry id (e.g. 'january' —
// FLAGSHIP_DEMO_SLUG maps id -> slug, so this reverses it). Every demo slug
// is unique across the map, so this always resolves.
function demoSlugToThemeId(slug: string): string {
  return Object.entries(FLAGSHIP_DEMO_SLUG).find(([, s]) => s === slug)?.[0] ?? slug
}

// Turns an email's local-part into a plausible boutique name, e.g.
// "priya.designs21@gmail.com" -> "Priya Designs21". Purely cosmetic —
// the seller can rename their store for real during signup.
function deriveBrandName(email: string): string {
  const local = email.split('@')[0] ?? ''
  const words = local.replace(/[^a-zA-Z0-9]+/g, ' ').trim().split(/\s+/).filter(Boolean)
  if (!words.length) return 'My Boutique'
  return words.slice(0, 3).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')
}

export interface PreviewTheme {
  name: string
  slug: string
}

// The landing page's primary conversion action — captures an email against
// whichever theme the visitor picked in the tile grid above, derives a
// boutique name from it, records the lead, then sends them into a
// personalized, no-login preview of their own store: that theme's real
// flagship demo (already fully seeded), with their derived name swapped
// into the header via ?preview_name= (see src/app/store/[slug]/page.tsx).
export function StorePreviewCapture({ theme }: { theme: PreviewTheme }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const previewName = email.includes('@') && email.split('@')[0]?.trim() ? deriveBrandName(email) : null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const brandName = deriveBrandName(email)
    const themeId = demoSlugToThemeId(theme.slug)

    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, brand_name: brandName, theme_id: themeId }),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError(data.error ?? 'Something went wrong — try again')
      setLoading(false)
      return
    }

    const params = new URLSearchParams({ preview_name: brandName, preview_email: email, theme: themeId })
    router.push(`/store/${theme.slug}?${params.toString()}`)
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 480, margin: '0 auto',
        background: '#f8f8f6', border: `1px solid ${INK}12`, borderRadius: 20, padding: '26px 28px',
      }}
    >
      <p style={{ fontSize: 12, color: `${INK}77`, margin: 0 }}>
        Chosen look — <strong style={{ color: INK }}>{theme.name}</strong>
      </p>
      <input
        type="email"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Your email"
        style={{
          padding: '13px 16px', borderRadius: 12, border: `1px solid ${INK}22`,
          background: '#fff', color: INK, fontSize: 14, outline: 'none',
        }}
      />
      {previewName && (
        <p style={{ fontSize: 12, color: `${INK}66`, margin: 0 }}>
          We&apos;ll preview your store as <strong style={{ color: INK }}>{previewName}</strong>
        </p>
      )}
      {error && <p style={{ color: '#B91C1C', fontSize: 13, margin: 0 }}>{error}</p>}
      <button
        type="submit"
        disabled={loading}
        style={{
          padding: '14px 0', borderRadius: 12, background: ACCENT, color: '#fff',
          fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer', opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? 'Loading your preview...' : `See ${theme.name} as my store →`}
      </button>
      <p style={{ fontSize: 12, color: `${INK}55`, textAlign: 'center', margin: 0 }}>
        No password, no signup — just a live preview.
      </p>
    </form>
  )
}
