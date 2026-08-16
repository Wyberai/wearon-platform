'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'
import { formatINR } from '@/lib/taana/catalog'
import { useFlagshipCart } from '@/lib/flagship/cart-context'
import { TaanaImg } from './TaanaShell'
import { Reveal } from '@/components/flagship/Reveal'

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'new'

function sortProducts(products: ThemeProduct[], sort: SortKey): ThemeProduct[] {
  const copy = [...products]
  if (sort === 'price-asc') return copy.sort((a, b) => a.price - b.price)
  if (sort === 'price-desc') return copy.sort((a, b) => b.price - a.price)
  if (sort === 'new') return copy.sort((a, b) => Number(b.tags.includes('new')) - Number(a.tags.includes('new')))
  return copy
}

// Shared by TaanaShopGrid, TaanaHome and TaanaPDP (related items) — kept in
// this file, exported, rather than duplicated across all three, since the
// theme's allowed file list doesn't include a separate ProductCard file.
export function TaanaProductCard({ product, slug, priority = false }: { product: ThemeProduct; slug: string; priority?: boolean }) {
  const { addLine } = useFlagshipCart()
  const [hovered, setHovered] = useState(false)

  function quickAdd(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    addLine(product, product.sizes[0] ?? '', product.colors[0] ?? '', 1)
  }

  return (
    <Link
      href={`/store/${slug}/product/${product.slug}`}
      className="group block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl">
        <TaanaImg src={product.image} alt={product.name} wrapperClassName="w-full h-full" priority={priority}
          imgClassName="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
        {product.tags.includes('new') && (
          <span className="absolute top-3 left-3 text-[10px] tracking-[0.1em] uppercase px-2.5 py-1 rounded-full font-medium" style={{ background: 'var(--ta-bg)', color: 'var(--ta-ink)' }}>New</span>
        )}
        {product.tags.includes('sale') && (
          <span className="absolute top-3 left-3 text-[10px] tracking-[0.1em] uppercase px-2.5 py-1 rounded-full font-medium" style={{ background: 'var(--ta-rust)', color: '#fff' }}>Sale</span>
        )}
        <button
          onClick={quickAdd}
          className="absolute bottom-0 left-0 right-0 py-3 text-[12px] tracking-[0.1em] uppercase text-center font-medium transition-all duration-300"
          style={{
            background: 'var(--ta-glass)',
            backdropFilter: 'blur(12px)',
            color: 'var(--ta-ink)',
            transform: hovered ? 'translateY(0)' : 'translateY(100%)',
            opacity: hovered ? 1 : 0,
          }}
        >
          Quick Add
        </button>
      </div>
      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <p className="text-sm" style={{ color: 'var(--ta-ink)' }}>{product.name}</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--ta-ink-dim)' }}>{product.colors[0]}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-sm" style={{ color: product.originalPrice ? 'var(--ta-rust)' : 'var(--ta-ink)' }}>{formatINR(product.price)}</p>
          {product.originalPrice && (
            <p className="text-xs line-through" style={{ color: 'var(--ta-ink-dim)' }}>{formatINR(product.originalPrice)}</p>
          )}
        </div>
      </div>
    </Link>
  )
}

export function TaanaShopGrid({ brand, products, initialCategory }: { brand: ThemeBrand; products: ThemeProduct[]; initialCategory?: string | null }) {
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
        <h1 className="italic text-4xl md:text-5xl mb-2" style={{ fontFamily: 'var(--ta-display)' }}>{category ?? 'The Collection'}</h1>
        <p className="text-sm mb-8" style={{ color: 'var(--ta-ink-muted)' }}>{filtered.length} pieces</p>
      </Reveal>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 sticky top-16 md:top-20 z-30 py-3 -mx-6 px-6 md:-mx-10 md:px-10 border-b" style={{ background: 'var(--ta-glass)', backdropFilter: 'blur(16px)', borderColor: 'var(--ta-line)' }}>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setCategory(null)}
            className="text-xs tracking-wide uppercase px-3.5 py-1.5 rounded-full border transition-opacity hover:opacity-80"
            style={category === null ? { background: 'var(--ta-ink)', color: 'var(--ta-bg)', borderColor: 'var(--ta-ink)' } : { borderColor: 'var(--ta-line)', color: 'var(--ta-ink-muted)' }}
          >
            All
          </button>
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className="text-xs tracking-wide uppercase px-3.5 py-1.5 rounded-full border transition-opacity hover:opacity-80"
              style={category === c ? { background: 'var(--ta-ink)', color: 'var(--ta-bg)', borderColor: 'var(--ta-ink)' } : { borderColor: 'var(--ta-line)', color: 'var(--ta-ink-muted)' }}
            >
              {c}
            </button>
          ))}
        </div>
        <select
          value={sort}
          onChange={e => setSort(e.target.value as SortKey)}
          className="text-xs tracking-wide uppercase bg-transparent border rounded-full px-3.5 py-1.5 outline-none"
          style={{ borderColor: 'var(--ta-line)', color: 'var(--ta-ink-muted)' }}
        >
          <option value="featured">Featured</option>
          <option value="new">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-8">
        {filtered.map((p, i) => (
          <Reveal key={p.id} delay={Math.min(i, 8) * 0.04}>
            <TaanaProductCard product={p} slug={slug} priority={i < 4} />
          </Reveal>
        ))}
      </div>
    </div>
  )
}
