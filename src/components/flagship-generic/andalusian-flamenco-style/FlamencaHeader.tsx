'use client'

import Link from 'next/link'
import { useFlagshipCart } from '@/lib/flagship/cart-context'
import type { ThemeBrand } from '@/lib/flagship/types'

// A faithful clone of Aires de Feria's real chrome: a red promo strip,
// hamburger + search icons (left), a script cursive wordmark
// (center), and search/bag icons (right) — quiet chrome that lets the
// campaign photography carry the page.
export function FlamencaHeader({ brand, mechanicLabel, onOpenMechanic }: { brand: ThemeBrand; mechanicLabel: string; onOpenMechanic: () => void }) {
  const slug = brand.slug
  const { count, openCart } = useFlagshipCart()

  return (
    <header className="sticky top-0 z-50" style={{ background: 'var(--fg-bg)' }}>
      <div className="h-8 flex items-center justify-center text-[11px] tracking-[0.02em] text-center px-4" style={{ background: 'var(--fg-accent)', color: 'white' }}>
        Todos los modelos mostrados están disponibles en distintos colores y tejidos
      </div>
      <div className="px-4 md:px-8 h-16 flex items-center justify-between gap-4">
        <button aria-label="Menu" className="hover:opacity-60 transition-opacity">
          <svg width="20" height="14" viewBox="0 0 24 16" fill="none" stroke="currentColor" strokeWidth="1.3" style={{ color: 'var(--fg-ink)' }} aria-hidden><line x1="0" y1="1" x2="24" y2="1" /><line x1="0" y1="8" x2="24" y2="8" /><line x1="0" y1="15" x2="24" y2="15" /></svg>
        </button>
        <Link href={`/store/${slug}`} className="text-3xl italic" style={{ color: 'var(--fg-ink)', fontFamily: 'Georgia, serif', fontWeight: 500 }}>
          {brand.name}
        </Link>
        <div className="flex items-center gap-4">
          <button onClick={onOpenMechanic} aria-label={mechanicLabel} className="hover:opacity-60 transition-opacity">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--fg-ink)' }} aria-hidden><circle cx="11" cy="11" r="7.5" /><path d="M21 21l-4.8-4.8" /></svg>
          </button>
          <button onClick={openCart} aria-label="Bag" className="relative hover:opacity-60 transition-opacity">
            <svg width="15" height="17" viewBox="0 0 24 26" fill="none" stroke="currentColor" strokeWidth="1.3" style={{ color: 'var(--fg-ink)' }} aria-hidden><path d="M6 8h12l1 15H5L6 8z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>
            {count > 0 && <span className="absolute -top-1.5 -right-2 text-[9px] w-4 h-4 rounded-full flex items-center justify-center" style={{ background: 'var(--fg-accent)', color: 'white' }}>{count}</span>}
          </button>
        </div>
      </div>
    </header>
  )
}
