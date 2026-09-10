'use client'

import Link from 'next/link'
import { useFlagshipCart } from '@/lib/flagship/cart-context'
import type { ThemeBrand } from '@/lib/flagship/types'

// A faithful clone of toa.st's real chrome: "MENU" text + search icon
// (left), a bold outlined/embossed wordmark (center), "BAG (N)" as plain
// text with no icon (right) — quieter and more literary than every other
// Generic* header in this kit.
export function KintsugiHeader({ brand, mechanicLabel, onOpenMechanic }: { brand: ThemeBrand; mechanicLabel: string; onOpenMechanic: () => void }) {
  const slug = brand.slug
  const { count, openCart } = useFlagshipCart()

  return (
    <header className="sticky top-0 z-50 border-b" style={{ background: 'var(--fg-bg)', borderColor: 'var(--fg-line)' }}>
      <div className="px-6 md:px-10 h-16 flex items-center justify-between gap-6">
        <div className="flex items-center gap-4 flex-1">
          <span className="text-[13px] tracking-[0.1em] uppercase" style={{ color: 'var(--fg-ink)' }}>Menu</span>
          <button onClick={onOpenMechanic} className="hover:opacity-60 transition-opacity" aria-label={mechanicLabel}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--fg-ink)' }} aria-hidden><circle cx="11" cy="11" r="7.5" /><path d="M21 21l-4.8-4.8" /></svg>
          </button>
        </div>
        <Link href={`/store/${slug}`} className="text-xl tracking-[0.06em]" style={{ color: 'var(--fg-ink)', fontWeight: 700, WebkitTextStroke: '0.5px var(--fg-ink)' }}>
          {brand.name}
        </Link>
        <div className="flex-1 flex justify-end">
          <button onClick={openCart} className="text-[13px] tracking-[0.05em] uppercase hover:opacity-60 transition-opacity" style={{ color: 'var(--fg-ink)' }}>
            Bag ({count})
          </button>
        </div>
      </div>
    </header>
  )
}
