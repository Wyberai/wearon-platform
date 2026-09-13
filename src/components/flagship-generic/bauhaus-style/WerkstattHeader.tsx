'use client'

import Link from 'next/link'
import { useFlagshipCart } from '@/lib/flagship/cart-context'
import type { ThemeBrand } from '@/lib/flagship/types'

// A faithful clone of the real Bauhaus-Shop's chrome: a promo strip on
// top, a lowercase stacked wordmark paired with a geometric circle +
// radial-line icon (echoing their real clock-face mark), and
// search/bag/menu icons on the right.
function GeometricMark() {
  return (
    <svg width="34" height="34" viewBox="0 0 40 40" fill="none" aria-hidden>
      <circle cx="20" cy="20" r="18" stroke="var(--fg-ink)" strokeWidth="1.4" />
      <line x1="20" y1="20" x2="20" y2="4" stroke="var(--fg-ink)" strokeWidth="1.4" />
      <line x1="20" y1="20" x2="30" y2="26" stroke="var(--fg-ink)" strokeWidth="1.4" />
      <circle cx="20" cy="20" r="2.5" fill="var(--fg-accent)" />
    </svg>
  )
}

export function WerkstattHeader({ brand, mechanicLabel, onOpenMechanic }: { brand: ThemeBrand; mechanicLabel: string; onOpenMechanic: () => void }) {
  const slug = brand.slug
  const { count, openCart } = useFlagshipCart()
  const words = brand.name.toLowerCase().split(' ')

  return (
    <header className="sticky top-0 z-50" style={{ background: 'var(--fg-bg)' }}>
      <div className="h-8 flex items-center justify-center text-[11px] tracking-[0.03em]" style={{ background: 'var(--fg-ink)', color: 'var(--fg-bg)' }}>
        Shop for good design
      </div>
      <div className="px-5 md:px-8 h-16 flex items-center justify-between border-b" style={{ borderColor: 'var(--fg-line)' }}>
        <Link href={`/store/${slug}`} className="flex items-center gap-3">
          <div className="leading-[0.95]">
            {words.map((w, i) => (
              <p key={i} className="text-lg lowercase" style={{ color: 'var(--fg-ink)', fontWeight: 700 }}>{w}</p>
            ))}
          </div>
          <GeometricMark />
        </Link>
        <div className="flex items-center gap-4">
          <button onClick={onOpenMechanic} className="hidden md:block text-[12px] uppercase tracking-[0.04em] hover:opacity-60 transition-opacity" style={{ color: 'var(--fg-ink-dim)' }}>
            {mechanicLabel}
          </button>
          <button aria-label="Search" className="hover:opacity-60 transition-opacity" style={{ color: 'var(--fg-ink)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden><circle cx="11" cy="11" r="7.5" /><path d="M21 21l-4.8-4.8" /></svg>
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
