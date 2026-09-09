'use client'

import Link from 'next/link'
import { useFlagshipCart } from '@/lib/flagship/cart-context'
import type { ThemeBrand } from '@/lib/flagship/types'

// Modeled on freepeople.com's real chrome: a large, prominent search bar
// sits directly below the logo (not hidden behind an icon like every other
// Generic* header), with wishlist/bag/menu icons alongside it — no flat
// top-nav category row at all.
export function SoukHeader({ brand, mechanicLabel, onOpenMechanic }: { brand: ThemeBrand; mechanicLabel: string; onOpenMechanic: () => void }) {
  const slug = brand.slug
  const { count, openCart } = useFlagshipCart()

  return (
    <header className="sticky top-0 z-50 border-b" style={{ background: 'var(--fg-bg)', borderColor: 'var(--fg-line)' }}>
      <div className="px-6 md:px-10 pt-4 pb-3">
        <Link href={`/store/${slug}`} className="block text-center text-lg tracking-[0.2em] uppercase mb-3" style={{ color: 'var(--fg-ink)', fontWeight: 700 }}>
          {brand.name}
        </Link>
        <div className="flex items-center gap-3 max-w-[1100px] mx-auto">
          <div className="flex-1 flex items-center gap-2 border rounded-full px-4 py-2.5" style={{ borderColor: 'var(--fg-line)' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--fg-ink-dim)', flexShrink: 0 }} aria-hidden>
              <circle cx="11" cy="11" r="7.5" /><path d="M21 21l-4.8-4.8" />
            </svg>
            <span className="text-[13px]" style={{ color: 'var(--fg-ink-dim)' }}>What are you looking for?</span>
          </div>
          <button onClick={onOpenMechanic} className="hidden sm:flex items-center gap-1.5 text-[11px] tracking-wide uppercase px-4 py-2.5 rounded-full flex-shrink-0" style={{ background: 'var(--fg-accent)', color: 'var(--fg-accent-ink)' }}>
            ✦ {mechanicLabel}
          </button>
          <button onClick={openCart} className="relative flex-shrink-0 hover:opacity-60 transition-opacity" aria-label="Bag" style={{ color: 'var(--fg-ink)' }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <path d="M6 8h12l-1 13H7L6 8z" /><path d="M9 8V6a3 3 0 016 0v2" />
            </svg>
            {count > 0 && <span className="absolute -top-1.5 -right-1.5 text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold" style={{ background: 'var(--fg-accent)', color: 'var(--fg-accent-ink)' }}>{count}</span>}
          </button>
        </div>
      </div>
    </header>
  )
}
