'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'
import { useFlagshipCart } from '@/lib/flagship/cart-context'
import { staticCaption } from '@/lib/galli/catalog'
import { Reveal } from '@/components/flagship/Reveal'

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'new'

function sortProducts(products: ThemeProduct[], sort: SortKey): ThemeProduct[] {
  const copy = [...products]
  if (sort === 'price-asc') return copy.sort((a, b) => a.price - b.price)
  if (sort === 'price-desc') return copy.sort((a, b) => b.price - a.price)
  if (sort === 'new') return copy.sort((a, b) => Number(b.tags.includes('new')) - Number(a.tags.includes('new')))
  return copy
}

// Shared product card — also used by GalliHome and GalliPDP (related rail).
// House rule 4 keeps new files to a fixed list, so this lives here rather
// than in its own GalliProductCard.tsx, same way GalliShell.tsx inlines its
// own header/footer/cart-drawer.
export function GalliProductCard({ product, slug, priority = false }: { product: ThemeProduct; slug: string; priority?: boolean }) {
  const { addLine } = useFlagshipCart()
  const [hovered, setHovered] = useState(false)
  const [imgOk, setImgOk] = useState(true)

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
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg" style={{ background: 'var(--g-card)' }}>
        {imgOk && (
          <img
            src={product.image}
            alt={product.name}
            loading={priority ? 'eager' : 'lazy'}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            onError={() => setImgOk(false)}
          />
        )}
        {product.tags.includes('new') && (
          <span className="absolute top-3 left-3 text-[10px] tracking-[0.1em] uppercase px-2.5 py-1 rounded-full font-bold" style={{ background: 'var(--g-accent)', color: 'var(--g-accent-ink)' }}>New</span>
        )}
        {product.tags.includes('sale') && (
          <span className="absolute top-3 left-3 text-[10px] tracking-[0.1em] uppercase px-2.5 py-1 rounded-full font-bold" style={{ background: 'var(--g-accent2)', color: '#0D0D0D' }}>Sale</span>
        )}
        <button
          onClick={quickAdd}
          className="absolute bottom-0 left-0 right-0 py-3 text-[12px] tracking-[0.1em] uppercase text-center font-semibold transition-all duration-300"
          style={{
            background: 'var(--g-glass)',
            backdropFilter: 'blur(12px)',
            color: 'var(--g-ink)',
            transform: hovered ? 'translateY(0)' : 'translateY(100%)',
            opacity: hovered ? 1 : 0,
          }}
        >
          Quick Add
        </button>
      </div>
      <div className="mt-3">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm" style={{ color: 'var(--g-ink)' }}>{product.name}</p>
          <div className="text-right flex-shrink-0">
            <p className="text-sm font-semibold" style={{ color: product.originalPrice ? 'var(--g-accent2)' : 'var(--g-ink)' }}>₹{product.price.toLocaleString('en-IN')}</p>
            {product.originalPrice && (
              <p className="text-xs line-through" style={{ color: 'var(--g-ink-dim)' }}>₹{product.originalPrice.toLocaleString('en-IN')}</p>
            )}
          </div>
        </div>
        <p className="text-xs mt-1 italic truncate" style={{ color: 'var(--g-ink-dim)' }}>&ldquo;{staticCaption(product)}&rdquo;</p>
      </div>
    </Link>
  )
}

export function GalliShopGrid({ brand, products, initialCategory }: { brand: ThemeBrand; products: ThemeProduct[]; initialCategory?: string | null }) {
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
        <h1 className="galli-display text-4xl md:text-5xl mb-2">{category ?? 'The Drop'}</h1>
        <p className="text-sm mb-8" style={{ color: 'var(--g-ink-muted)' }}>{filtered.length} pieces</p>
      </Reveal>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 sticky top-16 md:top-20 z-30 py-3 galli-glass -mx-6 px-6 md:-mx-10 md:px-10 border-b" style={{ borderColor: 'var(--g-line)' }}>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setCategory(null)}
            className="text-xs tracking-wide uppercase px-3.5 py-1.5 rounded-full border transition-opacity hover:opacity-80 font-semibold"
            style={category === null ? { background: 'var(--g-accent)', color: 'var(--g-accent-ink)', borderColor: 'var(--g-accent)' } : { borderColor: 'var(--g-line)', color: 'var(--g-ink-muted)' }}
          >
            All
          </button>
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className="text-xs tracking-wide uppercase px-3.5 py-1.5 rounded-full border transition-opacity hover:opacity-80 font-semibold"
              style={category === c ? { background: 'var(--g-accent)', color: 'var(--g-accent-ink)', borderColor: 'var(--g-accent)' } : { borderColor: 'var(--g-line)', color: 'var(--g-ink-muted)' }}
            >
              {c}
            </button>
          ))}
        </div>
        <select
          value={sort}
          onChange={e => setSort(e.target.value as SortKey)}
          className="text-xs tracking-wide uppercase bg-transparent border rounded-full px-3.5 py-1.5 outline-none"
          style={{ borderColor: 'var(--g-line)', color: 'var(--g-ink-muted)' }}
        >
          <option value="featured" style={{ color: '#0D0D0D' }}>Featured</option>
          <option value="new" style={{ color: '#0D0D0D' }}>Newest</option>
          <option value="price-asc" style={{ color: '#0D0D0D' }}>Price: Low to High</option>
          <option value="price-desc" style={{ color: '#0D0D0D' }}>Price: High to Low</option>
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-8">
        {filtered.map((p, i) => (
          <Reveal key={p.id} delay={Math.min(i, 8) * 0.04}>
            <GalliProductCard product={p} slug={slug} priority={i < 4} />
          </Reveal>
        ))}
      </div>
    </div>
  )
}
