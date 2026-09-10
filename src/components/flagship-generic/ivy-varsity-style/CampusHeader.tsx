'use client'

import Link from 'next/link'
import { useFlagshipCart } from '@/lib/flagship/cart-context'
import type { ThemeBrand } from '@/lib/flagship/types'

// A faithful clone of rowingblazers.com's real chrome: a bold serif
// wordmark (left), a full text nav row of categories, and account/
// search/bag icons (right) — the collegiate-outfitter layout.
export function CampusHeader({ brand, mechanicLabel, onOpenMechanic }: { brand: ThemeBrand; mechanicLabel: string; onOpenMechanic: () => void }) {
  const slug = brand.slug
  const { count, openCart } = useFlagshipCart()
  const categories = brand.categories.length ? brand.categories : []

  return (
    <header className="sticky top-0 z-50 border-b" style={{ background: 'var(--fg-bg)', borderColor: 'var(--fg-line)' }}>
      <div className="px-4 md:px-8 h-16 flex items-center justify-between gap-4">
        <Link href={`/store/${slug}`} className="text-xl font-bold tracking-[0.01em]" style={{ color: 'var(--fg-ink)' }}>
          {brand.name}
        </Link>
        <nav className="hidden md:flex items-center gap-5 text-[12px] uppercase tracking-[0.04em] font-semibold" style={{ color: 'var(--fg-ink)' }}>
          {categories.map(c => (
            <Link key={c} href={`/store/${slug}/shop?category=${encodeURIComponent(c)}`} className="hover:opacity-60 transition-opacity">{c}</Link>
          ))}
          <span className="hover:opacity-60 transition-opacity" style={{ color: 'var(--fg-accent)' }}>Sale</span>
        </nav>
        <div className="flex items-center gap-4">
          <button onClick={onOpenMechanic} aria-label={mechanicLabel} className="hidden md:block text-[12px] uppercase tracking-[0.04em] font-semibold hover:opacity-60 transition-opacity" style={{ color: 'var(--fg-ink)' }}>
            {mechanicLabel}
          </button>
          <button aria-label="Search" className="hover:opacity-60 transition-opacity">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--fg-ink)' }} aria-hidden><circle cx="11" cy="11" r="7.5" /><path d="M21 21l-4.8-4.8" /></svg>
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
