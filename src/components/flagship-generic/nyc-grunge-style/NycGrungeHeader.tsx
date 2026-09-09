'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useFlagshipCart } from '@/lib/flagship/cart-context'
import type { ThemeBrand } from '@/lib/flagship/types'

// Modeled on aimeleondore.com's real chrome: hamburger (opens a full category
// drawer) — centered wordmark — search/bag icons, with a persistent
// "neighborhood, NY | live date" strip underneath. No flat top-nav row like
// every other Generic* header in this kit.
export function NycGrungeHeader({ brand, categories, mechanicLabel, onOpenMechanic }: { brand: ThemeBrand; categories: string[]; mechanicLabel: string; onOpenMechanic: () => void }) {
  const slug = brand.slug
  const { count, openCart } = useFlagshipCart()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [dateStr, setDateStr] = useState('')

  useEffect(() => {
    setDateStr(new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: '2-digit' }))
  }, [])

  return (
    <div className="sticky top-0 z-50" style={{ background: 'var(--fg-bg)' }}>
      <header className="border-b" style={{ borderColor: 'var(--fg-line)' }}>
        <div className="px-6 md:px-10 h-16 flex items-center justify-between gap-6">
          <button aria-label="Menu" onClick={() => setDrawerOpen(true)} className="flex flex-col gap-1.5 w-5" style={{ color: 'var(--fg-ink)' }}>
            <span className="block h-[1.5px] w-full" style={{ background: 'currentColor' }} />
            <span className="block h-[1.5px] w-full" style={{ background: 'currentColor' }} />
          </button>
          <Link href={`/store/${slug}`} className="text-sm md:text-base tracking-[0.15em] uppercase" style={{ color: 'var(--fg-ink)', fontWeight: 700 }}>
            {brand.name}
          </Link>
          <div className="flex items-center gap-4 flex-shrink-0" style={{ color: 'var(--fg-ink)' }}>
            <button onClick={onOpenMechanic} className="hidden sm:inline text-[11px] tracking-wide uppercase hover:opacity-60 transition-opacity">{mechanicLabel}</button>
            <button onClick={openCart} className="relative hover:opacity-60 transition-opacity" aria-label="Bag">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <path d="M6 8h12l-1 13H7L6 8z" /><path d="M9 8V6a3 3 0 016 0v2" />
              </svg>
              {count > 0 && <span className="absolute -top-1.5 -right-1.5 text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold" style={{ background: 'var(--fg-accent)', color: 'var(--fg-accent-ink)' }}>{count}</span>}
            </button>
          </div>
        </div>
        <div className="text-center py-1.5 text-[10px] tracking-[0.12em] uppercase border-t" style={{ borderColor: 'var(--fg-line)', color: 'var(--fg-ink-dim)' }}>
          The Bowery, NYC{dateStr ? ` | ${dateStr}` : ''}
        </div>
      </header>

      {drawerOpen && (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={() => setDrawerOpen(false)} />
          <div className="absolute top-0 left-0 bottom-0 w-[280px] overflow-y-auto" style={{ background: 'var(--fg-bg)' }}>
            <div className="flex items-center justify-between px-6 h-16 border-b" style={{ borderColor: 'var(--fg-line)' }}>
              <span className="text-sm tracking-wide uppercase" style={{ fontWeight: 700 }}>{brand.name}</span>
              <button onClick={() => setDrawerOpen(false)} aria-label="Close" style={{ color: 'var(--fg-ink)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
            </div>
            <nav className="flex flex-col py-4">
              <Link href={`/store/${slug}/shop`} onClick={() => setDrawerOpen(false)} className="px-6 py-2.5 text-[13px] tracking-wide uppercase hover:opacity-60 transition-opacity" style={{ color: 'var(--fg-ink)' }}>
                All Products
              </Link>
              {categories.map(c => (
                <Link key={c} href={`/store/${slug}/shop?category=${encodeURIComponent(c)}`} onClick={() => setDrawerOpen(false)} className="px-6 py-2.5 text-[13px] tracking-wide uppercase hover:opacity-60 transition-opacity" style={{ color: 'var(--fg-ink)' }}>
                  {c}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  )
}
