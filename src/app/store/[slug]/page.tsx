'use client'

import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'
import { Suspense, useState, useEffect, useCallback } from 'react'
import type { Product, TenantConfig } from '@/lib/types'
import { getTheme } from '@/lib/themes'
import { FONTS } from '@/lib/constants'
import { StoreFeedLayout } from '@/components/store/StoreFeedLayout'

const STORAGE_BASE = 'https://zhrubbutcsvhcbuaalep.supabase.co/storage/v1/object/public/product-images'

function getOrCreateDeviceToken(): string {
  let token = localStorage.getItem('wearon_device_token')
  if (!token) {
    token = crypto.randomUUID()
    localStorage.setItem('wearon_device_token', token)
  }
  return token
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

  const isDemoStore = slug === 'demo'
  const themeOverride = searchParams.get('theme')

  const loadData = useCallback(async () => {
    try {
      const [cfgRes, prodRes] = await Promise.all([
        fetch(`/api/store/config?slug=${slug}`),
        fetch(`/api/store/products?slug=${slug}`),
      ])
      const cfgData = await cfgRes.json()
      const prodData = await prodRes.json()

      setConfig(cfgData.config ?? null)
      setProducts(isDemoStore ? getDemoProducts() : (prodData.products ?? []))
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
  }, [themeOverride, theme])

  const primary = (config as TenantConfig & { primary_color?: string })?.primary_color ?? theme.palette.accent
  const categories: string[] = (config?.categories as string[]) ?? ['Kurtas', 'Sarees', 'Lehengas', 'Western', 'Accessories']
  const categoryTiles: Record<string, string> = {
    Kurtas: `${STORAGE_BASE}/cat-kurtas.jpg`,
    Sarees: `${STORAGE_BASE}/cat-sarees.jpg`,
    Lehengas: `${STORAGE_BASE}/cat-lehengas.jpg`,
    Western: `${STORAGE_BASE}/cat-western.jpg`,
    Accessories: `${STORAGE_BASE}/cat-accessories.jpg`,
  }

  const filtered = products
    .filter(p => {
      if (!p.is_active) return false
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

  // Feed themes are a fundamentally different browsing paradigm — full-bleed
  // vertical scroll, not a grid — so they get their own renderer.
  if (theme.layout === 'feed') {
    return <StoreFeedLayout products={filtered} slug={slug} theme={theme} />
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
        <div className="w-full py-20 md:py-32 px-6 md:px-10 mb-6" style={{ background: theme.palette.bg }}>
          <p className="text-xs uppercase tracking-[0.22em] opacity-60 mb-3">New this season</p>
          <h1 className="text-5xl md:text-8xl font-bold tracking-tight" style={{ letterSpacing: '-0.02em', maxWidth: 900 }}>The full collection</h1>
        </div>
      ) : theme.hero === 'banner-strip' ? (
        <div className="w-full py-4 px-6 md:px-10 mb-6 flex items-center justify-between" style={{ background: theme.palette.accent, color: '#fff' }}>
          <span className="text-sm font-semibold">🔥 New arrivals this week</span>
          <span className="text-xs opacity-85">Free shipping over ₹999</span>
        </div>
      ) : (
        <div className="relative w-full h-[340px] md:h-[480px] overflow-hidden mb-10">
          <img src={heroImage} alt="" className="w-full h-full object-cover" onError={e => { e.currentTarget.style.display = 'none' }} />
          <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? 'from-black/85 via-black/30' : 'from-black/55 via-black/10'} to-transparent`} />
          <div className="absolute bottom-8 left-6 md:left-10 text-white">
            <p className="text-xs uppercase tracking-[0.22em] opacity-85 mb-2">New this season</p>
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight" style={{ letterSpacing: '-0.02em' }}>The full collection</h1>
          </div>
        </div>
      )}

      {/* Category row */}
      <div className="px-6 md:px-10 mb-10">
        <p className="text-xs uppercase tracking-[0.2em] mb-4" style={{ opacity: 0.5 }}>Categories</p>
        <div className="flex gap-5 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className="flex flex-col items-center gap-2 flex-shrink-0 group"
            >
              <div
                className="w-20 h-20 md:w-24 md:h-24 overflow-hidden"
                style={{
                  borderRadius: theme.decoration === 'stickers' ? 8 : '50%',
                  background: theme.palette.card,
                  outline: activeCategory === cat ? `2px solid ${theme.palette.accent}` : 'none',
                  outlineOffset: '3px',
                }}
              >
                <img
                  src={categoryTiles[cat]}
                  alt={cat}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={e => { e.currentTarget.style.visibility = 'hidden' }}
                />
              </div>
              <span className="text-xs font-medium whitespace-nowrap">{cat}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 md:px-10 pb-16">
        {/* Filter row */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b" style={{ borderColor: `${theme.palette.ink}14` }}>
          <div className="flex gap-6 overflow-x-auto">
            <button
              onClick={() => setActiveCategory(null)}
              className="text-sm font-medium whitespace-nowrap pb-1 transition-colors"
              style={{
                color: !activeCategory ? theme.palette.ink : `${theme.palette.ink}77`,
                borderBottom: !activeCategory ? `2px solid ${theme.palette.accent}` : '2px solid transparent',
              }}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                className="text-sm font-medium whitespace-nowrap pb-1 transition-colors"
                style={{
                  color: activeCategory === cat ? theme.palette.ink : `${theme.palette.ink}77`,
                  borderBottom: activeCategory === cat ? `2px solid ${theme.palette.accent}` : '2px solid transparent',
                }}
              >
                {cat}
              </button>
            ))}
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
                  <div className="relative overflow-hidden" style={{ aspectRatio: aspect, background: theme.palette.card, borderRadius: theme.decoration === 'rounded' ? 16 : 0 }}>
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
                      <span className="text-sm font-semibold" style={{ color: theme.palette.ink }}>₹{product.price_inr.toLocaleString('en-IN')}</span>
                      {product.original_price_inr && (
                        <span className="text-xs line-through" style={{ color: `${theme.palette.ink}55` }}>₹{product.original_price_inr.toLocaleString('en-IN')}</span>
                      )}
                    </div>
                    {rating && rating.count > 0 && (
                      <div className="flex items-center gap-1 mt-1.5">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill={theme.palette.ink} aria-hidden><path d="M12 2l2.9 6.9 7.1.6-5.4 4.7 1.7 7-6.3-3.9-6.3 3.9 1.7-7L2 9.5l7.1-.6z"/></svg>
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
    </div>
  )
}

function getDemoProducts(): Product[] {
  return [
    { id: 'p1', seller_id: 'demo', name: 'Floral Cotton Kurti', description: 'Light and breezy', category: 'Kurtas', price_inr: 899, original_price_inr: 1499, garment_image_url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&h=400&fit=crop', garment_preprocessed_url: null, slug: 'floral-kurti', is_active: true, sizes: ['S', 'M', 'L', 'XL'], colors: [], tags: [], created_at: '' },
    { id: 'p2', seller_id: 'demo', name: 'Embroidered Anarkali', description: 'For special occasions', category: 'Kurtas', price_inr: 2499, original_price_inr: 3999, garment_image_url: 'https://images.unsplash.com/photo-1617627143233-b27e68dda5df?w=400&h=400&fit=crop', garment_preprocessed_url: null, slug: 'anarkali', is_active: true, sizes: ['S', 'M', 'L'], colors: [], tags: [], created_at: '' },
    { id: 'p3', seller_id: 'demo', name: 'Silk Saree', description: 'Premium quality', category: 'Sarees', price_inr: 4999, original_price_inr: null, garment_image_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=400&fit=crop', garment_preprocessed_url: null, slug: 'silk-saree', is_active: true, sizes: ['Free Size'], colors: [], tags: [], created_at: '' },
    { id: 'p4', seller_id: 'demo', name: 'Casual Palazzo Set', description: 'Everyday comfort', category: 'Western', price_inr: 1299, original_price_inr: 1799, garment_image_url: 'https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=400&h=400&fit=crop', garment_preprocessed_url: null, slug: 'palazzo', is_active: true, sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: [], tags: [], created_at: '' },
  ]
}
