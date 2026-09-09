'use client'

import Link from 'next/link'
import { useFlagshipCart } from '@/lib/flagship/cart-context'
import type { ThemeBrand } from '@/lib/flagship/types'

// A faithful clone of loveshackfancy.com's real chrome: a two-tier header —
// top row (hamburger, serif wordmark, search/heart/bag icons), then a
// second plain-text category row underneath. No other Generic* header in
// this kit uses two tiers.
export function PrairieHeader({ brand, categories, mechanicLabel, onOpenMechanic }: { brand: ThemeBrand; categories: string[]; mechanicLabel: string; onOpenMechanic: () => void }) {
  const slug = brand.slug
  const { count, openCart } = useFlagshipCart()

  return (
    <header className="sticky top-0 z-50" style={{ background: 'var(--fg-bg)' }}>
      <div className="px-6 md:px-10 h-16 flex items-center justify-between gap-6 border-b" style={{ borderColor: 'var(--fg-line)' }}>
        <button aria-label="Menu" className="flex flex-col gap-1.5 w-5" style={{ color: 'var(--fg-ink)' }}>
          <span className="block h-[1.5px] w-full" style={{ background: 'currentColor' }} />
          <span className="block h-[1.5px] w-full" style={{ background: 'currentColor' }} />
          <span className="block h-[1.5px] w-full" style={{ background: 'currentColor' }} />
        </button>
        <Link href={`/store/${slug}`} className="text-xl tracking-[0.05em]" style={{ color: 'var(--fg-ink)', fontFamily: "'Playfair Display', serif" }}>
          {brand.name}
        </Link>
        <div className="flex items-center gap-4" style={{ color: 'var(--fg-ink)' }}>
          <button onClick={onOpenMechanic} className="hidden sm:inline hover:opacity-60 transition-opacity" aria-label={mechanicLabel}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden><circle cx="11" cy="11" r="7.5" /><path d="M21 21l-4.8-4.8" /></svg>
          </button>
          <button onClick={openCart} className="relative hover:opacity-60 transition-opacity" aria-label="Bag">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden><path d="M6 8h12l-1 13H7L6 8z" /><path d="M9 8V6a3 3 0 016 0v2" /></svg>
            {count > 0 && <span className="absolute -top-1.5 -right-1.5 text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold" style={{ background: 'var(--fg-accent)', color: 'var(--fg-accent-ink)' }}>{count}</span>}
          </button>
        </div>
      </div>
      <div className="px-6 md:px-10 h-11 flex items-center justify-center gap-7">
        {categories.map(c => (
          <Link key={c} href={`/store/${slug}/shop?category=${encodeURIComponent(c)}`} className="text-[13px] hover:opacity-60 transition-opacity" style={{ color: 'var(--fg-ink)' }}>
            {c}
          </Link>
        ))}
      </div>
    </header>
  )
}
