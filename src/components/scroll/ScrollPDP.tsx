'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { recordProductView } from '@/lib/flagship/use-recently-viewed'
import { useFlagshipCart } from '@/lib/flagship/cart-context'
import { productToJsonLd } from '@/lib/schema-org'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'
import { ScrollDMSheet } from './ScrollDMSheet'

export function ScrollPDP({ brand, product, related = [] }: { brand: ThemeBrand; product: ThemeProduct; related?: ThemeProduct[] }) {
  const slug = brand.slug
  const { addLine, openCart } = useFlagshipCart()
  const [size, setSize] = useState(product.sizes[0] ?? '')
  const [color, setColor] = useState(product.colors[0] ?? '')
  const [added, setAdded] = useState(false)
  const [dmOpen, setDmOpen] = useState(false)

  useEffect(() => {
    recordProductView('scroll_viewed_v1', product.id)
  }, [product.id])

  function handleAdd() {
    addLine(product, size, color, 1)
    setAdded(true)
    setTimeout(() => openCart(), 400)
  }

  const jsonLd = productToJsonLd(
    {
      id: product.id,
      name: product.name,
      description: product.description,
      category: product.category,
      price_inr: product.price,
      original_price_inr: product.originalPrice ?? null,
      garment_image_url: product.image,
      slug: product.slug,
      sizes: product.sizes,
      colors: product.colors,
      tags: product.tags,
    },
    { brandName: brand.name, currency: brand.currency, baseUrl: process.env.NEXT_PUBLIC_APP_URL ?? 'https://instastarz.in', storeSlug: slug }
  )

  return (
    <div className="max-w-[600px] mx-auto pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="relative w-full aspect-square" style={{ background: 'var(--sc-card)' }}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={e => { e.currentTarget.style.display = 'none' }}
        />
        <Link
          href={`/store/${slug}/shop`}
          aria-label="Back to shop"
          className="absolute top-3 left-3 w-9 h-9 rounded-full flex items-center justify-center scroll-glass"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--sc-ink)" strokeWidth="2" aria-hidden><path d="M15 18l-6-6 6-6"/></svg>
        </Link>
        {product.originalPrice && (
          <span className="absolute top-3 right-3 text-[10px] tracking-wide uppercase px-2.5 py-1 rounded-full font-bold scroll-gradient" style={{ color: 'var(--sc-accent-ink)' }}>Sale</span>
        )}
      </div>

      <div className="px-4 pt-5">
        <p className="text-[11px] tracking-[0.14em] uppercase mb-1.5" style={{ color: 'var(--sc-ink-dim)' }}>{product.category}</p>
        <h1 className="scroll-display text-2xl font-extrabold leading-tight mb-2.5">{product.name}</h1>
        <div className="flex items-baseline gap-2.5 mb-5">
          <span className="text-lg font-bold" style={{ color: product.originalPrice ? 'var(--sc-accent)' : 'var(--sc-ink)' }}>₹{product.price.toLocaleString('en-IN')}</span>
          {product.originalPrice && <span className="text-sm line-through" style={{ color: 'var(--sc-ink-dim)' }}>₹{product.originalPrice.toLocaleString('en-IN')}</span>}
        </div>
        <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--sc-ink-muted)' }}>{product.description}</p>

        {product.colors.length > 0 && (
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--sc-ink-dim)' }}>Colour — {color}</p>
            <div className="flex gap-2 flex-wrap">
              {product.colors.map(c => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className="text-xs font-semibold px-3.5 py-2 rounded-full border transition-opacity hover:opacity-80"
                  style={color === c ? { background: 'var(--sc-ink)', color: 'var(--sc-bg)', borderColor: 'var(--sc-ink)' } : { borderColor: 'var(--sc-line)' }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {product.sizes.length > 0 && (
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--sc-ink-dim)' }}>Size</p>
            <div className="flex gap-2 flex-wrap">
              {product.sizes.map(s => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className="text-xs font-semibold min-w-11 h-11 px-3 rounded-full border flex items-center justify-center transition-opacity hover:opacity-80"
                  style={size === s ? { background: 'var(--sc-ink)', color: 'var(--sc-bg)', borderColor: 'var(--sc-ink)' } : { borderColor: 'var(--sc-line)' }}
                >
                  {s}
                </button>
              ))}
            </div>
            {product.fit && <p className="text-xs mt-2.5" style={{ color: 'var(--sc-ink-dim)' }}>{product.fit}</p>}
          </div>
        )}

        <div className="flex items-center gap-2.5 mb-3">
          <button
            onClick={handleAdd}
            className="flex-1 py-3.5 rounded-full text-sm font-bold scroll-gradient transition-opacity hover:opacity-90"
            style={{ color: 'var(--sc-accent-ink)' }}
          >
            {added ? 'Added to bag ✓' : 'Add to Bag'}
          </button>
          <button
            onClick={() => setDmOpen(true)}
            aria-label="DM to order"
            className="w-12 h-12 rounded-full flex items-center justify-center border flex-shrink-0"
            style={{ borderColor: 'var(--sc-line)', color: 'var(--sc-ink)' }}
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
              <path d="M21 11.5a8.5 8.5 0 01-8.5 8.5 8.4 8.4 0 01-3.9-.95L3 20l1.05-3.5A8.4 8.4 0 013 11.5 8.5 8.5 0 0111.5 3a8.5 8.5 0 019.5 8.5z"/>
            </svg>
          </button>
        </div>
        <p className="text-[11px] text-center mb-8" style={{ color: 'var(--sc-ink-dim)' }}>Free shipping · Ships in 2–4 business days</p>

        {(product.detail || product.fabric || product.fit) && (
          <div className="border-t pt-4 mb-2" style={{ borderColor: 'var(--sc-line)' }}>
            <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--sc-ink-dim)' }}>Details &amp; Fabric</p>
            <div className="text-sm leading-relaxed" style={{ color: 'var(--sc-ink-muted)' }}>
              {product.detail && <p className="mb-1.5">{product.detail}</p>}
              {product.fabric && <p>{product.fabric}</p>}
            </div>
          </div>
        )}
      </div>

      {related.length > 0 && (
        <section className="mt-8 px-4">
          <h2 className="scroll-display text-lg font-extrabold mb-3">More from the feed</h2>
          <div className="grid grid-cols-3 gap-[2px]">
            {related.map(p => (
              <Link key={p.id} href={`/store/${slug}/product/${p.slug}`} className="group relative aspect-square block overflow-hidden" style={{ background: 'var(--sc-card)' }}>
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  onError={e => { e.currentTarget.style.display = 'none' }}
                />
              </Link>
            ))}
          </div>
        </section>
      )}

      {dmOpen && (
        <ScrollDMSheet brandName={brand.name} product={product} onClose={() => setDmOpen(false)} />
      )}
    </div>
  )
}
