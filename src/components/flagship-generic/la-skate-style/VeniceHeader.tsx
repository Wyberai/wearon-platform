'use client'

import Link from 'next/link'
import { useFlagshipCart } from '@/lib/flagship/cart-context'
import type { ThemeBrand } from '@/lib/flagship/types'

// A faithful clone of santacruzskateboards.com's real chrome: a black
// promo strip, a circular badge-style wordmark seal (left, standing in
// for their real flame-dot logo), plain-text nav pills for categories,
// and cart/search icons (right).
export function VeniceHeader({ brand, mechanicLabel, onOpenMechanic }: { brand: ThemeBrand; mechanicLabel: string; onOpenMechanic: () => void }) {
  const slug = brand.slug
  const { count, openCart } = useFlagshipCart()
  const categories = brand.categories.length ? brand.categories.slice(0, 3) : []

  return (
    <header className="sticky top-0 z-50" style={{ background: 'var(--fg-bg)' }}>
      <div className="h-8 flex items-center justify-center text-[11px] tracking-[0.04em] font-semibold" style={{ background: 'var(--fg-ink)', color: 'var(--fg-bg)' }}>
        FREE SHIPPING ON ORDERS OVER $85 &amp; 60-DAY RETURNS
      </div>
      <div className="px-4 md:px-8 h-16 flex items-center justify-between gap-4 border-b" style={{ borderColor: 'var(--fg-line)' }}>
        <Link href={`/store/${slug}`} className="flex items-center justify-center w-11 h-11 rounded-full flex-shrink-0 text-[9px] uppercase font-bold text-center leading-tight" style={{ background: 'var(--fg-accent)', color: 'var(--fg-bg)' }}>
          {brand.name.split(' ')[0]}
        </Link>
        <nav className="hidden md:flex items-center gap-5 text-[12px] uppercase tracking-[0.04em] font-semibold" style={{ color: 'var(--fg-ink)' }}>
          {categories.map(c => (
            <Link key={c} href={`/store/${slug}/shop?category=${encodeURIComponent(c)}`} className="hover:opacity-60 transition-opacity">{c}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <button onClick={onOpenMechanic} aria-label={mechanicLabel} className="hidden md:block text-[12px] uppercase tracking-[0.04em] font-semibold hover:opacity-60 transition-opacity" style={{ color: 'var(--fg-ink)' }}>
            {mechanicLabel}
          </button>
          <button onClick={openCart} aria-label="Cart" className="relative hover:opacity-60 transition-opacity">
            <svg width="16" height="18" viewBox="0 0 24 26" fill="none" stroke="currentColor" strokeWidth="1.3" style={{ color: 'var(--fg-ink)' }} aria-hidden><path d="M6 8h12l1 15H5L6 8z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>
            {count > 0 && <span className="absolute -top-1.5 -right-2 text-[9px] w-4 h-4 rounded-full flex items-center justify-center" style={{ background: 'var(--fg-accent)', color: 'var(--fg-bg)' }}>{count}</span>}
          </button>
        </div>
      </div>
    </header>
  )
}
