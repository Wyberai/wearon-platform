'use client'

import Link from 'next/link'
import { useFlagshipCart } from '@/lib/flagship/cart-context'
import type { ThemeBrand } from '@/lib/flagship/types'

// A faithful clone of acrnm.com's real chrome: pure white background,
// stark black type, a bold wordmark, and plain function-first text
// nav (SORT / FILTER / SEARCH — no icons at all) with CART(N) rendered
// as a solid black box. The most technical, least decorative header in
// this kit.
export function KraftHeader({ brand, mechanicLabel, onOpenMechanic }: { brand: ThemeBrand; mechanicLabel: string; onOpenMechanic: () => void }) {
  const slug = brand.slug
  const { count, openCart } = useFlagshipCart()

  return (
    <header className="sticky top-0 z-50 border-b" style={{ background: 'var(--fg-bg)', borderColor: 'var(--fg-ink)' }}>
      <div className="px-4 md:px-8 h-14 flex items-center justify-between gap-4">
        <Link href={`/store/${slug}`} className="text-lg font-bold tracking-[-0.01em] uppercase" style={{ color: 'var(--fg-ink)' }}>
          {brand.name}®
        </Link>
        <nav className="hidden md:flex items-center gap-5 text-[11px] uppercase tracking-[0.08em] font-semibold" style={{ color: 'var(--fg-ink)' }}>
          <Link href={`/store/${slug}/shop`} className="hover:opacity-60 transition-opacity">Sort</Link>
          <button onClick={onOpenMechanic} className="hover:opacity-60 transition-opacity">{mechanicLabel}</button>
          <Link href={`/store/${slug}/shop`} className="hover:opacity-60 transition-opacity">Search</Link>
        </nav>
        <button onClick={openCart} className="px-3 py-1.5 text-[11px] uppercase tracking-[0.06em] font-bold" style={{ background: 'var(--fg-ink)', color: 'var(--fg-bg)' }}>
          Cart ({count})
        </button>
      </div>
    </header>
  )
}
