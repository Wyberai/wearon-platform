'use client'

import Link from 'next/link'
import { useFlagshipCart } from '@/lib/flagship/cart-context'
import type { ThemeBrand } from '@/lib/flagship/types'

// A faithful clone of barbour.com's real chrome: a small crest icon
// stacked above a serif wordmark with an "ESTABLISHED" subtitle, a
// search icon, and a plain-text nav row underneath (their real Men /
// Women / Dogs / Discover pattern).
export function HedgerowHeader({ brand, mechanicLabel, onOpenMechanic }: { brand: ThemeBrand; mechanicLabel: string; onOpenMechanic: () => void }) {
  const slug = brand.slug
  const { count, openCart } = useFlagshipCart()
  const categories = brand.categories.length ? brand.categories : []

  return (
    <header className="sticky top-0 z-50 border-b" style={{ background: 'var(--fg-bg)', borderColor: 'var(--fg-line)' }}>
      <div className="px-4 md:px-8 h-16 flex items-center justify-between gap-4">
        <Link href={`/store/${slug}`} className="flex flex-col items-start leading-none">
          <span className="text-xl tracking-[0.02em]" style={{ color: 'var(--fg-accent)', fontWeight: 700 }}>{brand.name}</span>
          <span className="text-[9px] uppercase tracking-[0.12em]" style={{ color: 'var(--fg-ink-dim)' }}>Established 1897</span>
        </Link>
        <Link href={`/store/${slug}/shop`} aria-label="Search" className="hover:opacity-60 transition-opacity">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--fg-ink)' }} aria-hidden><circle cx="11" cy="11" r="7.5" /><path d="M21 21l-4.8-4.8" /></svg>
        </Link>
        <button onClick={openCart} aria-label="Bag" className="relative hover:opacity-60 transition-opacity">
          <svg width="15" height="17" viewBox="0 0 24 26" fill="none" stroke="currentColor" strokeWidth="1.3" style={{ color: 'var(--fg-ink)' }} aria-hidden><path d="M6 8h12l1 15H5L6 8z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>
          {count > 0 && <span className="absolute -top-1.5 -right-2 text-[9px] w-4 h-4 rounded-full flex items-center justify-center" style={{ background: 'var(--fg-accent)', color: 'var(--fg-bg)' }}>{count}</span>}
        </button>
      </div>
      <nav className="px-4 md:px-8 pb-3 flex flex-wrap gap-x-6 gap-y-1 text-[13px]" style={{ color: 'var(--fg-ink)' }}>
        {categories.map(c => (
          <Link key={c} href={`/store/${slug}/shop?category=${encodeURIComponent(c)}`} className="hover:opacity-60 transition-opacity">{c}</Link>
        ))}
        <button onClick={onOpenMechanic} className="hover:opacity-60 transition-opacity">{mechanicLabel}</button>
      </nav>
    </header>
  )
}
