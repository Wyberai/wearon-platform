'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useFlagshipCart } from '@/lib/flagship/cart-context'
import type { ThemeBrand } from '@/lib/flagship/types'

export function BloomHeader({ brand }: { brand: ThemeBrand }) {
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
        borderBottom: scrolled ? '1px solid var(--bl-line)' : '1px solid transparent',
        background: scrolled ? 'var(--bl-glass)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px) saturate(140%)' : 'none',
      }}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 h-16 md:h-20 flex items-center justify-between gap-6">
        <Link href={`/store/${slug}`} className="flex items-center flex-shrink-0" style={{ color: 'var(--bl-ink)' }}>
          <span className="bloom-display text-2xl md:text-3xl italic tracking-tight">{brand.name.charAt(0) + brand.name.slice(1).toLowerCase()}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-[13px] tracking-wide" style={{ color: 'var(--bl-ink-muted)' }}>
          <div className="relative" onMouseEnter={() => setShopOpen(true)} onMouseLeave={() => setShopOpen(false)}>
            <Link href={`/store/${slug}/shop`} className="hover:opacity-100 transition-opacity" style={{ color: shopOpen ? 'var(--bl-ink)' : 'inherit' }}>
              Shop
            </Link>
            {shopOpen && brand.categories.length > 0 && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4">
                <div className="bloom-glass rounded-2xl border p-4 flex flex-col gap-2 min-w-[170px] shadow-xl" style={{ borderColor: 'var(--bl-line)' }}>
                  {brand.categories.map(c => (
                    <Link key={c} href={`/store/${slug}/shop?category=${encodeURIComponent(c)}`} className="text-sm py-1 hover:opacity-60 transition-opacity" style={{ color: 'var(--bl-ink)' }}>
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
          <Link
            href={`/store/${slug}/quiz`}
            className="hidden sm:flex items-center gap-1.5 text-[13px] tracking-wide rounded-full px-4 py-2 border transition-transform hover:scale-105"
            style={{ borderColor: 'var(--bl-accent)', color: 'var(--bl-accent)' }}
          >
            ✦ Take the Style Quiz
          </Link>

          <button
            onClick={openCart}
            aria-label="Open bag"
            className="relative w-8 h-8 flex items-center justify-center transition-opacity hover:opacity-70"
            style={{ color: 'var(--bl-ink)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <path d="M6 8h12l-1 13H7L6 8z"/><path d="M9 8V6a3 3 0 016 0v2"/>
            </svg>
            {count > 0 && (
              <span
                className="absolute -top-1 -right-1 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold"
                style={{ background: 'var(--bl-accent)', color: 'var(--bl-accent-ink)' }}
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
