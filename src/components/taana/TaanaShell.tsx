'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState, type ReactNode, type CSSProperties } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FlagshipCartProvider, useFlagshipCart } from '@/lib/flagship/cart-context'
import { formatINR } from '@/lib/taana/catalog'
import type { ThemeBrand } from '@/lib/flagship/types'

// The theme's full palette lives as CSS custom properties on this one root
// element, rather than in globals.css — TAANA is a self-contained theme
// package, so any component under src/components/taana/ can reference
// var(--ta-*) once mounted under TaanaShell, with no changes required
// anywhere outside this directory.
const TAANA_VARS: CSSProperties = {
  '--ta-display': "'Fraunces', serif",
  '--ta-sans': "'Jost', var(--font-body), sans-serif",
  '--ta-bg': '#F5F0E6',
  '--ta-card': '#EAE1CC',
  '--ta-ink': '#241F1B',
  '--ta-ink-muted': 'rgba(36, 31, 27, 0.62)',
  '--ta-ink-dim': 'rgba(36, 31, 27, 0.38)',
  '--ta-line': 'rgba(36, 31, 27, 0.14)',
  '--ta-indigo': '#1F3A5F',
  '--ta-rust': '#B5502C',
  '--ta-gold': '#C9A667',
  '--ta-accent': '#1F3A5F',
  '--ta-accent-ink': '#F5F0E6',
  '--ta-glass': 'rgba(245, 240, 230, 0.88)',
} as CSSProperties

// Every <img> in this theme must be able to fail silently — if OpenAI image
// generation ran out of credits or a file is simply missing, the visitor
// should see a clean palette-colored block, never a broken-image icon. This
// wrapper is the one place that guarantee lives; every other Taana component
// renders images through it instead of a bare <img>.
export function TaanaImg({
  src, alt, wrapperClassName = '', imgClassName = 'w-full h-full object-cover', bg = 'var(--ta-card)', style, priority = false,
}: {
  src: string
  alt: string
  wrapperClassName?: string
  imgClassName?: string
  bg?: string
  style?: CSSProperties
  priority?: boolean
}) {
  return (
    <div className={wrapperClassName} style={{ background: bg, ...style }}>
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        className={imgClassName}
        onError={e => { e.currentTarget.style.display = 'none' }}
      />
    </div>
  )
}

function TaanaHeader({ brand }: { brand: ThemeBrand }) {
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
        borderBottom: scrolled ? '1px solid var(--ta-line)' : '1px solid transparent',
        background: scrolled ? 'var(--ta-glass)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px) saturate(140%)' : 'none',
      }}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 h-16 md:h-20 flex items-center justify-between gap-6">
        <Link href={`/store/${slug}`} className="flex items-center flex-shrink-0" style={{ color: 'var(--ta-ink)' }}>
          <span className="taana-display text-2xl md:text-3xl italic tracking-tight" style={{ fontFamily: 'var(--ta-display)' }}>{brand.name.charAt(0) + brand.name.slice(1).toLowerCase()}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-[13px] tracking-wide" style={{ color: 'var(--ta-ink-muted)' }}>
          <div className="relative" onMouseEnter={() => setShopOpen(true)} onMouseLeave={() => setShopOpen(false)}>
            <Link href={`/store/${slug}/shop`} className="hover:opacity-100 transition-opacity" style={{ color: shopOpen ? 'var(--ta-ink)' : 'inherit' }}>
              The Collection
            </Link>
            {shopOpen && brand.categories.length > 0 && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4">
                <div className="rounded-2xl border p-4 flex flex-col gap-2 min-w-[190px] shadow-xl" style={{ background: 'var(--ta-glass)', backdropFilter: 'blur(16px)', borderColor: 'var(--ta-line)' }}>
                  {brand.categories.map(c => (
                    <Link key={c} href={`/store/${slug}/shop?category=${encodeURIComponent(c)}`} className="text-sm py-1 hover:opacity-60 transition-opacity" style={{ color: 'var(--ta-ink)' }}>
                      {c}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          <a href="#the-loom" className="hover:opacity-100 transition-opacity">The Loom</a>
        </nav>

        <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
          <button
            onClick={openCart}
            aria-label="Open bag"
            className="relative w-8 h-8 flex items-center justify-center transition-opacity hover:opacity-70"
            style={{ color: 'var(--ta-ink)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <path d="M6 8h12l-1 13H7L6 8z"/><path d="M9 8V6a3 3 0 016 0v2"/>
            </svg>
            {count > 0 && (
              <span
                className="absolute -top-1 -right-1 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold"
                style={{ background: 'var(--ta-rust)', color: '#fff' }}
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

function TaanaFooter({ brand }: { brand: ThemeBrand }) {
  const slug = brand.slug
  const isDemoData = !brand.sellerId

  return (
    <footer id="the-loom" className="mt-32 border-t" style={{ borderColor: 'var(--ta-line)' }}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1">
          <span className="text-2xl italic" style={{ fontFamily: 'var(--ta-display)' }}>{brand.name}</span>
          <p className="text-sm mt-3 max-w-[220px] leading-relaxed" style={{ color: 'var(--ta-ink-muted)' }}>
            {brand.tagline}
          </p>
        </div>
        {brand.categories.length > 0 && (
          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] mb-4" style={{ color: 'var(--ta-gold)' }}>The Collection</p>
            <div className="flex flex-col gap-2.5 text-sm">
              {brand.categories.map(c => (
                <Link key={c} href={`/store/${slug}/shop?category=${encodeURIComponent(c)}`} className="hover:opacity-60 transition-opacity" style={{ color: 'var(--ta-ink-muted)' }}>
                  {c}
                </Link>
              ))}
            </div>
          </div>
        )}
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] mb-4" style={{ color: 'var(--ta-gold)' }}>The Weave</p>
          <div className="flex flex-col gap-2.5 text-sm" style={{ color: 'var(--ta-ink-muted)' }}>
            <a href="#" className="hover:opacity-60 transition-opacity">Our weavers</a>
            <a href="#" className="hover:opacity-60 transition-opacity">Care guide</a>
            <a href="#" className="hover:opacity-60 transition-opacity">The Weaver&apos;s Note</a>
          </div>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] mb-4" style={{ color: 'var(--ta-gold)' }}>Client Services</p>
          <div className="flex flex-col gap-2.5 text-sm" style={{ color: 'var(--ta-ink-muted)' }}>
            <a href="#" className="hover:opacity-60 transition-opacity">Shipping &amp; returns</a>
            <a href="#" className="hover:opacity-60 transition-opacity">Size guide</a>
            <a href="#" className="hover:opacity-60 transition-opacity">Contact</a>
          </div>
        </div>
      </div>
      <div className="border-t py-6" style={{ borderColor: 'var(--ta-line)' }}>
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px]" style={{ color: 'var(--ta-ink-dim)' }}>
          {isDemoData ? (
            <p>A concept storefront demonstrating Instastarz&apos;s &quot;May&quot; flagship theme. Not a real retailer.</p>
          ) : (
            <p>{brand.name}, built on Instastarz.</p>
          )}
          <p>Powered by <Link href="/" className="hover:opacity-70 transition-opacity" style={{ color: 'inherit' }}>Instastarz</Link></p>
        </div>
      </div>
    </footer>
  )
}

function TaanaCartDrawer({ brand }: { brand: ThemeBrand }) {
  const slug = brand.slug
  const { isOpen, closeCart, lines, subtotal, adjustQuantity, removeLine } = useFlagshipCart()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[90]"
            style={{ background: 'rgba(36,31,27,0.4)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={closeCart}
          />
          <motion.aside
            className="fixed top-0 right-0 h-full w-full sm:w-[420px] z-[91] flex flex-col border-l"
            style={{ background: 'var(--ta-glass)', backdropFilter: 'blur(16px)', borderColor: 'var(--ta-line)', color: 'var(--ta-ink)' }}
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 300 }}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: 'var(--ta-line)' }}>
              <h2 className="text-2xl italic" style={{ fontFamily: 'var(--ta-display)' }}>Your Bag</h2>
              <button onClick={closeCart} aria-label="Close" className="w-8 h-8 flex items-center justify-center hover:opacity-60 transition-opacity">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden><path d="M6 6l12 12M18 6L6 18"/></svg>
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-4">
                <p className="text-sm" style={{ color: 'var(--ta-ink-muted)' }}>Your bag is empty.</p>
                <Link href={`/store/${slug}/shop`} onClick={closeCart} className="text-sm underline underline-offset-4" style={{ color: 'var(--ta-indigo)' }}>
                  Continue browsing
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
                  {lines.map(line => (
                    <div key={`${line.productId}-${line.size}-${line.color}`} className="flex gap-4">
                      <TaanaImg src={line.image} alt={line.name} wrapperClassName="w-20 h-24 rounded-lg overflow-hidden flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium">{line.name}</p>
                          <p className="text-sm flex-shrink-0">{formatINR(line.price * line.quantity)}</p>
                        </div>
                        <p className="text-xs mt-1" style={{ color: 'var(--ta-ink-muted)' }}>
                          {line.color}{line.size ? ` · ${line.size}` : ''}
                        </p>
                        <div className="flex items-center gap-3 mt-2.5">
                          <div className="flex items-center border rounded-full" style={{ borderColor: 'var(--ta-line)' }}>
                            <button onClick={() => adjustQuantity(line.productId, line.size, line.color, -1)} className="w-6 h-6 flex items-center justify-center text-sm hover:opacity-60">−</button>
                            <span className="text-xs w-5 text-center">{line.quantity}</span>
                            <button onClick={() => adjustQuantity(line.productId, line.size, line.color, 1)} className="w-6 h-6 flex items-center justify-center text-sm hover:opacity-60">+</button>
                          </div>
                          <button onClick={() => removeLine(line.productId, line.size, line.color)} className="text-xs underline underline-offset-2 hover:opacity-60" style={{ color: 'var(--ta-ink-dim)' }}>
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t px-6 py-5" style={{ borderColor: 'var(--ta-line)' }}>
                  <div className="flex items-center justify-between text-sm mb-4">
                    <span style={{ color: 'var(--ta-ink-muted)' }}>Subtotal</span>
                    <span className="text-base font-medium">{formatINR(subtotal)}</span>
                  </div>
                  <Link
                    href={`/store/${slug}/checkout`}
                    onClick={closeCart}
                    className="block text-center w-full py-3.5 rounded-full text-sm tracking-wide font-medium transition-opacity hover:opacity-90"
                    style={{ background: 'var(--ta-accent)', color: 'var(--ta-accent-ink)' }}
                  >
                    Checkout
                  </Link>
                  <p className="text-[11px] text-center mt-3" style={{ color: 'var(--ta-ink-dim)' }}>
                    Free shipping across India &middot; COD available
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
    <div className="taana-root min-h-screen flex flex-col" style={{ ...TAANA_VARS, background: 'var(--ta-bg)', color: 'var(--ta-ink)', fontFamily: 'var(--ta-sans)' } as CSSProperties}>
      <TaanaHeader brand={brand} />
      <main className="flex-1">{children}</main>
      <TaanaFooter brand={brand} />
      <TaanaCartDrawer brand={brand} />
    </div>
  )
}

export function TaanaShell({ children, brand }: { children: ReactNode; brand: ThemeBrand }) {
  // Dashboard/Mobile-app preview tabs (PreviewBanner, ?view=) need the raw
  // storefront content only — skip this theme's own nav/footer chrome.
  const searchParams = useSearchParams()
  const previewView = searchParams.get('view')
  const previewName = searchParams.get('preview_name')
  const effectiveBrand = previewName ? { ...brand, name: previewName } : brand
  if (previewView === 'dashboard' || previewView === 'app') return <>{children}</>

  return (
    <>
      {/* Scoped to this theme only — not loaded globally */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;1,9..144,400;1,9..144,500&family=Jost:wght@400;500;600&display=swap" />
      <FlagshipCartProvider storageKey="taana_cart_v1">
        <ShellInner brand={effectiveBrand}>{children}</ShellInner>
      </FlagshipCartProvider>
    </>
  )
}
