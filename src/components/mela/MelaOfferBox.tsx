'use client'

import { useState } from 'react'
import type { ThemeProduct } from '@/lib/flagship/types'

// MELA's signature mechanic. The buyer types a price, an in-character
// bazaar stall-owner haggles back — a real back-and-forth (max two rounds),
// never a form. All accept/counter/decline MATH happens here, client-side,
// deterministically, so the hidden floor (75-80% of listed price) can never
// be crossed no matter what any model says; /api/mela-offer is called only
// to phrase the decision already made (see that route's own comment).

type Decision = 'accept' | 'counter' | 'decline-soft' | 'decline-final'

interface ChatLine {
  from: 'buyer' | 'stall'
  text: string
}

function roundToTen(n: number) {
  return Math.round(n / 10) * 10
}

// Deterministic per-product floor in [75%, 80%] of listed price, derived
// from the product id so it's stable across renders/sessions without
// needing any extra catalog field — works identically for a real seller's
// own products, which won't carry a bespoke "floor price" field either.
function getFloor(product: ThemeProduct): number {
  let h = 0
  for (const ch of product.id) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  const frac = (h % 1000) / 1000
  const pct = 0.75 + frac * 0.05
  return Math.max(50, roundToTen(product.price * pct))
}

function decide(round: 1 | 2, offer: number, listed: number, floor: number, prevCounter: number | null): { decision: Decision; price: number } {
  if (offer >= listed) return { decision: 'accept', price: listed }

  if (round === 1) {
    if (offer >= floor) {
      const proposed = roundToTen(offer + (listed - offer) * 0.4)
      const counter = Math.min(listed - 10, Math.max(proposed, floor))
      if (counter <= offer) return { decision: 'accept', price: offer }
      return { decision: 'counter', price: counter }
    }
    return { decision: 'decline-soft', price: floor }
  }

  // Round 2 is terminal — accept or decline, no further countering.
  const target = prevCounter ?? floor
  if (offer >= target || offer >= floor) return { decision: 'accept', price: Math.max(offer, floor) }
  return { decision: 'decline-final', price: floor }
}

export function MelaOfferBox({ product, brandName, onDealAccepted }: { product: ThemeProduct; brandName: string; onDealAccepted: (price: number) => void }) {
  const floor = getFloor(product)
  const [open, setOpen] = useState(false)
  const [offerInput, setOfferInput] = useState('')
  const [round, setRound] = useState<1 | 2>(1)
  const [prevCounter, setPrevCounter] = useState<number | null>(null)
  const [lines, setLines] = useState<ChatLine[]>([])
  const [thinking, setThinking] = useState(false)
  const [resolved, setResolved] = useState<{ type: 'accepted' | 'declined'; price: number } | null>(null)

  async function submitOffer(e: React.FormEvent) {
    e.preventDefault()
    const offer = Math.round(Number(offerInput))
    if (!offer || offer <= 0) return

    const result = decide(round, offer, product.price, floor, prevCounter)
    setLines(prev => [...prev, { from: 'buyer', text: `Will you take ₹${offer.toLocaleString('en-IN')}?` }, { from: 'stall', text: '' }])
    setOfferInput('')
    setThinking(true)

    try {
      const res = await fetch('/api/mela-offer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: product.name,
          category: product.category,
          listedPrice: product.price,
          buyerOffer: offer,
          decision: result.decision,
          price: result.price,
          round,
        }),
      })

      if (!res.body) throw new Error('No stream')
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let acc = ''
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        acc += decoder.decode(value)
        setLines(prev => prev.map((l, i) => (i === prev.length - 1 ? { ...l, text: acc } : l)))
      }
    } catch {
      setLines(prev => prev.map((l, i) => (i === prev.length - 1 ? { ...l, text: `Line's busy — but ₹${result.price.toLocaleString('en-IN')} works for the ${product.name}.` } : l)))
    } finally {
      setThinking(false)
    }

    if (result.decision === 'accept') {
      setResolved({ type: 'accepted', price: result.price })
    } else if (result.decision === 'decline-final') {
      setResolved({ type: 'declined', price: result.price })
    } else {
      // counter or decline-soft: one more round allowed
      setPrevCounter(result.decision === 'counter' ? result.price : null)
      setRound(2)
    }
  }

  function reset() {
    setOpen(false)
    setOfferInput('')
    setRound(1)
    setPrevCounter(null)
    setLines([])
    setResolved(null)
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full py-4 rounded-full text-sm tracking-wide font-extrabold border-2 transition-transform hover:scale-[1.01] flex items-center justify-center gap-2"
        style={{ borderColor: 'var(--me-turquoise)', color: 'var(--me-turquoise)' }}
      >
        <span style={{ fontSize: 16 }}>💬</span> Make an Offer
      </button>
    )
  }

  return (
    <div className="rounded-xl border-2 overflow-hidden" style={{ borderColor: 'var(--me-turquoise)' }}>
      <div className="flex items-center justify-between px-4 py-3" style={{ background: 'var(--me-turquoise)' }}>
        <p className="text-sm font-extrabold" style={{ color: '#fff' }}>Haggle with the stall &mdash; {brandName}</p>
        <button onClick={reset} aria-label="Close" className="w-6 h-6 flex items-center justify-center hover:opacity-70" style={{ color: '#fff' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
      </div>

      <div className="p-4">
        {lines.length === 0 && (
          <p className="text-xs mb-3 font-medium" style={{ color: 'var(--me-ink-muted)' }}>
            Listed at ₹{product.price.toLocaleString('en-IN')}. Type what you actually want to pay — the stall-owner will haggle back.
          </p>
        )}

        {lines.length > 0 && (
          <div className="flex flex-col gap-2.5 mb-4 max-h-64 overflow-y-auto">
            {lines.map((l, i) => (
              <div key={i} className={`flex ${l.from === 'buyer' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className="max-w-[85%] text-sm px-3.5 py-2.5 rounded-2xl font-medium leading-snug"
                  style={
                    l.from === 'buyer'
                      ? { background: 'var(--me-ink)', color: 'var(--me-bg)', borderBottomRightRadius: 4 }
                      : { background: 'var(--me-card)', border: '1px solid var(--me-line)', color: 'var(--me-ink)', borderBottomLeftRadius: 4 }
                  }
                >
                  {l.text || (thinking && i === lines.length - 1 ? '…' : '')}
                </div>
              </div>
            ))}
          </div>
        )}

        {resolved ? (
          <div className="flex flex-col gap-2.5">
            <button
              onClick={() => onDealAccepted(resolved.price)}
              className="w-full py-3.5 rounded-full text-sm tracking-wide font-extrabold transition-transform hover:scale-[1.01]"
              style={{ background: 'var(--me-marigold)', color: 'var(--me-ink)' }}
            >
              Add to Bag at &#8377;{resolved.price.toLocaleString('en-IN')}
            </button>
            <button onClick={reset} className="text-xs font-semibold underline underline-offset-4 hover:opacity-70 self-center" style={{ color: 'var(--me-ink-dim)' }}>
              Start a new offer
            </button>
          </div>
        ) : (
          <form onSubmit={submitOffer} className="flex items-center gap-2">
            <span className="text-sm font-bold" style={{ color: 'var(--me-ink-dim)' }}>&#8377;</span>
            <input
              type="number"
              min={1}
              required
              disabled={thinking}
              value={offerInput}
              onChange={e => setOfferInput(e.target.value)}
              placeholder={round === 1 ? 'Your price' : 'Your best price'}
              className="flex-1 border-2 rounded-full px-4 py-2.5 text-sm font-semibold bg-transparent outline-none disabled:opacity-60"
              style={{ borderColor: 'var(--me-line)' }}
            />
            <button
              type="submit"
              disabled={thinking}
              className="px-5 py-2.5 rounded-full text-sm font-extrabold transition-transform hover:scale-105 disabled:opacity-60"
              style={{ background: 'var(--me-pink)', color: '#fff' }}
            >
              {thinking ? '…' : round === 1 ? 'Offer' : 'Final Offer'}
            </button>
          </form>
        )}

        {!resolved && round === 2 && !thinking && (
          <p className="text-[11px] mt-2.5 font-medium" style={{ color: 'var(--me-ink-dim)' }}>Last round — the stall-owner will accept or hold firm.</p>
        )}
      </div>
    </div>
  )
}
