'use client'

import Link from 'next/link'
import { useFlagshipCart } from '@/lib/flagship/cart-context'
import type { ThemeBrand } from '@/lib/flagship/types'

// A faithful clone of kinlochanderson.com's real chrome: a crest-style
// emblem beside a bold serif wordmark with a "SCOTLAND" subtitle, a
// thin heritage/delivery info bar, and a full text nav row with a
// highlighted "Find Your Tartan" link on the far right — their real
// personalization CTA, wired here to the store's mechanic.
export function GlenmoreHeader({ brand, mechanicLabel, onOpenMechanic }: { brand: ThemeBrand; mechanicLabel: string; onOpenMechanic: () => void }) {
  const slug = brand.slug
  const { count, openCart } = useFlagshipCart()
  const categories = brand.categories.length ? brand.categories : []

  return (
    <header className="sticky top-0 z-50" style={{ background: 'var(--fg-bg)' }}>
      <div className="px-4 md:px-8 h-20 flex items-center justify-between gap-4 border-b" style={{ borderColor: 'var(--fg-line)' }}>
        <Link href={`/store/${slug}`} className="flex items-center gap-3">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--fg-accent)" strokeWidth="1.2" aria-hidden><path d="M12 2 4 5v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V5l-8-3z" /><path d="M9 12l2 2 4-4" /></svg>
          <span className="flex flex-col leading-none">
            <span className="text-lg font-bold" style={{ color: 'var(--fg-ink)' }}>{brand.name}</span>
            <span className="text-[9px] uppercase tracking-[0.2em]" style={{ color: 'var(--fg-ink-dim)' }}>Scotland</span>
          </span>
        </Link>
        <button onClick={openCart} aria-label="Bag" className="relative hover:opacity-60 transition-opacity">
          <svg width="15" height="17" viewBox="0 0 24 26" fill="none" stroke="currentColor" strokeWidth="1.3" style={{ color: 'var(--fg-ink)' }} aria-hidden><path d="M6 8h12l1 15H5L6 8z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>
          {count > 0 && <span className="absolute -top-1.5 -right-2 text-[9px] w-4 h-4 rounded-full flex items-center justify-center" style={{ background: 'var(--fg-accent)', color: 'var(--fg-bg)' }}>{count}</span>}
        </button>
      </div>
      <div className="px-4 md:px-8 h-8 hidden md:flex items-center gap-8 text-[11px]" style={{ color: 'var(--fg-ink-dim)' }}>
        <span>150 Years in Edinburgh, Scotland</span>
        <span>Free Delivery for all UK mainland orders over £100</span>
      </div>
      <nav className="px-4 md:px-8 pb-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-b" style={{ borderColor: 'var(--fg-line)' }}>
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-[13px]" style={{ color: 'var(--fg-ink)' }}>
          {categories.map(c => (
            <Link key={c} href={`/store/${slug}/shop?category=${encodeURIComponent(c)}`} className="hover:opacity-60 transition-opacity">{c}</Link>
          ))}
        </div>
        <button onClick={onOpenMechanic} className="text-[13px] font-semibold underline underline-offset-4" style={{ color: 'var(--fg-accent)' }}>
          {mechanicLabel}
        </button>
      </nav>
    </header>
  )
}
