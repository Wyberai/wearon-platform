'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FlagshipCartProvider, useFlagshipCart } from '@/lib/flagship/cart-context'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'

// SAAJ — flagship theme, "June". Festive jewel-tone palette (magenta,
// antique gold, emerald, ivory) scoped entirely to .saaj-root via an inline
// <style> tag rather than globals.css, since this file is the only place
// allowed to define SAAJ's look — no other file in this build touches
// globals.css. Same pattern layout.tsx already uses for non-flagship tenant
// CSS vars, just scoped locally instead of shared.
const SAAJ_STYLE = `
.saaj-root {
  --sj-display: 'Cormorant Garamond', serif;
  --sj-sans: 'Mukta', var(--font-body), sans-serif;
  --sj-bg: #FFF8EF;
  --sj-ink: #2A1420;
  --sj-ink-muted: rgba(42, 20, 32, 0.62);
  --sj-ink-dim: rgba(42, 20, 32, 0.36);
  --sj-card: #FFFFFF;
  --sj-line: rgba(42, 20, 32, 0.12);
  --sj-accent: #C6115B;
  --sj-accent-ink: #FFFFFF;
  --sj-gold: #D4A94C;
  --sj-emerald: #1B5E4A;
  --sj-glass: rgba(255, 248, 239, 0.82);
  background: var(--sj-bg);
  color: var(--sj-ink);
  font-family: var(--sj-sans);
}
.saaj-glass {
  background: var(--sj-glass);
  backdrop-filter: blur(16px) saturate(140%);
  -webkit-backdrop-filter: blur(16px) saturate(140%);
}
.saaj-display { font-family: var(--sj-display); }
.saaj-gold-line { background: linear-gradient(90deg, transparent, var(--sj-gold), transparent); }
`

// -----------------------------------------------------------------------
// Product card — shared by home, shop grid, PDP and the Function Planner
// results screen. Kept here (not a standalone file) since this build is
// only permitted to create the six named saaj/ components.
// -----------------------------------------------------------------------
export function SaajProductCard({ product, slug, priority = false }: { product: ThemeProduct; slug: string; priority?: boolean }) {
  const { addLine } = useFlagshipCart()
  const [hovered, setHovered] = useState(false)
  const [imgOk, setImgOk] = useState(true)

  function quickAdd(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    addLine(product, product.sizes[0] ?? '', product.colors[0] ?? '', 1)
  }

  return (
    <Link
      href={`/store/${slug}/product/${product.slug}`}
      className="group block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl" style={{ background: 'var(--sj-emerald)' }}>
        {imgOk && (
          <img
            src={product.image}
            alt={product.name}
            loading={priority ? 'eager' : 'lazy'}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            onError={() => setImgOk(false)}
          />
        )}
        {product.tags.includes('new') && (
          <span className="absolute top-3 left-3 text-[10px] tracking-[0.1em] uppercase px-2.5 py-1 rounded-full font-medium" style={{ background: 'var(--sj-bg)', color: 'var(--sj-ink)' }}>New</span>
        )}
        {product.tags.includes('sale') && (
          <span className="absolute top-3 left-3 text-[10px] tracking-[0.1em] uppercase px-2.5 py-1 rounded-full font-medium" style={{ background: 'var(--sj-accent)', color: 'var(--sj-accent-ink)' }}>Sale</span>
        )}
        <button
          onClick={quickAdd}
          className="absolute bottom-0 left-0 right-0 py-3 text-[12px] tracking-[0.1em] uppercase text-center font-medium transition-all duration-300"
          style={{
            background: 'var(--sj-glass)',
            backdropFilter: 'blur(12px)',
            color: 'var(--sj-ink)',
            transform: hovered ? 'translateY(0)' : 'translateY(100%)',
            opacity: hovered ? 1 : 0,
          }}
        >
          Quick Add
        </button>
      </div>
      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <p className="text-sm" style={{ color: 'var(--sj-ink)' }}>{product.name}</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--sj-ink-dim)' }}>{product.colors[0]}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-sm" style={{ color: product.originalPrice ? 'var(--sj-accent)' : 'var(--sj-ink)' }}>₹{product.price.toLocaleString('en-IN')}</p>
          {product.originalPrice && (
            <p className="text-xs line-through" style={{ color: 'var(--sj-ink-dim)' }}>₹{product.originalPrice.toLocaleString('en-IN')}</p>
          )}
        </div>
      </div>
    </Link>
  )
}

function SaajHeader({ brand }: { brand: ThemeBrand }) {
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
        borderBottom: scrolled ? '1px solid var(--sj-line)' : '1px solid transparent',
        background: scrolled ? 'var(--sj-glass)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px) saturate(140%)' : 'none',
      }}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 h-16 md:h-20 flex items-center justify-between gap-6">
        <Link href={`/store/${slug}`} className="flex items-center flex-shrink-0" style={{ color: 'var(--sj-ink)' }}>
          <span className="saaj-display text-2xl md:text-3xl tracking-tight font-semibold">{brand.name.charAt(0) + brand.name.slice(1).toLowerCase()}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-[13px] tracking-wide" style={{ color: 'var(--sj-ink-muted)' }}>
          <div className="relative" onMouseEnter={() => setShopOpen(true)} onMouseLeave={() => setShopOpen(false)}>
            <Link href={`/store/${slug}/shop`} className="hover:opacity-100 transition-opacity" style={{ color: shopOpen ? 'var(--sj-ink)' : 'inherit' }}>
              Shop
            </Link>
            {shopOpen && brand.categories.length > 0 && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4">
                <div className="saaj-glass rounded-2xl border p-4 flex flex-col gap-2 min-w-[190px] shadow-xl" style={{ borderColor: 'var(--sj-line)' }}>
                  {brand.categories.map(c => (
                    <Link key={c} href={`/store/${slug}/shop?category=${encodeURIComponent(c)}`} className="text-sm py-1 hover:opacity-60 transition-opacity" style={{ color: 'var(--sj-ink)' }}>
                      {c}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          <a href="#story" className="hover:opacity-100 transition-opacity">Story</a>
        </nav>

        <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
          <Link
            href={`/store/${slug}/planner`}
            className="hidden sm:flex items-center gap-1.5 text-[13px] tracking-wide rounded-full px-4 py-2 border transition-transform hover:scale-105"
            style={{ borderColor: 'var(--sj-accent)', color: 'var(--sj-accent)' }}
          >
            ✦ Plan My Functions
          </Link>

          <button
            onClick={openCart}
            aria-label="Open bag"
            className="relative w-8 h-8 flex items-center justify-center transition-opacity hover:opacity-70"
            style={{ color: 'var(--sj-ink)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <path d="M6 8h12l-1 13H7L6 8z"/><path d="M9 8V6a3 3 0 016 0v2"/>
            </svg>
            {count > 0 && (
              <span
                className="absolute -top-1 -right-1 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold"
                style={{ background: 'var(--sj-accent)', color: 'var(--sj-accent-ink)' }}
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

function SaajFooter({ brand }: { brand: ThemeBrand }) {
  const slug = brand.slug
  const isDemoData = !brand.sellerId

  return (
    <footer id="story" className="mt-32 border-t" style={{ borderColor: 'var(--sj-line)' }}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1">
          <span className="saaj-display text-2xl font-semibold">{brand.name}</span>
          <p className="text-sm mt-3 max-w-[220px] leading-relaxed" style={{ color: 'var(--sj-ink-muted)' }}>
            {brand.tagline}
          </p>
        </div>
        {brand.categories.length > 0 && (
          <div>
            <p className="text-[11px] uppercase tracking-[0.12em] mb-4" style={{ color: 'var(--sj-ink-dim)' }}>Shop</p>
            <div className="flex flex-col gap-2.5 text-sm">
              {brand.categories.map(c => (
                <Link key={c} href={`/store/${slug}/shop?category=${encodeURIComponent(c)}`} className="hover:opacity-60 transition-opacity" style={{ color: 'var(--sj-ink-muted)' }}>
                  {c}
                </Link>
              ))}
            </div>
          </div>
        )}
        <div>
          <p className="text-[11px] uppercase tracking-[0.12em] mb-4" style={{ color: 'var(--sj-ink-dim)' }}>Plan</p>
          <div className="flex flex-col gap-2.5 text-sm" style={{ color: 'var(--sj-ink-muted)' }}>
            <Link href={`/store/${slug}/planner`} className="hover:opacity-60 transition-opacity">Function Planner</Link>
            <a href="#" className="hover:opacity-60 transition-opacity">Size guide</a>
            <a href="#" className="hover:opacity-60 transition-opacity">Care guide</a>
          </div>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.12em] mb-4" style={{ color: 'var(--sj-ink-dim)' }}>Client Services</p>
          <div className="flex flex-col gap-2.5 text-sm" style={{ color: 'var(--sj-ink-muted)' }}>
            <a href="#" className="hover:opacity-60 transition-opacity">Shipping &amp; returns</a>
            <a href="#" className="hover:opacity-60 transition-opacity">Alterations</a>
            <a href="#" className="hover:opacity-60 transition-opacity">Contact</a>
          </div>
        </div>
      </div>
      <div className="border-t py-6" style={{ borderColor: 'var(--sj-line)' }}>
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px]" style={{ color: 'var(--sj-ink-dim)' }}>
          {isDemoData ? (
            <p>A concept storefront demonstrating Instastarz&apos;s &quot;June&quot; flagship theme. Not a real retailer.</p>
          ) : (
            <p>{brand.name}, built on Instastarz.</p>
          )}
          <p>Powered by <Link href="/" className="hover:opacity-70 transition-opacity" style={{ color: 'inherit' }}>Instastarz</Link></p>
        </div>
      </div>
    </footer>
  )
}

function SaajCartDrawer({ brand }: { brand: ThemeBrand }) {
  const slug = brand.slug
  const { isOpen, closeCart, lines, subtotal, adjustQuantity, removeLine } = useFlagshipCart()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[90]"
            style={{ background: 'rgba(42,20,32,0.4)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={closeCart}
          />
          <motion.aside
            className="saaj-glass fixed top-0 right-0 h-full w-full sm:w-[420px] z-[91] flex flex-col border-l"
            style={{ borderColor: 'var(--sj-line)', color: 'var(--sj-ink)' }}
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 300 }}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: 'var(--sj-line)' }}>
              <h2 className="saaj-display text-2xl font-semibold">Your Bag</h2>
              <button onClick={closeCart} aria-label="Close" className="w-8 h-8 flex items-center justify-center hover:opacity-60 transition-opacity">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden><path d="M6 6l12 12M18 6L6 18"/></svg>
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-4">
                <p className="text-sm" style={{ color: 'var(--sj-ink-muted)' }}>Your bag is empty.</p>
                <Link href={`/store/${slug}/shop`} onClick={closeCart} className="text-sm underline underline-offset-4" style={{ color: 'var(--sj-accent)' }}>
                  Continue browsing
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
                  {lines.map(line => (
                    <div key={`${line.productId}-${line.size}-${line.color}`} className="flex gap-4">
                      <div className="w-20 h-24 rounded-xl flex-shrink-0 overflow-hidden" style={{ background: 'var(--sj-emerald)' }}>
                        <CartLineImage src={line.image} alt={line.name} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium">{line.name}</p>
                          <p className="text-sm flex-shrink-0">₹{(line.price * line.quantity).toLocaleString('en-IN')}</p>
                        </div>
                        <p className="text-xs mt-1" style={{ color: 'var(--sj-ink-muted)' }}>
                          {line.color}{line.size ? ` · ${line.size}` : ''}
                        </p>
                        <div className="flex items-center gap-3 mt-2.5">
                          <div className="flex items-center border rounded-full" style={{ borderColor: 'var(--sj-line)' }}>
                            <button onClick={() => adjustQuantity(line.productId, line.size, line.color, -1)} className="w-6 h-6 flex items-center justify-center text-sm hover:opacity-60">−</button>
                            <span className="text-xs w-5 text-center">{line.quantity}</span>
                            <button onClick={() => adjustQuantity(line.productId, line.size, line.color, 1)} className="w-6 h-6 flex items-center justify-center text-sm hover:opacity-60">+</button>
                          </div>
                          <button onClick={() => removeLine(line.productId, line.size, line.color)} className="text-xs underline underline-offset-2 hover:opacity-60" style={{ color: 'var(--sj-ink-dim)' }}>
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t px-6 py-5" style={{ borderColor: 'var(--sj-line)' }}>
                  <div className="flex items-center justify-between text-sm mb-4">
                    <span style={{ color: 'var(--sj-ink-muted)' }}>Subtotal</span>
                    <span className="text-base font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <Link
                    href={`/store/${slug}/checkout`}
                    onClick={closeCart}
                    className="block text-center w-full py-3.5 rounded-full text-sm tracking-wide font-medium transition-opacity hover:opacity-90"
                    style={{ background: 'var(--sj-accent)', color: 'var(--sj-accent-ink)' }}
                  >
                    Checkout
                  </Link>
                  <p className="text-[11px] text-center mt-3" style={{ color: 'var(--sj-ink-dim)' }}>
                    Free shipping &amp; easy alterations on every order
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

// Cart lines are denormalized (see cart-context.tsx), so a broken image here
// falls back to the emerald block behind it rather than a broken-image icon.
function CartLineImage({ src, alt }: { src: string; alt: string }) {
  const [ok, setOk] = useState(true)
  if (!ok) return null
  return <img src={src} alt={alt} className="w-full h-full object-cover" onError={() => setOk(false)} />
}

function ShellInner({ children, brand }: { children: ReactNode; brand: ThemeBrand }) {
  return (
    <div className="saaj-root min-h-screen flex flex-col">
      <SaajHeader brand={brand} />
      <main className="flex-1">{children}</main>
      <SaajFooter brand={brand} />
      <SaajCartDrawer brand={brand} />

      {/* Mobile entry point — the header's nav link is desktop-only */}
      <Link
        href={`/store/${brand.slug}/planner`}
        className="fixed bottom-5 right-5 sm:hidden z-40 rounded-full flex items-center justify-center shadow-lg"
        style={{ background: 'var(--sj-accent)', color: 'var(--sj-accent-ink)', width: 52, height: 52 }}
        aria-label="Open the Function Planner"
      >
        <span style={{ fontSize: 20 }}>✦</span>
      </Link>
    </div>
  )
}

export function SaajShell({ children, brand }: { children: ReactNode; brand: ThemeBrand }) {
  // Dashboard/Mobile-app preview tabs (PreviewBanner, ?view=) need the raw
  // storefront content only — skip this theme's own nav/footer chrome.
  const previewView = useSearchParams().get('view')
  if (previewView === 'dashboard' || previewView === 'app') return <>{children}</>

  return (
    <>
      {/* Scoped to this theme only — not loaded globally */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=Mukta:wght@400;500;600;700&display=swap" />
      <style dangerouslySetInnerHTML={{ __html: SAAJ_STYLE }} />
      <FlagshipCartProvider storageKey="saaj_cart_v1">
        <ShellInner brand={brand}>{children}</ShellInner>
      </FlagshipCartProvider>
    </>
  )
}
