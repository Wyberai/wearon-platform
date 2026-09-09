'use client'

import Link from 'next/link'
import { useFlagshipCart } from '@/lib/flagship/cart-context'
import type { ThemeBrand } from '@/lib/flagship/types'

// Modeled on shopdoen.com's real chrome: hamburger + account icon (left),
// a centered refined serif wordmark, search + basket icons (right). No
// flat category nav row — quiet and editorial, like every other Generic*
// header in this kit is NOT.
export function AdobeHeader({ brand, mechanicLabel, onOpenMechanic }: { brand: ThemeBrand; mechanicLabel: string; onOpenMechanic: () => void }) {
  const slug = brand.slug
  const { count, openCart } = useFlagshipCart()

  return (
    <header className="sticky top-0 z-50 border-b" style={{ background: 'var(--fg-bg)', borderColor: 'var(--fg-line)' }}>
      <div className="px-6 md:px-10 h-16 flex items-center justify-between gap-6">
        <div className="flex items-center gap-4 flex-shrink-0">
          <button aria-label="Menu" className="flex flex-col gap-1.5 w-5" style={{ color: 'var(--fg-ink)' }}>
            <span className="block h-[1.5px] w-full" style={{ background: 'currentColor' }} />
            <span className="block h-[1.5px] w-full" style={{ background: 'currentColor' }} />
            <span className="block h-[1.5px] w-full" style={{ background: 'currentColor' }} />
          </button>
        </div>
        <Link href={`/store/${slug}`} className="text-xl md:text-2xl tracking-[0.12em]" style={{ color: 'var(--fg-ink)', fontWeight: 500, fontStyle: 'italic' }}>
          {brand.name}
        </Link>
        <div className="flex items-center gap-4 flex-shrink-0" style={{ color: 'var(--fg-ink)' }}>
          <button onClick={onOpenMechanic} className="hidden sm:inline text-[11px] tracking-wide uppercase hover:opacity-60 transition-opacity">{mechanicLabel}</button>
          <button onClick={openCart} className="relative hover:opacity-60 transition-opacity" aria-label="Bag">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden>
              <path d="M6 8h12l-1 13H7L6 8z" /><path d="M9 8V6a3 3 0 016 0v2" />
            </svg>
            {count > 0 && <span className="absolute -top-1.5 -right-1.5 text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold" style={{ background: 'var(--fg-accent)', color: 'var(--fg-accent-ink)' }}>{count}</span>}
          </button>
        </div>
      </div>
    </header>
  )
}
