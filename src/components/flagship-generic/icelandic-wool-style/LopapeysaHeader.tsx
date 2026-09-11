'use client'

import Link from 'next/link'
import { useFlagshipCart } from '@/lib/flagship/cart-context'
import type { ThemeBrand } from '@/lib/flagship/types'

// A faithful clone of farmersmarket.is' real chrome: a plain textured
// header with "MENU" as literal left-aligned text (not an icon), a
// centered plain wordmark, and "ICELANDIC" language toggle + a bag icon
// with a small item-count badge on the right.
export function LopapeysaHeader({ brand, mechanicLabel, onOpenMechanic }: { brand: ThemeBrand; mechanicLabel: string; onOpenMechanic: () => void }) {
  const slug = brand.slug
  const { count, openCart } = useFlagshipCart()

  return (
    <header className="sticky top-0 z-50 border-b" style={{ background: 'var(--fg-bg)', borderColor: 'var(--fg-line)' }}>
      <div className="px-5 md:px-8 h-16 flex items-center justify-between">
        <button onClick={onOpenMechanic} className="text-[11px] uppercase tracking-[0.15em] font-semibold hover:opacity-60 transition-opacity" style={{ color: 'var(--fg-ink)' }}>
          Menu
        </button>
        <Link href={`/store/${slug}`} className="absolute left-1/2 -translate-x-1/2 text-[13px] uppercase tracking-[0.2em]" style={{ color: 'var(--fg-ink)', fontWeight: 600 }}>
          {brand.name}
        </Link>
        <div className="flex items-center gap-5">
          <button onClick={onOpenMechanic} className="hidden md:block text-[11px] uppercase tracking-[0.1em] hover:opacity-60 transition-opacity" style={{ color: 'var(--fg-ink-dim)' }}>
            {mechanicLabel}
          </button>
          <span className="hidden md:block text-[11px] uppercase tracking-[0.1em]" style={{ color: 'var(--fg-ink-dim)' }}>Icelandic</span>
          <button onClick={openCart} aria-label="Bag" className="relative hover:opacity-60 transition-opacity">
            <svg width="16" height="18" viewBox="0 0 24 26" fill="none" stroke="currentColor" strokeWidth="1.3" style={{ color: 'var(--fg-ink)' }} aria-hidden><path d="M6 8h12l1 15H5L6 8z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>
            {count > 0 && <span className="absolute -top-1.5 -right-2 text-[9px] w-4 h-4 rounded-full flex items-center justify-center" style={{ background: 'var(--fg-accent)', color: 'var(--fg-bg)' }}>{count}</span>}
          </button>
        </div>
      </div>
    </header>
  )
}
