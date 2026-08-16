'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'
import { Reveal } from '@/components/flagship/Reveal'
import { rentalFieldsOf } from './KirayaRentForDate'

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'new'

function sortProducts(products: ThemeProduct[], sort: SortKey): ThemeProduct[] {
  const copy = [...products]
  if (sort === 'price-asc') return copy.sort((a, b) => a.price - b.price)
  if (sort === 'price-desc') return copy.sort((a, b) => b.price - a.price)
  if (sort === 'new') return copy.sort((a, b) => Number(b.tags.includes('new')) - Number(a.tags.includes('new')))
  return copy
}

// Shared product card — used by both KirayaShopGrid and KirayaHome so the
// rental-price / struck-through-retail-value framing only lives in one
// place. No "Quick Add" here (unlike BLOOM) — every rental genuinely
// requires an event date first, so the card always routes to the PDP where
// KirayaRentForDate lives.
export function KirayaProductCard({ product, slug, priority = false }: { product: ThemeProduct; slug: string; priority?: boolean }) {
  const { rentalPrice, retailValue } = rentalFieldsOf(product)

  return (
    <Link href={`/store/${slug}/product/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl" style={{ background: 'var(--ki-plum)' }}>
        <img
          src={product.image}
          alt={product.name}
          loading={priority ? 'eager' : 'lazy'}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          onError={e => { e.currentTarget.style.display = 'none' }}
        />
        {product.tags.includes('new') && (
          <span className="absolute top-3 left-3 text-[10px] tracking-[0.1em] uppercase px-2.5 py-1 rounded-full font-medium" style={{ background: 'var(--ki-bg)', color: 'var(--ki-ink)' }}>New</span>
        )}
        {product.tags.includes('signature') && (
          <span className="absolute top-3 left-3 text-[10px] tracking-[0.1em] uppercase px-2.5 py-1 rounded-full font-medium" style={{ background: 'var(--ki-accent)', color: 'var(--ki-accent-ink)' }}>Signature</span>
        )}
        <span
          className="absolute bottom-0 left-0 right-0 py-2.5 text-[11px] tracking-[0.08em] uppercase text-center font-medium"
          style={{ background: 'var(--ki-glass)', backdropFilter: 'blur(10px)', color: 'var(--ki-ink)' }}
        >
          Rent for the date →
        </span>
      </div>
      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <p className="text-sm" style={{ color: 'var(--ki-ink)' }}>{product.name}</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--ki-ink-dim)' }}>{product.colors[0]}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-sm font-medium" style={{ color: 'var(--ki-accent)' }}>₹{rentalPrice.toLocaleString('en-IN')}</p>
          <p className="text-[11px] line-through" style={{ color: 'var(--ki-ink-dim)' }}>₹{retailValue.toLocaleString('en-IN')}</p>
        </div>
      </div>
    </Link>
  )
}

export function KirayaShopGrid({ brand, products, initialCategory }: { brand: ThemeBrand; products: ThemeProduct[]; initialCategory?: string | null }) {
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
        <h1 className="kiraya-display italic text-4xl md:text-5xl mb-2">{category ?? 'The Rental Wardrobe'}</h1>
        <p className="text-sm mb-8" style={{ color: 'var(--ki-ink-muted)' }}>{filtered.length} pieces, ready to rent</p>
      </Reveal>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 sticky top-16 md:top-20 z-30 py-3 kiraya-glass -mx-6 px-6 md:-mx-10 md:px-10 border-b" style={{ borderColor: 'var(--ki-line)' }}>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setCategory(null)}
            className="text-xs tracking-wide uppercase px-3.5 py-1.5 rounded-full border transition-opacity hover:opacity-80"
            style={category === null ? { background: 'var(--ki-accent)', color: 'var(--ki-accent-ink)', borderColor: 'var(--ki-accent)' } : { borderColor: 'var(--ki-line)', color: 'var(--ki-ink-muted)' }}
          >
            All
          </button>
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className="text-xs tracking-wide uppercase px-3.5 py-1.5 rounded-full border transition-opacity hover:opacity-80"
              style={category === c ? { background: 'var(--ki-accent)', color: 'var(--ki-accent-ink)', borderColor: 'var(--ki-accent)' } : { borderColor: 'var(--ki-line)', color: 'var(--ki-ink-muted)' }}
            >
              {c}
            </button>
          ))}
        </div>
        <select
          value={sort}
          onChange={e => setSort(e.target.value as SortKey)}
          className="text-xs tracking-wide uppercase bg-transparent border rounded-full px-3.5 py-1.5 outline-none"
          style={{ borderColor: 'var(--ki-line)', color: 'var(--ki-ink-muted)' }}
        >
          <option value="featured">Featured</option>
          <option value="new">Newest</option>
          <option value="price-asc">Rental Price: Low to High</option>
          <option value="price-desc">Rental Price: High to Low</option>
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-8">
        {filtered.map((p, i) => (
          <Reveal key={p.id} delay={Math.min(i, 8) * 0.04}>
            <KirayaProductCard product={p} slug={slug} priority={i < 4} />
          </Reveal>
        ))}
      </div>
    </div>
  )
}
