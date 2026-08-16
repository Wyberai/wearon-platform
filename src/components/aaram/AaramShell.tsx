'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FlagshipCartProvider, useFlagshipCart } from '@/lib/flagship/cart-context'
import type { ThemeBrand } from '@/lib/flagship/types'
import { AaramDayMatch } from './AaramDayMatch'

// The homepage hero's day-type chips need to open this same modal
// pre-selected — but Home and the modal are siblings under this shell, not
// parent/child, so a plain DOM CustomEvent bridges them without threading
// modal state through every route/page component in between (same bridge
// pattern as Ember's Mood Match).
export const OPEN_DAY_MATCH_EVENT = 'aaram:open-day-match'

// AARAM's CSS custom properties are scoped to .aaram-root here (not in
// globals.css — this theme's files are additive-only, nothing existing
// gets touched). Warm clay / oat / sage / soft charcoal ink — calm and
// unhurried, never loud. A soft literary serif for display type paired
// with a rounded, friendly sans for body text.
function AaramThemeStyle() {
  return (
    <style>{`
      .aaram-root {
        --ar-display: 'Lora', serif;
        --ar-sans: var(--font-body), 'Nunito Sans', sans-serif;
        --ar-bg: #E8DFD1;
        --ar-ink: #2E2A26;
        --ar-ink-muted: rgba(46, 42, 38, 0.62);
        --ar-ink-dim: rgba(46, 42, 38, 0.38);
        --ar-card: #F3ECE0;
        --ar-line: rgba(46, 42, 38, 0.12);
        --ar-accent: #C08B6C;
        --ar-accent-ink: #FFFFFF;
        --ar-sage: #8A9A7E;
        --ar-glass: rgba(232, 223, 209, 0.82);
        background: var(--ar-bg);
        color: var(--ar-ink);
        font-family: var(--ar-sans);
      }
      .aaram-display { font-family: var(--ar-display); }
      .aaram-glass {
        background: var(--ar-glass);
        backdrop-filter: blur(16px) saturate(140%);
        -webkit-backdrop-filter: blur(16px) saturate(140%);
      }
    `}</style>
  )
}

function AaramHeader({ brand, onOpenDayMatch }: { brand: ThemeBrand; onOpenDayMatch: () => void }) {
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
        borderBottom: scrolled ? '1px solid var(--ar-line)' : '1px solid transparent',
        background: scrolled ? 'var(--ar-glass)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px) saturate(140%)' : 'none',
      }}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 h-16 md:h-20 flex items-center justify-between gap-6">
        <Link href={`/store/${slug}`} className="flex items-center flex-shrink-0" style={{ color: 'var(--ar-ink)' }}>
          <span className="aaram-display text-xl md:text-2xl tracking-tight">{brand.name.toLowerCase()}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-[13px] tracking-wide" style={{ color: 'var(--ar-ink-muted)' }}>
          <div className="relative" onMouseEnter={() => setShopOpen(true)} onMouseLeave={() => setShopOpen(false)}>
            <Link href={`/store/${slug}/shop`} className="hover:opacity-100 transition-opacity" style={{ color: shopOpen ? 'var(--ar-ink)' : 'inherit' }}>
              Shop
            </Link>
            {shopOpen && brand.categories.length > 0 && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4">
                <div className="aaram-glass rounded-2xl border p-4 flex flex-col gap-2 min-w-[180px] shadow-xl" style={{ borderColor: 'var(--ar-line)' }}>
                  {brand.categories.map(c => (
                    <Link key={c} href={`/store/${slug}/shop?category=${encodeURIComponent(c)}`} className="text-sm py-1 hover:opacity-60 transition-opacity" style={{ color: 'var(--ar-ink)' }}>
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
            onClick={onOpenDayMatch}
            className="hidden sm:flex items-center gap-1.5 text-[13px] tracking-wide rounded-full px-4 py-2 transition-transform hover:scale-105"
            style={{ background: 'var(--ar-accent)', color: 'var(--ar-accent-ink)' }}
          >
            ☕ Day Match
          </button>

          <button
            onClick={openCart}
            aria-label="Open bag"
            className="relative w-8 h-8 flex items-center justify-center transition-opacity hover:opacity-70"
            style={{ color: 'var(--ar-ink)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <path d="M6 8h12l-1 13H7L6 8z"/><path d="M9 8V6a3 3 0 016 0v2"/>
            </svg>
            {count > 0 && (
              <span
                className="absolute -top-1 -right-1 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold"
                style={{ background: 'var(--ar-accent)', color: 'var(--ar-accent-ink)' }}
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

function AaramFooter({ brand }: { brand: ThemeBrand }) {
  const slug = brand.slug
  const isDemoData = !brand.sellerId

  return (
    <footer id="journal" className="mt-32 border-t" style={{ borderColor: 'var(--ar-line)' }}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1">
          <span className="aaram-display text-lg tracking-tight">{brand.name.toLowerCase()}</span>
          <p className="text-sm mt-3 max-w-[220px] leading-relaxed" style={{ color: 'var(--ar-ink-muted)' }}>
            {brand.tagline}
          </p>
        </div>
        {brand.categories.length > 0 && (
          <div>
            <p className="text-[11px] uppercase tracking-[0.12em] mb-4" style={{ color: 'var(--ar-ink-dim)' }}>Shop</p>
            <div className="flex flex-col gap-2.5 text-sm">
              {brand.categories.map(c => (
                <Link key={c} href={`/store/${slug}/shop?category=${encodeURIComponent(c)}`} className="hover:opacity-60 transition-opacity" style={{ color: 'var(--ar-ink-muted)' }}>
                  {c}
                </Link>
              ))}
            </div>
          </div>
        )}
        <div>
          <p className="text-[11px] uppercase tracking-[0.12em] mb-4" style={{ color: 'var(--ar-ink-dim)' }}>About</p>
          <div className="flex flex-col gap-2.5 text-sm" style={{ color: 'var(--ar-ink-muted)' }}>
            <a href="#" className="hover:opacity-60 transition-opacity">Our story</a>
            <a href="#" className="hover:opacity-60 transition-opacity">Fabric guide</a>
            <a href="#" className="hover:opacity-60 transition-opacity">Care guide</a>
          </div>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.12em] mb-4" style={{ color: 'var(--ar-ink-dim)' }}>Support</p>
          <div className="flex flex-col gap-2.5 text-sm" style={{ color: 'var(--ar-ink-muted)' }}>
            <a href="#" className="hover:opacity-60 transition-opacity">Shipping &amp; returns</a>
            <a href="#" className="hover:opacity-60 transition-opacity">Size guide</a>
            <a href="#" className="hover:opacity-60 transition-opacity">Contact</a>
          </div>
        </div>
      </div>
      <div className="border-t py-6" style={{ borderColor: 'var(--ar-line)' }}>
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px]" style={{ color: 'var(--ar-ink-dim)' }}>
          {isDemoData ? (
            <p>A concept storefront demonstrating Instastarz&apos;s &quot;September&quot; flagship theme. Not a real retailer.</p>
          ) : (
            <p>{brand.name}, built on Instastarz.</p>
          )}
          <p>Powered by <Link href="/" className="hover:opacity-70 transition-opacity" style={{ color: 'inherit' }}>Instastarz</Link></p>
        </div>
      </div>
    </footer>
  )
}

function AaramCartDrawer({ brand }: { brand: ThemeBrand }) {
  const slug = brand.slug
  const { isOpen, closeCart, lines, subtotal, adjustQuantity, removeLine } = useFlagshipCart()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[90]"
            style={{ background: 'rgba(0,0,0,0.45)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={closeCart}
          />
          <motion.aside
            className="aaram-glass fixed top-0 right-0 h-full w-full sm:w-[420px] z-[91] flex flex-col border-l"
            style={{ borderColor: 'var(--ar-line)', color: 'var(--ar-ink)' }}
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 300 }}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: 'var(--ar-line)' }}>
              <h2 className="aaram-display text-lg tracking-tight">Your Bag</h2>
              <button onClick={closeCart} aria-label="Close" className="w-8 h-8 flex items-center justify-center hover:opacity-60 transition-opacity">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden><path d="M6 6l12 12M18 6L6 18"/></svg>
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-4">
                <p className="text-sm" style={{ color: 'var(--ar-ink-muted)' }}>Your bag is empty.</p>
                <Link href={`/store/${slug}/shop`} onClick={closeCart} className="text-sm underline underline-offset-4" style={{ color: 'var(--ar-accent)' }}>
                  Continue browsing
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
                  {lines.map(line => (
                    <div key={`${line.productId}-${line.size}-${line.color}`} className="flex gap-4">
                      <div className="w-20 h-24 rounded-lg flex-shrink-0 relative overflow-hidden" style={{ background: 'var(--ar-card)' }}>
                        <img
                          src={line.image}
                          alt={line.name}
                          className="w-full h-full object-cover"
                          onError={e => { e.currentTarget.style.display = 'none' }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium">{line.name}</p>
                          <p className="text-sm flex-shrink-0">₹{(line.price * line.quantity).toLocaleString('en-IN')}</p>
                        </div>
                        <p className="text-xs mt-1" style={{ color: 'var(--ar-ink-muted)' }}>
                          {line.color}{line.size ? ` · ${line.size}` : ''}
                        </p>
                        <div className="flex items-center gap-3 mt-2.5">
                          <div className="flex items-center border rounded-full" style={{ borderColor: 'var(--ar-line)' }}>
                            <button onClick={() => adjustQuantity(line.productId, line.size, line.color, -1)} className="w-6 h-6 flex items-center justify-center text-sm hover:opacity-60">−</button>
                            <span className="text-xs w-5 text-center">{line.quantity}</span>
                            <button onClick={() => adjustQuantity(line.productId, line.size, line.color, 1)} className="w-6 h-6 flex items-center justify-center text-sm hover:opacity-60">+</button>
                          </div>
                          <button onClick={() => removeLine(line.productId, line.size, line.color)} className="text-xs underline underline-offset-2 hover:opacity-60" style={{ color: 'var(--ar-ink-dim)' }}>
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t px-6 py-5" style={{ borderColor: 'var(--ar-line)' }}>
                  <div className="flex items-center justify-between text-sm mb-4">
                    <span style={{ color: 'var(--ar-ink-muted)' }}>Subtotal</span>
                    <span className="text-base font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <Link
                    href={`/store/${slug}/checkout`}
                    onClick={closeCart}
                    className="block text-center w-full py-3.5 rounded-full text-sm tracking-wide font-medium transition-transform hover:scale-[1.02]"
                    style={{ background: 'var(--ar-accent)', color: 'var(--ar-accent-ink)' }}
                  >
                    Checkout
                  </Link>
                  <p className="text-[11px] text-center mt-3" style={{ color: 'var(--ar-ink-dim)' }}>
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
  const [dayMatchOpen, setDayMatchOpen] = useState(false)
  const [pendingDayKey, setPendingDayKey] = useState<string | null>(null)

  useEffect(() => {
    function handler(e: Event) {
      const detail = (e as CustomEvent<{ dayKey?: string }>).detail
      setPendingDayKey(detail?.dayKey ?? null)
      setDayMatchOpen(true)
    }
    window.addEventListener(OPEN_DAY_MATCH_EVENT, handler)
    return () => window.removeEventListener(OPEN_DAY_MATCH_EVENT, handler)
  }, [])

  return (
    <div className="aaram-root min-h-screen flex flex-col">
      <AaramHeader brand={brand} onOpenDayMatch={() => { setPendingDayKey(null); setDayMatchOpen(true) }} />
      <main className="flex-1">{children}</main>
      <AaramFooter brand={brand} />
      <AaramCartDrawer brand={brand} />
      <AaramDayMatch brand={brand} open={dayMatchOpen} initialDayKey={pendingDayKey} onClose={() => setDayMatchOpen(false)} />

      <button
        onClick={() => { setPendingDayKey(null); setDayMatchOpen(true) }}
        className="fixed bottom-5 right-5 sm:hidden z-40 rounded-full flex items-center justify-center shadow-lg"
        style={{ background: 'var(--ar-accent)', color: 'var(--ar-accent-ink)', width: 52, height: 52 }}
        aria-label="Day Match"
      >
        <span style={{ fontSize: 20 }}>☕</span>
      </button>
    </div>
  )
}

export function AaramShell({ children, brand }: { children: ReactNode; brand: ThemeBrand }) {
  // Dashboard/Mobile-app preview tabs (PreviewBanner, ?view=) need the raw
  // storefront content only — skip this theme's own nav/footer chrome.
  const searchParams = useSearchParams()
  const previewView = searchParams.get('view')
  const previewName = searchParams.get('preview_name')
  const effectiveBrand = previewName ? { ...brand, name: previewName } : brand
  if (previewView === 'dashboard' || previewView === 'app') return <>{children}</>

  return (
    <>
      <AaramThemeStyle />
      {/* Scoped to this theme only — not loaded globally */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;1,400;1,500&family=Nunito+Sans:wght@400;500;600;700&display=swap" />
      <FlagshipCartProvider storageKey="aaram_cart_v1">
        <ShellInner brand={effectiveBrand}>{children}</ShellInner>
      </FlagshipCartProvider>
    </>
  )
}
