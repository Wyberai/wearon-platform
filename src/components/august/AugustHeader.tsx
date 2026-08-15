'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useFlagshipCart } from '@/lib/flagship/cart-context'
import { useFlagshipMode } from '@/lib/flagship/mode-context'
import type { ThemeBrand } from '@/lib/flagship/types'

function AugustMark({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1" />
      <circle cx="12" cy="12" r="2.5" fill="currentColor" />
    </svg>
  )
}

export function AugustHeader({ brand, onOpenStylist }: { brand: ThemeBrand; onOpenStylist: () => void }) {
  const slug = brand.slug
  const { count, openCart } = useFlagshipCart()
  const { mode, toggle } = useFlagshipMode()
  const [scrolled, setScrolled] = useState(false)
  const [shopOpen, setShopOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className="sticky top-0 z-50 transition-colors duration-500"
      style={{
        borderBottom: scrolled ? '1px solid var(--a-line)' : '1px solid transparent',
        background: scrolled ? 'var(--a-glass)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px) saturate(140%)' : 'none',
      }}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 h-16 md:h-20 flex items-center justify-between gap-6">
        <Link href={`/store/${slug}`} className="flex items-center gap-2.5 flex-shrink-0" style={{ color: 'var(--a-ink)' }}>
          <AugustMark />
          <span className="august-serif text-lg md:text-xl tracking-[0.14em]" style={{ fontWeight: 500 }}>{brand.name}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-[13px] tracking-[0.06em] uppercase" style={{ color: 'var(--a-ink-muted)' }}>
          <div className="relative" onMouseEnter={() => setShopOpen(true)} onMouseLeave={() => setShopOpen(false)}>
            <Link href={`/store/${slug}/shop`} className="hover:opacity-100 transition-opacity" style={{ color: shopOpen ? 'var(--a-ink)' : 'inherit' }}>
              Shop
            </Link>
            {shopOpen && brand.categories.length > 0 && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4">
                <div className="august-glass rounded-sm border p-4 flex flex-col gap-2 min-w-[180px] shadow-xl" style={{ borderColor: 'var(--a-line)' }}>
                  {brand.categories.map(c => (
                    <Link key={c} href={`/store/${slug}/shop?category=${encodeURIComponent(c)}`} className="normal-case text-sm py-1 hover:opacity-60 transition-opacity" style={{ color: 'var(--a-ink)' }}>
                      {c}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          <a href="#atelier" className="hover:opacity-100 transition-opacity">The Atelier</a>
          <a href="#journal" className="hover:opacity-100 transition-opacity">Journal</a>
        </nav>

        <div className="flex items-center gap-4 md:gap-5 flex-shrink-0">
          <button
            onClick={onOpenStylist}
            className="hidden sm:flex items-center gap-1.5 text-[13px] tracking-wide border rounded-full px-3.5 py-1.5 transition-opacity hover:opacity-70"
            style={{ borderColor: 'var(--a-line)', color: 'var(--a-ink)' }}
          >
            <span style={{ color: 'var(--a-accent)' }}>✦</span> Ask {brand.name}
          </button>

          <button
            onClick={toggle}
            aria-label="Toggle After Hours mode"
            className="w-8 h-8 flex items-center justify-center rounded-full transition-opacity hover:opacity-70"
            style={{ color: 'var(--a-ink)' }}
            title={mode === 'light' ? 'Switch to After Hours' : 'Switch to Boutique'}
          >
            {mode === 'light' ? (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
            ) : (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2.5M12 19.5V22M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8L6 18M18 6l1.8-1.8"/></svg>
            )}
          </button>

          <button
            onClick={openCart}
            aria-label="Open bag"
            className="relative w-8 h-8 flex items-center justify-center transition-opacity hover:opacity-70"
            style={{ color: 'var(--a-ink)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <path d="M6 8h12l-1 13H7L6 8z"/><path d="M9 8V6a3 3 0 016 0v2"/>
            </svg>
            {count > 0 && (
              <span
                className="absolute -top-1 -right-1 text-[10px] w-4 h-4 rounded-full flex items-center justify-center"
                style={{ background: 'var(--a-accent)', color: 'var(--a-accent-ink)' }}
              >
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
