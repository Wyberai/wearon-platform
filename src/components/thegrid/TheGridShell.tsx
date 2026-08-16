'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState, type ReactNode, type CSSProperties } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FlagshipCartProvider, useFlagshipCart } from '@/lib/flagship/cart-context'
import { formatINR } from '@/lib/thegrid/catalog'
import type { ThemeBrand } from '@/lib/flagship/types'

// High-contrast, IG-native monochrome + a single vivid accent — distinct
// from Reel Rack's warm ethnic-wear palette. Every component under
// src/components/thegrid/ reads this off var(--tg-*) once mounted here.
const THEGRID_VARS: CSSProperties = {
  '--tg-display': "'Sora', var(--font-display), sans-serif",
  '--tg-sans': "'Manrope', var(--font-body), sans-serif",
  '--tg-bg': '#FFFFFF',
  '--tg-card': '#FAFAFA',
  '--tg-ink': '#000000',
  '--tg-ink-muted': 'rgba(0, 0, 0, 0.62)',
  '--tg-ink-dim': 'rgba(0, 0, 0, 0.35)',
  '--tg-line': 'rgba(0, 0, 0, 0.12)',
  '--tg-accent': '#C13584',
  '--tg-accent-ink': '#FFFFFF',
  '--tg-sale': '#D64545',
  '--tg-glass': 'rgba(255, 255, 255, 0.92)',
} as CSSProperties

export function TheGridImg({
  src, alt, wrapperClassName = '', imgClassName = 'w-full h-full object-cover', bg = 'var(--tg-card)', style, priority = false,
}: { src: string; alt: string; wrapperClassName?: string; imgClassName?: string; bg?: string; style?: CSSProperties; priority?: boolean }) {
  return (
    <div className={wrapperClassName} style={{ background: bg, ...style }}>
      <img src={src} alt={alt} loading={priority ? 'eager' : 'lazy'} className={imgClassName} onError={e => { e.currentTarget.style.display = 'none' }} />
    </div>
  )
}

function TheGridHeader({ brand }: { brand: ThemeBrand }) {
  const slug = brand.slug
  const { count, openCart } = useFlagshipCart()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b" style={{ borderColor: 'var(--tg-line)', background: scrolled ? 'var(--tg-glass)' : 'var(--tg-bg)', backdropFilter: scrolled ? 'blur(14px)' : 'none' }}>
      <div className="max-w-[1080px] mx-auto px-6 h-16 flex items-center justify-between gap-6">
        <Link href={`/store/${slug}`} className="flex-shrink-0" style={{ color: 'var(--tg-ink)' }}>
          <span className="text-xl font-bold tracking-tight" style={{ fontFamily: 'var(--tg-display)' }}>{brand.name}</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-[13px] font-medium" style={{ color: 'var(--tg-ink-muted)' }}>
          <Link href={`/store/${slug}/shop`}>Grid</Link>
          {brand.categories.slice(0, 4).map(c => (
            <Link key={c} href={`/store/${slug}/shop?category=${encodeURIComponent(c)}`}>{c}</Link>
          ))}
        </nav>
        <button onClick={openCart} aria-label="Open bag" className="relative w-9 h-9 flex items-center justify-center rounded-full transition-colors hover:bg-black/5" style={{ color: 'var(--tg-ink)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden><path d="M6 8h12l-1 13H7L6 8z"/><path d="M9 8V6a3 3 0 016 0v2"/></svg>
          {count > 0 && <span className="absolute top-0 right-0 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold" style={{ background: 'var(--tg-accent)', color: '#fff' }}>{count}</span>}
        </button>
      </div>
    </header>
  )
}

function TheGridFooter({ brand }: { brand: ThemeBrand }) {
  const isDemoData = !brand.sellerId
  return (
    <footer className="mt-20 border-t py-8" style={{ borderColor: 'var(--tg-line)' }}>
      <div className="max-w-[1080px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px]" style={{ color: 'var(--tg-ink-dim)' }}>
        {isDemoData ? <p>A concept storefront demonstrating a Instastarz Insta theme. Not a real retailer.</p> : <p>{brand.name}, built on Instastarz.</p>}
        <p>Powered by <Link href="/" style={{ color: 'inherit' }}>Instastarz</Link></p>
      </div>
    </footer>
  )
}

function TheGridCartDrawer({ brand }: { brand: ThemeBrand }) {
  const slug = brand.slug
  const { isOpen, closeCart, lines, subtotal, adjustQuantity, removeLine } = useFlagshipCart()
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div className="fixed inset-0 z-[90]" style={{ background: 'rgba(0,0,0,0.4)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeCart} />
          <motion.aside className="fixed top-0 right-0 h-full w-full sm:w-[420px] z-[91] flex flex-col border-l" style={{ background: 'var(--tg-bg)', borderColor: 'var(--tg-line)', color: 'var(--tg-ink)' }}
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 32, stiffness: 300 }}>
            <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: 'var(--tg-line)' }}>
              <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--tg-display)' }}>Your Bag</h2>
              <button onClick={closeCart} aria-label="Close" className="w-8 h-8 flex items-center justify-center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
            </div>
            {lines.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-4">
                <p className="text-sm" style={{ color: 'var(--tg-ink-muted)' }}>Your bag is empty.</p>
                <Link href={`/store/${slug}/shop`} onClick={closeCart} className="text-sm underline underline-offset-4" style={{ color: 'var(--tg-accent)' }}>Continue browsing</Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
                  {lines.map(line => (
                    <div key={`${line.productId}-${line.size}-${line.color}`} className="flex gap-4">
                      <TheGridImg src={line.image} alt={line.name} wrapperClassName="w-20 h-24 rounded-lg overflow-hidden flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium">{line.name}</p>
                          <p className="text-sm flex-shrink-0">{formatINR(line.price * line.quantity)}</p>
                        </div>
                        <p className="text-xs mt-1" style={{ color: 'var(--tg-ink-muted)' }}>{line.color}{line.size ? ` · ${line.size}` : ''}</p>
                        <div className="flex items-center gap-3 mt-2.5">
                          <div className="flex items-center border rounded-full" style={{ borderColor: 'var(--tg-line)' }}>
                            <button onClick={() => adjustQuantity(line.productId, line.size, line.color, -1)} className="w-6 h-6 flex items-center justify-center text-sm">−</button>
                            <span className="text-xs w-5 text-center">{line.quantity}</span>
                            <button onClick={() => adjustQuantity(line.productId, line.size, line.color, 1)} className="w-6 h-6 flex items-center justify-center text-sm">+</button>
                          </div>
                          <button onClick={() => removeLine(line.productId, line.size, line.color)} className="text-xs underline underline-offset-2" style={{ color: 'var(--tg-ink-dim)' }}>Remove</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t px-6 py-5" style={{ borderColor: 'var(--tg-line)' }}>
                  <div className="flex items-center justify-between text-sm mb-4"><span style={{ color: 'var(--tg-ink-muted)' }}>Subtotal</span><span className="text-base font-semibold">{formatINR(subtotal)}</span></div>
                  <Link href={`/store/${slug}/checkout`} onClick={closeCart} className="block text-center w-full py-3.5 rounded-full text-sm font-semibold" style={{ background: 'var(--tg-accent)', color: 'var(--tg-accent-ink)' }}>Checkout</Link>
                  <p className="text-[11px] text-center mt-3" style={{ color: 'var(--tg-ink-dim)' }}>Free shipping across India &middot; COD available</p>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

function ShellInner({ children, brand }: { children: ReactNode; brand: ThemeBrand }) {
  return (
    <div className="thegrid-root min-h-screen flex flex-col" style={{ ...THEGRID_VARS, background: 'var(--tg-bg)', color: 'var(--tg-ink)', fontFamily: 'var(--tg-sans)' } as CSSProperties}>
      <TheGridHeader brand={brand} />
      <main className="flex-1">{children}</main>
      <TheGridFooter brand={brand} />
      <TheGridCartDrawer brand={brand} />
    </div>
  )
}

export function TheGridShell({ children, brand }: { children: ReactNode; brand: ThemeBrand }) {
  // Dashboard/Mobile-app preview tabs (PreviewBanner, ?view=) need the raw
  // storefront content only — skip this theme's own nav/footer chrome.
  const previewView = useSearchParams().get('view')
  if (previewView === 'dashboard' || previewView === 'app') return <>{children}</>

  return (
    <>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Manrope:wght@400;500;600;700&display=swap" />
      <FlagshipCartProvider storageKey="thegrid_cart_v1">
        <ShellInner brand={brand}>{children}</ShellInner>
      </FlagshipCartProvider>
    </>
  )
}
