'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useFlagshipCart } from '@/lib/flagship/cart-context'
import type { ThemeBrand } from '@/lib/flagship/types'

const MARQUEE = ['FREE SHIPPING OVER $75', 'NEW DROPS EVERY FRIDAY', 'UP TO 50% OFF NIGHT OUT']

// A faithful clone of motelrocks.com's real chrome: a rotating marquee
// promo strip above the header, then hamburger + plain-text category
// links (left), a lowercase script wordmark (center), and search/
// account/wishlist/bag icons (right).
export function GangnamHeader({ brand, mechanicLabel, onOpenMechanic }: { brand: ThemeBrand; mechanicLabel: string; onOpenMechanic: () => void }) {
  const slug = brand.slug
  const { count, openCart } = useFlagshipCart()
  const [i] = useState(0)
  const categories = brand.categories.length ? brand.categories.slice(0, 3) : []

  return (
    <header className="sticky top-0 z-50" style={{ background: 'var(--fg-bg)' }}>
      <div className="h-8 flex items-center justify-center overflow-hidden text-[11px] tracking-[0.05em] font-semibold" style={{ background: 'var(--fg-accent)', color: 'var(--fg-bg)' }}>
        {MARQUEE[i]}
      </div>
      <div className="px-4 md:px-8 h-16 flex items-center justify-between gap-4 border-b" style={{ borderColor: 'var(--fg-line)' }}>
        <div className="flex items-center gap-4">
          <button aria-label="Menu" className="hover:opacity-60 transition-opacity md:hidden">
            <svg width="20" height="14" viewBox="0 0 24 16" fill="none" stroke="currentColor" strokeWidth="1.3" style={{ color: 'var(--fg-ink)' }} aria-hidden><line x1="0" y1="1" x2="24" y2="1" /><line x1="0" y1="8" x2="24" y2="8" /><line x1="0" y1="15" x2="24" y2="15" /></svg>
          </button>
          <nav className="hidden md:flex items-center gap-4 text-[12px] uppercase tracking-[0.04em] font-semibold" style={{ color: 'var(--fg-ink)' }}>
            {categories.map(c => (
              <Link key={c} href={`/store/${slug}/shop?category=${encodeURIComponent(c)}`} className="hover:opacity-60 transition-opacity">{c}</Link>
            ))}
          </nav>
        </div>
        <Link href={`/store/${slug}`} className="text-3xl italic lowercase" style={{ color: 'var(--fg-accent)', fontWeight: 600 }}>
          {brand.name}
        </Link>
        <div className="flex items-center gap-4">
          <button aria-label="Search" className="hover:opacity-60 transition-opacity hidden md:block">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--fg-ink)' }} aria-hidden><circle cx="11" cy="11" r="7.5" /><path d="M21 21l-4.8-4.8" /></svg>
          </button>
          <button onClick={onOpenMechanic} aria-label={mechanicLabel} className="hover:opacity-60 transition-opacity">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--fg-ink)' }} aria-hidden><path d="M12 22s-9-5.6-9-12.6C3 5.5 6 3 9 3c1.7 0 3 1 3 1s1.3-1 3-1c3 0 6 2.5 6 6.4C21 16.4 12 22 12 22z" /></svg>
          </button>
          <button onClick={openCart} aria-label="Bag" className="relative hover:opacity-60 transition-opacity">
            <svg width="16" height="18" viewBox="0 0 24 26" fill="none" stroke="currentColor" strokeWidth="1.3" style={{ color: 'var(--fg-ink)' }} aria-hidden><path d="M6 8h12l1 15H5L6 8z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>
            {count > 0 && <span className="absolute -top-1.5 -right-2 text-[9px] w-4 h-4 rounded-full flex items-center justify-center" style={{ background: 'var(--fg-accent)', color: 'var(--fg-bg)' }}>{count}</span>}
          </button>
        </div>
      </div>
    </header>
  )
}
