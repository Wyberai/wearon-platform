'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { submitPreviewLead, type PreviewTheme } from '@/lib/preview-utils'

const ACCENT = '#A6134A'
const INK = '#111010'

// Shopify keeps "Enter your email" visible via a floating bar the entire
// time you scroll the page — this is that pattern, adapted to our actual
// mechanic (a theme is already chosen above) instead of a redundant generic
// field. Rendered by ThemePicker once the inline capture box scrolls out of
// view, and stays pinned through every section below down to the footer.
export function StickyCaptureBar({ theme }: { theme: PreviewTheme }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

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
    <div style={{ position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 40, background: INK, borderTop: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 -8px 24px rgba(0,0,0,0.15)' }}>
      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: 720, margin: '0 auto', padding: '12px 20px',
          display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
        }}
      >
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', flexShrink: 0, whiteSpace: 'nowrap' }}>
          Your look: <strong style={{ color: '#fff' }}>{theme.name}</strong>
        </span>
        <input
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Your email"
          style={{
            flex: '1 1 180px', minWidth: 140, padding: '10px 14px', borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)',
            color: '#fff', fontSize: 13, outline: 'none',
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 18px', borderRadius: 10, background: ACCENT, color: '#fff',
            fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer', opacity: loading ? 0.6 : 1,
            whiteSpace: 'nowrap', flexShrink: 0,
          }}
        >
          {loading ? 'Loading...' : 'See my store →'}
        </button>
        {error && (
          <p style={{ color: '#F87171', fontSize: 12, margin: 0, width: '100%' }}>{error}</p>
        )}
      </form>
    </div>
  )
}
