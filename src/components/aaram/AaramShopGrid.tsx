'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'
import { useFlagshipCart } from '@/lib/flagship/cart-context'
import { Reveal } from '@/components/flagship/Reveal'

// Shared image wrapper for the whole theme — a colored div (from the AARAM
// palette) always sits behind the <img>, and onError unmounts the <img>
// entirely rather than leaving a broken-image icon on screen. This is how
// every image in every AARAM file is rendered, so if OpenAI generation
// fails or runs out of credits, the storefront still shows clean color
// blocks instead of broken icons.
export function AaramImg({ src, alt, className, bg = 'var(--ar-card)', priority = false }: { src: string; alt: string; className?: string; bg?: string; priority?: boolean }) {
  const [errored, setErrored] = useState(false)
  return (
    <div className={className} style={{ background: bg, position: 'relative', overflow: 'hidden' }}>
      {!errored && (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          onError={() => setErrored(true)}
          className="w-full h-full object-cover"
          style={{ position: 'absolute', inset: 0 }}
        />
      )}
    </div>
  )
}

// Shared product card — used by Home, ShopGrid, and PDP's "related" rail.
export function AaramProductCard({ product, slug, priority = false }: { product: ThemeProduct; slug: string; priority?: boolean }) {
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
        <AaramImg src={product.image} alt={product.name} priority={priority} className="w-full h-full transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
        {product.tags.includes('new') && (
          <span className="absolute top-3 left-3 text-[10px] tracking-[0.1em] uppercase px-2 py-1 rounded-full font-semibold" style={{ background: 'var(--ar-sage)', color: '#FFFFFF' }}>New</span>
        )}
        {product.tags.includes('sale') && (
          <span className="absolute top-3 left-3 text-[10px] tracking-[0.1em] uppercase px-2 py-1 rounded-full font-semibold" style={{ background: 'var(--ar-ink)', color: 'var(--ar-bg)' }}>Sale</span>
        )}
        <button
          onClick={quickAdd}
          className="absolute bottom-0 left-0 right-0 py-3 text-[12px] tracking-[0.1em] uppercase text-center font-semibold transition-all duration-300"
          style={{
            background: 'var(--ar-accent)',
            color: 'var(--ar-accent-ink)',
            transform: hovered ? 'translateY(0)' : 'translateY(100%)',
            opacity: hovered ? 1 : 0,
          }}
        >
          Quick Add
        </button>
      </div>
      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <p className="text-sm" style={{ color: 'var(--ar-ink)' }}>{product.name}</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--ar-ink-dim)' }}>{product.colors[0]}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-sm font-medium" style={{ color: product.originalPrice ? 'var(--ar-accent)' : 'var(--ar-ink)' }}>₹{product.price.toLocaleString('en-IN')}</p>
          {product.originalPrice && (
            <p className="text-xs line-through" style={{ color: 'var(--ar-ink-dim)' }}>₹{product.originalPrice.toLocaleString('en-IN')}</p>
          )}
        </div>
      </div>
    </Link>
  )
}

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'new'

function sortProducts(products: ThemeProduct[], sort: SortKey): ThemeProduct[] {
  const copy = [...products]
  if (sort === 'price-asc') return copy.sort((a, b) => a.price - b.price)
  if (sort === 'price-desc') return copy.sort((a, b) => b.price - a.price)
  if (sort === 'new') return copy.sort((a, b) => Number(b.tags.includes('new')) - Number(a.tags.includes('new')))
  return copy
}

export function AaramShopGrid({ brand, products, initialCategory }: { brand: ThemeBrand; products: ThemeProduct[]; initialCategory?: string | null }) {
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
        <h1 className="aaram-display text-3xl md:text-4xl mb-2">{category ?? 'Everything Comfortable'}</h1>
        <p className="text-sm mb-8" style={{ color: 'var(--ar-ink-muted)' }}>{filtered.length} pieces</p>
      </Reveal>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 sticky top-16 md:top-20 z-30 py-3 aaram-glass -mx-6 px-6 md:-mx-10 md:px-10 border-b" style={{ borderColor: 'var(--ar-line)' }}>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setCategory(null)}
            className="text-xs tracking-wide uppercase px-3.5 py-1.5 rounded-full border transition-opacity hover:opacity-80"
            style={category === null ? { background: 'var(--ar-ink)', color: 'var(--ar-bg)', borderColor: 'var(--ar-ink)' } : { borderColor: 'var(--ar-line)', color: 'var(--ar-ink-muted)' }}
          >
            All
          </button>
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className="text-xs tracking-wide uppercase px-3.5 py-1.5 rounded-full border transition-opacity hover:opacity-80"
              style={category === c ? { background: 'var(--ar-ink)', color: 'var(--ar-bg)', borderColor: 'var(--ar-ink)' } : { borderColor: 'var(--ar-line)', color: 'var(--ar-ink-muted)' }}
            >
              {c}
            </button>
          ))}
        </div>
        <select
          value={sort}
          onChange={e => setSort(e.target.value as SortKey)}
          className="text-xs tracking-wide uppercase bg-transparent border rounded-full px-3.5 py-1.5 outline-none"
          style={{ borderColor: 'var(--ar-line)', color: 'var(--ar-ink-muted)' }}
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
            <AaramProductCard product={p} slug={slug} priority={i < 4} />
          </Reveal>
        ))}
      </div>
    </div>
  )
}
