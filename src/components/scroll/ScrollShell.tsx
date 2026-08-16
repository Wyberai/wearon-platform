'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FlagshipCartProvider, useFlagshipCart } from '@/lib/flagship/cart-context'
import type { ThemeBrand } from '@/lib/flagship/types'

// SCROLL's design tokens are scoped to .scroll-root via an inline <style>
// tag (rather than a globals.css edit) so this theme stays a self-contained
// drop-in, same isolation principle as every other flagship theme's scoped
// CSS class. White/near-black base, ONE vivid coral-to-violet gradient used
// sparingly for active/liked states and story rings only — never as a flat
// background — so the app reads like modern social-app chrome, not a
// literal copy of any real platform's branding.
const SCROLL_STYLES = `
.scroll-root {
  --sc-display: 'Plus Jakarta Sans', var(--font-body), sans-serif;
  --sc-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, var(--font-body), Helvetica, Arial, sans-serif;
  --sc-bg: #FFFFFF;
  --sc-ink: #111111;
  --sc-ink-muted: rgba(17,17,17,0.55);
  --sc-ink-dim: rgba(17,17,17,0.35);
  --sc-card: #F5F5F5;
  --sc-line: rgba(17,17,17,0.10);
  --sc-accent-from: #FF5864;
  --sc-accent-to: #7B2FF7;
  --sc-accent: #FF3B70;
  --sc-accent-ink: #FFFFFF;
  --sc-glass: rgba(255,255,255,0.86);
  background: var(--sc-bg);
  color: var(--sc-ink);
  font-family: var(--sc-sans);
}
.scroll-display { font-family: var(--sc-display); }
.scroll-glass { background: var(--sc-glass); backdrop-filter: blur(16px) saturate(140%); -webkit-backdrop-filter: blur(16px) saturate(140%); }
.scroll-gradient { background: linear-gradient(135deg, var(--sc-accent-from), var(--sc-accent-to)); }
.scroll-gradient-text { background: linear-gradient(135deg, var(--sc-accent-from), var(--sc-accent-to)); -webkit-background-clip: text; background-clip: text; color: transparent; }
.scroll-story-ring { background: linear-gradient(135deg, var(--sc-accent-from), var(--sc-accent-to)); padding: 2.5px; border-radius: 9999px; }
.scroll-story-ring-seen { background: var(--sc-line); padding: 2.5px; border-radius: 9999px; }
`

function ScrollHeader({ brand }: { brand: ThemeBrand }) {
  const slug = brand.slug
  const { count, openCart } = useFlagshipCart()

  return (
    <header
      className="sticky top-0 z-50 border-b scroll-glass"
      style={{ borderColor: 'var(--sc-line)' }}
    >
      <div className="max-w-[600px] mx-auto px-4 h-14 flex items-center justify-between">
        <Link href={`/store/${slug}`} className="flex items-center flex-shrink-0">
          <span className="scroll-display scroll-gradient-text text-2xl font-extrabold tracking-tight">Scroll</span>
        </Link>

        <nav className="flex items-center gap-5 text-[13px] font-medium" style={{ color: 'var(--sc-ink)' }}>
          <Link href={`/store/${slug}/shop`} className="hover:opacity-60 transition-opacity">Shop</Link>
        </nav>

        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={openCart}
            aria-label="Open bag"
            className="relative w-8 h-8 flex items-center justify-center transition-opacity hover:opacity-70"
            style={{ color: 'var(--sc-ink)' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
              <path d="M6 8h12l-1 13H7L6 8z"/><path d="M9 8V6a3 3 0 016 0v2"/>
            </svg>
            {count > 0 && (
              <span
                className="absolute -top-1 -right-1 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold scroll-gradient"
                style={{ color: 'var(--sc-accent-ink)' }}
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

function ScrollFooter({ brand }: { brand: ThemeBrand }) {
  const slug = brand.slug
  const isDemoData = !brand.sellerId

  return (
    <footer className="mt-16 border-t" style={{ borderColor: 'var(--sc-line)' }}>
      <div className="max-w-[600px] mx-auto px-4 py-10 grid grid-cols-2 gap-8">
        <div className="col-span-2">
          <span className="scroll-display scroll-gradient-text text-xl font-extrabold">{brand.name}</span>
          <p className="text-sm mt-2 max-w-[280px] leading-relaxed" style={{ color: 'var(--sc-ink-muted)' }}>
            {brand.tagline}
          </p>
        </div>
        {brand.categories.length > 0 && (
          <div>
            <p className="text-[11px] uppercase tracking-[0.12em] mb-3" style={{ color: 'var(--sc-ink-dim)' }}>Shop</p>
            <div className="flex flex-col gap-2 text-sm">
              {brand.categories.map(c => (
                <Link key={c} href={`/store/${slug}/shop?category=${encodeURIComponent(c)}`} className="hover:opacity-60 transition-opacity" style={{ color: 'var(--sc-ink-muted)' }}>
                  {c}
                </Link>
              ))}
            </div>
          </div>
        )}
        <div>
          <p className="text-[11px] uppercase tracking-[0.12em] mb-3" style={{ color: 'var(--sc-ink-dim)' }}>Help</p>
          <div className="flex flex-col gap-2 text-sm" style={{ color: 'var(--sc-ink-muted)' }}>
            <a href="#" className="hover:opacity-60 transition-opacity">Shipping &amp; returns</a>
            <a href="#" className="hover:opacity-60 transition-opacity">Size guide</a>
            <a href="#" className="hover:opacity-60 transition-opacity">Contact</a>
          </div>
        </div>
      </div>
      <div className="border-t py-5" style={{ borderColor: 'var(--sc-line)' }}>
        <div className="max-w-[600px] mx-auto px-4 flex flex-col gap-2 text-[11px] text-center" style={{ color: 'var(--sc-ink-dim)' }}>
          {isDemoData ? (
            <p>A concept storefront demonstrating Instastarz&apos;s &quot;July&quot; flagship theme. Not affiliated with, endorsed by, or a copy of any social media platform.</p>
          ) : (
            <p>{brand.name}, built on Instastarz.</p>
          )}
          <p>Powered by <Link href="/" className="hover:opacity-70 transition-opacity" style={{ color: 'inherit' }}>Instastarz</Link></p>
        </div>
      </div>
    </footer>
  )
}

function ScrollCartDrawer({ brand }: { brand: ThemeBrand }) {
  const slug = brand.slug
  const { isOpen, closeCart, lines, subtotal, adjustQuantity, removeLine } = useFlagshipCart()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[90]"
            style={{ background: 'rgba(17,17,17,0.4)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={closeCart}
          />
          <motion.aside
            className="scroll-glass fixed top-0 right-0 h-full w-full sm:w-[400px] z-[91] flex flex-col border-l"
            style={{ borderColor: 'var(--sc-line)', color: 'var(--sc-ink)' }}
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 300 }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--sc-line)' }}>
              <h2 className="scroll-display text-xl font-extrabold">Your Bag</h2>
              <button onClick={closeCart} aria-label="Close" className="w-8 h-8 flex items-center justify-center hover:opacity-60 transition-opacity">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden><path d="M6 6l12 12M18 6L6 18"/></svg>
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-3">
                <p className="text-sm" style={{ color: 'var(--sc-ink-muted)' }}>Your bag is empty.</p>
                <Link href={`/store/${slug}/shop`} onClick={closeCart} className="text-sm font-semibold scroll-gradient-text">
                  Continue browsing
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
                  {lines.map(line => (
                    <div key={`${line.productId}-${line.size}-${line.color}`} className="flex gap-3">
                      <div className="w-16 h-16 rounded-xl flex-shrink-0 overflow-hidden" style={{ background: 'var(--sc-card)' }}>
                        <img
                          src={line.image}
                          alt={line.name}
                          className="w-full h-full object-cover"
                          onError={e => { e.currentTarget.style.display = 'none' }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold truncate">{line.name}</p>
                          <p className="text-sm flex-shrink-0">₹{(line.price * line.quantity).toLocaleString('en-IN')}</p>
                        </div>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--sc-ink-muted)' }}>
                          {line.color}{line.size ? ` · ${line.size}` : ''}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center border rounded-full" style={{ borderColor: 'var(--sc-line)' }}>
                            <button onClick={() => adjustQuantity(line.productId, line.size, line.color, -1)} className="w-6 h-6 flex items-center justify-center text-sm hover:opacity-60">−</button>
                            <span className="text-xs w-5 text-center">{line.quantity}</span>
                            <button onClick={() => adjustQuantity(line.productId, line.size, line.color, 1)} className="w-6 h-6 flex items-center justify-center text-sm hover:opacity-60">+</button>
                          </div>
                          <button onClick={() => removeLine(line.productId, line.size, line.color)} className="text-xs underline underline-offset-2 hover:opacity-60" style={{ color: 'var(--sc-ink-dim)' }}>
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t px-5 py-4" style={{ borderColor: 'var(--sc-line)' }}>
                  <div className="flex items-center justify-between text-sm mb-3">
                    <span style={{ color: 'var(--sc-ink-muted)' }}>Subtotal</span>
                    <span className="text-base font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <Link
                    href={`/store/${slug}/checkout`}
                    onClick={closeCart}
                    className="scroll-gradient block text-center w-full py-3.5 rounded-full text-sm font-bold transition-opacity hover:opacity-90"
                    style={{ color: 'var(--sc-accent-ink)' }}
                  >
                    Checkout
                  </Link>
                  <p className="text-[11px] text-center mt-2.5" style={{ color: 'var(--sc-ink-dim)' }}>
                    Free shipping on every order
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
    <div className="scroll-root min-h-screen flex flex-col">
      <ScrollHeader brand={brand} />
      <main className="flex-1 w-full">{children}</main>
      <ScrollFooter brand={brand} />
      <ScrollCartDrawer brand={brand} />
    </div>
  )
}

export function ScrollShell({ children, brand }: { children: ReactNode; brand: ThemeBrand }) {
  return (
    <>
      {/* Scoped to this theme only — not loaded globally */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;700;800&display=swap" />
      <style dangerouslySetInnerHTML={{ __html: SCROLL_STYLES }} />
      <FlagshipCartProvider storageKey="scroll_cart_v1">
        <ShellInner brand={brand}>{children}</ShellInner>
      </FlagshipCartProvider>
    </>
  )
}
