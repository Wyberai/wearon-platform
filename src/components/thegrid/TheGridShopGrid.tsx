'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'
import { formatINR } from '@/lib/thegrid/catalog'
import { TheGridTile } from './TheGridTile'
import { Reveal } from '@/components/flagship/Reveal'

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'new'

function sortProducts(products: ThemeProduct[], sort: SortKey): ThemeProduct[] {
  const copy = [...products]
  if (sort === 'price-asc') return copy.sort((a, b) => a.price - b.price)
  if (sort === 'price-desc') return copy.sort((a, b) => b.price - a.price)
  if (sort === 'new') return copy.sort((a, b) => Number(b.tags.includes('new')) - Number(a.tags.includes('new')))
  return copy
}

// A tile plus its hover-reveal price caption — kept edge-to-edge like a
// real IG grid (thin gutters, no card chrome), the price only surfaces on
// hover/tap rather than always-visible text under each tile.
function TileWithCaption({ product, slug, priority }: { product: ThemeProduct; slug: string; priority?: boolean }) {
  const pctOff = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : null
  return (
    <div className="relative group">
      <TheGridTile product={product} slug={slug} priority={priority} />
      <div className="absolute bottom-0 left-0 right-0 p-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.65) 0%, transparent 100%)' }}>
        <p className="text-white text-[11px] font-medium truncate">{product.name}</p>
        <div className="flex items-center gap-1.5">
          <span className="text-white text-xs font-semibold">{formatINR(product.price)}</span>
          {pctOff !== null && <span className="text-white/80 text-[10px]">-{pctOff}%</span>}
        </div>
      </div>
    </div>
  )
}

export function TheGridShopGrid({ brand, products, initialCategory }: { brand: ThemeBrand; products: ThemeProduct[]; initialCategory?: string | null }) {
  const slug = brand.slug
  const [category, setCategory] = useState<string | null>(initialCategory ?? null)
  const [sort, setSort] = useState<SortKey>('featured')

  const categories = useMemo(() => brand.categories.length ? brand.categories : Array.from(new Set(products.map(p => p.category))), [brand.categories, products])
  const filtered = useMemo(() => {
    const base = category ? products.filter(p => p.category === category) : products
    return sortProducts(base, sort)
  }, [products, category, sort])

  return (
    <div className="max-w-[1080px] mx-auto pt-6 pb-24">
      <div className="px-6">
        <Reveal>
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--tg-display)' }}>{category ?? 'The Grid'}</h1>
          <p className="text-sm mb-6" style={{ color: 'var(--tg-ink-muted)' }}>{filtered.length} posts</p>
        </Reveal>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={() => setCategory(null)} className="text-xs font-medium px-3 py-1.5 rounded-full border" style={category === null ? { background: 'var(--tg-ink)', color: 'var(--tg-bg)', borderColor: 'var(--tg-ink)' } : { borderColor: 'var(--tg-line)', color: 'var(--tg-ink-muted)' }}>All</button>
            {categories.map(c => (
              <button key={c} onClick={() => setCategory(c)} className="text-xs font-medium px-3 py-1.5 rounded-full border" style={category === c ? { background: 'var(--tg-ink)', color: 'var(--tg-bg)', borderColor: 'var(--tg-ink)' } : { borderColor: 'var(--tg-line)', color: 'var(--tg-ink-muted)' }}>{c}</button>
            ))}
          </div>
          <select value={sort} onChange={e => setSort(e.target.value as SortKey)} className="text-xs font-medium bg-transparent border rounded-full px-3 py-1.5 outline-none" style={{ borderColor: 'var(--tg-line)', color: 'var(--tg-ink-muted)' }}>
            <option value="featured">Featured</option>
            <option value="new">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-0.5 md:gap-1">
        {filtered.map((p, i) => (
          <TileWithCaption key={p.id} product={p} slug={slug} priority={i < 6} />
        ))}
      </div>
    </div>
  )
}
