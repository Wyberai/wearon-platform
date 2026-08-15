'use client'

import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AUGUST_PRODUCTS } from '@/lib/august/catalog'
import { productToThemeProduct } from '@/lib/august/adapters'
import type { ThemeBrand, ThemeProduct } from '@/lib/august/types'

interface ChatMessage {
  role: 'user' | 'assistant'
  text: string
}

const PROMPTS = [
  'Something for a first client dinner',
  'Build me a considered wardrobe',
  'What pairs well together?',
]

export function AugustStylistDrawer({ brand, open, onClose }: { brand: ThemeBrand; open: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const catalogRef = useRef<ThemeProduct[] | null>(null)

  async function getCatalog(): Promise<ThemeProduct[]> {
    if (catalogRef.current) return catalogRef.current
    if (!brand.sellerId) {
      catalogRef.current = AUGUST_PRODUCTS
      return AUGUST_PRODUCTS
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

  async function send(query: string) {
    if (!query.trim() || streaming) return
    setMessages(prev => [...prev, { role: 'user', text: query }, { role: 'assistant', text: '' }])
    setInput('')
    setStreaming(true)

    try {
      const catalog = await getCatalog()
      const res = await fetch('/api/style-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
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
        const chunk = decoder.decode(value)
        setMessages(prev => {
          const next = [...prev]
          next[next.length - 1] = { role: 'assistant', text: next[next.length - 1].text + chunk }
          return next
        })
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
      }
    } catch {
      setMessages(prev => {
        const next = [...prev]
        next[next.length - 1] = { role: 'assistant', text: "Couldn't reach the stylist just now — try again in a moment." }
        return next
      })
    } finally {
      setStreaming(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[90]"
            style={{ background: 'rgba(0,0,0,0.4)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="august-glass fixed bottom-0 sm:bottom-6 right-0 sm:right-6 z-[91] w-full sm:w-[400px] h-[80vh] sm:h-[560px] sm:rounded-2xl border flex flex-col overflow-hidden"
            style={{ borderColor: 'var(--a-line)', color: 'var(--a-ink)' }}
            initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 320 }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--a-line)' }}>
              <div className="flex items-center gap-2">
                <span style={{ color: 'var(--a-accent)' }}>✦</span>
                <span className="august-serif text-base tracking-wide">Ask {brand.name}</span>
              </div>
              <button onClick={onClose} aria-label="Close" className="w-7 h-7 flex items-center justify-center hover:opacity-60 transition-opacity">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden><path d="M6 6l12 12M18 6L6 18"/></svg>
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
              {messages.length === 0 && (
                <div className="flex flex-col gap-4">
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--a-ink-muted)' }}>
                    Our AI stylist knows the full collection. Ask about an occasion, a fit, or what pairs with what.
                  </p>
                  <div className="flex flex-col gap-2">
                    {PROMPTS.map(p => (
                      <button
                        key={p}
                        onClick={() => send(p)}
                        className="text-left text-sm border rounded-full px-4 py-2.5 hover:opacity-70 transition-opacity"
                        style={{ borderColor: 'var(--a-line)' }}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={m.role === 'user' ? 'self-end max-w-[85%]' : 'self-start max-w-[85%]'}>
                  <div
                    className="text-sm leading-relaxed rounded-2xl px-4 py-2.5 whitespace-pre-wrap"
                    style={m.role === 'user'
                      ? { background: 'var(--a-ink)', color: 'var(--a-bg)' }
                      : { background: 'var(--a-card)', border: '1px solid var(--a-line)' }}
                  >
                    {m.text || (streaming && i === messages.length - 1 ? '…' : '')}
                  </div>
                </div>
              ))}
            </div>

            <form
              onSubmit={e => { e.preventDefault(); send(input) }}
              className="flex items-center gap-2 px-4 py-3 border-t"
              style={{ borderColor: 'var(--a-line)' }}
            >
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask about fit, fabric, an occasion…"
                className="flex-1 bg-transparent text-sm outline-none px-2 py-2"
                style={{ color: 'var(--a-ink)' }}
              />
              <button
                type="submit"
                disabled={streaming || !input.trim()}
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 disabled:opacity-40 transition-opacity"
                style={{ background: 'var(--a-ink)', color: 'var(--a-bg)' }}
                aria-label="Send"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M5 12h14M13 6l6 6-6 6"/></svg>
              </button>
            </form>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
