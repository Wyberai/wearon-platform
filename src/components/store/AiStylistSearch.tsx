'use client'

import { useState } from 'react'

interface AgentProduct {
  id: string
  name: string
  image_url: string
  price: number
  currency: string
  product_url: string
}

const PLACEHOLDERS = [
  'What should I wear for a wedding today?',
  'Something for a beach vacation',
  'I need an office-ready outfit',
  'Date night look, nothing too loud',
]

// Theme-native by design: every color/font here reads from the same CSS
// custom properties (--store-bg/--store-ink/--primary/--store-font) that
// StorePageContent already sets per-seller, so this looks native to
// whichever of the 12 themes a seller picked without per-theme variants.
export function AiStylistSearch({ slug }: { slug: string }) {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<AgentProduct[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [dismissed, setDismissed] = useState(false)

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim() || loading) return
    setLoading(true)
    setError(null)
    setResults(null)
    try {
      const res = await fetch(`/api/store/${slug}/ai-search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (data.code === 'NOT_ELIGIBLE') { setDismissed(true); return }
        setError(data.error ?? 'Search failed')
        return
      }
      setResults(data.results ?? [])
    } catch {
      setError('Search failed — try again')
    }
    setLoading(false)
  }

  if (dismissed) return null

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 20px' }}>
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8 }}>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={PLACEHOLDERS[0]}
          style={{
            flex: 1, padding: '12px 16px', borderRadius: 999, fontSize: 14,
            border: '1px solid var(--store-ink, #171512)', borderColor: 'color-mix(in srgb, var(--store-ink, #171512) 15%, transparent)',
            background: 'var(--store-bg, #fff)', color: 'var(--store-ink, #171512)',
            fontFamily: 'var(--store-font, inherit)', outline: 'none',
          }}
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          style={{
            padding: '12px 20px', borderRadius: 999, fontSize: 13, fontWeight: 600,
            background: 'var(--primary, #A6134A)', color: '#fff', border: 'none',
            cursor: 'pointer', opacity: loading || !query.trim() ? 0.6 : 1, flexShrink: 0,
          }}
        >
          {loading ? '...' : 'Ask'}
        </button>
      </form>

      {error && <p style={{ fontSize: 13, color: '#dc2626', marginTop: 10 }}>{error}</p>}

      {results && (
        <div style={{ marginTop: 20 }}>
          {results.length === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--store-ink, #171512)', opacity: 0.6 }}>Nothing matched — try describing it differently.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
              {results.map(p => (
                <a key={p.id} href={p.product_url} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ aspectRatio: '3/4', borderRadius: 12, overflow: 'hidden', background: '#f2f2f2', marginBottom: 6 }}>
                    <img src={p.image_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--store-ink, #171512)', fontFamily: 'var(--store-font, inherit)' }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--primary, #A6134A)', fontWeight: 700 }}>{p.currency === 'USD' ? '$' : '₹'}{p.price.toLocaleString('en-IN')}</div>
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
