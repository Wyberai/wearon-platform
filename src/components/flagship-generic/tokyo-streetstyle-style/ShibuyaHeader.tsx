'use client'

import Link from 'next/link'
import { useFlagshipCart } from '@/lib/flagship/cart-context'
import type { ThemeBrand } from '@/lib/flagship/types'

// A faithful clone of shop.doverstreetmarket.com's real chrome: a tiny
// black house-shaped crest icon, then plain uppercase TEXT LABELS for
// every action — MENU / SEARCH / QUIZ / CART, no icon glyphs anywhere —
// under a massive bold condensed wordmark. The starkest, most
// typography-driven header in this kit.
export function ShibuyaHeader({ brand, mechanicLabel, onOpenMechanic }: { brand: ThemeBrand; mechanicLabel: string; onOpenMechanic: () => void }) {
  const slug = brand.slug
  const { count, openCart } = useFlagshipCart()

  return (
    <header className="sticky top-0 z-50 border-b-4" style={{ background: 'var(--fg-bg)', borderColor: 'var(--fg-ink)' }}>
      <div className="px-4 md:px-8 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="var(--fg-ink)" aria-hidden><path d="M12 2 L22 12 L18 12 L18 22 L6 22 L6 12 L2 12 Z" /></svg>
          <Link href={`/store/${slug}`} className="hidden md:block">
            <span className="text-[11px] uppercase tracking-[0.05em] font-bold" style={{ color: 'var(--fg-ink)' }}>Menu</span>
          </Link>
        </div>
        <Link href={`/store/${slug}`} className="text-3xl md:text-5xl uppercase leading-none text-center" style={{ color: 'var(--fg-ink)', fontWeight: 900, letterSpacing: '-0.02em' }}>
          {brand.name}
        </Link>
        <div className="flex items-center gap-4">
          <button onClick={onOpenMechanic} className="text-[11px] uppercase tracking-[0.05em] font-bold hover:opacity-60 transition-opacity hidden md:block" style={{ color: 'var(--fg-ink)' }}>
            {mechanicLabel}
          </button>
          <button onClick={openCart} className="text-[11px] uppercase tracking-[0.05em] font-bold hover:opacity-60 transition-opacity" style={{ color: 'var(--fg-ink)' }}>
            Cart ({count})
          </button>
        </div>
      </div>
    </header>
  )
}
