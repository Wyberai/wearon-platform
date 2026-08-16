'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AARAM_PRODUCTS, DAY_TYPES } from '@/lib/aaram/catalog'
import { productToThemeProduct } from '@/lib/flagship/adapters'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'

type DayType = (typeof DAY_TYPES)[number]

// Signature AI feature: "Day Match" — tap ONE day-type chip and get one
// AI-recommended outfit with a short reasoning sentence about the
// comfort-vs-presentable tradeoff for that kind of day. Same tap-a-chip
// shape as Ember's Mood Match, but a day-type/schedule mental model rather
// than a mood/feeling one, and the model is explicitly asked to reason
// about ease vs. polish rather than emotional resonance.
export function AaramDayMatch({ brand, open, initialDayKey, onClose }: { brand: ThemeBrand; open: boolean; initialDayKey?: string | null; onClose: () => void }) {
  const [selectedDay, setSelectedDay] = useState<DayType | null>(null)
  const [response, setResponse] = useState('')
  const [streaming, setStreaming] = useState(false)
  const catalogRef = useRef<ThemeProduct[] | null>(null)

  async function getCatalog(): Promise<ThemeProduct[]> {
    if (catalogRef.current) return catalogRef.current
    if (!brand.sellerId) {
      catalogRef.current = AARAM_PRODUCTS
      return AARAM_PRODUCTS
    }
    try {
      const res = await fetch(`/api/store/products?slug=${brand.slug}`)
      const data = await res.json()
      const products = (data.products ?? []).map(productToThemeProduct)
      catalogRef.current = products
      return products
    } catch {
      return []
    }
  }

  async function pickDay(day: DayType) {
    setSelectedDay(day)
    setResponse('')
    setStreaming(true)

    try {
      const catalog = await getCatalog()
      const res = await fetch('/api/style-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `Today is a "${day.label}" kind of day. Recommend exactly one outfit from the collection for that day, then explain in one or two sentences the comfort-vs-presentable tradeoff — how much ease it gives up (or keeps) versus how put-together it looks — and why that's the right balance for this specific day type.`,
          brand_name: brand.name,
          catalog: catalog.map(p => ({ name: p.name, price: p.price, category: p.category, description: p.description })),
        }),
      })

      if (!res.body) throw new Error('No stream')
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

  useEffect(() => {
    if (!open || !initialDayKey) return
    const day = DAY_TYPES.find(d => d.key === initialDayKey)
    if (day) pickDay(day)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialDayKey])

  function reset() {
    setSelectedDay(null)
    setResponse('')
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[90]"
            style={{ background: 'rgba(46,42,38,0.45)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="aaram-glass fixed bottom-0 sm:bottom-6 left-1/2 -translate-x-1/2 z-[91] w-full sm:w-[440px] sm:rounded-2xl border overflow-hidden"
            style={{ borderColor: 'var(--ar-line)', color: 'var(--ar-ink)' }}
            initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 320 }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--ar-line)' }}>
              <span className="aaram-display text-base tracking-tight">Day Match</span>
              <button onClick={onClose} aria-label="Close" className="w-7 h-7 flex items-center justify-center hover:opacity-60 transition-opacity">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden><path d="M6 6l12 12M18 6L6 18"/></svg>
              </button>
            </div>

            <div className="p-5">
              {!selectedDay ? (
                <>
                  <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--ar-ink-muted)' }}>
                    What kind of day is it? We&apos;ll pick the outfit that fits it.
                  </p>
                  <div className="grid grid-cols-3 gap-2.5">
                    {DAY_TYPES.map(d => (
                      <button
                        key={d.key}
                        onClick={() => pickDay(d)}
                        className="flex flex-col items-center gap-1.5 rounded-xl border py-4 transition-transform hover:scale-[1.04]"
                        style={{ borderColor: 'var(--ar-line)', background: 'var(--ar-card)' }}
                      >
                        <span style={{ fontSize: 22 }}>{d.emoji}</span>
                        <span className="text-xs tracking-wide uppercase font-medium text-center leading-tight">{d.label}</span>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <span style={{ fontSize: 20 }}>{selectedDay.emoji}</span>
                    <span className="text-sm font-medium">{selectedDay.label}</span>
                  </div>
                  <div
                    className="text-sm leading-relaxed rounded-xl p-4 mb-4 min-h-[80px]"
                    style={{ background: 'var(--ar-card)', border: '1px solid var(--ar-line)' }}
                  >
                    {response || (streaming ? '…' : '')}
                  </div>
                  <button
                    onClick={reset}
                    disabled={streaming}
                    className="w-full py-3 rounded-full text-sm tracking-wide font-semibold transition-transform hover:scale-[1.02] disabled:opacity-50"
                    style={{ background: 'var(--ar-accent)', color: 'var(--ar-accent-ink)' }}
                  >
                    Try another day
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
