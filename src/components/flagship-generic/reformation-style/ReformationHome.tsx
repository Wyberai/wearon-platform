'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'
import { useFlagshipCart } from '@/lib/flagship/cart-context'

// A direct structural recreation of thereformation.com's real homepage —
// not the "hero photo + uniform 4-col grid" every other Generic* home uses.
// Reformation's actual pattern, observed live:
//   1. Giant display wordmark overlapping/bleeding over the hero photo
//      (not centered text on top of it) with a small caption bottom-left.
//   2. A compact category rail (4 tiles, small captions) directly below.
//   3. A sequence of small editorial "modules" — a short two-line headline
//      paired with a *horizontal* rail of ~4 products and a "show more"
//      link — repeated per curated cut, instead of one big grid.
function ProductRail({ products, slug }: { products: ThemeProduct[]; slug: string }) {
  const { addLine } = useFlagshipCart()
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {products.map(p => (
        <Link key={p.id} href={`/store/${slug}/product/${p.slug}`} className="group block">
          <div className="relative aspect-[3/4] overflow-hidden" style={{ background: 'var(--fg-card)' }}>
            <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
            <button
              onClick={e => { e.preventDefault(); e.stopPropagation(); addLine(p, p.sizes[0] ?? '', p.colors[0] ?? '', 1) }}
              className="absolute bottom-2 left-2 right-2 py-2 text-[10px] tracking-[0.1em] uppercase text-center opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: 'var(--fg-bg)', color: 'var(--fg-ink)' }}
            >
              quick add
            </button>
          </div>
          <p className="mt-2.5 text-[13px]" style={{ color: 'var(--fg-ink)' }}>{p.name}</p>
          <p className="text-[13px]" style={{ color: 'var(--fg-ink-dim)' }}>
            {p.originalPrice && <span className="line-through mr-1.5">${p.originalPrice.toLocaleString('en-IN')}</span>}
            ${p.price.toLocaleString('en-IN')}
          </p>
        </Link>
      ))}
    </div>
  )
}

function Module({ eyebrow, headline, products, slug, shopHref }: { eyebrow: string; headline: string; products: ThemeProduct[]; slug: string; shopHref: string }) {
  return (
    <section className="px-6 md:px-10 py-14 border-t" style={{ borderColor: 'var(--fg-line)' }}>
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-[11px] tracking-[0.15em] uppercase mb-1.5" style={{ color: 'var(--fg-ink-dim)' }}>{eyebrow}</p>
          <h2 className="text-2xl md:text-3xl" style={{ fontWeight: 500, fontStyle: 'italic' }}>{headline}</h2>
        </div>
        <Link href={shopHref} className="text-[12px] tracking-wide underline underline-offset-4 hover:opacity-60 transition-opacity flex-shrink-0" style={{ color: 'var(--fg-ink)' }}>
          show more
        </Link>
      </div>
      <ProductRail products={products} slug={slug} />
    </section>
  )
}

export function ReformationHome({ brand, products, mechanicLabel, onOpenMechanic }: { brand: ThemeBrand; products: ThemeProduct[]; mechanicLabel: string; onOpenMechanic: () => void }) {
  const slug = brand.slug
  const categories = useMemo(() => brand.categories.length ? brand.categories : Array.from(new Set(products.map(p => p.category))), [brand.categories, products])
  const heroImage = products[0]?.image
  // Each rail needs 4 real items — a tag match of 1-2 products would render
  // a half-empty module, so pad from the wider catalog (excluding whatever's
  // already shown) rather than trusting the tag alone.
  function padTo4(preferred: ThemeProduct[], exclude: ThemeProduct[] = []) {
    const excludeIds = new Set(exclude.map(p => p.id))
    if (preferred.length >= 4) return preferred.slice(0, 4)
    const fillers = products.filter(p => !excludeIds.has(p.id) && !preferred.some(pp => pp.id === p.id))
    return [...preferred, ...fillers].slice(0, 4)
  }
  const bestsellers = products.filter(p => p.tags.includes('bestseller'))
  const curatedCut = padTo4(bestsellers)
  const saleCut = products.filter(p => p.tags.includes('sale') || p.originalPrice)
  const newCut = products.filter(p => p.tags.includes('new'))
  const secondPreferred = saleCut.length ? saleCut : newCut
  const secondCut = padTo4(secondPreferred, curatedCut)

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'ClothingStore', name: brand.name, description: brand.description }) }} />

      {/* Hero — oversized wordmark bleeding over the photo, not centered text on it */}
      <div className="relative">
        <div className="relative h-[78vh] min-h-[520px] overflow-hidden">
          {heroImage && <img src={heroImage} alt="" className="w-full h-full object-cover" />}
        </div>
        <h1
          className="absolute top-3 left-4 md:left-8 leading-[0.82] pointer-events-none select-none"
          style={{ fontSize: 'clamp(48px, 11vw, 148px)', fontWeight: 800, color: 'var(--fg-bg)', mixBlendMode: 'difference' }}
        >
          {brand.name}
        </h1>
        <div className="absolute bottom-6 left-4 md:left-8">
          <p className="text-lg md:text-xl mb-1" style={{ color: '#fff', fontStyle: 'italic', textShadow: '0 1px 8px rgba(0,0,0,0.4)' }}>{brand.tagline}</p>
          <Link href={`/store/${slug}/shop`} className="text-sm underline underline-offset-4" style={{ color: '#fff', textShadow: '0 1px 8px rgba(0,0,0,0.4)' }}>
            shop
          </Link>
        </div>
      </div>

      {/* Category rail — compact tiles, small captions, unlike the big square
          category grid every other Generic* home uses */}
      {categories.length > 0 && (
        <section className="px-6 md:px-10 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {categories.slice(0, 4).map(c => {
              const img = products.find(p => p.category === c)?.image ?? products[0]?.image
              return (
                <Link key={c} href={`/store/${slug}/shop?category=${encodeURIComponent(c)}`} className="group block">
                  <div className="relative aspect-[4/5] overflow-hidden mb-2" style={{ background: 'var(--fg-card)' }}>
                    {img && <img src={img} alt={c} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />}
                  </div>
                  <p className="text-[12px] tracking-wide" style={{ color: 'var(--fg-ink)' }}>{c.toLowerCase()}</p>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      <Module eyebrow="new this week" headline="For nowhere casual" products={curatedCut} slug={slug} shopHref={`/store/${slug}/shop`} />
      <Module eyebrow="limited stock" headline={secondPreferred === saleCut ? 'Sale ends soon' : 'Just landed'} products={secondCut} slug={slug} shopHref={`/store/${slug}/shop`} />

      <section className="px-6 md:px-10 py-16 border-t text-center" style={{ borderColor: 'var(--fg-line)' }}>
        <p className="text-[11px] tracking-[0.2em] uppercase mb-3" style={{ color: 'var(--fg-ink-dim)' }}>Not sure where to start?</p>
        <h2 className="text-2xl md:text-3xl mb-5" style={{ fontWeight: 500, fontStyle: 'italic' }}>{mechanicLabel}</h2>
        <button onClick={onOpenMechanic} className="px-6 py-3 text-[12px] tracking-[0.1em] uppercase" style={{ background: 'var(--fg-ink)', color: 'var(--fg-bg)' }}>
          {mechanicLabel}
        </button>
      </section>
    </div>
  )
}
