'use client'

import Link from 'next/link'
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FlagshipCartProvider, useFlagshipCart } from '@/lib/flagship/cart-context'
import type { ThemeBrand } from '@/lib/flagship/types'
import type { RentalSelection } from './KirayaRentForDate'
import { lineKey } from './KirayaRentForDate'

// KIRAYA — flagship theme, "December". The rental marketplace: dark-first
// always (like EMBER, no light/dark toggle — a rental boutique doesn't need
// one), deep plum / antique gold / near-black, a calmer and more considered
// mood than SAAJ's wedding-shopper joy or TAANA's artisan quiet. Scoped CSS
// tokens are injected inline here (not in globals.css) so this theme stays
// fully self-contained in src/components/kiraya + src/lib/kiraya, per the
// build brief — no existing file is touched.

const KIRAYA_STYLES = `
.kiraya-root {
  --ki-display: 'Cormorant Garamond', serif;
  --ki-sans: 'Jost', var(--font-body), sans-serif;
  --ki-bg: #150B16;
  --ki-ink: #F3E9E6;
  --ki-ink-muted: rgba(243, 233, 230, 0.64);
  --ki-ink-dim: rgba(243, 233, 230, 0.38);
  --ki-card: #241227;
  --ki-line: rgba(243, 233, 230, 0.14);
  --ki-accent: #C6A15B;
  --ki-accent-ink: #150B16;
  --ki-plum: #3D1E3F;
  --ki-glass: rgba(21, 11, 22, 0.8);
  background: var(--ki-bg);
  color: var(--ki-ink);
  font-family: var(--ki-sans);
  min-height: 100vh;
}
.kiraya-glass {
  background: var(--ki-glass);
  backdrop-filter: blur(16px) saturate(140%);
  -webkit-backdrop-filter: blur(16px) saturate(140%);
}
.kiraya-display { font-family: var(--ki-display); }
`

// Rental info lives in a small parallel context (localStorage-backed, same
// pattern as FlagshipCartProvider) keyed by the same productId::size::color
// key as the cart line, rather than extending CartLine itself — so the
// generic flagship cart contract stays untouched but the event date + window
// still rides genuinely through cart → checkout → confirmation.
interface RentalRecord extends RentalSelection {
  productName: string
}

interface RentalsContextValue {
  rentals: Record<string, RentalRecord>
  setRental: (key: string, record: RentalRecord) => void
}

const RentalsContext = createContext<RentalsContextValue | null>(null)
const RENTALS_STORAGE_KEY = 'kiraya_rentals_v1'

function RentalsProvider({ children }: { children: ReactNode }) {
  const [rentals, setRentals] = useState<Record<string, RentalRecord>>({})
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(RENTALS_STORAGE_KEY)
      if (raw) setRentals(JSON.parse(raw))
    } catch { /* ignore corrupt local storage */ }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    window.localStorage.setItem(RENTALS_STORAGE_KEY, JSON.stringify(rentals))
  }, [rentals, hydrated])

  const setRental = useCallback((key: string, record: RentalRecord) => {
    setRentals(prev => ({ ...prev, [key]: record }))
  }, [])

  return <RentalsContext.Provider value={{ rentals, setRental }}>{children}</RentalsContext.Provider>
}

export function useKirayaRentals() {
  const ctx = useContext(RentalsContext)
  if (!ctx) throw new Error('useKirayaRentals must be used within KirayaShell')
  return ctx
}

export { lineKey }

function formatShort(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', timeZone: 'UTC' })
}

function KirayaHeader({ brand }: { brand: ThemeBrand }) {
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
        borderBottom: scrolled ? '1px solid var(--ki-line)' : '1px solid transparent',
        background: scrolled ? 'var(--ki-glass)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px) saturate(140%)' : 'none',
      }}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 h-16 md:h-20 flex items-center justify-between gap-6">
        <Link href={`/store/${slug}`} className="flex items-center flex-shrink-0" style={{ color: 'var(--ki-ink)' }}>
          <span className="kiraya-display italic text-2xl md:text-3xl tracking-tight" style={{ color: 'var(--ki-accent)' }}>Kiraya</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-[13px] tracking-wide" style={{ color: 'var(--ki-ink-muted)' }}>
          <div className="relative" onMouseEnter={() => setShopOpen(true)} onMouseLeave={() => setShopOpen(false)}>
            <Link href={`/store/${slug}/shop`} className="hover:opacity-100 transition-opacity" style={{ color: shopOpen ? 'var(--ki-ink)' : 'inherit' }}>
              Rent the Collection
            </Link>
            {shopOpen && brand.categories.length > 0 && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4">
                <div className="kiraya-glass rounded-2xl border p-4 flex flex-col gap-2 min-w-[190px] shadow-xl" style={{ borderColor: 'var(--ki-line)' }}>
                  {brand.categories.map(c => (
                    <Link key={c} href={`/store/${slug}/shop?category=${encodeURIComponent(c)}`} className="text-sm py-1 hover:opacity-60 transition-opacity" style={{ color: 'var(--ki-ink)' }}>
                      {c}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          <a href="#how-it-works" className="hover:opacity-100 transition-opacity">How renting works</a>
        </nav>

        <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
          <button
            onClick={openCart}
            aria-label="Open bag"
            className="relative w-8 h-8 flex items-center justify-center transition-opacity hover:opacity-70"
            style={{ color: 'var(--ki-ink)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <path d="M6 8h12l-1 13H7L6 8z" /><path d="M9 8V6a3 3 0 016 0v2" />
            </svg>
            {count > 0 && (
              <span
                className="absolute -top-1 -right-1 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold"
                style={{ background: 'var(--ki-accent)', color: 'var(--ki-accent-ink)' }}
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

function KirayaFooter({ brand }: { brand: ThemeBrand }) {
  const slug = brand.slug
  const isDemoData = !brand.sellerId

  return (
    <footer className="mt-32 border-t" style={{ borderColor: 'var(--ki-line)' }}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1">
          <span className="kiraya-display italic text-2xl" style={{ color: 'var(--ki-accent)' }}>{brand.name}</span>
          <p className="text-sm mt-3 max-w-[240px] leading-relaxed" style={{ color: 'var(--ki-ink-muted)' }}>{brand.tagline}</p>
        </div>
        {brand.categories.length > 0 && (
          <div>
            <p className="text-[11px] uppercase tracking-[0.12em] mb-4" style={{ color: 'var(--ki-ink-dim)' }}>Rent</p>
            <div className="flex flex-col gap-2.5 text-sm">
              {brand.categories.map(c => (
                <Link key={c} href={`/store/${slug}/shop?category=${encodeURIComponent(c)}`} className="hover:opacity-60 transition-opacity" style={{ color: 'var(--ki-ink-muted)' }}>{c}</Link>
              ))}
            </div>
          </div>
        )}
        <div>
          <p className="text-[11px] uppercase tracking-[0.12em] mb-4" style={{ color: 'var(--ki-ink-dim)' }}>How It Works</p>
          <div className="flex flex-col gap-2.5 text-sm" style={{ color: 'var(--ki-ink-muted)' }}>
            <a href="#how-it-works" className="hover:opacity-60 transition-opacity">Pick your date</a>
            <a href="#how-it-works" className="hover:opacity-60 transition-opacity">Delivery &amp; return</a>
            <a href="#" className="hover:opacity-60 transition-opacity">Damage policy</a>
          </div>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.12em] mb-4" style={{ color: 'var(--ki-ink-dim)' }}>Client Services</p>
          <div className="flex flex-col gap-2.5 text-sm" style={{ color: 'var(--ki-ink-muted)' }}>
            <a href="#" className="hover:opacity-60 transition-opacity">Size guide</a>
            <a href="#" className="hover:opacity-60 transition-opacity">Cleaning &amp; care</a>
            <a href="#" className="hover:opacity-60 transition-opacity">Contact</a>
          </div>
        </div>
      </div>
      <div className="border-t py-6" style={{ borderColor: 'var(--ki-line)' }}>
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px]" style={{ color: 'var(--ki-ink-dim)' }}>
          {isDemoData ? (
            <p>A concept storefront demonstrating Instastarz&apos;s &quot;December&quot; flagship theme. Not a real rental service.</p>
          ) : (
            <p>{brand.name}, built on Instastarz.</p>
          )}
          <p>Powered by <Link href="/" className="hover:opacity-70 transition-opacity" style={{ color: 'inherit' }}>Instastarz</Link></p>
        </div>
      </div>
    </footer>
  )
}

function KirayaCartDrawer({ brand }: { brand: ThemeBrand }) {
  const slug = brand.slug
  const { isOpen, closeCart, lines, subtotal, adjustQuantity, removeLine } = useFlagshipCart()
  const { rentals } = useKirayaRentals()

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
            className="kiraya-glass fixed top-0 right-0 h-full w-full sm:w-[420px] z-[91] flex flex-col border-l"
            style={{ borderColor: 'var(--ki-line)', color: 'var(--ki-ink)' }}
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 300 }}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: 'var(--ki-line)' }}>
              <h2 className="kiraya-display italic text-2xl" style={{ color: 'var(--ki-accent)' }}>Your Rentals</h2>
              <button onClick={closeCart} aria-label="Close" className="w-8 h-8 flex items-center justify-center hover:opacity-60 transition-opacity">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-4">
                <p className="text-sm" style={{ color: 'var(--ki-ink-muted)' }}>Your bag is empty.</p>
                <Link href={`/store/${slug}/shop`} onClick={closeCart} className="text-sm underline underline-offset-4" style={{ color: 'var(--ki-accent)' }}>Continue browsing</Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
                  {lines.map(line => {
                    const rental = rentals[lineKey(line.productId, line.size, line.color)]
                    return (
                      <div key={`${line.productId}-${line.size}-${line.color}`} className="flex gap-4">
                        <div className="w-20 h-24 rounded-xl flex-shrink-0 overflow-hidden" style={{ background: 'var(--ki-plum)' }}>
                          <img src={line.image} alt={line.name} className="w-full h-full object-cover" onError={e => { e.currentTarget.style.display = 'none' }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-medium">{line.name}</p>
                            <p className="text-sm flex-shrink-0">₹{(line.price * line.quantity).toLocaleString('en-IN')}</p>
                          </div>
                          <p className="text-xs mt-1" style={{ color: 'var(--ki-ink-muted)' }}>
                            {line.color}{line.size ? ` · ${line.size}` : ''}
                          </p>
                          {rental && (
                            <p className="text-[11px] mt-1" style={{ color: 'var(--ki-accent)' }}>
                              Event {formatShort(rental.eventDate)} · Return by {formatShort(rental.returnDate)}
                            </p>
                          )}
                          <div className="flex items-center gap-3 mt-2.5">
                            <div className="flex items-center border rounded-full" style={{ borderColor: 'var(--ki-line)' }}>
                              <button onClick={() => adjustQuantity(line.productId, line.size, line.color, -1)} className="w-6 h-6 flex items-center justify-center text-sm hover:opacity-60">−</button>
                              <span className="text-xs w-5 text-center">{line.quantity}</span>
                              <button onClick={() => adjustQuantity(line.productId, line.size, line.color, 1)} className="w-6 h-6 flex items-center justify-center text-sm hover:opacity-60">+</button>
                            </div>
                            <button onClick={() => removeLine(line.productId, line.size, line.color)} className="text-xs underline underline-offset-2 hover:opacity-60" style={{ color: 'var(--ki-ink-dim)' }}>Remove</button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="border-t px-6 py-5" style={{ borderColor: 'var(--ki-line)' }}>
                  <div className="flex items-center justify-between text-sm mb-4">
                    <span style={{ color: 'var(--ki-ink-muted)' }}>Rental Subtotal</span>
                    <span className="text-base font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <Link
                    href={`/store/${slug}/checkout`}
                    onClick={closeCart}
                    className="block text-center w-full py-3.5 rounded-full text-sm tracking-wide font-medium transition-opacity hover:opacity-90"
                    style={{ background: 'var(--ki-accent)', color: 'var(--ki-accent-ink)' }}
                  >
                    Checkout
                  </Link>
                  <p className="text-[11px] text-center mt-3" style={{ color: 'var(--ki-ink-dim)' }}>Free delivery &amp; return pickup on every rental</p>
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
    <div className="kiraya-root min-h-screen flex flex-col">
      <KirayaHeader brand={brand} />
      <main className="flex-1">{children}</main>
      <KirayaFooter brand={brand} />
      <KirayaCartDrawer brand={brand} />
    </div>
  )
}

export function KirayaShell({ children, brand }: { children: ReactNode; brand: ThemeBrand }) {
  return (
    <>
      {/* Scoped to this theme only — not loaded globally */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500;1,600&family=Jost:wght@400;500;600;700&display=swap" />
      <style dangerouslySetInnerHTML={{ __html: KIRAYA_STYLES }} />
      <FlagshipCartProvider storageKey="kiraya_cart_v1">
        <RentalsProvider>
          <ShellInner brand={brand}>{children}</ShellInner>
        </RentalsProvider>
      </FlagshipCartProvider>
    </>
  )
}
