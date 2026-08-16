'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'
import { getPriceHistory } from '@/lib/dhamaka/catalog'
import { useFlagshipCart } from '@/lib/flagship/cart-context'
import { DhamakaPriceRadarBadge } from './DhamakaPriceRadar'
import { Reveal } from '@/components/flagship/Reveal'

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'new'

function sortProducts(products: ThemeProduct[], sort: SortKey): ThemeProduct[] {
  const copy = [...products]
  if (sort === 'price-asc') return copy.sort((a, b) => a.price - b.price)
  if (sort === 'price-desc') return copy.sort((a, b) => b.price - a.price)
  if (sort === 'new') return copy.sort((a, b) => Number(b.tags.includes('new')) - Number(a.tags.includes('new')))
  return copy
}

// Shared product card — used by both the shop grid and the homepage rails
// so the discount badge / Price Radar badge / quick-add logic only live in
// one place.
export function DhamakaProductCard({ product, slug, priority = false }: { product: ThemeProduct; slug: string; priority?: boolean }) {
  const { addLine } = useFlagshipCart()
  const [imgOk, setImgOk] = useState(true)
  const discountPct = product.originalPrice && product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null

  function quickAdd(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    addLine(product, product.sizes[0] ?? '', product.colors[0] ?? '', 1)
  }

  return (
    <Link href={`/store/${slug}/product/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded" style={{ background: 'var(--dh-card)' }}>
        {imgOk && (
          <img
            src={product.image}
            alt={product.name}
            loading={priority ? 'eager' : 'lazy'}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
            onError={() => setImgOk(false)}
          />
        )}

        {discountPct !== null && (
          <div
            className="absolute top-2 left-2 w-12 h-12 rounded-full flex items-center justify-center text-[11px] font-black text-center leading-tight"
            style={{ background: 'var(--dh-red)', color: 'var(--dh-red-ink)', transform: 'rotate(-10deg)' }}
          >
            -{discountPct}%
          </div>
        )}
        {product.tags.includes('flash') && (
          <span className="absolute top-2 right-2 text-[10px] font-black uppercase tracking-wide px-2 py-1 rounded" style={{ background: 'var(--dh-yellow)', color: 'var(--dh-yellow-ink)' }}>
            ⚡ Flash
          </span>
        )}

        <div className="absolute bottom-2 left-2 right-2">
          <DhamakaPriceRadarBadge history={getPriceHistory(product)} currentPrice={product.price} seedKey={product.id} />
        </div>

        <button
          onClick={quickAdd}
          className="absolute inset-x-0 bottom-0 py-2.5 text-[11px] tracking-[0.1em] uppercase text-center font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200 translate-y-full group-hover:translate-y-0"
          style={{ background: 'var(--dh-red)', color: 'var(--dh-red-ink)' }}
        >
          Quick Add
        </button>
      </div>
      <div className="mt-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm truncate" style={{ color: 'var(--dh-ink)' }}>{product.name}</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--dh-ink-dim)' }}>{product.colors[0]}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-sm font-bold" style={{ color: 'var(--dh-yellow)' }}>₹{product.price.toLocaleString('en-IN')}</p>
          {product.originalPrice && (
            <p className="text-xs line-through" style={{ color: 'var(--dh-ink-dim)' }}>₹{product.originalPrice.toLocaleString('en-IN')}</p>
          )}
        </div>
      </div>
    </Link>
  )
}

export function DhamakaShopGrid({ brand, products, initialCategory }: { brand: ThemeBrand; products: ThemeProduct[]; initialCategory?: string | null }) {
  const slug = brand.slug
  const [category, setCategory] = useState<string | null>(initialCategory ?? null)
  const [sort, setSort] = useState<SortKey>('featured')

  const categories = useMemo(() => brand.categories.length ? brand.categories : Array.from(new Set(products.map(p => p.category))), [brand.categories, products])

  const filtered = useMemo(() => {
    const base = category ? products.filter(p => p.category === category) : products
    return sortProducts(base, sort)
  }, [products, category, sort])

  return (
    <div className="max-w-[1440px] mx-auto px-6 md:px-10 pt-10 pb-24">
      <Reveal>
        <h1 className="dhamaka-display text-4xl md:text-5xl mb-2" style={{ color: 'var(--dh-yellow)' }}>{(category ?? 'The Blast').toUpperCase()}</h1>
        <p className="text-sm mb-8 font-medium" style={{ color: 'var(--dh-ink-muted)' }}>{filtered.length} deals live right now</p>
      </Reveal>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 sticky top-16 md:top-20 z-30 py-3 dhamaka-glass -mx-6 px-6 md:-mx-10 md:px-10 border-b" style={{ borderColor: 'var(--dh-line)' }}>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setCategory(null)}
            className="text-xs font-bold tracking-wide uppercase px-3.5 py-1.5 rounded border transition-opacity hover:opacity-80"
            style={category === null ? { background: 'var(--dh-red)', color: 'var(--dh-red-ink)', borderColor: 'var(--dh-red)' } : { borderColor: 'var(--dh-line)', color: 'var(--dh-ink-muted)' }}
          >
            All
          </button>
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className="text-xs font-bold tracking-wide uppercase px-3.5 py-1.5 rounded border transition-opacity hover:opacity-80"
              style={category === c ? { background: 'var(--dh-red)', color: 'var(--dh-red-ink)', borderColor: 'var(--dh-red)' } : { borderColor: 'var(--dh-line)', color: 'var(--dh-ink-muted)' }}
            >
              {c}
            </button>
          ))}
        </div>
        <select
          value={sort}
          onChange={e => setSort(e.target.value as SortKey)}
          className="text-xs font-bold tracking-wide uppercase bg-transparent border rounded px-3.5 py-1.5 outline-none"
          style={{ borderColor: 'var(--dh-line)', color: 'var(--dh-ink-muted)' }}
        >
          <option value="featured" style={{ color: '#000' }}>Featured</option>
          <option value="new" style={{ color: '#000' }}>Newest</option>
          <option value="price-asc" style={{ color: '#000' }}>Price: Low to High</option>
          <option value="price-desc" style={{ color: '#000' }}>Price: High to Low</option>
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-8">
        {filtered.map((p, i) => (
          <Reveal key={p.id} delay={Math.min(i, 8) * 0.04}>
            <DhamakaProductCard product={p} slug={slug} priority={i < 4} />
          </Reveal>
        ))}
      </div>
    </div>
  )
}
