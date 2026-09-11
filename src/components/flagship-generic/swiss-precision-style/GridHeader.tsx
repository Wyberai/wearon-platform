'use client'

import Link from 'next/link'
import { useFlagshipCart } from '@/lib/flagship/cart-context'
import type { ThemeBrand } from '@/lib/flagship/types'

// A faithful clone of Akris' real chrome: hamburger + search icons on
// the left, a spaced-letter wordmark rendered with hyphens between
// each character in the center ("A-K-R-I-S-" pattern), and
// account/wishlist/bag icons on the right.
export function GridHeader({ brand, mechanicLabel, onOpenMechanic }: { brand: ThemeBrand; mechanicLabel: string; onOpenMechanic: () => void }) {
  const slug = brand.slug
  const { count, openCart } = useFlagshipCart()
  const spaced = brand.name.split(' ')[0].toUpperCase().split('').join('-') + '-'

  return (
    <header className="sticky top-0 z-50 border-b" style={{ background: 'var(--fg-bg)', borderColor: 'var(--fg-line)' }}>
      <div className="px-5 md:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button aria-label="Menu" className="hover:opacity-60 transition-opacity" style={{ color: 'var(--fg-ink)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden><path d="M3 6h18M3 12h18M3 18h18" /></svg>
          </button>
          <button aria-label="Search" className="hover:opacity-60 transition-opacity" style={{ color: 'var(--fg-ink)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden><circle cx="11" cy="11" r="7.5" /><path d="M21 21l-4.8-4.8" /></svg>
          </button>
        </div>
        <Link href={`/store/${slug}`} className="absolute left-1/2 -translate-x-1/2 text-lg md:text-xl uppercase tracking-[0.05em]" style={{ color: 'var(--fg-ink)', fontWeight: 800 }}>
          {spaced}
        </Link>
        <div className="flex items-center gap-4">
          <button onClick={onOpenMechanic} className="hidden md:block text-[11px] uppercase tracking-[0.08em] hover:opacity-60 transition-opacity" style={{ color: 'var(--fg-ink-dim)' }}>
            {mechanicLabel}
          </button>
          <button aria-label="Account" className="hover:opacity-60 transition-opacity" style={{ color: 'var(--fg-ink)' }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" /></svg>
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
