'use client'

import Link from 'next/link'
import { useFlagshipCart } from '@/lib/flagship/cart-context'
import type { ThemeBrand } from '@/lib/flagship/types'

// A faithful clone of sezane.com's real chrome: icon-only left cluster
// (hamburger + search, no text labels), a centered serif wordmark, and an
// icon-only right cluster (account + bag) — nothing spelled out anywhere,
// the quietest header in this kit.
export function RiveHeader({ brand, mechanicLabel, onOpenMechanic }: { brand: ThemeBrand; mechanicLabel: string; onOpenMechanic: () => void }) {
  const slug = brand.slug
  const { count, openCart } = useFlagshipCart()

  return (
    <header className="sticky top-0 z-50 border-b" style={{ background: 'var(--fg-bg)', borderColor: 'var(--fg-line)' }}>
      <div className="px-6 md:px-10 h-16 flex items-center justify-between gap-6">
        <div className="flex items-center gap-5 flex-1">
          <button aria-label="Menu" className="hover:opacity-60 transition-opacity">
            <svg width="20" height="14" viewBox="0 0 24 16" fill="none" stroke="currentColor" strokeWidth="1.3" style={{ color: 'var(--fg-ink)' }} aria-hidden><line x1="0" y1="1" x2="24" y2="1" /><line x1="0" y1="8" x2="24" y2="8" /><line x1="0" y1="15" x2="24" y2="15" /></svg>
          </button>
          <button aria-label="Search" className="hover:opacity-60 transition-opacity">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--fg-ink)' }} aria-hidden><circle cx="11" cy="11" r="7.5" /><path d="M21 21l-4.8-4.8" /></svg>
          </button>
        </div>
        <Link href={`/store/${slug}`} className="text-2xl tracking-[0.12em] uppercase" style={{ color: 'var(--fg-ink)', fontWeight: 500 }}>
          {brand.name}
        </Link>
        <div className="flex-1 flex justify-end items-center gap-5">
          <button onClick={onOpenMechanic} aria-label={mechanicLabel} className="hover:opacity-60 transition-opacity">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" style={{ color: 'var(--fg-ink)' }} aria-hidden><path d="M21 11.5a8.4 8.4 0 0 1-8.9 8.4 8.6 8.6 0 0 1-3.3-.7L3 21l1.8-5.4A8.4 8.4 0 1 1 21 11.5z" /></svg>
          </button>
          <button onClick={openCart} aria-label="Bag" className="relative hover:opacity-60 transition-opacity">
            <svg width="16" height="18" viewBox="0 0 24 26" fill="none" stroke="currentColor" strokeWidth="1.3" style={{ color: 'var(--fg-ink)' }} aria-hidden><path d="M6 8h12l1 15H5L6 8z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>
            {count > 0 && <span className="absolute -top-1.5 -right-2 text-[9px] w-4 h-4 rounded-full flex items-center justify-center" style={{ background: 'var(--fg-ink)', color: 'var(--fg-bg)' }}>{count}</span>}
          </button>
        </div>
      </div>
    </header>
  )
}
