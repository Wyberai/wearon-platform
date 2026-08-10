'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState, useEffect, useCallback } from 'react'
import type { Product, TenantConfig } from '@/lib/types'

function getOrCreateDeviceToken(): string {
  let token = localStorage.getItem('wearon_device_token')
  if (!token) {
    token = crypto.randomUUID()
    localStorage.setItem('wearon_device_token', token)
  }
  return token
}

export default function StorePage() {
  const { slug } = useParams() as { slug: string }
  const [config, setConfig] = useState<TenantConfig | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState('newest')
  const [wishlist, setWishlist] = useState<Set<string>>(new Set())
  const [ratings, setRatings] = useState<Record<string, { avg: number; count: number }>>({})
  const [loading, setLoading] = useState(true)

  const isDemoStore = slug === 'demo'

  const loadData = useCallback(async () => {
    try {
      const [cfgRes, prodRes] = await Promise.all([
        fetch(`/api/store/config?slug=${slug}`),
        fetch(`/api/admin/products?slug=${slug}`),
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

  const primary = (config as TenantConfig & { primary_color?: string })?.primary_color ?? '#F72585'
  const categories: string[] = (config?.categories as string[]) ?? ['Kurtas', 'Sarees', 'Lehengas', 'Western', 'Accessories']

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

  const heroImage = products.find(p => p.is_active)?.garment_image_url

  return (
    <div className="max-w-[1400px] mx-auto">
      {/* Editorial hero */}
      {heroImage && (
        <div className="relative w-full h-[340px] md:h-[480px] overflow-hidden mb-10">
          <img src={heroImage} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
          <div className="absolute bottom-8 left-6 md:left-10 text-white">
            <p className="text-xs uppercase tracking-[0.2em] opacity-80 mb-2">New this season</p>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">The full collection</h1>
          </div>
        </div>
      )}

      <div className="px-6 md:px-10 pb-16">
        {/* Filter row — understated, no big search box */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-gray-100">
          <div className="flex gap-6 overflow-x-auto">
            <button
              onClick={() => setActiveCategory(null)}
              className="text-sm font-medium whitespace-nowrap pb-1 transition-colors"
              style={{
                color: !activeCategory ? '#111827' : '#9CA3AF',
                borderBottom: !activeCategory ? `2px solid ${primary}` : '2px solid transparent',
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
                  color: activeCategory === cat ? '#111827' : '#9CA3AF',
                  borderBottom: activeCategory === cat ? `2px solid ${primary}` : '2px solid transparent',
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
              className="text-sm text-gray-600 border-b border-gray-200 focus:border-gray-400 outline-none py-1 w-32 bg-transparent"
            />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="text-xs text-gray-500 outline-none bg-transparent cursor-pointer"
            >
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Products grid — portrait imagery, minimal chrome */}
        {filtered.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <p className="text-sm">{search ? 'No products match your search' : 'No products yet. Check back soon!'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
            {filtered.map(product => {
              const inWishlist = wishlist.has(product.id)
              const rating = ratings[product.id]
              if (!rating) loadRatings(product.id)

              return (
                <Link key={product.id} href={`/store/${slug}/product/${product.id}`} className="group block">
                  <div className="relative overflow-hidden bg-gray-50" style={{ aspectRatio: '4 / 5' }}>
                    <img
                      src={product.garment_image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    />
                    {product.original_price_inr && product.original_price_inr > product.price_inr && (
                      <div className="absolute top-3 left-3 bg-white text-[10px] font-semibold uppercase tracking-wide px-2 py-1 text-gray-900">
                        {Math.round((1 - product.price_inr / product.original_price_inr) * 100)}% off
                      </div>
                    )}
                    <button
                      onClick={(e) => toggleWishlist(e, product.id)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <span className="text-base leading-none" style={{ color: inWishlist ? primary : '#9CA3AF' }}>
                        {inWishlist ? '♥' : '♡'}
                      </span>
                    </button>
                  </div>
                  <div className="pt-3">
                    <p className="text-sm text-gray-800 truncate">{product.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-900 font-medium">₹{product.price_inr.toLocaleString('en-IN')}</span>
                      {product.original_price_inr && (
                        <span className="text-gray-400 text-xs line-through">₹{product.original_price_inr.toLocaleString('en-IN')}</span>
                      )}
                    </div>
                    {rating && rating.count > 0 && (
                      <p className="text-xs text-gray-400 mt-1">
                        {'★'.repeat(Math.round(rating.avg))}{'☆'.repeat(5 - Math.round(rating.avg))} ({rating.count})
                      </p>
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
