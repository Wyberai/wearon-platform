'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { EMBER_PRODUCTS, MOODS } from '@/lib/ember/catalog'
import { productToThemeProduct } from '@/lib/flagship/adapters'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'

type Mood = (typeof MOODS)[number]

export function EmberMoodMatch({ brand, open, initialMoodKey, onClose }: { brand: ThemeBrand; open: boolean; initialMoodKey?: string | null; onClose: () => void }) {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null)
  const [response, setResponse] = useState('')
  const [streaming, setStreaming] = useState(false)
  const catalogRef = useRef<ThemeProduct[] | null>(null)

  async function getCatalog(): Promise<ThemeProduct[]> {
    if (catalogRef.current) return catalogRef.current
    if (!brand.sellerId) {
      catalogRef.current = EMBER_PRODUCTS
      return EMBER_PRODUCTS
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

  async function pickMood(mood: Mood) {
    setSelectedMood(mood)
    setResponse('')
    setStreaming(true)

    try {
      const catalog = await getCatalog()
      const res = await fetch('/api/style-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `I'm feeling ${mood.label.toLowerCase()} today. Put together one outfit from the collection for that mood, and tell me in one or two sentences why it fits.`,
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
    if (!open || !initialMoodKey) return
    const mood = MOODS.find(m => m.key === initialMoodKey)
    if (mood) pickMood(mood)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialMoodKey])

  function reset() {
    setSelectedMood(null)
    setResponse('')
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[90]"
            style={{ background: 'rgba(0,0,0,0.6)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="ember-glass fixed bottom-0 sm:bottom-6 left-1/2 -translate-x-1/2 z-[91] w-full sm:w-[440px] sm:rounded-2xl border overflow-hidden"
            style={{ borderColor: 'var(--e-line)', color: 'var(--e-ink)' }}
            initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 320 }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--e-line)' }}>
              <span className="ember-display text-base tracking-tight" style={{ fontWeight: 800 }}>Mood Match</span>
              <button onClick={onClose} aria-label="Close" className="w-7 h-7 flex items-center justify-center hover:opacity-60 transition-opacity">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden><path d="M6 6l12 12M18 6L6 18"/></svg>
              </button>
            </div>

            <div className="p-5">
              {!selectedMood ? (
                <>
                  <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--e-ink-muted)' }}>
                    How do you feel today? We&apos;ll build the outfit.
                  </p>
                  <div className="grid grid-cols-3 gap-2.5">
                    {MOODS.map(m => (
                      <button
                        key={m.key}
                        onClick={() => pickMood(m)}
                        className="flex flex-col items-center gap-1.5 rounded-xl border py-4 transition-transform hover:scale-[1.04]"
                        style={{ borderColor: 'var(--e-line)', background: 'var(--e-card)' }}
                      >
                        <span style={{ fontSize: 22 }}>{m.emoji}</span>
                        <span className="text-xs tracking-wide uppercase font-medium">{m.label}</span>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <span style={{ fontSize: 20 }}>{selectedMood.emoji}</span>
                    <span className="text-sm font-medium">Feeling {selectedMood.label.toLowerCase()}</span>
                  </div>
                  <div
                    className="text-sm leading-relaxed rounded-xl p-4 mb-4 min-h-[80px]"
                    style={{ background: 'var(--e-card)', border: '1px solid var(--e-line)' }}
                  >
                    {response || (streaming ? '…' : '')}
                  </div>
                  <button
                    onClick={reset}
                    disabled={streaming}
                    className="w-full py-3 rounded-full text-sm tracking-wide font-semibold transition-transform hover:scale-[1.02] disabled:opacity-50 ember-glow"
                    style={{ background: 'var(--e-accent)', color: 'var(--e-accent-ink)' }}
                  >
                    Try another mood
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
