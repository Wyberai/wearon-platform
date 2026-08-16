'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deriveBrandName, submitPreviewLead, type PreviewTheme } from '@/lib/preview-utils'

const ACCENT = '#A6134A'
const INK = '#111010'

export type { PreviewTheme }

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

    const result = await submitPreviewLead(email, theme)
    if (!result.ok) {
      setError(result.error ?? 'Something went wrong — try again')
      setLoading(false)
      return
    }
    router.push(result.redirectUrl!)
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
