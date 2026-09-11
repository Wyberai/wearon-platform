'use client'

import Link from 'next/link'
import { useFlagshipCart } from '@/lib/flagship/cart-context'
import type { ThemeBrand } from '@/lib/flagship/types'

// A faithful clone of Tekla's real chrome: a promo strip on top, a
// bold sans wordmark on the left, "New / Shop / About" text nav, and
// search/language/account/bag on the right.
export function HyggeHeader({ brand, mechanicLabel, onOpenMechanic }: { brand: ThemeBrand; mechanicLabel: string; onOpenMechanic: () => void }) {
  const slug = brand.slug
  const { count, openCart } = useFlagshipCart()

  return (
    <header className="sticky top-0 z-50" style={{ background: 'var(--fg-bg)' }}>
      <div className="h-8 flex items-center justify-center text-[11px] tracking-[0.02em]" style={{ background: 'var(--fg-card)', color: 'var(--fg-ink-dim)' }}>
        Free shipping for orders above $150
      </div>
      <div className="px-5 md:px-8 h-16 flex items-center justify-between border-b" style={{ borderColor: 'var(--fg-line)' }}>
        <div className="flex items-center gap-6">
          <Link href={`/store/${slug}`} className="text-lg tracking-[0.01em] uppercase" style={{ color: 'var(--fg-ink)', fontWeight: 800 }}>
            {brand.name.split(' ')[0]}
          </Link>
          <nav className="hidden md:flex items-center gap-5 text-[13px]" style={{ color: 'var(--fg-ink)' }}>
            <Link href={`/store/${slug}/shop`} className="hover:opacity-60 transition-opacity">New</Link>
            <Link href={`/store/${slug}/shop`} className="hover:opacity-60 transition-opacity">Shop</Link>
            <button onClick={onOpenMechanic} className="hover:opacity-60 transition-opacity">{mechanicLabel}</button>
          </nav>
        </div>
        <div className="flex items-center gap-4 text-[13px]" style={{ color: 'var(--fg-ink)' }}>
          <button aria-label="Search" className="hover:opacity-60 transition-opacity">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden><circle cx="11" cy="11" r="7.5" /><path d="M21 21l-4.8-4.8" /></svg>
          </button>
          <span className="hidden md:inline" style={{ color: 'var(--fg-ink-dim)' }}>EN</span>
          <button onClick={openCart} className="relative hover:opacity-60 transition-opacity">
            Cart ({count})
          </button>
        </div>
      </div>
    </header>
  )
}
