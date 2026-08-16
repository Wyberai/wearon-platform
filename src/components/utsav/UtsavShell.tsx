'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FlagshipCartProvider, useFlagshipCart } from '@/lib/flagship/cart-context'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'

// UTSAV ("October") — Diwali/festival gifting specialist. Every other
// flagship theme is built around a shopper dressing themselves; UTSAV is
// built around a shopper buying FOR someone else. Its signature entry point
// is "Find a Gift" (this theme's equivalent of Bloom's Style Quiz shortcut),
// which routes to the standalone Gift Finder page/mechanic.
//
// Header/Footer/CartDrawer/ProductCard/Img are kept inline in this one file
// (rather than split across many files like Bloom's) to respect this
// build's file-location constraints. Theme CSS variables are injected via a
// scoped <style> tag below rather than editing the shared globals.css, for
// the same reason.

function money(n: number) {
  return `₹${n.toLocaleString('en-IN')}`
}

// Every image in this theme goes through here: a colored div sits behind
// the <img> always, and onError hides the <img> entirely — so a failed/
// not-yet-generated OpenAI image degrades to a clean festive color block,
// never a broken-image icon. className controls sizing/position/radius;
// this component never assumes relative vs. absolute positioning.
export function UtsavImg({ src, alt, className = '', style }: { src: string; alt: string; className?: string; style?: CSSProperties }) {
  const [errored, setErrored] = useState(false)
  return (
    <div className={className} style={{ background: 'var(--ut-marigold)', overflow: 'hidden', ...style }}>
      {!errored && (
        <img
          src={src}
          alt={alt}
          onError={() => setErrored(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      )}
    </div>
  )
}

export function UtsavProductCard({ product, slug, priority = false }: { product: ThemeProduct; slug: string; priority?: boolean }) {
  const { addLine } = useFlagshipCart()
  const [hovered, setHovered] = useState(false)

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
      <div className="relative aspect-[4/5] rounded-xl overflow-hidden">
        <UtsavImg src={product.image} alt={product.name} className="absolute inset-0" />
        {product.tags.includes('new') && (
          <span className="absolute top-3 left-3 text-[10px] tracking-[0.1em] uppercase px-2.5 py-1 rounded-full font-medium" style={{ background: 'var(--ut-bg)', color: 'var(--ut-ink)' }}>New</span>
        )}
        {product.tags.includes('sale') && (
          <span className="absolute top-3 left-3 text-[10px] tracking-[0.1em] uppercase px-2.5 py-1 rounded-full font-medium" style={{ background: 'var(--ut-accent)', color: 'var(--ut-accent-ink)' }}>Sale</span>
        )}
        <button
          onClick={quickAdd}
          className="absolute bottom-0 left-0 right-0 py-3 text-[12px] tracking-[0.1em] uppercase text-center font-medium transition-all duration-300"
          style={{
            background: 'var(--ut-glass)',
            backdropFilter: 'blur(12px)',
            color: 'var(--ut-ink)',
            transform: hovered ? 'translateY(0)' : 'translateY(100%)',
            opacity: hovered ? 1 : 0,
          }}
        >
          Quick Add
        </button>
      </div>
      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <p className="text-sm" style={{ color: 'var(--ut-ink)' }}>{product.name}</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--ut-ink-dim)' }}>{product.colors[0]}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-sm" style={{ color: product.originalPrice ? 'var(--ut-accent)' : 'var(--ut-ink)' }}>{money(product.price)}</p>
          {product.originalPrice && (
            <p className="text-xs line-through" style={{ color: 'var(--ut-ink-dim)' }}>{money(product.originalPrice)}</p>
          )}
        </div>
      </div>
    </Link>
  )
}

function UtsavHeader({ brand }: { brand: ThemeBrand }) {
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
        borderBottom: scrolled ? '1px solid var(--ut-line)' : '1px solid transparent',
        background: scrolled ? 'var(--ut-glass)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px) saturate(140%)' : 'none',
      }}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 h-16 md:h-20 flex items-center justify-between gap-6">
        <Link href={`/store/${slug}`} className="flex items-center flex-shrink-0" style={{ color: 'var(--ut-ink)' }}>
          <span className="utsav-display text-2xl md:text-3xl tracking-tight" style={{ color: 'var(--ut-accent)' }}>{brand.name.charAt(0) + brand.name.slice(1).toLowerCase()}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-[13px] tracking-wide" style={{ color: 'var(--ut-ink-muted)' }}>
          <div className="relative" onMouseEnter={() => setShopOpen(true)} onMouseLeave={() => setShopOpen(false)}>
            <Link href={`/store/${slug}/shop`} className="hover:opacity-100 transition-opacity" style={{ color: shopOpen ? 'var(--ut-ink)' : 'inherit' }}>
              Shop
            </Link>
            {shopOpen && brand.categories.length > 0 && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4">
                <div className="utsav-glass rounded-2xl border p-4 flex flex-col gap-2 min-w-[190px] shadow-xl" style={{ borderColor: 'var(--ut-line)' }}>
                  {brand.categories.map(c => (
                    <Link key={c} href={`/store/${slug}/shop?category=${encodeURIComponent(c)}`} className="text-sm py-1 hover:opacity-60 transition-opacity" style={{ color: 'var(--ut-ink)' }}>
                      {c}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          <a href="#story" className="hover:opacity-100 transition-opacity">Our Story</a>
        </nav>

        <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
          <Link
            href={`/store/${slug}/gift-finder`}
            className="hidden sm:flex items-center gap-1.5 text-[13px] tracking-wide rounded-full px-4 py-2 border transition-transform hover:scale-105"
            style={{ borderColor: 'var(--ut-accent)', color: 'var(--ut-accent)' }}
          >
            ✦ Find a Gift
          </Link>

          <button
            onClick={openCart}
            aria-label="Open bag"
            className="relative w-8 h-8 flex items-center justify-center transition-opacity hover:opacity-70"
            style={{ color: 'var(--ut-ink)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <path d="M6 8h12l-1 13H7L6 8z"/><path d="M9 8V6a3 3 0 016 0v2"/>
            </svg>
            {count > 0 && (
              <span
                className="absolute -top-1 -right-1 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold"
                style={{ background: 'var(--ut-accent)', color: 'var(--ut-accent-ink)' }}
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

function UtsavFooter({ brand }: { brand: ThemeBrand }) {
  const slug = brand.slug
  const isDemoData = !brand.sellerId

  return (
    <footer id="story" className="mt-32 border-t" style={{ borderColor: 'var(--ut-line)' }}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1">
          <span className="utsav-display text-2xl" style={{ color: 'var(--ut-accent)' }}>{brand.name}</span>
          <p className="text-sm mt-3 max-w-[220px] leading-relaxed" style={{ color: 'var(--ut-ink-muted)' }}>
            {brand.tagline}
          </p>
        </div>
        {brand.categories.length > 0 && (
          <div>
            <p className="text-[11px] uppercase tracking-[0.12em] mb-4" style={{ color: 'var(--ut-ink-dim)' }}>Shop</p>
            <div className="flex flex-col gap-2.5 text-sm">
              {brand.categories.map(c => (
                <Link key={c} href={`/store/${slug}/shop?category=${encodeURIComponent(c)}`} className="hover:opacity-60 transition-opacity" style={{ color: 'var(--ut-ink-muted)' }}>
                  {c}
                </Link>
              ))}
            </div>
          </div>
        )}
        <div>
          <p className="text-[11px] uppercase tracking-[0.12em] mb-4" style={{ color: 'var(--ut-ink-dim)' }}>Gifting</p>
          <div className="flex flex-col gap-2.5 text-sm" style={{ color: 'var(--ut-ink-muted)' }}>
            <Link href={`/store/${slug}/gift-finder`} className="hover:opacity-60 transition-opacity">Find a Gift</Link>
            <a href="#" className="hover:opacity-60 transition-opacity">Corporate gifting</a>
            <a href="#" className="hover:opacity-60 transition-opacity">Gift cards</a>
          </div>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.12em] mb-4" style={{ color: 'var(--ut-ink-dim)' }}>Client Services</p>
          <div className="flex flex-col gap-2.5 text-sm" style={{ color: 'var(--ut-ink-muted)' }}>
            <a href="#" className="hover:opacity-60 transition-opacity">Shipping &amp; returns</a>
            <a href="#" className="hover:opacity-60 transition-opacity">Size guide</a>
            <a href="#" className="hover:opacity-60 transition-opacity">Contact</a>
          </div>
        </div>
      </div>
      <div className="border-t py-6" style={{ borderColor: 'var(--ut-line)' }}>
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px]" style={{ color: 'var(--ut-ink-dim)' }}>
          {isDemoData ? (
            <p>A concept storefront demonstrating Instastarz&apos;s &quot;October&quot; flagship theme. Not a real retailer.</p>
          ) : (
            <p>{brand.name}, built on Instastarz.</p>
          )}
          <p>Powered by <Link href="/" className="hover:opacity-70 transition-opacity" style={{ color: 'inherit' }}>Instastarz</Link></p>
        </div>
      </div>
    </footer>
  )
}

function UtsavCartDrawer({ brand }: { brand: ThemeBrand }) {
  const slug = brand.slug
  const { isOpen, closeCart, lines, subtotal, adjustQuantity, removeLine } = useFlagshipCart()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[90]"
            style={{ background: 'rgba(59,31,31,0.35)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={closeCart}
          />
          <motion.aside
            className="utsav-glass fixed top-0 right-0 h-full w-full sm:w-[420px] z-[91] flex flex-col border-l"
            style={{ borderColor: 'var(--ut-line)', color: 'var(--ut-ink)' }}
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 300 }}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: 'var(--ut-line)' }}>
              <h2 className="utsav-display text-2xl">Your Bag</h2>
              <button onClick={closeCart} aria-label="Close" className="w-8 h-8 flex items-center justify-center hover:opacity-60 transition-opacity">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden><path d="M6 6l12 12M18 6L6 18"/></svg>
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-4">
                <p className="text-sm" style={{ color: 'var(--ut-ink-muted)' }}>Your bag is empty.</p>
                <Link href={`/store/${slug}/shop`} onClick={closeCart} className="text-sm underline underline-offset-4" style={{ color: 'var(--ut-accent)' }}>
                  Continue browsing
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
                  {lines.map(line => (
                    <div key={`${line.productId}-${line.size}-${line.color}`} className="flex gap-4">
                      <UtsavImg src={line.image} alt={line.name} className="w-20 h-24 rounded-xl flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium">{line.name}</p>
                          <p className="text-sm flex-shrink-0">{money(line.price * line.quantity)}</p>
                        </div>
                        <p className="text-xs mt-1" style={{ color: 'var(--ut-ink-muted)' }}>
                          {line.color}{line.size ? ` · ${line.size}` : ''}
                        </p>
                        <div className="flex items-center gap-3 mt-2.5">
                          <div className="flex items-center border rounded-full" style={{ borderColor: 'var(--ut-line)' }}>
                            <button onClick={() => adjustQuantity(line.productId, line.size, line.color, -1)} className="w-6 h-6 flex items-center justify-center text-sm hover:opacity-60">−</button>
                            <span className="text-xs w-5 text-center">{line.quantity}</span>
                            <button onClick={() => adjustQuantity(line.productId, line.size, line.color, 1)} className="w-6 h-6 flex items-center justify-center text-sm hover:opacity-60">+</button>
                          </div>
                          <button onClick={() => removeLine(line.productId, line.size, line.color)} className="text-xs underline underline-offset-2 hover:opacity-60" style={{ color: 'var(--ut-ink-dim)' }}>
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t px-6 py-5" style={{ borderColor: 'var(--ut-line)' }}>
                  <div className="flex items-center justify-between text-sm mb-4">
                    <span style={{ color: 'var(--ut-ink-muted)' }}>Subtotal</span>
                    <span className="text-base font-medium">{money(subtotal)}</span>
                  </div>
                  <Link
                    href={`/store/${slug}/checkout`}
                    onClick={closeCart}
                    className="block text-center w-full py-3.5 rounded-full text-sm tracking-wide font-medium transition-opacity hover:opacity-90"
                    style={{ background: 'var(--ut-accent)', color: 'var(--ut-accent-ink)' }}
                  >
                    Checkout
                  </Link>
                  <p className="text-[11px] text-center mt-3" style={{ color: 'var(--ut-ink-dim)' }}>
                    Free shipping across India on every order
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
    <div className="utsav-root min-h-screen flex flex-col">
      <UtsavHeader brand={brand} />
      <main className="flex-1">{children}</main>
      <UtsavFooter brand={brand} />
      <UtsavCartDrawer brand={brand} />

      {/* Mobile entry point — the header's nav link is desktop-only */}
      <Link
        href={`/store/${brand.slug}/gift-finder`}
        className="fixed bottom-5 right-5 sm:hidden z-40 rounded-full flex items-center justify-center shadow-lg"
        style={{ background: 'var(--ut-accent)', color: 'var(--ut-accent-ink)', width: 52, height: 52 }}
        aria-label="Find a Gift"
      >
        <span style={{ fontSize: 20 }}>✦</span>
      </Link>
    </div>
  )
}

export function UtsavShell({ children, brand }: { children: ReactNode; brand: ThemeBrand }) {
  // Dashboard/Mobile-app preview tabs (PreviewBanner, ?view=) need the raw
  // storefront content only — skip this theme's own nav/footer chrome.
  const previewView = useSearchParams().get('view')
  if (previewView === 'dashboard' || previewView === 'app') return <>{children}</>

  return (
    <>
      {/* Scoped to this theme only — not loaded globally */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Yeseva+One&family=Mukta:wght@400;500;600;700&display=swap" />
      {/* Theme tokens injected here (rather than in globals.css) so this
          build never touches an existing shared file — see house rules. */}
      <style>{`
        .utsav-root {
          --ut-display: 'Yeseva One', serif;
          --ut-sans: 'Mukta', var(--font-body), sans-serif;
          --ut-bg: #FDF6EC;
          --ut-ink: #3B1F1F;
          --ut-ink-muted: rgba(59, 31, 31, 0.62);
          --ut-ink-dim: rgba(59, 31, 31, 0.38);
          --ut-card: #FFFFFF;
          --ut-line: rgba(59, 31, 31, 0.14);
          --ut-accent: #A8193B;
          --ut-accent-ink: #FFFFFF;
          --ut-gold: #D4AF37;
          --ut-marigold: #E67E22;
          --ut-glass: rgba(253, 246, 236, 0.82);
          background: var(--ut-bg);
          color: var(--ut-ink);
          font-family: var(--ut-sans);
        }
        .utsav-glass { background: var(--ut-glass); }
        .utsav-display { font-family: var(--ut-display); }
      `}</style>
      <FlagshipCartProvider storageKey="utsav_cart_v1">
        <ShellInner brand={brand}>{children}</ShellInner>
      </FlagshipCartProvider>
    </>
  )
}
