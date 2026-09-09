'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useFlagshipCart } from '@/lib/flagship/cart-context'
import type { ThemeBrand } from '@/lib/flagship/types'

// A faithful clone of norseprojects.com's real chrome: transparent overlay
// on the hero (white text/icons), turning solid on scroll — hamburger +
// bold uppercase letterspaced wordmark (left), account/search/bag icons
// (right). No flat category row, no CTA button in the header.
export function NoirHeader({ brand, mechanicLabel, onOpenMechanic, overlay = false }: { brand: ThemeBrand; mechanicLabel: string; onOpenMechanic: () => void; overlay?: boolean }) {
  const slug = brand.slug
  const { count, openCart } = useFlagshipCart()
  const [scrolled, setScrolled] = useState(!overlay)

  useEffect(() => {
    if (!overlay) return
    const onScroll = () => setScrolled(window.scrollY > 60)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [overlay])

  const ink = scrolled ? 'var(--fg-ink)' : '#fff'

  return (
    <header
      className="sticky top-0 z-50 transition-colors duration-300"
      style={{ background: scrolled ? 'var(--fg-bg)' : 'transparent', borderBottom: scrolled ? '1px solid var(--fg-line)' : 'none' }}
    >
      <div className="px-6 md:px-10 h-16 flex items-center justify-between gap-6">
        <button aria-label="Menu" className="flex flex-col gap-1.5 w-5" style={{ color: ink }}>
          <span className="block h-[1.5px] w-full" style={{ background: 'currentColor' }} />
          <span className="block h-[1.5px] w-full" style={{ background: 'currentColor' }} />
        </button>
        <Link href={`/store/${slug}`} className="text-[15px] tracking-[0.15em] uppercase" style={{ color: ink, fontWeight: 700 }}>
          {brand.name}
        </Link>
        <div className="flex items-center gap-4" style={{ color: ink }}>
          <button onClick={onOpenMechanic} className="hidden sm:inline hover:opacity-60 transition-opacity" aria-label={mechanicLabel}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden><circle cx="11" cy="11" r="7.5" /><path d="M21 21l-4.8-4.8" /></svg>
          </button>
          <button onClick={openCart} className="relative hover:opacity-60 transition-opacity" aria-label="Bag">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden><path d="M6 8h12l-1 13H7L6 8z" /><path d="M9 8V6a3 3 0 016 0v2" /></svg>
            {count > 0 && <span className="absolute -top-1.5 -right-1.5 text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold" style={{ background: 'var(--fg-accent)', color: 'var(--fg-accent-ink)' }}>{count}</span>}
          </button>
        </div>
      </div>
    </header>
  )
}
