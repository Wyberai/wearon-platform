'use client'

import Link from 'next/link'
import { useFlagshipCart } from '@/lib/flagship/cart-context'
import type { ThemeBrand } from '@/lib/flagship/types'

// A faithful clone of trinaturk.com's real chrome: a bold-color promo
// strip over a dark secondary announcement bar, a bold condensed
// wordmark, and a full text nav row underneath — with search/account/
// wishlist/bag icons on the far right, exactly the real layout.
export function OceanHeader({ brand, mechanicLabel, onOpenMechanic }: { brand: ThemeBrand; mechanicLabel: string; onOpenMechanic: () => void }) {
  const slug = brand.slug
  const { count, openCart } = useFlagshipCart()
  const categories = brand.categories.length ? brand.categories : []

  return (
    <header className="sticky top-0 z-50" style={{ background: 'var(--fg-bg)' }}>
      <div className="h-8 flex items-center justify-center text-[11px] tracking-[0.04em] font-semibold text-center px-4" style={{ background: 'var(--fg-accent)', color: 'white' }}>
        FREE SHIPPING ON ORDERS OVER $150
      </div>
      <div className="h-7 flex items-center justify-center text-[10px] uppercase tracking-[0.08em] font-semibold" style={{ background: 'var(--fg-ink)', color: 'var(--fg-bg)' }}>
        New Arrivals: {brand.name}
      </div>
      <div className="px-4 md:px-8 pt-4 pb-2 flex items-center justify-between gap-4">
        <Link href={`/store/${slug}`} className="text-2xl font-bold tracking-[0.02em] uppercase" style={{ color: 'var(--fg-ink)' }}>
          {brand.name}
        </Link>
        <div className="flex items-center gap-4">
          <button onClick={onOpenMechanic} aria-label={mechanicLabel} className="text-[12px] uppercase tracking-[0.04em] font-semibold hover:opacity-60 transition-opacity hidden md:block" style={{ color: 'var(--fg-ink)' }}>
            {mechanicLabel}
          </button>
          <button aria-label="Search" className="hover:opacity-60 transition-opacity">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--fg-ink)' }} aria-hidden><circle cx="11" cy="11" r="7.5" /><path d="M21 21l-4.8-4.8" /></svg>
          </button>
          <button onClick={openCart} aria-label="Bag" className="relative hover:opacity-60 transition-opacity">
            <svg width="15" height="17" viewBox="0 0 24 26" fill="none" stroke="currentColor" strokeWidth="1.3" style={{ color: 'var(--fg-ink)' }} aria-hidden><path d="M6 8h12l1 15H5L6 8z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>
            {count > 0 && <span className="absolute -top-1.5 -right-2 text-[9px] w-4 h-4 rounded-full flex items-center justify-center" style={{ background: 'var(--fg-accent)', color: 'white' }}>{count}</span>}
          </button>
        </div>
      </div>
      <nav className="px-4 md:px-8 pb-3 flex flex-wrap gap-x-5 gap-y-1 text-[12px] uppercase tracking-[0.04em] font-semibold border-b" style={{ color: 'var(--fg-ink)', borderColor: 'var(--fg-line)' }}>
        {categories.map(c => (
          <Link key={c} href={`/store/${slug}/shop?category=${encodeURIComponent(c)}`} className="hover:opacity-60 transition-opacity">{c}</Link>
        ))}
      </nav>
    </header>
  )
}
