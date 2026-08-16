'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { ThemeProduct } from '@/lib/flagship/types'

// "DM to order" — an in-app chat-bubble overlay mimicking a modern DM
// thread UI. This is a demo storefront with no live messaging backend, so
// Send only ever produces a local "Message sent" confirmation state — it
// never actually dispatches anywhere, and that's stated on-screen rather
// than implied.
export function ScrollDMSheet({ brandName, product, onClose }: { brandName: string; product: ThemeProduct; onClose: () => void }) {
  const [text, setText] = useState(`Hi! I'd like to order ${product.name}`)
  const [status, setStatus] = useState<'draft' | 'sending' | 'sent'>('draft')

  useEffect(() => {
    setText(`Hi! I'd like to order ${product.name}`)
    setStatus('draft')
  }, [product.id, product.name])

  function handleSend() {
    if (!text.trim() || status !== 'draft') return
    setStatus('sending')
    setTimeout(() => setStatus('sent'), 650)
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center"
        style={{ background: 'rgba(17,17,17,0.45)' }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="w-full sm:max-w-[380px] sm:rounded-2xl rounded-t-2xl flex flex-col overflow-hidden"
          style={{ background: 'var(--sc-bg)', maxHeight: '80vh' }}
          initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          onClick={e => e.stopPropagation()}
        >
          {/* Thread header */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b" style={{ borderColor: 'var(--sc-line)' }}>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full flex items-center justify-center scroll-gradient flex-shrink-0">
                <span className="text-xs font-extrabold" style={{ color: 'var(--sc-accent-ink)' }}>{brandName.slice(0, 1)}</span>
              </div>
              <div>
                <p className="text-sm font-semibold leading-tight">{brandName.toLowerCase()}</p>
                <p className="text-[11px] leading-tight" style={{ color: 'var(--sc-ink-dim)' }}>Active now</p>
              </div>
            </div>
            <button onClick={onClose} aria-label="Close" className="w-8 h-8 flex items-center justify-center hover:opacity-60 transition-opacity">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden><path d="M6 6l12 12M18 6L6 18"/></svg>
            </button>
          </div>

          {/* Thread body */}
          <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3" style={{ minHeight: 220 }}>
            {/* Product context bubble */}
            <div className="flex items-center gap-2.5 self-start max-w-[85%] p-2 rounded-2xl" style={{ background: 'var(--sc-card)' }}>
              <div className="w-11 h-11 rounded-lg overflow-hidden flex-shrink-0" style={{ background: 'var(--sc-line)' }}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={e => { e.currentTarget.style.display = 'none' }}
                />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold truncate">{product.name}</p>
                <p className="text-xs" style={{ color: 'var(--sc-ink-muted)' }}>₹{product.price.toLocaleString('en-IN')}</p>
              </div>
            </div>

            <div className="self-start max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm" style={{ background: 'var(--sc-card)' }}>
              Hey! Thanks for reaching out — ask us anything about this piece.
            </div>

            {(status === 'sending' || status === 'sent') && (
              <div className="self-end max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm scroll-gradient" style={{ color: 'var(--sc-accent-ink)' }}>
                {text}
              </div>
            )}

            {status === 'sent' && (
              <p className="self-end text-[11px]" style={{ color: 'var(--sc-ink-dim)' }}>Message sent ✓</p>
            )}
          </div>

          {/* Composer */}
          <div className="border-t px-3 py-3" style={{ borderColor: 'var(--sc-line)' }}>
            {status === 'sent' ? (
              <div className="text-center">
                <p className="text-sm font-semibold mb-0.5">Message sent</p>
                <p className="text-[11px] mb-3" style={{ color: 'var(--sc-ink-dim)' }}>
                  This is a demo storefront — no real DM backend. A live store would notify the seller here.
                </p>
                <button
                  onClick={onClose}
                  className="w-full py-3 rounded-full text-sm font-bold border"
                  style={{ borderColor: 'var(--sc-line)', color: 'var(--sc-ink)' }}
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="flex items-end gap-2">
                <textarea
                  value={text}
                  onChange={e => setText(e.target.value)}
                  rows={2}
                  disabled={status === 'sending'}
                  className="flex-1 resize-none rounded-2xl px-3.5 py-2.5 text-sm outline-none border"
                  style={{ borderColor: 'var(--sc-line)', background: 'var(--sc-card)', color: 'var(--sc-ink)' }}
                />
                <button
                  onClick={handleSend}
                  disabled={!text.trim() || status === 'sending'}
                  aria-label="Send"
                  className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 scroll-gradient disabled:opacity-50"
                  style={{ color: 'var(--sc-accent-ink)' }}
                >
                  {status === 'sending' ? (
                    <span className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'rgba(255,255,255,0.9)', borderTopColor: 'transparent' }} />
                  ) : (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/></svg>
                  )}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
