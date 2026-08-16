'use client'

import Link from 'next/link'
import { useEffect, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FlagshipCartProvider, useFlagshipCart } from '@/lib/flagship/cart-context'
import type { ThemeBrand } from '@/lib/flagship/types'

// GALLI is a single dark-mode street-brand identity — no light/dark toggle,
// same as EMBER. All theming lives in the `.galli-root` scoped <style> below
// rather than globals.css, since this file is new and globals.css is not
// (house rule: never touch existing files — see CLAUDE.md build notes).
const GALLI_STYLE = `
  .galli-root {
    --g-display: 'Anton', sans-serif;
    --g-sans: 'Space Grotesk', var(--font-body), sans-serif;
    --g-bg: #0D0D0D;
    --g-ink: #F5F5F0;
    --g-ink-muted: rgba(245, 245, 240, 0.62);
    --g-ink-dim: rgba(245, 245, 240, 0.38);
    --g-card: #1A1A1A;
    --g-line: rgba(245, 245, 240, 0.14);
    --g-accent: #B6FF3C;
    --g-accent-ink: #0D0D0D;
    --g-accent2: #FF5E1A;
    --g-glass: rgba(13, 13, 13, 0.78);
    background: var(--g-bg);
    color: var(--g-ink);
    font-family: var(--g-sans);
  }
  .galli-glass { background: var(--g-glass); backdrop-filter: blur(16px) saturate(140%); }
  .galli-display { font-family: var(--g-display); text-transform: uppercase; letter-spacing: 0.01em; }
`

function GalliHeader({ brand }: { brand: ThemeBrand }) {
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
        borderBottom: scrolled ? '1px solid var(--g-line)' : '1px solid transparent',
        background: scrolled ? 'var(--g-glass)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px) saturate(140%)' : 'none',
      }}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 h-16 md:h-20 flex items-center justify-between gap-6">
        <Link href={`/store/${slug}`} className="flex items-center flex-shrink-0" style={{ color: 'var(--g-ink)' }}>
          <span className="galli-display text-2xl md:text-3xl">Galli</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-[13px] tracking-wide uppercase" style={{ color: 'var(--g-ink-muted)' }}>
          <div className="relative" onMouseEnter={() => setShopOpen(true)} onMouseLeave={() => setShopOpen(false)}>
            <Link href={`/store/${slug}/shop`} className="hover:opacity-100 transition-opacity" style={{ color: shopOpen ? 'var(--g-ink)' : 'inherit' }}>
              Shop
            </Link>
            {shopOpen && brand.categories.length > 0 && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4">
                <div className="galli-glass rounded-lg border p-4 flex flex-col gap-2 min-w-[180px] shadow-xl" style={{ borderColor: 'var(--g-line)' }}>
                  {brand.categories.map(c => (
                    <Link key={c} href={`/store/${slug}/shop?category=${encodeURIComponent(c)}`} className="text-sm normal-case py-1 hover:opacity-60 transition-opacity" style={{ color: 'var(--g-ink)' }}>
                      {c}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          <a href="#drop-radar" className="hover:opacity-100 transition-opacity" style={{ color: 'var(--g-accent)' }}>Next Drop</a>
        </nav>

        <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
          <a
            href="#drop-radar"
            className="hidden sm:flex items-center gap-1.5 text-[12px] tracking-wide uppercase rounded-full px-4 py-2 border transition-transform hover:scale-105 font-semibold"
            style={{ borderColor: 'var(--g-accent)', color: 'var(--g-accent)' }}
          >
            ⚡ Drop Radar
          </a>

          <button
            onClick={openCart}
            aria-label="Open bag"
            className="relative w-8 h-8 flex items-center justify-center transition-opacity hover:opacity-70"
            style={{ color: 'var(--g-ink)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <path d="M6 8h12l-1 13H7L6 8z"/><path d="M9 8V6a3 3 0 016 0v2"/>
            </svg>
            {count > 0 && (
              <span
                className="absolute -top-1 -right-1 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold"
                style={{ background: 'var(--g-accent)', color: 'var(--g-accent-ink)' }}
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

function GalliFooter({ brand }: { brand: ThemeBrand }) {
  const slug = brand.slug
  const isDemoData = !brand.sellerId

  return (
    <footer className="mt-32 border-t" style={{ borderColor: 'var(--g-line)' }}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1">
          <span className="galli-display text-2xl">{brand.name}</span>
          <p className="text-sm mt-3 max-w-[220px] leading-relaxed" style={{ color: 'var(--g-ink-muted)' }}>
            {brand.tagline}
          </p>
        </div>
        {brand.categories.length > 0 && (
          <div>
            <p className="text-[11px] uppercase tracking-[0.12em] mb-4" style={{ color: 'var(--g-ink-dim)' }}>Shop</p>
            <div className="flex flex-col gap-2.5 text-sm">
              {brand.categories.map(c => (
                <Link key={c} href={`/store/${slug}/shop?category=${encodeURIComponent(c)}`} className="hover:opacity-60 transition-opacity" style={{ color: 'var(--g-ink-muted)' }}>
                  {c}
                </Link>
              ))}
            </div>
          </div>
        )}
        <div>
          <p className="text-[11px] uppercase tracking-[0.12em] mb-4" style={{ color: 'var(--g-ink-dim)' }}>Galli</p>
          <div className="flex flex-col gap-2.5 text-sm" style={{ color: 'var(--g-ink-muted)' }}>
            <a href="#drop-radar" className="hover:opacity-60 transition-opacity">Drop Radar</a>
            <a href="#" className="hover:opacity-60 transition-opacity">Size guide</a>
            <a href="#" className="hover:opacity-60 transition-opacity">FAQs</a>
          </div>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.12em] mb-4" style={{ color: 'var(--g-ink-dim)' }}>Support</p>
          <div className="flex flex-col gap-2.5 text-sm" style={{ color: 'var(--g-ink-muted)' }}>
            <a href="#" className="hover:opacity-60 transition-opacity">Shipping &amp; returns</a>
            <a href="#" className="hover:opacity-60 transition-opacity">Track order</a>
            <a href="#" className="hover:opacity-60 transition-opacity">Contact</a>
          </div>
        </div>
      </div>
      <div className="border-t py-6" style={{ borderColor: 'var(--g-line)' }}>
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px]" style={{ color: 'var(--g-ink-dim)' }}>
          {isDemoData ? (
            <p>A concept storefront demonstrating WearOn&apos;s &quot;November&quot; flagship theme. Not a real retailer.</p>
          ) : (
            <p>{brand.name}, built on WearOn.</p>
          )}
          <p>Powered by <Link href="/" className="hover:opacity-70 transition-opacity" style={{ color: 'inherit' }}>WearOn</Link></p>
        </div>
      </div>
    </footer>
  )
}

function GalliCartDrawer({ brand }: { brand: ThemeBrand }) {
  const slug = brand.slug
  const { isOpen, closeCart, lines, subtotal, adjustQuantity, removeLine } = useFlagshipCart()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[90]"
            style={{ background: 'rgba(0,0,0,0.55)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={closeCart}
          />
          <motion.aside
            className="galli-glass fixed top-0 right-0 h-full w-full sm:w-[420px] z-[91] flex flex-col border-l"
            style={{ borderColor: 'var(--g-line)', color: 'var(--g-ink)' }}
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 300 }}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: 'var(--g-line)' }}>
              <h2 className="galli-display text-2xl">Your Bag</h2>
              <button onClick={closeCart} aria-label="Close" className="w-8 h-8 flex items-center justify-center hover:opacity-60 transition-opacity">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden><path d="M6 6l12 12M18 6L6 18"/></svg>
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-4">
                <p className="text-sm" style={{ color: 'var(--g-ink-muted)' }}>Bag&apos;s empty. Drops don&apos;t wait, bhai.</p>
                <Link href={`/store/${slug}/shop`} onClick={closeCart} className="text-sm underline underline-offset-4" style={{ color: 'var(--g-accent)' }}>
                  Go shop the drop
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
                  {lines.map(line => (
                    <div key={`${line.productId}-${line.size}-${line.color}`} className="flex gap-4">
                      <div className="w-20 h-24 rounded-lg flex-shrink-0 overflow-hidden" style={{ background: 'var(--g-card)' }}>
                        <img
                          src={line.image}
                          alt={line.name}
                          className="w-full h-full object-cover"
                          onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium">{line.name}</p>
                          <p className="text-sm flex-shrink-0">₹{(line.price * line.quantity).toLocaleString('en-IN')}</p>
                        </div>
                        <p className="text-xs mt-1" style={{ color: 'var(--g-ink-muted)' }}>
                          {line.color}{line.size ? ` · ${line.size}` : ''}
                        </p>
                        <div className="flex items-center gap-3 mt-2.5">
                          <div className="flex items-center border rounded-full" style={{ borderColor: 'var(--g-line)' }}>
                            <button onClick={() => adjustQuantity(line.productId, line.size, line.color, -1)} className="w-6 h-6 flex items-center justify-center text-sm hover:opacity-60">−</button>
                            <span className="text-xs w-5 text-center">{line.quantity}</span>
                            <button onClick={() => adjustQuantity(line.productId, line.size, line.color, 1)} className="w-6 h-6 flex items-center justify-center text-sm hover:opacity-60">+</button>
                          </div>
                          <button onClick={() => removeLine(line.productId, line.size, line.color)} className="text-xs underline underline-offset-2 hover:opacity-60" style={{ color: 'var(--g-ink-dim)' }}>
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t px-6 py-5" style={{ borderColor: 'var(--g-line)' }}>
                  <div className="flex items-center justify-between text-sm mb-4">
                    <span style={{ color: 'var(--g-ink-muted)' }}>Subtotal</span>
                    <span className="text-base font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <Link
                    href={`/store/${slug}/checkout`}
                    onClick={closeCart}
                    className="block text-center w-full py-3.5 rounded-full text-sm tracking-wide uppercase font-semibold transition-opacity hover:opacity-90"
                    style={{ background: 'var(--g-accent)', color: 'var(--g-accent-ink)' }}
                  >
                    Checkout
                  </Link>
                  <p className="text-[11px] text-center mt-3" style={{ color: 'var(--g-ink-dim)' }}>
                    Cash on delivery available on every drop
                  </p>
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
    <div className="galli-root min-h-screen flex flex-col">
      <GalliHeader brand={brand} />
      <main className="flex-1">{children}</main>
      <GalliFooter brand={brand} />
      <GalliCartDrawer brand={brand} />

      {/* Mobile entry point — the header's Drop Radar link is desktop-only */}
      <a
        href="#drop-radar"
        className="fixed bottom-5 right-5 sm:hidden z-40 rounded-full flex items-center justify-center shadow-lg font-bold"
        style={{ background: 'var(--g-accent)', color: 'var(--g-accent-ink)', width: 52, height: 52 }}
        aria-label="Jump to Drop Radar"
      >
        <span style={{ fontSize: 20 }}>⚡</span>
      </a>
    </div>
  )
}

export function GalliShell({ children, brand }: { children: ReactNode; brand: ThemeBrand }) {
  return (
    <>
      {/* Scoped to this theme only — not loaded globally */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anton&family=Space+Grotesk:wght@400;500;600;700&display=swap" />
      <style>{GALLI_STYLE}</style>
      <FlagshipCartProvider storageKey="galli_cart_v1">
        <ShellInner brand={brand}>{children}</ShellInner>
      </FlagshipCartProvider>
    </>
  )
}
