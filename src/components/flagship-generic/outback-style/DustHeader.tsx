'use client'

import Link from 'next/link'
import { useFlagshipCart } from '@/lib/flagship/cart-context'
import type { ThemeBrand } from '@/lib/flagship/types'

// A faithful clone of R.M.Williams' real chrome: a full-width promo
// bar, a spaced-letter wordmark with an "EST." heritage subtitle
// (left), a search bar (center), and bag/menu icons (right).
export function DustHeader({ brand, mechanicLabel, onOpenMechanic }: { brand: ThemeBrand; mechanicLabel: string; onOpenMechanic: () => void }) {
  const slug = brand.slug
  const { count, openCart } = useFlagshipCart()

  return (
    <header className="sticky top-0 z-50" style={{ background: 'var(--fg-bg)' }}>
      <div className="h-8 flex items-center justify-center text-[11px] tracking-[0.04em] border-b" style={{ borderColor: 'var(--fg-line)', color: 'var(--fg-ink-dim)' }}>
        Free shipping on all orders $75 and over
      </div>
      <div className="px-4 md:px-8 h-16 flex items-center justify-between gap-4 border-b" style={{ borderColor: 'var(--fg-line)' }}>
        <Link href={`/store/${slug}`} className="flex flex-col leading-none flex-shrink-0">
          <span className="text-lg md:text-xl tracking-[0.15em] uppercase" style={{ color: 'var(--fg-ink)', fontWeight: 700 }}>{brand.name.split(' ').slice(0, 2).join(' ')}</span>
          <span className="text-[9px] uppercase tracking-[0.15em]" style={{ color: 'var(--fg-ink-dim)' }}>Est. Australia</span>
        </Link>
        <div className="hidden md:flex flex-1 max-w-sm mx-6 items-center gap-2 px-4 py-2 rounded-full border" style={{ borderColor: 'var(--fg-line)' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--fg-ink-dim)' }} aria-hidden><circle cx="11" cy="11" r="7.5" /><path d="M21 21l-4.8-4.8" /></svg>
          <span className="text-[13px]" style={{ color: 'var(--fg-ink-dim)' }}>I&rsquo;m searching for...</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={onOpenMechanic} className="hidden md:block text-[12px] uppercase tracking-[0.04em] font-semibold hover:opacity-60 transition-opacity" style={{ color: 'var(--fg-ink)' }}>
            {mechanicLabel}
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
