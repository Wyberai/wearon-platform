'use client'

import Link from 'next/link'
import { useFlagshipCart } from '@/lib/flagship/cart-context'
import type { ThemeBrand } from '@/lib/flagship/types'

// Modeled directly on thereformation.com's real chrome: a thin black promo
// strip above a sticky nav row of sparse lowercase text links (no icons on
// the left), wordmark on the far left, and a right-aligned cluster of
// text+icon utility links. Deliberately NOT centered/boxed like every other
// Generic* header in this kit — that's the actual structural difference.
export function ReformationHeader({ brand, categories, mechanicLabel, onOpenMechanic }: { brand: ThemeBrand; categories: string[]; mechanicLabel: string; onOpenMechanic: () => void }) {
  const slug = brand.slug
  const { count, openCart } = useFlagshipCart()

  return (
    <div className="sticky top-0 z-50" style={{ background: 'var(--fg-bg)' }}>
      <div className="w-full py-2 text-center text-[11px] tracking-wide" style={{ background: 'var(--fg-ink)', color: 'var(--fg-bg)' }}>
        {mechanicLabel} — a real stylist for real questions.{' '}
        <button onClick={onOpenMechanic} className="underline underline-offset-2 font-medium">Ask now</button>
      </div>
      <header className="border-b" style={{ borderColor: 'var(--fg-line)' }}>
        <div className="px-6 md:px-10 h-12 flex items-center justify-between gap-6 text-[11px] tracking-[0.02em]" style={{ color: 'var(--fg-ink)' }}>
          <nav className="hidden md:flex items-center gap-5 flex-1">
            {categories.slice(0, 8).map(c => (
              <Link key={c} href={`/store/${slug}/shop?category=${encodeURIComponent(c)}`} className="hover:opacity-50 transition-opacity lowercase">
                {c}
              </Link>
            ))}
            <Link href={`/store/${slug}/shop`} className="hover:opacity-50 transition-opacity">sale</Link>
          </nav>
          <Link href={`/store/${slug}`} className="md:hidden text-sm" style={{ fontWeight: 700 }}>{brand.name}</Link>
          <div className="flex items-center gap-5 flex-shrink-0">
            <span className="hidden sm:inline hover:opacity-50 transition-opacity cursor-default">search</span>
            <button onClick={onOpenMechanic} className="hidden sm:inline hover:opacity-50 transition-opacity">{mechanicLabel.toLowerCase()}</button>
            <button onClick={openCart} className="relative hover:opacity-50 transition-opacity">
              bag ({count})
            </button>
          </div>
        </div>
      </header>
    </div>
  )
}
