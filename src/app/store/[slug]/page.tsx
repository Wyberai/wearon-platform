'use client'

import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'
import { Suspense, useState, useEffect, useCallback } from 'react'
import type { Product, TenantConfig } from '@/lib/types'

interface FeaturedCollection {
  id: string
  title: string
  description?: string
  editorial_copy: unknown
  product_ids: string[]
  occasion_tags: string[]
  hero_image_url?: string
  products?: { id: string; name: string; garment_image_url: string; price_inr: number }[]
}
import { getTheme, HEADING_TYPE, LOGO_RADIUS, type Theme } from '@/lib/themes'
import { FONTS } from '@/lib/constants'
import { getOrCreateDeviceToken } from '@/lib/device-token'
import { StoreFeedLayout } from '@/components/store/StoreFeedLayout'
import { WhatsAppBubble } from '@/components/store/WhatsAppBubble'

const STORAGE_BASE = 'https://zhrubbutcsvhcbuaalep.supabase.co/storage/v1/object/public/product-images'

// Heading treatment per theme.headingStyle — case/weight/tracking only, the
// hero's own size/layout still comes from theme.hero so the two axes compose.
const HEADING_CLASS: Record<Theme['headingStyle'], string> = {
  serif: 'italic font-medium tracking-tight',
  display: 'uppercase font-black tracking-tighter',
  minimal: 'font-normal tracking-tight',
  rounded: 'font-extrabold tracking-tight',
  luxury: 'uppercase font-light tracking-[0.12em]',
}

// Price-text treatment per theme.headingStyle, so the number that matters
// most on a product card reads with the same personality as the hero.
const PRICE_CLASS: Record<Theme['headingStyle'], string> = {
  serif: 'text-sm font-semibold',
  display: 'text-sm font-black',
  minimal: 'text-xs font-normal tracking-wide',
  rounded: 'text-sm font-bold',
  luxury: 'text-xs font-light uppercase tracking-[0.08em]',
}

export default function StorePage() {
  return (
    <Suspense fallback={<div className="max-w-[1400px] mx-auto px-6 py-32 text-center text-gray-300 text-sm">Loading...</div>}>
      <StorePageContent />
    </Suspense>
  )
}

function StorePageContent() {
  const { slug } = useParams() as { slug: string }
  const searchParams = useSearchParams()
  const [config, setConfig] = useState<TenantConfig | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState('newest')
  const [wishlist, setWishlist] = useState<Set<string>>(new Set())
  const [ratings, setRatings] = useState<Record<string, { avg: number; count: number }>>({})
  const [loading, setLoading] = useState(true)
  const [collections, setCollections] = useState<FeaturedCollection[]>([])
  const [activeCollection, setActiveCollection] = useState<string | null>(null)

  const isDemoStore = slug === 'demo'
  const themeOverride = searchParams.get('theme')

  const loadData = useCallback(async () => {
    try {
      const [cfgRes, prodRes, colRes] = await Promise.all([
        fetch(`/api/store/config?slug=${slug}`),
        fetch(`/api/store/products?slug=${slug}`),
        fetch(`/api/store/${slug}/collections`),
      ])
      const cfgData = await cfgRes.json()
      const prodData = await prodRes.json()
      const colData = await colRes.json()

      setConfig(cfgData.config ?? null)
      setProducts(isDemoStore ? getDemoProducts() : (prodData.products ?? []))
      setCollections(colData.collections ?? [])
    } catch {
      if (isDemoStore) setProducts(getDemoProducts())
    }
    setLoading(false)
  }, [slug, isDemoStore])

  useEffect(() => { loadData() }, [loadData])

  useEffect(() => {
    if (loading) return
    const deviceToken = getOrCreateDeviceToken()
    if (config?.seller_id) {
      fetch(`/api/store/wishlist?seller_id=${config.seller_id}&device_token=${deviceToken}`)
        .then(r => r.json())
        .then(data => {
          if (Array.isArray(data)) {
            setWishlist(new Set(data.map((w: { product_id: string }) => w.product_id)))
          }
        }).catch(() => {})
    }
  }, [loading, config])

  function loadRatings(productId: string) {
    if (ratings[productId] !== undefined) return
    fetch(`/api/store/reviews?product_id=${productId}`)
      .then(r => r.json())
      .then((data: Array<{ rating: number }>) => {
        if (Array.isArray(data) && data.length > 0) {
          const avg = data.reduce((s, r) => s + r.rating, 0) / data.length
          setRatings(prev => ({ ...prev, [productId]: { avg, count: data.length } }))
        } else {
          setRatings(prev => ({ ...prev, [productId]: { avg: 0, count: 0 } }))
        }
      }).catch(() => {})
  }

  async function toggleWishlist(e: React.MouseEvent, productId: string) {
    e.preventDefault()
    e.stopPropagation()
    if (!config?.seller_id) return
    const deviceToken = getOrCreateDeviceToken()
    const inWishlist = wishlist.has(productId)

    setWishlist(prev => {
      const next = new Set(prev)
      if (inWishlist) next.delete(productId)
      else next.add(productId)
      return next
    })

    if (inWishlist) {
      await fetch('/api/store/wishlist', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId, device_token: deviceToken }),
      }).catch(() => {})
    } else {
      await fetch('/api/store/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seller_id: config.seller_id, product_id: productId, device_token: deviceToken }),
      }).catch(() => {})
    }
  }

  const theme = getTheme(themeOverride || config?.theme_id)
  const currencySymbol = config?.currency === 'USD' ? '$' : '₹'
  const priceLocale = config?.currency === 'USD' ? 'en-US' : 'en-IN'

  // Preview override (?theme=) only reaches this client component — push it
  // up to the shared CSS vars so the server-rendered header/footer (which
  // read var(--store-bg) etc.) recolor consistently instead of staying stuck
  // on the seller's saved DB config while the page content changes underneath.
  useEffect(() => {
    if (!themeOverride) return
    const root = document.documentElement
    root.style.setProperty('--store-bg', theme.palette.bg)
    root.style.setProperty('--store-ink', theme.palette.ink)
    root.style.setProperty('--primary', theme.palette.accent)
    const fontCss = FONTS[theme.font as keyof typeof FONTS]?.css
    if (fontCss) root.style.setProperty('--store-font', fontCss)
    root.style.setProperty('--store-logo-radius', LOGO_RADIUS[theme.logoShape])
    const brandType = HEADING_TYPE[theme.headingStyle]
    root.style.setProperty('--store-brand-weight', brandType.weight)
    root.style.setProperty('--store-brand-case', brandType.case)
    root.style.setProperty('--store-brand-tracking', brandType.tracking)
    root.style.setProperty('--store-brand-size', brandType.size)
  }, [themeOverride, theme])

  const primary = (config as TenantConfig & { primary_color?: string })?.primary_color ?? theme.palette.accent
  const categories: string[] = (config?.categories as string[]) ?? ['Dresses', 'Tops', 'Denim', 'Outerwear', 'Accessories']
  const categoryTiles: Record<string, string> = {
    Dresses: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=400&fit=crop',
    Tops: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop',
    Denim: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop',
    Outerwear: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400&h=400&fit=crop',
    Accessories: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop',
  }

  const activeCollectionData = collections.find(c => c.id === activeCollection) ?? null
  const activeCollectionProductIds = activeCollectionData
    ? new Set((activeCollectionData.product_ids as string[]))
    : null

  const filtered = products
    .filter(p => {
      if (!p.is_active) return false
      if (activeCollectionProductIds && !activeCollectionProductIds.has(p.id)) return false
      const q = search.toLowerCase()
      const matchSearch = !q || p.name.toLowerCase().includes(q) ||
        (p.category ?? '').toLowerCase().includes(q) ||
        (p.tags ?? []).some(t => t.toLowerCase().includes(q))
      const matchCat = !activeCategory || p.category === activeCategory
      return matchSearch && matchCat
    })
    .sort((a, b) => {
      if (sortBy === 'price_asc') return a.price_inr - b.price_inr
      if (sortBy === 'price_desc') return b.price_inr - a.price_inr
      return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
    })

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto px-6 py-32 text-center">
        <p className="text-gray-300 text-sm tracking-wide">Loading...</p>
      </div>
    )
  }

  const chatBubble = config?.whatsapp_number ? (
    <WhatsAppBubble phone={config.whatsapp_number} message={`Hi! I have a question about ${config?.brand_name || 'your store'}.`} />
  ) : null

  // Feed themes are a fundamentally different browsing paradigm — full-bleed
  // vertical scroll, not a grid — so they get their own renderer.
  if (theme.layout === 'feed') {
    return (
      <>
        <StoreFeedLayout products={filtered} slug={slug} theme={theme} currency={config?.currency} />
        {chatBubble}
      </>
    )
  }

  const heroImage = theme.previewImage
  const isDark = theme.hero === 'full-bleed-dark'
  const gridCols = theme.density === 'dense' ? 'grid-cols-3 md:grid-cols-4 lg:grid-cols-5' : theme.density === 'airy' ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
  const gridGap = theme.density === 'dense' ? 'gap-x-3 gap-y-6' : theme.density === 'airy' ? 'gap-x-6 gap-y-14' : 'gap-x-5 gap-y-10'
  const aspect = theme.density === 'dense' ? '1 / 1.15' : '4 / 5'

  return (
    <div className="max-w-[1400px] mx-auto" style={{ background: theme.palette.bg, color: theme.palette.ink }}>
      {/* Hero — varies by theme */}
      {theme.hero === 'text-only' ? (
        <div className="relative w-full py-20 md:py-32 px-6 md:px-10 mb-6 overflow-hidden" style={{ background: theme.palette.bg }}>
          {theme.heroDecoration === 'blob-dots' && (
            <>
              <div aria-hidden className="absolute pointer-events-none" style={{
                top: '-15%', right: '-8%', width: 480, height: 480, borderRadius: '50%',
                background: `radial-gradient(circle, ${theme.palette.accent}22, transparent 70%)`,
              }} />
              <div aria-hidden className="absolute pointer-events-none hidden md:block" style={{
                top: '12%', right: '14%', width: 140, height: 140,
                backgroundImage: `radial-gradient(${theme.palette.ink}33 2.5px, transparent 2.5px)`,
                backgroundSize: '18px 18px',
              }} />
            </>
          )}
          <p className="relative text-xs uppercase tracking-[0.22em] opacity-60 mb-3">New this season</p>
          <h1 className={`relative text-5xl md:text-8xl ${HEADING_CLASS[theme.headingStyle]}`} style={{ maxWidth: 900 }}>{config?.brand_name ?? 'The Collection'}</h1>
          <a href="#products" className="relative inline-block mt-6 px-6 py-2.5 text-sm font-semibold" style={{ background: theme.palette.accent, color: '#fff', textDecoration: 'none' }}>Shop now</a>
          {theme.headingStyle === 'luxury' && <div className="relative mt-6 w-16 h-px" style={{ background: theme.palette.accent }} />}
        </div>
      ) : theme.hero === 'banner-strip' ? (
        <div className="w-full py-4 px-6 md:px-10 mb-6 flex items-center justify-between" style={{ background: theme.palette.accent, color: '#fff' }}>
          <span className="text-sm font-semibold">🔥 New arrivals this week</span>
          <span className="text-xs opacity-85">Free shipping over {currencySymbol}{config?.currency === 'USD' ? '75' : '999'}</span>
        </div>
      ) : (
        <div className="relative w-full h-[430px] md:h-[520px] overflow-hidden mb-10" style={{ background: theme.heroGradient }}>
          <img src={heroImage} alt="" className="w-full h-full object-cover absolute inset-0" onError={e => { e.currentTarget.style.opacity = '0' }} style={{ transition: 'opacity 0.3s' }} />
          <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? 'from-black/85 via-black/30' : 'from-black/55 via-black/10'} to-transparent`} />
          <div className="absolute bottom-8 left-6 md:left-10 text-white">
            <p className="text-xs uppercase tracking-[0.22em] opacity-85 mb-2">New this season</p>
            <h1 className={`text-4xl md:text-6xl ${HEADING_CLASS[theme.headingStyle]}`}>{config?.brand_name ?? 'The Collection'}</h1>
            {theme.headingStyle === 'luxury' && <div className="mt-4 w-14 h-px" style={{ background: theme.palette.accent }} />}
            <a href="#products" className="inline-block mt-4 px-5 py-2 text-sm font-semibold" style={{ background: theme.palette.accent, color: '#fff', textDecoration: 'none' }}>Shop now</a>
          </div>
        </div>
      )}

      {/* Category row — large photo tiles for themes with categoryDisplay
          'tiles', the small circular avatar row for everyone else. */}
      {theme.categoryDisplay === 'tiles' ? (
        <div className="px-6 md:px-10 mb-12">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                className="relative overflow-hidden text-left group transition-shadow duration-300 hover:shadow-xl"
                style={{
                  aspectRatio: '4 / 3', borderRadius: 20,
                  outline: activeCategory === cat ? `2px solid ${theme.palette.accent}` : 'none',
                  outlineOffset: 2,
                }}
              >
                <img
                  src={categoryTiles[cat]}
                  alt={cat}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={e => { e.currentTarget.style.visibility = 'hidden' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-4 left-5 text-white">
                  <p className={`text-lg md:text-xl ${HEADING_CLASS[theme.headingStyle]}`}>{cat}</p>
                  <span className="text-xs font-semibold uppercase tracking-wide underline">Shop now →</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="px-6 md:px-10 mb-10">
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {categories.map(cat => {
              const active = activeCategory === cat
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(active ? null : cat)}
                  className="flex-shrink-0 transition-all duration-200"
                  style={{
                    padding: '7px 18px', fontSize: 13, fontWeight: 500,
                    borderRadius: 999, whiteSpace: 'nowrap',
                    background: active ? theme.palette.accent : 'transparent',
                    color: active ? '#fff' : theme.palette.ink,
                    border: `1.5px solid ${active ? theme.palette.accent : `color-mix(in srgb, ${theme.palette.ink} 20%, transparent)`}`,
                  }}
                >
                  {cat}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Featured Collections — shown when AI Buyer has curated edits */}
      {collections.length > 0 && (
        <div className="px-6 md:px-10 mb-12">
          <div className="flex items-baseline justify-between mb-5">
            <h2 className={`text-xl ${HEADING_CLASS[theme.headingStyle]}`} style={{ color: theme.palette.ink }}>
              Shop the Edit
            </h2>
            {activeCollection && (
              <button
                onClick={() => { setActiveCollection(null); setActiveCategory(null) }}
                className="text-xs underline"
                style={{ color: `${theme.palette.ink}77` }}
              >
                Clear filter ×
              </button>
            )}
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
            {collections.map(col => {
              const isActive = activeCollection === col.id
              const editorial = col.editorial_copy as { intro?: string; product_captions?: Record<string, string> } | null
              const thumbs = (col.products as { id: string; garment_image_url: string; name: string }[] | undefined) ?? []
              return (
                <button
                  key={col.id}
                  onClick={() => {
                    setActiveCollection(isActive ? null : col.id)
                    setActiveCategory(null)
                    if (!isActive) {
                      setTimeout(() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
                    }
                  }}
                  className="flex-shrink-0 text-left transition-all duration-200"
                  style={{
                    width: 240,
                    background: isActive ? theme.palette.accent : theme.palette.card ?? `${theme.palette.ink}08`,
                    color: isActive ? '#fff' : theme.palette.ink,
                    borderRadius: theme.decoration === 'rounded' ? 16 : 4,
                    padding: '16px',
                    border: isActive ? 'none' : `1.5px solid ${theme.palette.ink}14`,
                  }}
                >
                  {/* Product thumbnails strip */}
                  {thumbs.length > 0 && (
                    <div className="flex gap-1.5 mb-3">
                      {thumbs.slice(0, 4).map(p => (
                        <img
                          key={p.id}
                          src={p.garment_image_url}
                          alt={p.name}
                          className="object-cover flex-1"
                          style={{ height: 60, borderRadius: theme.decoration === 'rounded' ? 8 : 2 }}
                          onError={e => { e.currentTarget.style.display = 'none' }}
                        />
                      ))}
                    </div>
                  )}
                  <p className="text-sm font-semibold truncate">{col.title}</p>
                  {editorial?.intro && (
                    <p className="text-xs mt-1 leading-relaxed line-clamp-2" style={{ opacity: isActive ? 0.85 : 0.6 }}>
                      {editorial.intro}
                    </p>
                  )}
                  <p className="text-[11px] mt-2 font-medium" style={{ opacity: 0.75 }}>
                    {(col.product_ids as string[]).length} pieces {isActive ? '— showing ↓' : '→'}
                  </p>
                </button>
              )
            })}
          </div>
        </div>
      )}

      <div id="products" className="px-6 md:px-10 pb-16">
        {/* Filter row */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b" style={{ borderColor: `${theme.palette.ink}14` }}>
          <div className="flex gap-6 overflow-x-auto items-center">
            {renderNavTab(theme, 'All', !activeCategory, () => setActiveCategory(null))}
            {categories.map(cat => renderNavTab(theme, cat, activeCategory === cat, () => setActiveCategory(activeCategory === cat ? null : cat)))}
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search"
              className="text-sm border-b outline-none py-1 w-32 bg-transparent"
              style={{ color: theme.palette.ink, borderColor: `${theme.palette.ink}22` }}
            />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="text-xs outline-none bg-transparent cursor-pointer"
              style={{ color: `${theme.palette.ink}99` }}
            >
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Products grid — density/decoration driven by theme */}
        {filtered.length === 0 ? (
          <div className="text-center py-24" style={{ color: `${theme.palette.ink}55` }}>
            <p className="text-sm">{search ? 'No products match your search' : 'No products yet. Check back soon!'}</p>
          </div>
        ) : (
          <div className={`grid ${gridCols} ${gridGap}`}>
            {filtered.map(product => {
              const inWishlist = wishlist.has(product.id)
              const rating = ratings[product.id]
              if (!rating) loadRatings(product.id)
              const discountPct = product.original_price_inr && product.original_price_inr > product.price_inr
                ? Math.round((1 - product.price_inr / product.original_price_inr) * 100)
                : null

              return (
                <Link key={product.id} href={`/store/${slug}/product/${product.id}`} className="group block">
                  <div className="relative overflow-hidden" style={{ aspectRatio: aspect, background: theme.palette.card, borderRadius: theme.decoration === 'rounded' ? 12 : 0 }}>
                    <img
                      src={product.garment_image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    />
                    {discountPct !== null && theme.decoration === 'stickers' && (
                      <div
                        className="absolute top-2 left-2 w-11 h-11 rounded-full flex items-center justify-center text-[10px] font-bold text-center leading-tight"
                        style={{ background: theme.palette.accent, color: '#fff', transform: 'rotate(-12deg)', border: `2px solid ${theme.palette.ink}` }}
                      >
                        -{discountPct}%
                      </div>
                    )}
                    {discountPct !== null && theme.decoration === 'badges' && (
                      <div className="absolute top-2 left-2 text-[10px] font-bold uppercase px-2 py-1 rounded" style={{ background: theme.palette.accent, color: '#fff' }}>
                        {discountPct}% OFF
                      </div>
                    )}
                    {discountPct !== null && (theme.decoration === 'none' || theme.decoration === 'rounded') && (
                      <div className="absolute top-3 left-3 text-[10px] font-semibold uppercase tracking-wide px-2 py-1" style={{ background: theme.palette.bg, color: theme.palette.ink }}>
                        {discountPct}% off
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out px-3 py-2.5 pointer-events-none"
                      style={{ background: `linear-gradient(to top, ${theme.palette.accent} 0%, color-mix(in srgb, ${theme.palette.accent} 70%, transparent) 100%)` }}>
                      <span className="text-white text-[11px] font-semibold tracking-wide uppercase">View →</span>
                    </div>
                    <button
                      onClick={(e) => toggleWishlist(e, product.id)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                      style={{ background: `${theme.palette.bg}F2` }}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill={inWishlist ? primary : 'none'} stroke={inWishlist ? primary : `${theme.palette.ink}66`} strokeWidth="2" aria-hidden>
                        <path d="M12 21s-7.5-4.6-10-9.2C.5 8.4 2.2 5 5.6 5c2 0 3.6 1.2 4.4 2.6C10.8 6.2 12.4 5 14.4 5c3.4 0 5.1 3.4 3.6 6.8-2.5 4.6-10 9.2-10 9.2z"/>
                      </svg>
                    </button>
                  </div>
                  <div className="pt-3">
                    <p className="text-[13.5px] truncate" style={{ color: `${theme.palette.ink}dd` }}>{product.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={PRICE_CLASS[theme.headingStyle]} style={{ color: theme.headingStyle === 'luxury' ? theme.palette.accent : theme.palette.ink }}>{currencySymbol}{product.price_inr.toLocaleString(priceLocale)}</span>
                      {product.original_price_inr && (
                        <span className="text-xs line-through" style={{ color: `${theme.palette.ink}55` }}>{currencySymbol}{product.original_price_inr.toLocaleString(priceLocale)}</span>
                      )}
                    </div>
                    {rating && rating.count > 0 && (
                      <div className="flex items-center gap-1 mt-1.5">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill={theme.palette.accent} aria-hidden><path d="M12 2l2.9 6.9 7.1.6-5.4 4.7 1.7 7-6.3-3.9-6.3 3.9 1.7-7L2 9.5l7.1-.6z"/></svg>
                        <span className="text-xs" style={{ color: `${theme.palette.ink}77` }}>{rating.avg.toFixed(1)} ({rating.count})</span>
                      </div>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
      {chatBubble}
    </div>
  )
}

// Category/filter tab, styled per theme.navStyle — underline (default),
// pill (bold/playful themes), or ghost (utilitarian/luxury themes).
function renderNavTab(theme: Theme, label: string, active: boolean, onClick: () => void) {
  const dim = `${theme.palette.ink}77`
  if (theme.navStyle === 'pill') {
    return (
      <button key={label} onClick={onClick} className="text-sm font-semibold whitespace-nowrap px-4 py-1.5 rounded-full transition-colors"
        style={{ background: active ? theme.palette.accent : 'transparent', color: active ? '#fff' : theme.palette.ink, border: active ? 'none' : `1px solid ${theme.palette.ink}22` }}>
        {label}
      </button>
    )
  }
  if (theme.navStyle === 'ghost') {
    return (
      <button key={label} onClick={onClick} className="text-[11px] uppercase tracking-[0.14em] font-medium whitespace-nowrap px-2.5 py-1.5 transition-colors"
        style={{ background: active ? `${theme.palette.accent}18` : 'transparent', color: active ? theme.palette.accent : dim }}>
        {label}
      </button>
    )
  }
  return (
    <button key={label} onClick={onClick} className="text-sm font-medium whitespace-nowrap pb-1 transition-colors"
      style={{ color: active ? theme.palette.ink : dim, borderBottom: active ? `2px solid ${theme.palette.accent}` : '2px solid transparent' }}>
      {label}
    </button>
  )
}

const _U = (id: string) => `https://images.unsplash.com/${id}?w=800&h=1000&fit=crop`

function getDemoProducts(): Product[] {
  return [
    { id: 'demo-01', seller_id: 'demo', name: 'Satin Slip Maxi Dress', description: 'Fluid satin with adjustable straps. Runs true to size.', category: 'Dresses', price_inr: 89, original_price_inr: 120, garment_image_url: _U('photo-1496747611176-843222e1e57c'), garment_preprocessed_url: null, slug: 'satin-slip-maxi-dress', is_active: true, sizes: ['XS','S','M','L','XL'], colors: ['Champagne','Black','Sage'], tags: ['bestseller'], created_at: '' },
    { id: 'demo-02', seller_id: 'demo', name: 'Floral Wrap Midi Dress', description: 'Lightweight wrap silhouette, adjustable tie waist.', category: 'Dresses', price_inr: 72, original_price_inr: null, garment_image_url: _U('photo-1572804013309-59a88b7e92f1'), garment_preprocessed_url: null, slug: 'floral-wrap-midi-dress', is_active: true, sizes: ['XS','S','M','L'], colors: ['Floral Print'], tags: [], created_at: '' },
    { id: 'demo-03', seller_id: 'demo', name: 'Off-Shoulder Mini Dress', description: 'Clean off-shoulder cut, structured bodice, stretch hem.', category: 'Dresses', price_inr: 65, original_price_inr: null, garment_image_url: _U('photo-1496440737103-cd596325d314'), garment_preprocessed_url: null, slug: 'off-shoulder-mini-dress', is_active: true, sizes: ['XS','S','M','L','XL'], colors: ['White','Black'], tags: ['new'], created_at: '' },
    { id: 'demo-04', seller_id: 'demo', name: 'Oversized Linen Shirt', description: 'Boxy relaxed fit, 100% European linen, coconut buttons.', category: 'Tops', price_inr: 55, original_price_inr: null, garment_image_url: _U('photo-1434389677669-e08b4cac3105'), garment_preprocessed_url: null, slug: 'oversized-linen-shirt', is_active: true, sizes: ['XS','S','M','L','XL','XXL'], colors: ['Ivory','Sand','Navy'], tags: [], created_at: '' },
    { id: 'demo-05', seller_id: 'demo', name: 'Cropped Ribbed Tank', description: 'Fitted crop in thick-rib jersey. Pairs with everything.', category: 'Tops', price_inr: 32, original_price_inr: null, garment_image_url: _U('photo-1509631179647-0177331693ae'), garment_preprocessed_url: null, slug: 'cropped-ribbed-tank', is_active: true, sizes: ['XS','S','M','L'], colors: ['Black','White','Cream','Mocha'], tags: ['bestseller'], created_at: '' },
    { id: 'demo-06', seller_id: 'demo', name: 'Satin Cowl-Neck Cami', description: 'Draped cowl neck, adjustable straps, relaxed fit.', category: 'Tops', price_inr: 48, original_price_inr: 60, garment_image_url: _U('photo-1469334031218-e382a71b716b'), garment_preprocessed_url: null, slug: 'satin-cowl-neck-cami', is_active: true, sizes: ['XS','S','M','L','XL'], colors: ['Champagne','Dusty Rose','Slate'], tags: ['sale'], created_at: '' },
    { id: 'demo-07', seller_id: 'demo', name: 'High-Rise Straight Jeans', description: 'Classic high-rise with a straight leg. 98% cotton, slight stretch.', category: 'Denim', price_inr: 98, original_price_inr: null, garment_image_url: _U('photo-1542272604-787c3835535d'), garment_preprocessed_url: null, slug: 'high-rise-straight-jeans', is_active: true, sizes: ['24','25','26','27','28','29','30','31','32'], colors: ['Mid Wash','Dark Wash','Light Wash'], tags: ['bestseller'], created_at: '' },
    { id: 'demo-08', seller_id: 'demo', name: 'Wide-Leg Barrel Jeans', description: 'Relaxed barrel silhouette, low to mid rise.', category: 'Denim', price_inr: 110, original_price_inr: null, garment_image_url: _U('photo-1475178626620-a4d074967452'), garment_preprocessed_url: null, slug: 'wide-leg-barrel-jeans', is_active: true, sizes: ['24','25','26','27','28','29','30'], colors: ['Ecru','Mid Wash'], tags: ['new'], created_at: '' },
    { id: 'demo-09', seller_id: 'demo', name: 'Classic Denim Jacket', description: 'Structured denim jacket with chest pockets and button closure.', category: 'Denim', price_inr: 115, original_price_inr: 145, garment_image_url: _U('photo-1591047139829-d91aecb6caea'), garment_preprocessed_url: null, slug: 'classic-denim-jacket', is_active: true, sizes: ['XS','S','M','L','XL'], colors: ['Light Wash','Dark Wash'], tags: ['sale'], created_at: '' },
    { id: 'demo-10', seller_id: 'demo', name: 'Camel Trench Coat', description: 'Belted trench in a water-repellent shell. Timeless silhouette.', category: 'Outerwear', price_inr: 195, original_price_inr: null, garment_image_url: _U('photo-1539533018447-63fcce2678e3'), garment_preprocessed_url: null, slug: 'camel-trench-coat', is_active: true, sizes: ['XS','S','M','L','XL'], colors: ['Camel','Khaki'], tags: ['new'], created_at: '' },
    { id: 'demo-11', seller_id: 'demo', name: 'Oversized Wool Blazer', description: 'Boyfriend-fit blazer in a herringbone wool blend.', category: 'Outerwear', price_inr: 155, original_price_inr: 200, garment_image_url: _U('photo-1490481651871-ab68de25d43d'), garment_preprocessed_url: null, slug: 'oversized-wool-blazer', is_active: true, sizes: ['XS','S','M','L','XL'], colors: ['Black','Charcoal','Cream'], tags: ['sale'], created_at: '' },
    { id: 'demo-12', seller_id: 'demo', name: 'Quilted Puffer Vest', description: 'Lightweight quilted fill, cropped length, snap buttons.', category: 'Outerwear', price_inr: 88, original_price_inr: null, garment_image_url: _U('photo-1548624313-0396c75e4b1a'), garment_preprocessed_url: null, slug: 'quilted-puffer-vest', is_active: true, sizes: ['XS','S','M','L','XL'], colors: ['Black','Cream','Olive'], tags: [], created_at: '' },
    { id: 'demo-13', seller_id: 'demo', name: 'Mini Crossbody Bag', description: 'Structured mini bag in pebbled faux leather. Adjustable strap.', category: 'Accessories', price_inr: 79, original_price_inr: null, garment_image_url: _U('photo-1548036328-c9fa89d128fa'), garment_preprocessed_url: null, slug: 'mini-crossbody-bag', is_active: true, sizes: [], colors: ['Black','Tan','Burgundy'], tags: ['bestseller'], created_at: '' },
    { id: 'demo-14', seller_id: 'demo', name: 'Gold Chain Hoops', description: 'Lightweight chunky chain hoops, 18k gold-plated brass.', category: 'Accessories', price_inr: 34, original_price_inr: null, garment_image_url: _U('photo-1606760227091-3dd870d97f1d'), garment_preprocessed_url: null, slug: 'gold-chain-hoops', is_active: true, sizes: [], colors: ['Gold'], tags: ['new'], created_at: '' },
    { id: 'demo-15', seller_id: 'demo', name: 'Ribbed Knit Beanie', description: 'Chunky ribbed knit in a one-size-fits-all style.', category: 'Accessories', price_inr: 28, original_price_inr: null, garment_image_url: _U('photo-1516762689617-e1cffcef479d'), garment_preprocessed_url: null, slug: 'ribbed-knit-beanie', is_active: true, sizes: [], colors: ['Oatmeal','Black','Camel','Sage'], tags: [], created_at: '' },
  ]
}
