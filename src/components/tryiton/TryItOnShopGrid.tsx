'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'
import { formatINR } from '@/lib/tryiton/catalog'
import { useFlagshipCart } from '@/lib/flagship/cart-context'
import { TryItOnImg } from './TryItOnShell'
import { Reveal } from '@/components/flagship/Reveal'

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'new'

function sortProducts(products: ThemeProduct[], sort: SortKey): ThemeProduct[] {
  const copy = [...products]
  if (sort === 'price-asc') return copy.sort((a, b) => a.price - b.price)
  if (sort === 'price-desc') return copy.sort((a, b) => b.price - a.price)
  if (sort === 'new') return copy.sort((a, b) => Number(b.tags.includes('new')) - Number(a.tags.includes('new')))
  return copy
}

// A normal catalog card — the theme's signature (video-first PDP) lives on
// the product page, not here, so this card just flags "has a reel" with a
// small badge rather than autoplaying anything in-grid.
export function TryItOnProductCard({ product, slug, priority = false }: { product: ThemeProduct; slug: string; priority?: boolean }) {
  const { addLine } = useFlagshipCart()
  const [hovered, setHovered] = useState(false)
  const pctOff = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : null

  function quickAdd(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    addLine(product, product.sizes[0] ?? '', product.colors[0] ?? '', 1)
  }

  return (
    <Link href={`/store/${slug}/product/${product.slug}`} className="group block" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
        <TryItOnImg src={product.image} alt={product.name} wrapperClassName="absolute inset-0" imgClassName="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" priority={priority} />
        {product.video && <span className="absolute top-2.5 left-2.5 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center text-[11px]">▶</span>}
        {pctOff !== null && <span className="absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-1 rounded-md" style={{ background: 'var(--ti-sale)', color: 'var(--ti-accent-ink)' }}>-{pctOff}%</span>}
        <button onClick={quickAdd} className="absolute bottom-0 left-0 right-0 py-2.5 text-[11px] font-semibold text-center transition-all duration-300" style={{ background: 'var(--ti-ink)', color: 'var(--ti-bg)', transform: hovered ? 'translateY(0)' : 'translateY(100%)', opacity: hovered ? 1 : 0 }}>
          QUICK ADD
        </button>
      </div>
      <div className="mt-3">
        <p className="text-sm font-medium truncate" style={{ color: 'var(--ti-ink)' }}>{product.name}</p>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-sm font-semibold" style={{ color: product.originalPrice ? 'var(--ti-sale)' : 'var(--ti-ink)' }}>{formatINR(product.price)}</p>
          {product.originalPrice && <p className="text-xs line-through" style={{ color: 'var(--ti-ink-dim)' }}>{formatINR(product.originalPrice)}</p>}
        </div>
      </div>
    </Link>
  )
}

export function TryItOnShopGrid({ brand, products, initialCategory }: { brand: ThemeBrand; products: ThemeProduct[]; initialCategory?: string | null }) {
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
        <h1 className="text-3xl md:text-4xl font-bold mb-1" style={{ fontFamily: 'var(--ti-display)' }}>{category ?? 'Shop All'}</h1>
        <p className="text-sm mb-6" style={{ color: 'var(--ti-ink-muted)' }}>{filtered.length} products</p>
      </Reveal>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sticky top-16 md:top-18 z-30 py-3 -mx-6 px-6 md:-mx-10 md:px-10 border-b" style={{ background: 'var(--ti-glass)', backdropFilter: 'blur(14px)', borderColor: 'var(--ti-line)' }}>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => setCategory(null)} className="text-xs font-medium px-3.5 py-1.5 rounded-full border" style={category === null ? { background: 'var(--ti-ink)', color: 'var(--ti-bg)', borderColor: 'var(--ti-ink)' } : { borderColor: 'var(--ti-line)', color: 'var(--ti-ink-muted)' }}>All</button>
          {categories.map(c => (
            <button key={c} onClick={() => setCategory(c)} className="text-xs font-medium px-3.5 py-1.5 rounded-full border" style={category === c ? { background: 'var(--ti-ink)', color: 'var(--ti-bg)', borderColor: 'var(--ti-ink)' } : { borderColor: 'var(--ti-line)', color: 'var(--ti-ink-muted)' }}>{c}</button>
          ))}
        </div>
        <select value={sort} onChange={e => setSort(e.target.value as SortKey)} className="text-xs font-medium bg-transparent border rounded-full px-3.5 py-1.5 outline-none" style={{ borderColor: 'var(--ti-line)', color: 'var(--ti-ink-muted)' }}>
          <option value="featured">Featured</option>
          <option value="new">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {filtered.map((p, i) => (
          <Reveal key={p.id} delay={Math.min(i, 8) * 0.04}><TryItOnProductCard product={p} slug={slug} priority={i < 4} /></Reveal>
        ))}
      </div>
    </div>
  )
}
