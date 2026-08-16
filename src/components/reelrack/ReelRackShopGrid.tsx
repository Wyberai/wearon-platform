'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'
import { formatINR } from '@/lib/reelrack/catalog'
import { useFlagshipCart } from '@/lib/flagship/cart-context'
import { ReelRackMedia } from './ReelRackShell'
import { Reveal } from '@/components/flagship/Reveal'

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'new'

function sortProducts(products: ThemeProduct[], sort: SortKey): ThemeProduct[] {
  const copy = [...products]
  if (sort === 'price-asc') return copy.sort((a, b) => a.price - b.price)
  if (sort === 'price-desc') return copy.sort((a, b) => b.price - a.price)
  if (sort === 'new') return copy.sort((a, b) => Number(b.tags.includes('new')) - Number(a.tags.includes('new')))
  return copy
}

// Simple, local-only wishlist — a heart the shopper can toggle per browser.
// Not backed by an account; good enough to signal "saved for later" without
// requiring sign-in, same spirit as most small-boutique storefronts.
const WISHLIST_KEY = 'reelrack_wishlist_v1'
function useWishlist() {
  const [ids, setIds] = useState<Set<string>>(new Set())
  useEffect(() => {
    try { setIds(new Set(JSON.parse(localStorage.getItem(WISHLIST_KEY) ?? '[]'))) } catch { /* ignore */ }
  }, [])
  function toggle(id: string) {
    setIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      localStorage.setItem(WISHLIST_KEY, JSON.stringify([...next]))
      return next
    })
  }
  return { ids, toggle }
}

export function ReelRackProductCard({ product, slug, priority = false }: { product: ThemeProduct; slug: string; priority?: boolean }) {
  const { addLine } = useFlagshipCart()
  const { ids: wishlisted, toggle: toggleWishlist } = useWishlist()
  const [hovered, setHovered] = useState(false)

  const pctOff = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : null

  function quickAdd(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    addLine(product, product.sizes[0] ?? '', product.colors[0] ?? '', 1)
  }

  function onWishlist(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(product.id)
  }

  return (
    <Link href={`/store/${slug}/product/${product.slug}`} className="group block" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
        <ReelRackMedia image={product.image} video={product.video} alt={product.name} playing={hovered} wrapperClassName="absolute inset-0" priority={priority} />

        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {pctOff !== null && (
            <span className="text-[10px] font-bold px-2 py-1 rounded-md" style={{ background: 'var(--rr-sale)', color: '#fff' }}>-{pctOff}%</span>
          )}
          {product.tags.includes('new') && (
            <span className="text-[10px] font-bold px-2 py-1 rounded-md" style={{ background: 'var(--rr-ink)', color: 'var(--rr-bg)' }}>NEW</span>
          )}
        </div>

        <button
          onClick={onWishlist}
          aria-label="Add to wishlist"
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          style={{ background: 'rgba(255,249,245,0.9)' }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill={wishlisted.has(product.id) ? 'var(--rr-accent)' : 'none'} stroke={wishlisted.has(product.id) ? 'var(--rr-accent)' : 'var(--rr-ink)'} strokeWidth="1.8" aria-hidden>
            <path d="M12 21s-7.5-4.8-10-9.3C.4 8.2 2 4.5 5.5 3.6c2.1-.5 4.1.4 5.2 2 .3.4.8 1 1.3 1.7.5-.7 1-1.3 1.3-1.7 1.1-1.6 3.1-2.5 5.2-2 3.5.9 5.1 4.6 3.5 8.1-2.5 4.5-10 9.3-10 9.3z"/>
          </svg>
        </button>

        <button
          onClick={quickAdd}
          className="absolute bottom-0 left-0 right-0 py-2.5 text-[11px] font-semibold text-center transition-all duration-300"
          style={{ background: 'var(--rr-ink)', color: 'var(--rr-bg)', transform: hovered ? 'translateY(0)' : 'translateY(100%)', opacity: hovered ? 1 : 0 }}
        >
          QUICK ADD
        </button>
      </div>
      <div className="mt-3">
        <p className="text-sm font-medium truncate" style={{ color: 'var(--rr-ink)' }}>{product.name}</p>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-sm font-semibold" style={{ color: product.originalPrice ? 'var(--rr-sale)' : 'var(--rr-ink)' }}>{formatINR(product.price)}</p>
          {product.originalPrice && <p className="text-xs line-through" style={{ color: 'var(--rr-ink-dim)' }}>{formatINR(product.originalPrice)}</p>}
        </div>
      </div>
    </Link>
  )
}

export function ReelRackShopGrid({ brand, products, initialCategory }: { brand: ThemeBrand; products: ThemeProduct[]; initialCategory?: string | null }) {
  const slug = brand.slug
  const [category, setCategory] = useState<string | null>(initialCategory ?? null)
  const [sort, setSort] = useState<SortKey>('featured')

  const categories = useMemo(() => brand.categories.length ? brand.categories : Array.from(new Set(products.map(p => p.category))), [brand.categories, products])
  const filtered = useMemo(() => {
    const base = category ? products.filter(p => p.category === category) : products
    return sortProducts(base, sort)
  }, [products, category, sort])

  return (
    <div className="max-w-[1440px] mx-auto px-6 md:px-10 pt-8 pb-24">
      <Reveal>
        <h1 className="text-3xl md:text-4xl font-bold mb-1" style={{ fontFamily: 'var(--rr-display)' }}>{category ?? 'Shop All'}</h1>
        <p className="text-sm mb-6" style={{ color: 'var(--rr-ink-muted)' }}>{filtered.length} products</p>
      </Reveal>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sticky top-16 md:top-18 z-30 py-3 -mx-6 px-6 md:-mx-10 md:px-10 border-b" style={{ background: 'var(--rr-glass)', backdropFilter: 'blur(14px)', borderColor: 'var(--rr-line)' }}>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => setCategory(null)} className="text-xs font-medium px-3.5 py-1.5 rounded-full border transition-opacity hover:opacity-80"
            style={category === null ? { background: 'var(--rr-ink)', color: 'var(--rr-bg)', borderColor: 'var(--rr-ink)' } : { borderColor: 'var(--rr-line)', color: 'var(--rr-ink-muted)' }}>
            All
          </button>
          {categories.map(c => (
            <button key={c} onClick={() => setCategory(c)} className="text-xs font-medium px-3.5 py-1.5 rounded-full border transition-opacity hover:opacity-80"
              style={category === c ? { background: 'var(--rr-ink)', color: 'var(--rr-bg)', borderColor: 'var(--rr-ink)' } : { borderColor: 'var(--rr-line)', color: 'var(--rr-ink-muted)' }}>
              {c}
            </button>
          ))}
        </div>
        <select value={sort} onChange={e => setSort(e.target.value as SortKey)}
          className="text-xs font-medium bg-transparent border rounded-full px-3.5 py-1.5 outline-none" style={{ borderColor: 'var(--rr-line)', color: 'var(--rr-ink-muted)' }}>
          <option value="featured">Featured</option>
          <option value="new">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {filtered.map((p, i) => (
          <Reveal key={p.id} delay={Math.min(i, 8) * 0.04}>
            <ReelRackProductCard product={p} slug={slug} priority={i < 4} />
          </Reveal>
        ))}
      </div>
    </div>
  )
}
