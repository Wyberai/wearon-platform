'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useFlagshipCart } from '@/lib/flagship/cart-context'
import type { ThemeBrand } from '@/lib/flagship/types'

// Modeled on vacation.inc's real chrome: a yellow promo strip, then plain
// text nav — "Menu +" on the left, "Search · Bag (N)" on the right — no
// hamburger icon, no logo mark, no serif wordmark. Deliberately loud and
// playful where the last 4 rebuilds in this kit went quiet/refined.
export function ResortHeader({ brand, categories, mechanicLabel, onOpenMechanic }: { brand: ThemeBrand; categories: string[]; mechanicLabel: string; onOpenMechanic: () => void }) {
  const slug = brand.slug
  const { count, openCart } = useFlagshipCart()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="sticky top-0 z-50">
      <div className="w-full py-2 text-center text-[11px] tracking-wide font-bold" style={{ background: 'var(--fg-accent)', color: 'var(--fg-accent-ink)' }}>
        FREE SHIPPING ON ORDERS $75+ · {mechanicLabel.toUpperCase()} IS OPEN
      </div>
      <header style={{ background: 'var(--fg-bg)' }}>
        <div className="px-6 md:px-10 h-14 flex items-center justify-between gap-6 text-[15px]" style={{ color: 'var(--fg-ink)' }}>
          <button onClick={() => setMenuOpen(v => !v)} className="font-bold hover:opacity-60 transition-opacity">Menu +</button>
          <Link href={`/store/${slug}`} className="text-lg" style={{ fontFamily: "'Pacifico', cursive", fontWeight: 400 }}>
            {brand.name}
          </Link>
          <div className="flex items-center gap-4 font-bold">
            <button onClick={onOpenMechanic} className="hidden sm:inline hover:opacity-60 transition-opacity">Search</button>
            <button onClick={openCart} className="hover:opacity-60 transition-opacity">Bag ({count})</button>
          </div>
        </div>
        {menuOpen && (
          <div className="px-6 md:px-10 pb-4 flex flex-wrap gap-x-5 gap-y-2 border-t pt-4" style={{ borderColor: 'var(--fg-line)' }}>
            {categories.map(c => (
              <Link key={c} href={`/store/${slug}/shop?category=${encodeURIComponent(c)}`} className="text-[13px] font-bold hover:opacity-60 transition-opacity" style={{ color: 'var(--fg-ink)' }}>
                {c}
              </Link>
            ))}
          </div>
        )}
      </header>
    </div>
  )
}
