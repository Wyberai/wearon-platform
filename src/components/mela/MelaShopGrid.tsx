'use client'

import { useMemo, useState } from 'react'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'
import { MelaProductCard } from './MelaShell'
import { Reveal } from '@/components/flagship/Reveal'

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'new'

function sortProducts(products: ThemeProduct[], sort: SortKey): ThemeProduct[] {
  const copy = [...products]
  if (sort === 'price-asc') return copy.sort((a, b) => a.price - b.price)
  if (sort === 'price-desc') return copy.sort((a, b) => b.price - a.price)
  if (sort === 'new') return copy.sort((a, b) => Number(b.tags.includes('new')) - Number(a.tags.includes('new')))
  return copy
}

export function MelaShopGrid({ brand, products, initialCategory }: { brand: ThemeBrand; products: ThemeProduct[]; initialCategory?: string | null }) {
  const slug = brand.slug
  const [category, setCategory] = useState<string | null>(initialCategory ?? null)
  const [sort, setSort] = useState<SortKey>('featured')

  const categories = useMemo(() => brand.categories.length ? brand.categories : Array.from(new Set(products.map(p => p.category))), [brand.categories, products])

  const filtered = useMemo(() => {
    const base = category ? products.filter(p => p.category === category) : products
    return sortProducts(base, sort)
  }, [products, category, sort])

  return (
    <div className="max-w-[1440px] mx-auto px-5 md:px-10 pt-8 pb-24">
      <Reveal>
        <h1 className="mela-display text-4xl md:text-5xl font-extrabold mb-2" style={{ color: 'var(--me-pink)' }}>{category ?? 'Everything On The Rack'}</h1>
        <p className="text-sm mb-8 font-medium" style={{ color: 'var(--me-ink-muted)' }}>{filtered.length} pieces · every price is a starting price</p>
      </Reveal>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-9 sticky top-[104px] md:top-[120px] z-30 py-3 mela-glass -mx-5 px-5 md:-mx-10 md:px-10 border-b" style={{ borderColor: 'var(--me-line)' }}>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setCategory(null)}
            className="text-xs tracking-wide uppercase px-3.5 py-1.5 rounded-full border-2 font-bold transition-opacity hover:opacity-80"
            style={category === null ? { background: 'var(--me-ink)', color: 'var(--me-bg)', borderColor: 'var(--me-ink)' } : { borderColor: 'var(--me-line)', color: 'var(--me-ink-muted)' }}
          >
            All
          </button>
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className="text-xs tracking-wide uppercase px-3.5 py-1.5 rounded-full border-2 font-bold transition-opacity hover:opacity-80"
              style={category === c ? { background: 'var(--me-pink)', color: '#fff', borderColor: 'var(--me-pink)' } : { borderColor: 'var(--me-line)', color: 'var(--me-ink-muted)' }}
            >
              {c}
            </button>
          ))}
        </div>
        <select
          value={sort}
          onChange={e => setSort(e.target.value as SortKey)}
          className="text-xs tracking-wide uppercase bg-transparent border-2 rounded-full px-3.5 py-1.5 outline-none font-bold"
          style={{ borderColor: 'var(--me-line)', color: 'var(--me-ink-muted)' }}
        >
          <option value="featured">Featured</option>
          <option value="new">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {filtered.map((p, i) => (
          <Reveal key={p.id} delay={Math.min(i, 8) * 0.04}>
            <MelaProductCard product={p} slug={slug} priority={i < 4} />
          </Reveal>
        ))}
      </div>
    </div>
  )
}
