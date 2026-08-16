'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState, type ReactNode, type CSSProperties } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FlagshipCartProvider, useFlagshipCart } from '@/lib/flagship/cart-context'
import { formatINR } from '@/lib/tryiton/catalog'
import type { ThemeBrand } from '@/lib/flagship/types'

// Dark, night-out palette — distinct from Reel Rack's warm cream and The
// Grid's pure-white monochrome. Every component under
// src/components/tryiton/ reads this off var(--ti-*) once mounted here.
const TRYITON_VARS: CSSProperties = {
  '--ti-display': "'Sora', var(--font-display), sans-serif",
  '--ti-sans': "'Manrope', var(--font-body), sans-serif",
  '--ti-bg': '#141116',
  '--ti-card': '#1E1A21',
  '--ti-ink': '#F5F0EC',
  '--ti-ink-muted': 'rgba(245, 240, 236, 0.65)',
  '--ti-ink-dim': 'rgba(245, 240, 236, 0.4)',
  '--ti-line': 'rgba(245, 240, 236, 0.14)',
  '--ti-accent': '#FF6B4A',
  '--ti-accent-ink': '#141116',
  '--ti-sale': '#FF6B4A',
  '--ti-glass': 'rgba(20, 17, 22, 0.88)',
} as CSSProperties

export function TryItOnImg({
  src, alt, wrapperClassName = '', imgClassName = 'w-full h-full object-cover', bg = 'var(--ti-card)', style, priority = false,
}: { src: string; alt: string; wrapperClassName?: string; imgClassName?: string; bg?: string; style?: CSSProperties; priority?: boolean }) {
  return (
    <div className={wrapperClassName} style={{ background: bg, ...style }}>
      <img src={src} alt={alt} loading={priority ? 'eager' : 'lazy'} className={imgClassName} onError={e => { e.currentTarget.style.display = 'none' }} />
    </div>
  )
}

function TryItOnHeader({ brand }: { brand: ThemeBrand }) {
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
    <header className="sticky top-0 z-50 border-b" style={{ borderColor: 'var(--ti-line)', background: scrolled ? 'var(--ti-glass)' : 'var(--ti-bg)', backdropFilter: scrolled ? 'blur(14px)' : 'none' }}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 h-16 md:h-18 flex items-center justify-between gap-6">
        <Link href={`/store/${slug}`} className="flex-shrink-0" style={{ color: 'var(--ti-ink)' }}>
          <span className="text-xl md:text-2xl font-bold tracking-tight" style={{ fontFamily: 'var(--ti-display)' }}>{brand.name}</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-[13px] font-medium" style={{ color: 'var(--ti-ink-muted)' }}>
          {brand.categories.map(c => (
            <Link key={c} href={`/store/${slug}/shop?category=${encodeURIComponent(c)}`} className="hover:opacity-100 transition-opacity">{c}</Link>
          ))}
        </nav>
        <button onClick={openCart} aria-label="Open bag" className="relative w-9 h-9 flex items-center justify-center rounded-full transition-colors hover:bg-white/5" style={{ color: 'var(--ti-ink)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden><path d="M6 8h12l-1 13H7L6 8z"/><path d="M9 8V6a3 3 0 016 0v2"/></svg>
          {count > 0 && <span className="absolute top-0 right-0 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold" style={{ background: 'var(--ti-accent)', color: 'var(--ti-accent-ink)' }}>{count}</span>}
        </button>
      </div>
    </header>
  )
}

function TryItOnFooter({ brand }: { brand: ThemeBrand }) {
  const slug = brand.slug
  const isDemoData = !brand.sellerId
  return (
    <footer className="mt-24 border-t" style={{ borderColor: 'var(--ti-line)' }}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1">
          <span className="text-xl font-bold" style={{ fontFamily: 'var(--ti-display)' }}>{brand.name}</span>
          <p className="text-sm mt-3 max-w-[220px] leading-relaxed" style={{ color: 'var(--ti-ink-muted)' }}>{brand.tagline}</p>
        </div>
        {brand.categories.length > 0 && (
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] mb-4 font-semibold" style={{ color: 'var(--ti-accent)' }}>Shop</p>
            <div className="flex flex-col gap-2.5 text-sm">
              {brand.categories.map(c => (
                <Link key={c} href={`/store/${slug}/shop?category=${encodeURIComponent(c)}`} className="hover:opacity-70 transition-opacity" style={{ color: 'var(--ti-ink-muted)' }}>{c}</Link>
              ))}
            </div>
          </div>
        )}
        <div>
          <p className="text-[11px] uppercase tracking-[0.14em] mb-4 font-semibold" style={{ color: 'var(--ti-accent)' }}>Support</p>
          <div className="flex flex-col gap-2.5 text-sm" style={{ color: 'var(--ti-ink-muted)' }}>
            <a href="#" className="hover:opacity-70 transition-opacity">Shipping &amp; returns</a>
            <a href="#" className="hover:opacity-70 transition-opacity">Size guide</a>
            <a href="#" className="hover:opacity-70 transition-opacity">Contact</a>
          </div>
        </div>
      </div>
      <div className="border-t py-6" style={{ borderColor: 'var(--ti-line)' }}>
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px]" style={{ color: 'var(--ti-ink-dim)' }}>
          {isDemoData ? <p>A concept storefront demonstrating a Instastarz Insta theme. Not a real retailer.</p> : <p>{brand.name}, built on Instastarz.</p>}
          <p>Powered by <Link href="/" style={{ color: 'inherit' }}>Instastarz</Link></p>
        </div>
      </div>
    </footer>
  )
}

function TryItOnCartDrawer({ brand }: { brand: ThemeBrand }) {
  const slug = brand.slug
  const { isOpen, closeCart, lines, subtotal, adjustQuantity, removeLine } = useFlagshipCart()
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div className="fixed inset-0 z-[90]" style={{ background: 'rgba(0,0,0,0.5)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeCart} />
          <motion.aside className="fixed top-0 right-0 h-full w-full sm:w-[420px] z-[91] flex flex-col border-l" style={{ background: 'var(--ti-bg)', borderColor: 'var(--ti-line)', color: 'var(--ti-ink)' }}
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 32, stiffness: 300 }}>
            <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: 'var(--ti-line)' }}>
              <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--ti-display)' }}>Your Bag</h2>
              <button onClick={closeCart} aria-label="Close" className="w-8 h-8 flex items-center justify-center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
            </div>
            {lines.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-4">
                <p className="text-sm" style={{ color: 'var(--ti-ink-muted)' }}>Your bag is empty.</p>
                <Link href={`/store/${slug}/shop`} onClick={closeCart} className="text-sm underline underline-offset-4" style={{ color: 'var(--ti-accent)' }}>Continue browsing</Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
                  {lines.map(line => (
                    <div key={`${line.productId}-${line.size}-${line.color}`} className="flex gap-4">
                      <TryItOnImg src={line.image} alt={line.name} wrapperClassName="w-20 h-24 rounded-lg overflow-hidden flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium">{line.name}</p>
                          <p className="text-sm flex-shrink-0">{formatINR(line.price * line.quantity)}</p>
                        </div>
                        <p className="text-xs mt-1" style={{ color: 'var(--ti-ink-muted)' }}>{line.color}{line.size ? ` · ${line.size}` : ''}</p>
                        <div className="flex items-center gap-3 mt-2.5">
                          <div className="flex items-center border rounded-full" style={{ borderColor: 'var(--ti-line)' }}>
                            <button onClick={() => adjustQuantity(line.productId, line.size, line.color, -1)} className="w-6 h-6 flex items-center justify-center text-sm">−</button>
                            <span className="text-xs w-5 text-center">{line.quantity}</span>
                            <button onClick={() => adjustQuantity(line.productId, line.size, line.color, 1)} className="w-6 h-6 flex items-center justify-center text-sm">+</button>
                          </div>
                          <button onClick={() => removeLine(line.productId, line.size, line.color)} className="text-xs underline underline-offset-2" style={{ color: 'var(--ti-ink-dim)' }}>Remove</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t px-6 py-5" style={{ borderColor: 'var(--ti-line)' }}>
                  <div className="flex items-center justify-between text-sm mb-4"><span style={{ color: 'var(--ti-ink-muted)' }}>Subtotal</span><span className="text-base font-semibold">{formatINR(subtotal)}</span></div>
                  <Link href={`/store/${slug}/checkout`} onClick={closeCart} className="block text-center w-full py-3.5 rounded-full text-sm font-semibold" style={{ background: 'var(--ti-accent)', color: 'var(--ti-accent-ink)' }}>Checkout</Link>
                  <p className="text-[11px] text-center mt-3" style={{ color: 'var(--ti-ink-dim)' }}>Free shipping across India &middot; COD available</p>
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
    <div className="tryiton-root min-h-screen flex flex-col" style={{ ...TRYITON_VARS, background: 'var(--ti-bg)', color: 'var(--ti-ink)', fontFamily: 'var(--ti-sans)' } as CSSProperties}>
      <TryItOnHeader brand={brand} />
      <main className="flex-1">{children}</main>
      <TryItOnFooter brand={brand} />
      <TryItOnCartDrawer brand={brand} />
    </div>
  )
}

export function TryItOnShell({ children, brand }: { children: ReactNode; brand: ThemeBrand }) {
  // Dashboard/Mobile-app preview tabs (PreviewBanner, ?view=) need the raw
  // storefront content only — skip this theme's own nav/footer chrome.
  const previewView = useSearchParams().get('view')
  if (previewView === 'dashboard' || previewView === 'app') return <>{children}</>

  return (
    <>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Manrope:wght@400;500;600;700&display=swap" />
      <FlagshipCartProvider storageKey="tryiton_cart_v1">
        <ShellInner brand={brand}>{children}</ShellInner>
      </FlagshipCartProvider>
    </>
  )
}
