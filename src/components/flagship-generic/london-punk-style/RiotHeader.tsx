'use client'

import Link from 'next/link'
import { useFlagshipCart } from '@/lib/flagship/cart-context'
import type { ThemeBrand } from '@/lib/flagship/types'

// A faithful clone of viviennewestwood.com's real chrome: a black
// promo strip, then "Menu" text + search icon (left), a small orb/
// crest mark stacked above a two-line serif centered wordmark, and
// account/wishlist/bag icons (right) — the same quiet-couture framing
// Westwood gives her own punk archive.
export function RiotHeader({ brand, mechanicLabel, onOpenMechanic }: { brand: ThemeBrand; mechanicLabel: string; onOpenMechanic: () => void }) {
  const slug = brand.slug
  const { count, openCart } = useFlagshipCart()
  const words = brand.name.split(' ')
  const mid = Math.ceil(words.length / 2)

  return (
    <header className="sticky top-0 z-50" style={{ background: 'var(--fg-bg)' }}>
      <div className="h-8 flex items-center justify-center text-[11px] tracking-[0.04em] font-semibold text-center px-4" style={{ background: 'var(--fg-ink)', color: 'var(--fg-bg)' }}>
        COMPLIMENTARY DELIVERY ON ORDERS OVER $250
      </div>
      <div className="px-4 md:px-8 h-20 flex items-center justify-between gap-4 border-b" style={{ borderColor: 'var(--fg-line)' }}>
        <div className="flex items-center gap-4 flex-1">
          <span className="text-[12px] uppercase tracking-[0.04em] font-semibold" style={{ color: 'var(--fg-ink)' }}>Menu</span>
          <button aria-label="Search" className="hover:opacity-60 transition-opacity">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--fg-ink)' }} aria-hidden><circle cx="11" cy="11" r="7.5" /><path d="M21 21l-4.8-4.8" /></svg>
          </button>
        </div>
        <Link href={`/store/${slug}`} className="flex flex-col items-center leading-none">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--fg-accent)" strokeWidth="1.3" className="mb-1" aria-hidden><circle cx="12" cy="12" r="8" /><ellipse cx="12" cy="12" rx="8" ry="3" /></svg>
          <span className="text-lg italic" style={{ color: 'var(--fg-ink)', fontWeight: 500 }}>{words.slice(0, mid).join(' ')}</span>
          <span className="text-lg italic" style={{ color: 'var(--fg-ink)', fontWeight: 500 }}>{words.slice(mid).join(' ')}</span>
        </Link>
        <div className="flex-1 flex justify-end items-center gap-4">
          <button onClick={onOpenMechanic} aria-label={mechanicLabel} className="hover:opacity-60 transition-opacity hidden md:block">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--fg-ink)' }} aria-hidden><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z" /></svg>
          </button>
          <button onClick={openCart} aria-label="Bag" className="relative hover:opacity-60 transition-opacity">
            <svg width="15" height="17" viewBox="0 0 24 26" fill="none" stroke="currentColor" strokeWidth="1.3" style={{ color: 'var(--fg-ink)' }} aria-hidden><path d="M6 8h12l1 15H5L6 8z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>
            {count > 0 && <span className="absolute -top-1.5 -right-2 text-[9px] w-4 h-4 rounded-full flex items-center justify-center" style={{ background: 'var(--fg-accent)', color: 'var(--fg-bg)' }}>{count}</span>}
          </button>
        </div>
      </div>
    </header>
  )
}
