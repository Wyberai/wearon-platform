'use client'

import { useState } from 'react'
import { MechanicModal } from './MechanicModal'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'

// Reuses the same generic /api/style-ai endpoint EMBER's Mood Match and
// UTSAV's Gift Finder already call (it takes a plain query + brand_name +
// catalog, with a built-in demo-mode fallback when no OPENAI_API_KEY is
// set) — only the framing text differs per brand, so no new backend route
// is needed for this mechanic.
export function AiStylistMechanic({ brand, products, open, intro, onClose }: { brand: ThemeBrand; products: ThemeProduct[]; open: boolean; intro: string; onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [response, setResponse] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [asked, setAsked] = useState(false)

  async function ask(e?: React.FormEvent) {
    e?.preventDefault()
    if (!query.trim() || streaming) return
    setAsked(true)
    setResponse('')
    setStreaming(true)
    try {
      const res = await fetch('/api/style-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          brand_name: brand.name,
          catalog: products.slice(0, 10).map(p => ({ name: p.name, price: p.price, category: p.category, description: p.description })),
        }),
      })
      if (!res.ok || !res.body) throw new Error('Stylist unavailable')
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        setResponse(prev => prev + decoder.decode(value))
      }
    } catch {
      setResponse("Couldn't reach the stylist just now — try again in a moment.")
    } finally {
      setStreaming(false)
    }
  }

  function reset() {
    setAsked(false)
    setQuery('')
    setResponse('')
  }

  return (
    <MechanicModal open={open} title="Ask the Stylist" onClose={onClose}>
      {!asked ? (
        <form onSubmit={ask}>
          <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--fg-ink-muted)' }}>{intro}</p>
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="e.g. something for a weekend trip"
            className="w-full rounded-xl border px-4 py-3 text-sm bg-transparent outline-none mb-3"
            style={{ borderColor: 'var(--fg-line)' }}
          />
          <button type="submit" disabled={!query.trim()} className="w-full py-3 rounded-full text-sm tracking-wide font-semibold disabled:opacity-50" style={{ background: 'var(--fg-accent)', color: 'var(--fg-accent-ink)' }}>
            Ask
          </button>
        </form>
      ) : (
        <>
          <div className="text-sm leading-relaxed rounded-xl p-4 mb-4 min-h-[80px]" style={{ background: 'var(--fg-card)', border: '1px solid var(--fg-line)' }}>
            {response || (streaming ? '…' : '')}
          </div>
          <button onClick={reset} disabled={streaming} className="w-full py-3 rounded-full text-sm tracking-wide font-semibold disabled:opacity-50" style={{ background: 'var(--fg-accent)', color: 'var(--fg-accent-ink)' }}>
            Ask something else
          </button>
        </>
      )}
    </MechanicModal>
  )
}
