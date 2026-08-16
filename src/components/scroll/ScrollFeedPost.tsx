'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { ThemeProduct } from '@/lib/flagship/types'

const DOUBLE_TAP_WINDOW_MS = 320

// Real sellers on this theme render plain ThemeProduct objects with no
// caption/likes/comments (those are demo-only extras on SCROLL_PRODUCTS) —
// these fallbacks keep every post looking genuinely populated instead of
// showing "undefined" or a suspiciously identical number on every card.
function hashToRange(id: string, min: number, max: number): number {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0
  return min + (h % (max - min))
}
function getCaption(product: ThemeProduct): string {
  const extra = product as unknown as { caption?: string }
  return extra.caption ?? product.description ?? product.name
}
function getLikes(product: ThemeProduct): number {
  const extra = product as unknown as { likes?: number }
  return extra.likes ?? hashToRange(product.id, 400, 3200)
}
function getComments(product: ThemeProduct): number {
  const extra = product as unknown as { comments?: number }
  return extra.comments ?? hashToRange(product.id, 12, 140)
}

export function ScrollFeedPost({
  product, slug, brandHandle, liked, onToggleLike, onDM, timeLabel,
}: {
  product: ThemeProduct
  slug: string
  brandHandle: string
  liked: boolean
  onToggleLike: (productId: string) => void
  onDM: (product: ThemeProduct) => void
  timeLabel: string
}) {
  const [showHeart, setShowHeart] = useState(false)
  const [saved, setSaved] = useState(false)
  const lastTapRef = useRef(0)

  const likeCount = getLikes(product) + (liked ? 1 : 0)
  const caption = getCaption(product)

  function popHeart() {
    setShowHeart(true)
    setTimeout(() => setShowHeart(false), 700)
  }

  // Fires the same way for a real double-click (desktop) and two quick
  // taps (touch) — click events fire on tap-end in every mobile browser,
  // so timing two of them is a reliable cross-input double-tap detector
  // without needing separate touch-event plumbing.
  function handleImageTap() {
    const now = Date.now()
    if (now - lastTapRef.current < DOUBLE_TAP_WINDOW_MS) {
      if (!liked) onToggleLike(product.id)
      popHeart()
      lastTapRef.current = 0
    } else {
      lastTapRef.current = now
    }
  }

  return (
    <article className="border-b" style={{ borderColor: 'var(--sc-line)' }}>
      {/* Post header */}
      <div className="flex items-center justify-between px-3.5 py-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full flex items-center justify-center scroll-gradient flex-shrink-0">
            <span className="text-[11px] font-extrabold" style={{ color: 'var(--sc-accent-ink)' }}>{brandHandle.slice(0, 1).toUpperCase()}</span>
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold truncate">{brandHandle}</p>
            <p className="text-[11px] truncate" style={{ color: 'var(--sc-ink-dim)' }}>{product.category}</p>
          </div>
        </div>
        <button aria-label="More options" className="w-7 h-7 flex items-center justify-center flex-shrink-0" style={{ color: 'var(--sc-ink-muted)' }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>
        </button>
      </div>

      {/* Post image, double-tap to like */}
      <div
        className="relative w-full aspect-square select-none"
        style={{ background: 'var(--sc-card)' }}
        onClick={handleImageTap}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={e => { e.currentTarget.style.display = 'none' }}
        />
        {product.originalPrice && (
          <span className="absolute top-3 left-3 text-[10px] tracking-wide uppercase px-2.5 py-1 rounded-full font-bold scroll-gradient" style={{ color: 'var(--sc-accent-ink)' }}>Sale</span>
        )}
        <AnimatePresence>
          {showHeart && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1.15 }}
              exit={{ opacity: 0, scale: 1.3 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <svg width="88" height="88" viewBox="0 0 24 24" fill="#fff" style={{ filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.35))' }} aria-hidden>
                <path d="M12 21s-7.5-4.6-10-9.2C.5 8.4 2.2 5 5.6 5c2 0 3.6 1.2 4.4 2.6C10.8 6.2 12.4 5 14.4 5c3.4 0 5.1 3.4 3.6 6.8-2.5 4.6-10 9.2-10 9.2z"/>
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action row */}
      <div className="flex items-center justify-between px-3.5 pt-2.5">
        <div className="flex items-center gap-4">
          <button aria-label={liked ? 'Unlike' : 'Like'} onClick={() => onToggleLike(product.id)} className="flex items-center justify-center">
            {liked ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--sc-accent)" aria-hidden>
                <path d="M12 21s-7.5-4.6-10-9.2C.5 8.4 2.2 5 5.6 5c2 0 3.6 1.2 4.4 2.6C10.8 6.2 12.4 5 14.4 5c3.4 0 5.1 3.4 3.6 6.8-2.5 4.6-10 9.2-10 9.2z"/>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--sc-ink)" strokeWidth="1.6" aria-hidden>
                <path d="M12 21s-7.5-4.6-10-9.2C.5 8.4 2.2 5 5.6 5c2 0 3.6 1.2 4.4 2.6C10.8 6.2 12.4 5 14.4 5c3.4 0 5.1 3.4 3.6 6.8-2.5 4.6-10 9.2-10 9.2z"/>
              </svg>
            )}
          </button>
          <button aria-label="Comment" onClick={() => onDM(product)} className="flex items-center justify-center">
            <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="var(--sc-ink)" strokeWidth="1.6" aria-hidden>
              <path d="M21 11.5a8.5 8.5 0 01-8.5 8.5 8.4 8.4 0 01-3.9-.95L3 20l1.05-3.5A8.4 8.4 0 013 11.5 8.5 8.5 0 0111.5 3a8.5 8.5 0 019.5 8.5z"/>
            </svg>
          </button>
          <button
            aria-label="Share"
            onClick={() => { if (typeof navigator !== 'undefined' && navigator.share) navigator.share({ title: product.name, url: `/store/${slug}/product/${product.slug}` }).catch(() => {}) }}
            className="flex items-center justify-center"
          >
            <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="var(--sc-ink)" strokeWidth="1.6" aria-hidden>
              <path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/>
            </svg>
          </button>
        </div>
        <button aria-label={saved ? 'Remove bookmark' : 'Bookmark'} onClick={() => setSaved(s => !s)} className="flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill={saved ? 'var(--sc-ink)' : 'none'} stroke="var(--sc-ink)" strokeWidth="1.6" aria-hidden>
            <path d="M6 3.5h12a1 1 0 011 1V21l-7-4-7 4V4.5a1 1 0 011-1z"/>
          </svg>
        </button>
      </div>

      {/* Likes */}
      <p className="px-3.5 pt-2 text-[13px] font-semibold">{likeCount.toLocaleString('en-IN')} likes</p>

      {/* Caption */}
      <p className="px-3.5 pt-1 text-[13.5px] leading-snug" style={{ whiteSpace: 'pre-line' }}>
        <span className="font-semibold mr-1.5">{brandHandle}</span>
        {caption}
      </p>

      {/* CTAs */}
      <div className="flex items-center gap-2.5 px-3.5 pt-2.5">
        <Link
          href={`/store/${slug}/product/${product.slug}`}
          className="flex-1 text-center py-2 rounded-full text-[12.5px] font-bold border"
          style={{ borderColor: 'var(--sc-line)', color: 'var(--sc-ink)' }}
        >
          View product · ₹{product.price.toLocaleString('en-IN')}
        </Link>
        <button
          onClick={() => onDM(product)}
          className="flex-1 text-center py-2 rounded-full text-[12.5px] font-bold scroll-gradient"
          style={{ color: 'var(--sc-accent-ink)' }}
        >
          DM to order
        </button>
      </div>

      {/* Comments + timestamp */}
      <button onClick={() => onDM(product)} className="block px-3.5 pt-2 text-[13px]" style={{ color: 'var(--sc-ink-dim)' }}>
        View all {getComments(product).toLocaleString('en-IN')} comments
      </button>
      <p className="px-3.5 pt-1 pb-3.5 text-[10.5px] tracking-wide uppercase" style={{ color: 'var(--sc-ink-dim)' }}>{timeLabel}</p>
    </article>
  )
}
