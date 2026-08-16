'use client'

import Link from 'next/link'
import { useEffect, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FlagshipCartProvider, useFlagshipCart } from '@/lib/flagship/cart-context'
import type { ThemeBrand } from '@/lib/flagship/types'

// DHAMAKA scopes its own CSS variables inline (rather than in globals.css,
// which is out of scope to edit for this build) — same pattern every other
// flagship theme's globals.css block follows (.bloom-root, .ember-root,
// .august-root), just kept self-contained to this file instead. Near-black
// base so the red/yellow "flash sale" accents read at maximum contrast —
// the loud, commercial opposite of BLOOM's soft daylight palette.
const DHAMAKA_STYLE = `
.dhamaka-root {
  --dh-display: 'Anton', sans-serif;
  --dh-sans: 'Barlow Condensed', var(--font-body), sans-serif;
  --dh-bg: #121212;
  --dh-ink: #FFFFFF;
  --dh-ink-muted: rgba(255,255,255,0.68);
  --dh-ink-dim: rgba(255,255,255,0.42);
  --dh-card: #1E1E1E;
  --dh-line: rgba(255,255,255,0.14);
  --dh-red: #E11D2E;
  --dh-red-ink: #FFFFFF;
  --dh-yellow: #FFD400;
  --dh-yellow-ink: #121212;
  --dh-glass: rgba(18,18,18,0.86);
  background: var(--dh-bg);
  color: var(--dh-ink);
  font-family: var(--dh-sans);
}
.dhamaka-display { font-family: var(--dh-display); }
.dhamaka-glass {
  background: var(--dh-glass);
  backdrop-filter: blur(14px) saturate(140%);
  -webkit-backdrop-filter: blur(14px) saturate(140%);
}
`

function DhamakaHeader({ brand }: { brand: ThemeBrand }) {
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
      className="sticky top-0 z-50 transition-colors duration-300"
      style={{
        borderBottom: scrolled ? '2px solid var(--dh-red)' : '2px solid transparent',
        background: scrolled ? 'var(--dh-glass)' : 'transparent',
        backdropFilter: scrolled ? 'blur(14px) saturate(140%)' : 'none',
      }}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 h-16 md:h-20 flex items-center justify-between gap-6">
        <Link href={`/store/${slug}`} className="flex items-center flex-shrink-0" style={{ color: 'var(--dh-ink)' }}>
          <span className="dhamaka-display text-3xl md:text-4xl tracking-tight" style={{ color: 'var(--dh-yellow)', WebkitTextStroke: '1px var(--dh-red)' }}>DHAMAKA</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-[14px] font-semibold uppercase tracking-wide" style={{ color: 'var(--dh-ink-muted)' }}>
          <div className="relative" onMouseEnter={() => setShopOpen(true)} onMouseLeave={() => setShopOpen(false)}>
            <Link href={`/store/${slug}/shop`} className="hover:opacity-100 transition-opacity" style={{ color: shopOpen ? 'var(--dh-ink)' : 'inherit' }}>
              Shop All
            </Link>
            {shopOpen && brand.categories.length > 0 && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4">
                <div className="dhamaka-glass rounded-lg border p-4 flex flex-col gap-2 min-w-[170px] shadow-xl" style={{ borderColor: 'var(--dh-line)' }}>
                  {brand.categories.map(c => (
                    <Link key={c} href={`/store/${slug}/shop?category=${encodeURIComponent(c)}`} className="text-sm normal-case font-normal py-1 hover:opacity-60 transition-opacity" style={{ color: 'var(--dh-ink)' }}>
                      {c}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          <a href="#radar" className="hover:opacity-100 transition-opacity">Price Radar</a>
        </nav>

        <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide px-3 py-1.5 rounded" style={{ background: 'var(--dh-red)', color: 'var(--dh-red-ink)' }}>
            Under ₹1,999
          </span>
          <button
            onClick={openCart}
            aria-label="Open bag"
            className="relative w-9 h-9 flex items-center justify-center transition-opacity hover:opacity-70"
            style={{ color: 'var(--dh-ink)' }}
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
              <path d="M6 8h12l-1 13H7L6 8z" /><path d="M9 8V6a3 3 0 016 0v2" />
            </svg>
            {count > 0 && (
              <span
                className="absolute -top-1 -right-1 text-[10px] w-4.5 h-4.5 min-w-[18px] min-h-[18px] rounded-full flex items-center justify-center font-bold"
                style={{ background: 'var(--dh-yellow)', color: 'var(--dh-yellow-ink)' }}
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

function DhamakaFooter({ brand }: { brand: ThemeBrand }) {
  const slug = brand.slug
  const isDemoData = !brand.sellerId

  return (
    <footer id="radar" className="mt-32 border-t" style={{ borderColor: 'var(--dh-line)' }}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1">
          <span className="dhamaka-display text-2xl" style={{ color: 'var(--dh-yellow)' }}>{brand.name}</span>
          <p className="text-sm mt-3 max-w-[240px] leading-relaxed" style={{ color: 'var(--dh-ink-muted)' }}>
            {brand.tagline}
          </p>
        </div>
        {brand.categories.length > 0 && (
          <div>
            <p className="text-[11px] uppercase tracking-[0.12em] mb-4 font-bold" style={{ color: 'var(--dh-red)' }}>Shop</p>
            <div className="flex flex-col gap-2.5 text-sm">
              {brand.categories.map(c => (
                <Link key={c} href={`/store/${slug}/shop?category=${encodeURIComponent(c)}`} className="hover:opacity-60 transition-opacity" style={{ color: 'var(--dh-ink-muted)' }}>
                  {c}
                </Link>
              ))}
            </div>
          </div>
        )}
        <div>
          <p className="text-[11px] uppercase tracking-[0.12em] mb-4 font-bold" style={{ color: 'var(--dh-red)' }}>Price Radar</p>
          <div className="flex flex-col gap-2.5 text-sm" style={{ color: 'var(--dh-ink-muted)' }}>
            <span>How it works</span>
            <span>Lowest-price alerts</span>
            <span>60-day price history</span>
          </div>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.12em] mb-4 font-bold" style={{ color: 'var(--dh-red)' }}>Support</p>
          <div className="flex flex-col gap-2.5 text-sm" style={{ color: 'var(--dh-ink-muted)' }}>
            <a href="#" className="hover:opacity-60 transition-opacity">Shipping &amp; returns</a>
            <a href="#" className="hover:opacity-60 transition-opacity">Size guide</a>
            <a href="#" className="hover:opacity-60 transition-opacity">Contact</a>
          </div>
        </div>
      </div>
      <div className="border-t py-6" style={{ borderColor: 'var(--dh-line)' }}>
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px]" style={{ color: 'var(--dh-ink-dim)' }}>
          {isDemoData ? (
            <p>A concept storefront demonstrating WearOn&apos;s &quot;August&quot; flagship theme. Not a real retailer.</p>
          ) : (
            <p>{brand.name}, built on WearOn.</p>
          )}
          <p>Powered by <Link href="/" className="hover:opacity-70 transition-opacity" style={{ color: 'inherit' }}>WearOn</Link></p>
        </div>
      </div>
    </footer>
  )
}

function DhamakaCartDrawer({ brand }: { brand: ThemeBrand }) {
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
            className="dhamaka-glass fixed top-0 right-0 h-full w-full sm:w-[420px] z-[91] flex flex-col border-l"
            style={{ borderColor: 'var(--dh-line)', color: 'var(--dh-ink)' }}
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 300 }}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: 'var(--dh-line)' }}>
              <h2 className="dhamaka-display text-2xl" style={{ color: 'var(--dh-yellow)' }}>Your Bag</h2>
              <button onClick={closeCart} aria-label="Close" className="w-8 h-8 flex items-center justify-center hover:opacity-60 transition-opacity">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-4">
                <p className="text-sm" style={{ color: 'var(--dh-ink-muted)' }}>Your bag is empty.</p>
                <Link href={`/store/${slug}/shop`} onClick={closeCart} className="text-sm underline underline-offset-4 font-semibold" style={{ color: 'var(--dh-yellow)' }}>
                  Continue browsing
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
                  {lines.map(line => (
                    <div key={`${line.productId}-${line.size}-${line.color}`} className="flex gap-4">
                      <div className="w-20 h-24 rounded-lg flex-shrink-0" style={{ background: 'var(--dh-card)' }}>
                        <img
                          src={line.image}
                          alt={line.name}
                          className="w-20 h-24 object-cover rounded-lg"
                          onError={e => { e.currentTarget.style.display = 'none' }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold">{line.name}</p>
                          <p className="text-sm flex-shrink-0">₹{(line.price * line.quantity).toLocaleString('en-IN')}</p>
                        </div>
                        <p className="text-xs mt-1" style={{ color: 'var(--dh-ink-muted)' }}>
                          {line.color}{line.size ? ` · ${line.size}` : ''}
                        </p>
                        <div className="flex items-center gap-3 mt-2.5">
                          <div className="flex items-center border rounded" style={{ borderColor: 'var(--dh-line)' }}>
                            <button onClick={() => adjustQuantity(line.productId, line.size, line.color, -1)} className="w-6 h-6 flex items-center justify-center text-sm hover:opacity-60">−</button>
                            <span className="text-xs w-5 text-center">{line.quantity}</span>
                            <button onClick={() => adjustQuantity(line.productId, line.size, line.color, 1)} className="w-6 h-6 flex items-center justify-center text-sm hover:opacity-60">+</button>
                          </div>
                          <button onClick={() => removeLine(line.productId, line.size, line.color)} className="text-xs underline underline-offset-2 hover:opacity-60" style={{ color: 'var(--dh-ink-dim)' }}>
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t px-6 py-5" style={{ borderColor: 'var(--dh-line)' }}>
                  <div className="flex items-center justify-between text-sm mb-4">
                    <span style={{ color: 'var(--dh-ink-muted)' }}>Subtotal</span>
                    <span className="text-base font-bold">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <Link
                    href={`/store/${slug}/checkout`}
                    onClick={closeCart}
                    className="block text-center w-full py-3.5 rounded text-sm tracking-wide font-bold uppercase transition-opacity hover:opacity-90"
                    style={{ background: 'var(--dh-red)', color: 'var(--dh-red-ink)' }}
                  >
                    Checkout
                  </Link>
                  <p className="text-[11px] text-center mt-3" style={{ color: 'var(--dh-ink-dim)' }}>
                    Prices this good won&apos;t sit in your bag forever
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
    <div className="dhamaka-root min-h-screen flex flex-col">
      <DhamakaHeader brand={brand} />
      <main className="flex-1">{children}</main>
      <DhamakaFooter brand={brand} />
      <DhamakaCartDrawer brand={brand} />
    </div>
  )
}

export function DhamakaShell({ children, brand }: { children: ReactNode; brand: ThemeBrand }) {
  return (
    <>
      {/* Scoped to this theme only — not loaded globally */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anton&family=Barlow+Condensed:wght@400;500;600;700;800&display=swap" />
      <style>{DHAMAKA_STYLE}</style>
      <FlagshipCartProvider storageKey="dhamaka_cart_v1">
        <ShellInner brand={brand}>{children}</ShellInner>
      </FlagshipCartProvider>
    </>
  )
}
