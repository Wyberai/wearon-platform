'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

// The landing page's primary conversion action — captures a lead (email +
// brand name) then sends them into a personalized, no-login preview of
// their own store using the seeded demo dataset with their name swapped in.
export function StorePreviewCapture() {
  const [email, setEmail] = useState('')
  const [brandName, setBrandName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, brand_name: brandName }),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError(data.error ?? 'Something went wrong — try again')
      setLoading(false)
      return
    }

    const params = new URLSearchParams({ preview_name: brandName, preview_email: email })
    router.push(`/store/priyas-boutique?${params.toString()}`)
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 440, margin: '0 auto',
        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 20, padding: '28px 28px',
      }}
    >
      <input
        type="text"
        required
        value={brandName}
        onChange={e => setBrandName(e.target.value)}
        placeholder="Your boutique name (e.g. Priya's Boutique)"
        style={{
          padding: '13px 16px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.15)',
          background: 'rgba(255,255,255,0.06)', color: '#fff', fontSize: 14, outline: 'none',
        }}
      />
      <input
        type="email"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Your email"
        style={{
          padding: '13px 16px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.15)',
          background: 'rgba(255,255,255,0.06)', color: '#fff', fontSize: 14, outline: 'none',
        }}
      />
      {error && <p style={{ color: '#F87171', fontSize: 13, margin: 0 }}>{error}</p>}
      <button
        type="submit"
        disabled={loading}
        style={{
          padding: '14px 0', borderRadius: 12, background: '#A6134A', color: '#fff',
          fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer', opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? 'Loading your preview...' : 'See how my store would look →'}
      </button>
      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', textAlign: 'center', margin: 0 }}>
        No password, no signup — just a live preview.
      </p>
    </form>
  )
}
