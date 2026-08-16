'use client'

import { useMemo, useState } from 'react'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'
import { SaajProductCard } from './SaajShell'
import { Reveal } from '@/components/flagship/Reveal'

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'new'

function sortProducts(products: ThemeProduct[], sort: SortKey): ThemeProduct[] {
  const copy = [...products]
  if (sort === 'price-asc') return copy.sort((a, b) => a.price - b.price)
  if (sort === 'price-desc') return copy.sort((a, b) => b.price - a.price)
  if (sort === 'new') return copy.sort((a, b) => Number(b.tags.includes('new')) - Number(a.tags.includes('new')))
  return copy
}

export function SaajShopGrid({ brand, products, initialCategory }: { brand: ThemeBrand; products: ThemeProduct[]; initialCategory?: string | null }) {
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
        <h1 className="saaj-display text-4xl md:text-5xl mb-2 font-semibold">{category ?? 'The Collection'}</h1>
        <p className="text-sm mb-8" style={{ color: 'var(--sj-ink-muted)' }}>{filtered.length} pieces</p>
      </Reveal>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 sticky top-16 md:top-20 z-30 py-3 saaj-glass -mx-6 px-6 md:-mx-10 md:px-10 border-b" style={{ borderColor: 'var(--sj-line)' }}>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setCategory(null)}
            className="text-xs tracking-wide uppercase px-3.5 py-1.5 rounded-full border transition-opacity hover:opacity-80"
            style={category === null ? { background: 'var(--sj-ink)', color: 'var(--sj-bg)', borderColor: 'var(--sj-ink)' } : { borderColor: 'var(--sj-line)', color: 'var(--sj-ink-muted)' }}
          >
            All
          </button>
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className="text-xs tracking-wide uppercase px-3.5 py-1.5 rounded-full border transition-opacity hover:opacity-80"
              style={category === c ? { background: 'var(--sj-ink)', color: 'var(--sj-bg)', borderColor: 'var(--sj-ink)' } : { borderColor: 'var(--sj-line)', color: 'var(--sj-ink-muted)' }}
            >
              {c}
            </button>
          ))}
        </div>
        <select
          value={sort}
          onChange={e => setSort(e.target.value as SortKey)}
          className="text-xs tracking-wide uppercase bg-transparent border rounded-full px-3.5 py-1.5 outline-none"
          style={{ borderColor: 'var(--sj-line)', color: 'var(--sj-ink-muted)' }}
        >
          <option value="featured">Featured</option>
          <option value="new">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm py-16 text-center" style={{ color: 'var(--sj-ink-muted)' }}>No pieces in this category yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-8">
          {filtered.map((p, i) => (
            <Reveal key={p.id} delay={Math.min(i, 8) * 0.04}>
              <SaajProductCard product={p} slug={slug} priority={i < 4} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  )
}
