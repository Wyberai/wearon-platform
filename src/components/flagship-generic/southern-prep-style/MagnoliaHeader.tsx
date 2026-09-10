'use client'

import Link from 'next/link'
import { useFlagshipCart } from '@/lib/flagship/cart-context'
import type { ThemeBrand } from '@/lib/flagship/types'

// A faithful clone of draperjames.com's real chrome: a navy promo
// strip over a cream ground, a centered serif wordmark, and a full
// text nav row underneath — the quiet, ladylike Southern-brand framing.
export function MagnoliaHeader({ brand, mechanicLabel, onOpenMechanic }: { brand: ThemeBrand; mechanicLabel: string; onOpenMechanic: () => void }) {
  const slug = brand.slug
  const { count, openCart } = useFlagshipCart()
  const categories = brand.categories.length ? brand.categories : []

  return (
    <header className="sticky top-0 z-50" style={{ background: 'var(--fg-bg)' }}>
      <div className="h-8 flex items-center justify-center text-[11px] tracking-[0.04em] font-semibold" style={{ background: 'var(--fg-ink)', color: 'var(--fg-bg)' }}>
        Free Shipping on Orders Over $150
      </div>
      <div className="px-4 md:px-8 py-4 flex items-center justify-center relative">
        <Link href={`/store/${slug}`} className="text-2xl tracking-[0.08em] uppercase" style={{ color: 'var(--fg-ink)', fontWeight: 500 }}>
          {brand.name}
        </Link>
        <div className="absolute right-4 md:right-8 flex items-center gap-4">
          <button onClick={onOpenMechanic} aria-label={mechanicLabel} className="hidden md:block text-[11px] uppercase tracking-[0.04em] font-semibold hover:opacity-60 transition-opacity" style={{ color: 'var(--fg-ink)' }}>
            {mechanicLabel}
          </button>
          <button onClick={openCart} aria-label="Bag" className="relative hover:opacity-60 transition-opacity">
            <svg width="15" height="17" viewBox="0 0 24 26" fill="none" stroke="currentColor" strokeWidth="1.3" style={{ color: 'var(--fg-ink)' }} aria-hidden><path d="M6 8h12l1 15H5L6 8z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>
            {count > 0 && <span className="absolute -top-1.5 -right-2 text-[9px] w-4 h-4 rounded-full flex items-center justify-center" style={{ background: 'var(--fg-accent)', color: 'var(--fg-bg)' }}>{count}</span>}
          </button>
        </div>
      </div>
      <nav className="px-4 md:px-8 pb-3 flex flex-wrap justify-center gap-x-6 gap-y-1 text-[11px] uppercase tracking-[0.06em] font-semibold border-b" style={{ color: 'var(--fg-ink)', borderColor: 'var(--fg-line)' }}>
        {categories.map(c => (
          <Link key={c} href={`/store/${slug}/shop?category=${encodeURIComponent(c)}`} className="hover:opacity-60 transition-opacity">{c}</Link>
        ))}
      </nav>
    </header>
  )
}
