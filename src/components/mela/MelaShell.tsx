'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FlagshipCartProvider, useFlagshipCart } from '@/lib/flagship/cart-context'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'

// MELA has no globals.css entry of its own — nine flagship themes are being
// built in parallel this month, and a shared file every theme needs to edit
// is exactly the kind of collision that breaks a parallel build. So the
// theme's tokens/fonts/keyframes are scoped and injected right here instead,
// under .mela-root, the same variable-naming convention (--me-*) as every
// sibling theme's globals.css block, just locally owned.
const MELA_STYLES = `
.mela-root {
  --me-display: 'Baloo 2', 'Poppins', sans-serif;
  --me-sans: 'Mukta', var(--font-body), sans-serif;
  --me-bg: #FFF8EF;
  --me-ink: #1A1015;
  --me-ink-muted: rgba(26, 16, 21, 0.64);
  --me-ink-dim: rgba(26, 16, 21, 0.4);
  --me-card: #FFFFFF;
  --me-line: rgba(26, 16, 21, 0.14);
  --me-pink: #E6007A;
  --me-pink-ink: #FFFFFF;
  --me-marigold: #FFB800;
  --me-turquoise: #00A9A5;
  --me-accent: var(--me-pink);
  --me-accent-ink: var(--me-pink-ink);
  --me-glass: rgba(255, 248, 239, 0.86);
  background: var(--me-bg);
  color: var(--me-ink);
  font-family: var(--me-sans);
}
.mela-glass {
  background: var(--me-glass);
  backdrop-filter: blur(14px) saturate(150%);
  -webkit-backdrop-filter: blur(14px) saturate(150%);
}
.mela-display { font-family: var(--me-display); }
@keyframes mela-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
.mela-marquee-track { display: flex; width: max-content; animation: mela-marquee 22s linear infinite; }
`

// Every <img> in the theme goes through this: a colored block sits behind it
// always, and onError swaps the <img> out entirely — so if asset generation
// runs out of OpenAI credits mid-run, the storefront shows a clean color
// block instead of a broken-image icon, never the broken icon itself.
export function MelaImg({
  src, alt, className, imgClassName, bg = 'var(--me-card)', loading,
}: {
  src: string
  alt: string
  className?: string
  imgClassName?: string
  bg?: string
  loading?: 'eager' | 'lazy'
}) {
  const [broken, setBroken] = useState(false)
  return (
    <div className={className} style={{ background: bg, position: 'relative', overflow: 'hidden' }}>
      {!broken && (
        <img
          src={src}
          alt={alt}
          loading={loading}
          onError={() => setBroken(true)}
          className={imgClassName}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      )}
    </div>
  )
}

// Shared product card — used by MelaHome, MelaShopGrid and MelaPDP's related
// rail alike, kept here rather than as its own file since it's a small piece
// of the shared theme "kit" this shell already anchors (MelaImg lives here
// for the same reason).
export function MelaProductCard({ product, slug, priority = false }: { product: ThemeProduct; slug: string; priority?: boolean }) {
  const { addLine } = useFlagshipCart()
  const [hovered, setHovered] = useState(false)

  function quickAdd(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    addLine(product, product.sizes[0] ?? '', product.colors[0] ?? '', 1)
  }

  const discountPct = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0

  return (
    <Link
      href={`/store/${slug}/product/${product.slug}`}
      className="group block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg border" style={{ borderColor: 'var(--me-line)' }}>
        <MelaImg
          src={product.image}
          alt={product.name}
          loading={priority ? 'eager' : 'lazy'}
          className="w-full h-full"
          imgClassName="transition-transform duration-500 ease-out group-hover:scale-[1.06]"
        />
        {discountPct >= 10 && (
          <span className="absolute top-2.5 left-2.5 text-[10px] tracking-wide uppercase px-2 py-1 rounded-full font-extrabold" style={{ background: 'var(--me-pink)', color: 'var(--me-pink-ink)' }}>
            {discountPct}% OFF
          </span>
        )}
        {product.tags.includes('new') && discountPct < 10 && (
          <span className="absolute top-2.5 left-2.5 text-[10px] tracking-wide uppercase px-2 py-1 rounded-full font-extrabold" style={{ background: 'var(--me-turquoise)', color: '#fff' }}>New</span>
        )}
        <button
          onClick={quickAdd}
          className="absolute bottom-0 left-0 right-0 py-2.5 text-[12px] tracking-[0.08em] uppercase text-center font-bold transition-all duration-300"
          style={{
            background: 'var(--me-marigold)',
            color: 'var(--me-ink)',
            transform: hovered ? 'translateY(0)' : 'translateY(100%)',
            opacity: hovered ? 1 : 0,
          }}
        >
          Quick Add
        </button>
      </div>
      <div className="mt-2.5 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate" style={{ color: 'var(--me-ink)' }}>{product.name}</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--me-ink-dim)' }}>{product.category}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-sm font-bold" style={{ color: product.originalPrice ? 'var(--me-pink)' : 'var(--me-ink)' }}>&#8377;{product.price.toLocaleString('en-IN')}</p>
          {product.originalPrice && (
            <p className="text-xs line-through" style={{ color: 'var(--me-ink-dim)' }}>&#8377;{product.originalPrice.toLocaleString('en-IN')}</p>
          )}
        </div>
      </div>
    </Link>
  )
}

const DEAL_STRIP = [
  'FLAT DEALS ALL DAY', 'MAKE AN OFFER ON EVERY PIECE', 'COD AVAILABLE', 'NEW STOCK EVERY FRIDAY',
  'HAGGLE. IT WORKS HERE.', '₹399 ONWARDS', 'FREE SHIPPING OVER ₹999',
]

function MelaMarquee() {
  const items = [...DEAL_STRIP, ...DEAL_STRIP]
  return (
    <div className="overflow-hidden border-b py-1.5" style={{ borderColor: 'var(--me-line)', background: 'var(--me-ink)' }}>
      <div className="mela-marquee-track">
        {items.map((t, i) => (
          <span key={i} className="text-[11px] tracking-[0.12em] uppercase font-semibold px-6 whitespace-nowrap" style={{ color: 'var(--me-bg)' }}>
            {t} <span style={{ color: 'var(--me-marigold)' }}>&bull;</span>
          </span>
        ))}
      </div>
    </div>
  )
}

function MelaHeader({ brand }: { brand: ThemeBrand }) {
  const slug = brand.slug
  const { count, openCart } = useFlagshipCart()
  const [scrolled, setScrolled] = useState(false)
  const [shopOpen, setShopOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="sticky top-0 z-50">
      <MelaMarquee />
      <header
        className="transition-colors duration-300"
        style={{
          borderBottom: scrolled ? '1px solid var(--me-line)' : '1px solid transparent',
          background: scrolled ? 'var(--me-glass)' : 'var(--me-bg)',
          backdropFilter: scrolled ? 'blur(14px) saturate(150%)' : 'none',
        }}
      >
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 h-16 md:h-[72px] flex items-center justify-between gap-4">
          <Link href={`/store/${slug}`} className="flex items-center flex-shrink-0">
            <span className="mela-display text-3xl md:text-4xl font-extrabold tracking-tight" style={{ color: 'var(--me-pink)', WebkitTextStroke: '0.5px var(--me-ink)' }}>
              {brand.name}
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-[13px] font-semibold tracking-wide uppercase" style={{ color: 'var(--me-ink-muted)' }}>
            <div className="relative" onMouseEnter={() => setShopOpen(true)} onMouseLeave={() => setShopOpen(false)}>
              <Link href={`/store/${slug}/shop`} className="hover:opacity-100 transition-opacity" style={{ color: shopOpen ? 'var(--me-ink)' : 'inherit' }}>
                Shop All
              </Link>
              {shopOpen && brand.categories.length > 0 && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4">
                  <div className="mela-glass rounded-2xl border p-4 flex flex-col gap-2 min-w-[190px] shadow-xl" style={{ borderColor: 'var(--me-line)' }}>
                    {brand.categories.map(c => (
                      <Link key={c} href={`/store/${slug}/shop?category=${encodeURIComponent(c)}`} className="text-sm normal-case font-medium py-1 hover:opacity-60 transition-opacity" style={{ color: 'var(--me-ink)' }}>
                        {c}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <span className="hidden lg:inline" style={{ color: 'var(--me-turquoise)' }}>Make an Offer &rarr; on every product</span>
          </nav>

          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            <button
              onClick={openCart}
              aria-label="Open bag"
              className="relative w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110"
              style={{ background: 'var(--me-ink)', color: 'var(--me-bg)' }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                <path d="M6 8h12l-1 13H7L6 8z" /><path d="M9 8V6a3 3 0 016 0v2" />
              </svg>
              {count > 0 && (
                <span
                  className="absolute -top-1.5 -right-1.5 text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold border-2"
                  style={{ background: 'var(--me-marigold)', color: 'var(--me-ink)', borderColor: 'var(--me-bg)' }}
                >
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
    </div>
  )
}

function MelaFooter({ brand }: { brand: ThemeBrand }) {
  const slug = brand.slug
  const isDemoData = !brand.sellerId

  return (
    <footer className="mt-28 border-t" style={{ borderColor: 'var(--me-line)', background: 'var(--me-ink)', color: 'var(--me-bg)' }}>
      <div className="max-w-[1440px] mx-auto px-5 md:px-10 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1">
          <span className="mela-display text-2xl font-extrabold" style={{ color: 'var(--me-marigold)' }}>{brand.name}</span>
          <p className="text-sm mt-3 max-w-[220px] leading-relaxed" style={{ color: 'rgba(255,248,239,0.72)' }}>{brand.tagline}</p>
        </div>
        {brand.categories.length > 0 && (
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] mb-4 font-semibold" style={{ color: 'var(--me-turquoise)' }}>Shop</p>
            <div className="flex flex-col gap-2.5 text-sm">
              {brand.categories.map(c => (
                <Link key={c} href={`/store/${slug}/shop?category=${encodeURIComponent(c)}`} className="hover:opacity-70 transition-opacity" style={{ color: 'rgba(255,248,239,0.85)' }}>
                  {c}
                </Link>
              ))}
            </div>
          </div>
        )}
        <div>
          <p className="text-[11px] uppercase tracking-[0.14em] mb-4 font-semibold" style={{ color: 'var(--me-turquoise)' }}>Store Info</p>
          <div className="flex flex-col gap-2.5 text-sm" style={{ color: 'rgba(255,248,239,0.85)' }}>
            <a href="#" className="hover:opacity-70 transition-opacity">Shipping &amp; returns</a>
            <a href="#" className="hover:opacity-70 transition-opacity">Size guide</a>
            <a href="#" className="hover:opacity-70 transition-opacity">Contact the stall</a>
          </div>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.14em] mb-4 font-semibold" style={{ color: 'var(--me-turquoise)' }}>How to Haggle</p>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,248,239,0.85)' }}>
            Every product page has a &quot;Make an Offer&quot; box. Name your price. We&apos;ll counter — or take the deal.
          </p>
        </div>
      </div>
      <div className="border-t py-6" style={{ borderColor: 'rgba(255,248,239,0.14)' }}>
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px]" style={{ color: 'rgba(255,248,239,0.55)' }}>
          {isDemoData ? (
            <p>A concept storefront demonstrating Instastarz&apos;s &quot;April&quot; flagship theme. Not a real retailer.</p>
          ) : (
            <p>{brand.name}, built on Instastarz.</p>
          )}
          <p>Powered by <Link href="/" className="hover:opacity-80 transition-opacity" style={{ color: 'inherit' }}>Instastarz</Link></p>
        </div>
      </div>
    </footer>
  )
}

function MelaCartDrawer({ brand }: { brand: ThemeBrand }) {
  const slug = brand.slug
  const { isOpen, closeCart, lines, subtotal, adjustQuantity, removeLine } = useFlagshipCart()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[90]"
            style={{ background: 'rgba(26,16,21,0.45)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={closeCart}
          />
          <motion.aside
            className="mela-glass fixed top-0 right-0 h-full w-full sm:w-[420px] z-[91] flex flex-col border-l"
            style={{ borderColor: 'var(--me-line)', color: 'var(--me-ink)' }}
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 300 }}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: 'var(--me-line)' }}>
              <h2 className="mela-display text-2xl font-extrabold" style={{ color: 'var(--me-pink)' }}>Your Bag</h2>
              <button onClick={closeCart} aria-label="Close" className="w-8 h-8 flex items-center justify-center hover:opacity-60 transition-opacity">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-4">
                <p className="text-sm" style={{ color: 'var(--me-ink-muted)' }}>Your bag is empty. Bazaar&apos;s still open.</p>
                <Link href={`/store/${slug}/shop`} onClick={closeCart} className="text-sm font-semibold underline underline-offset-4" style={{ color: 'var(--me-pink)' }}>
                  Start browsing
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
                  {lines.map(line => (
                    <div key={`${line.productId}-${line.size}-${line.color}`} className="flex gap-4">
                      <MelaImg src={line.image} alt={line.name} className="w-20 h-24 rounded-xl flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold">{line.name}</p>
                          <p className="text-sm flex-shrink-0 font-semibold">&#8377;{(line.price * line.quantity).toLocaleString('en-IN')}</p>
                        </div>
                        <p className="text-xs mt-1" style={{ color: 'var(--me-ink-muted)' }}>
                          {line.color}{line.size ? ` · ${line.size}` : ''}
                        </p>
                        <div className="flex items-center gap-3 mt-2.5">
                          <div className="flex items-center border rounded-full" style={{ borderColor: 'var(--me-line)' }}>
                            <button onClick={() => adjustQuantity(line.productId, line.size, line.color, -1)} className="w-6 h-6 flex items-center justify-center text-sm hover:opacity-60">&minus;</button>
                            <span className="text-xs w-5 text-center">{line.quantity}</span>
                            <button onClick={() => adjustQuantity(line.productId, line.size, line.color, 1)} className="w-6 h-6 flex items-center justify-center text-sm hover:opacity-60">+</button>
                          </div>
                          <button onClick={() => removeLine(line.productId, line.size, line.color)} className="text-xs underline underline-offset-2 hover:opacity-60" style={{ color: 'var(--me-ink-dim)' }}>
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t px-6 py-5" style={{ borderColor: 'var(--me-line)' }}>
                  <div className="flex items-center justify-between text-sm mb-4">
                    <span style={{ color: 'var(--me-ink-muted)' }}>Subtotal</span>
                    <span className="text-base font-bold">&#8377;{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <Link
                    href={`/store/${slug}/checkout`}
                    onClick={closeCart}
                    className="block text-center w-full py-3.5 rounded-full text-sm tracking-wide font-bold transition-transform hover:scale-[1.02]"
                    style={{ background: 'var(--me-pink)', color: 'var(--me-pink-ink)' }}
                  >
                    Checkout
                  </Link>
                  <p className="text-[11px] text-center mt-3" style={{ color: 'var(--me-ink-dim)' }}>
                    COD available &middot; Free shipping over &#8377;999
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
    <div className="mela-root min-h-screen flex flex-col">
      <style dangerouslySetInnerHTML={{ __html: MELA_STYLES }} />
      <MelaHeader brand={brand} />
      <main className="flex-1">{children}</main>
      <MelaFooter brand={brand} />
      <MelaCartDrawer brand={brand} />
    </div>
  )
}

export function MelaShell({ children, brand }: { children: ReactNode; brand: ThemeBrand }) {
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
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;700;800&family=Mukta:wght@400;500;600;700&display=swap" />
      <FlagshipCartProvider storageKey="mela_cart_v1">
        <ShellInner brand={effectiveBrand}>{children}</ShellInner>
      </FlagshipCartProvider>
    </>
  )
}
