'use client'

import Link from 'next/link'
import { useFlagshipCart } from '@/lib/flagship/cart-context'
import type { ThemeBrand } from '@/lib/flagship/types'

// A faithful clone of BIASA's real chrome: a black promo strip, "Shop"
// / "Collections" dropdown-style nav (left), a brush-lettered wordmark
// (center), and search/account/bag icons (right).
export function UbudHeader({ brand, mechanicLabel, onOpenMechanic }: { brand: ThemeBrand; mechanicLabel: string; onOpenMechanic: () => void }) {
  const slug = brand.slug
  const { count, openCart } = useFlagshipCart()
  const categories = brand.categories.length ? brand.categories.slice(0, 2) : []

  return (
    <header className="sticky top-0 z-50" style={{ background: 'var(--fg-bg)' }}>
      <div className="h-8 flex items-center justify-center text-[11px] tracking-[0.04em]" style={{ background: 'var(--fg-ink)', color: 'var(--fg-bg)' }}>
        Free Shipping when you spend over $150
      </div>
      <div className="px-4 md:px-8 h-16 flex items-center justify-between gap-4 border-b" style={{ borderColor: 'var(--fg-line)' }}>
        <nav className="hidden md:flex items-center gap-5 text-[13px]" style={{ color: 'var(--fg-ink)' }}>
          {categories.map(c => (
            <Link key={c} href={`/store/${slug}/shop?category=${encodeURIComponent(c)}`} className="hover:opacity-60 transition-opacity">{c}</Link>
          ))}
          <button onClick={onOpenMechanic} className="hover:opacity-60 transition-opacity">{mechanicLabel}</button>
        </nav>
        <Link href={`/store/${slug}`} className="text-2xl italic" style={{ color: 'var(--fg-accent)', fontFamily: 'Georgia, serif', fontWeight: 700 }}>
          {brand.name.split(' ')[0]}
        </Link>
        <div className="flex items-center gap-4">
          <button aria-label="Search" className="hover:opacity-60 transition-opacity">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--fg-ink)' }} aria-hidden><circle cx="11" cy="11" r="7.5" /><path d="M21 21l-4.8-4.8" /></svg>
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
