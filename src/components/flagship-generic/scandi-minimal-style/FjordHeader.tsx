'use client'

import Link from 'next/link'
import { useFlagshipCart } from '@/lib/flagship/cart-context'
import type { ThemeBrand } from '@/lib/flagship/types'

// A faithful clone of arket.com's real chrome: hamburger + wordmark +
// account/wishlist/bag icons, then a search bar that's ALWAYS visible in
// the header (not a toggle behind an icon, unlike every other Generic*
// header in this kit).
export function FjordHeader({ brand, mechanicLabel, onOpenMechanic }: { brand: ThemeBrand; mechanicLabel: string; onOpenMechanic: () => void }) {
  const slug = brand.slug
  const { count, openCart } = useFlagshipCart()

  return (
    <header className="sticky top-0 z-50" style={{ background: 'var(--fg-bg)' }}>
      <div className="px-6 md:px-10 h-16 flex items-center justify-between gap-6 border-b" style={{ borderColor: 'var(--fg-line)' }}>
        <button aria-label="Menu" className="flex flex-col gap-1.5 w-5" style={{ color: 'var(--fg-ink)' }}>
          <span className="block h-[1.5px] w-full" style={{ background: 'currentColor' }} />
          <span className="block h-[1.5px] w-full" style={{ background: 'currentColor' }} />
        </button>
        <Link href={`/store/${slug}`} className="text-lg tracking-[0.1em] uppercase" style={{ color: 'var(--fg-ink)', fontWeight: 700 }}>
          {brand.name}
        </Link>
        <div className="flex items-center gap-4" style={{ color: 'var(--fg-ink)' }}>
          <button onClick={onOpenMechanic} className="hidden sm:inline hover:opacity-60 transition-opacity" aria-label={mechanicLabel}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden><path d="M12 21s-7.5-4.6-10-9.2C.5 8.4 2.2 5 5.6 5c2 0 3.6 1.2 4.4 2.6C10.8 6.2 12.4 5 14.4 5c3.4 0 5.1 3.4 3.6 6.8-2.5 4.6-10 9.2-10 9.2z" /></svg>
          </button>
          <button onClick={openCart} className="relative hover:opacity-60 transition-opacity" aria-label="Bag">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden><path d="M6 8h12l-1 13H7L6 8z" /><path d="M9 8V6a3 3 0 016 0v2" /></svg>
            {count > 0 && <span className="absolute -top-1.5 -right-1.5 text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold" style={{ background: 'var(--fg-accent)', color: 'var(--fg-accent-ink)' }}>{count}</span>}
          </button>
        </div>
      </div>
      <div className="px-6 md:px-10 py-2.5 border-b" style={{ borderColor: 'var(--fg-line)' }}>
        <div className="flex items-center gap-2 px-3 py-2" style={{ background: 'var(--fg-card)' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--fg-ink-dim)', flexShrink: 0 }} aria-hidden><circle cx="11" cy="11" r="7.5" /><path d="M21 21l-4.8-4.8" /></svg>
          <span className="text-[13px]" style={{ color: 'var(--fg-ink-dim)' }}>Search</span>
        </div>
      </div>
    </header>
  )
}
