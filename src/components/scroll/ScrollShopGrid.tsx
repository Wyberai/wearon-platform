'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'new'

function sortProducts(products: ThemeProduct[], sort: SortKey): ThemeProduct[] {
  const copy = [...products]
  if (sort === 'price-asc') return copy.sort((a, b) => a.price - b.price)
  if (sort === 'price-desc') return copy.sort((a, b) => b.price - a.price)
  if (sort === 'new') return copy.sort((a, b) => Number(b.tags.includes('new')) - Number(a.tags.includes('new')))
  return copy
}

// The browse view is a tight 3-column square grid — the same shape as a
// real social app's profile grid — rather than the airy 2-4 col product
// grids every other flagship theme uses. It's still a full real ecommerce
// grid (filter, sort, tap through to a real PDP); the grid shape is just
// this theme's genre signature.
export function ScrollShopGrid({ brand, products, initialCategory }: { brand: ThemeBrand; products: ThemeProduct[]; initialCategory?: string | null }) {
  const slug = brand.slug
  const [category, setCategory] = useState<string | null>(initialCategory ?? null)
  const [sort, setSort] = useState<SortKey>('featured')

  const categories = useMemo(() => brand.categories.length ? brand.categories : Array.from(new Set(products.map(p => p.category))), [brand.categories, products])

  const filtered = useMemo(() => {
    const base = category ? products.filter(p => p.category === category) : products
    return sortProducts(base, sort)
  }, [products, category, sort])

  return (
    <div className="max-w-[600px] mx-auto pb-16">
      <div className="px-3.5 pt-5 pb-3">
        <h1 className="scroll-display text-2xl font-extrabold mb-1">{category ?? 'Shop the Feed'}</h1>
        <p className="text-sm" style={{ color: 'var(--sc-ink-muted)' }}>{filtered.length} pieces</p>
      </div>

      <div className="flex flex-col gap-3 mb-1 sticky top-14 z-30 py-2.5 scroll-glass border-b" style={{ borderColor: 'var(--sc-line)' }}>
        <div className="flex items-center justify-between gap-3 px-3.5">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setCategory(null)}
              className="text-[11.5px] font-semibold px-3 py-1.5 rounded-full border transition-opacity hover:opacity-80"
              style={category === null ? { background: 'var(--sc-ink)', color: 'var(--sc-bg)', borderColor: 'var(--sc-ink)' } : { borderColor: 'var(--sc-line)', color: 'var(--sc-ink-muted)' }}
            >
              All
            </button>
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className="text-[11.5px] font-semibold px-3 py-1.5 rounded-full border transition-opacity hover:opacity-80 whitespace-nowrap"
                style={category === c ? { background: 'var(--sc-ink)', color: 'var(--sc-bg)', borderColor: 'var(--sc-ink)' } : { borderColor: 'var(--sc-line)', color: 'var(--sc-ink-muted)' }}
              >
                {c}
              </button>
            ))}
          </div>
          <select
            value={sort}
            onChange={e => setSort(e.target.value as SortKey)}
            className="text-[11px] font-semibold bg-transparent border rounded-full px-2.5 py-1.5 outline-none flex-shrink-0"
            style={{ borderColor: 'var(--sc-line)', color: 'var(--sc-ink-muted)' }}
          >
            <option value="featured">Featured</option>
            <option value="new">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-[2px] mt-[2px]">
        {filtered.map(p => (
          <Link key={p.id} href={`/store/${slug}/product/${p.slug}`} className="group relative aspect-square block overflow-hidden" style={{ background: 'var(--sc-card)' }}>
            <img
              src={p.image}
              alt={p.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              onError={e => { e.currentTarget.style.display = 'none' }}
            />
            {p.tags.includes('bestseller') && (
              <span className="absolute top-1.5 left-1.5 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded scroll-gradient" style={{ color: 'var(--sc-accent-ink)' }}>Hot</span>
            )}
            <div className="absolute inset-x-0 bottom-0 px-1.5 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.65))' }}>
              <span className="text-white text-[11px] font-semibold">₹{p.price.toLocaleString('en-IN')}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
