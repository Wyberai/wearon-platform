'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useFlagshipCart } from '@/lib/flagship/cart-context'
import type { ThemeBrand } from '@/lib/flagship/types'

export function EmberHeader({ brand, onOpenMoodMatch }: { brand: ThemeBrand; onOpenMoodMatch: () => void }) {
  const slug = brand.slug
  const { count, openCart } = useFlagshipCart()
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
        borderBottom: scrolled ? '1px solid var(--e-line)' : '1px solid transparent',
        background: scrolled ? 'var(--e-glass)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px) saturate(140%)' : 'none',
      }}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 h-16 md:h-20 flex items-center justify-between gap-6">
        <Link href={`/store/${slug}`} className="flex items-center flex-shrink-0" style={{ color: 'var(--e-ink)' }}>
          <span className="ember-display text-xl md:text-2xl tracking-tight" style={{ fontWeight: 800 }}>EMBER</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-[12px] tracking-[0.1em] uppercase font-medium" style={{ color: 'var(--e-ink-muted)' }}>
          <div className="relative" onMouseEnter={() => setShopOpen(true)} onMouseLeave={() => setShopOpen(false)}>
            <Link href={`/store/${slug}/shop`} className="hover:opacity-100 transition-opacity" style={{ color: shopOpen ? 'var(--e-ink)' : 'inherit' }}>
              Shop
            </Link>
            {shopOpen && brand.categories.length > 0 && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4">
                <div className="ember-glass rounded-lg border p-4 flex flex-col gap-2 min-w-[180px] shadow-xl" style={{ borderColor: 'var(--e-line)' }}>
                  {brand.categories.map(c => (
                    <Link key={c} href={`/store/${slug}/shop?category=${encodeURIComponent(c)}`} className="normal-case text-sm py-1 hover:opacity-60 transition-opacity" style={{ color: 'var(--e-ink)' }}>
                      {c}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          <a href="#journal" className="hover:opacity-100 transition-opacity">Journal</a>
        </nav>

        <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
          <button
            onClick={onOpenMoodMatch}
            className="hidden sm:flex items-center gap-1.5 text-[12px] tracking-wide uppercase font-semibold rounded-full px-4 py-2 transition-transform hover:scale-105 ember-glow"
            style={{ background: 'var(--e-accent)', color: 'var(--e-accent-ink)' }}
          >
            ✦ Mood Match
          </button>

          <button
            onClick={openCart}
            aria-label="Open bag"
            className="relative w-8 h-8 flex items-center justify-center transition-opacity hover:opacity-70"
            style={{ color: 'var(--e-ink)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <path d="M6 8h12l-1 13H7L6 8z"/><path d="M9 8V6a3 3 0 016 0v2"/>
            </svg>
            {count > 0 && (
              <span
                className="absolute -top-1 -right-1 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold"
                style={{ background: 'var(--e-accent)', color: 'var(--e-accent-ink)' }}
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
