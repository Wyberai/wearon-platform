'use client'

import { useEffect, useState } from 'react'
import { recordProductView } from '@/lib/flagship/use-recently-viewed'
import { useFlagshipCart } from '@/lib/flagship/cart-context'
import { productToJsonLd } from '@/lib/schema-org'
import { formatINR } from '@/lib/thegrid/catalog'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'
import { TheGridTile } from './TheGridTile'
import { TheGridImg } from './TheGridShell'
import { Reveal } from '@/components/flagship/Reveal'

// A single-post view — large square media + caption-style description,
// echoing an IG post detail rather than a conventional two-column PDP.
export function TheGridPDP({ brand, product, related = [] }: { brand: ThemeBrand; product: ThemeProduct; related?: ThemeProduct[] }) {
  const slug = brand.slug
  const { addLine, openCart } = useFlagshipCart()
  const [size, setSize] = useState(product.sizes[0] ?? '')
  const [color, setColor] = useState(product.colors[0] ?? '')
  const [added, setAdded] = useState(false)

  useEffect(() => { recordProductView('thegrid_viewed_v1', product.id) }, [product.id])

  function handleAdd() {
    addLine(product, size, color, 1)
    setAdded(true)
    setTimeout(() => openCart(), 400)
  }

  const pctOff = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : null

  const jsonLd = productToJsonLd(
    { id: product.id, name: product.name, description: product.description, category: product.category, price_inr: product.price, original_price_inr: product.originalPrice ?? null, garment_image_url: product.image, slug: product.slug, sizes: product.sizes, colors: product.colors, tags: product.tags },
    { brandName: brand.name, currency: brand.currency, baseUrl: process.env.NEXT_PUBLIC_APP_URL ?? 'https://wearon.in', storeSlug: slug }
  )

  return (
    <div className="max-w-[560px] mx-auto pt-6 pb-24 px-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="relative aspect-square overflow-hidden rounded-lg" style={{ background: 'var(--tg-card)' }}>
        <TheGridImg src={product.image} alt={product.name} wrapperClassName="absolute inset-0" priority />
        {product.video && <video src={product.video} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" />}
        {pctOff !== null && <span className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1.5 rounded-md" style={{ background: 'var(--tg-sale)', color: '#fff' }}>-{pctOff}%</span>}
      </div>

      <div className="mt-4">
        <p className="text-xs uppercase tracking-wide font-medium" style={{ color: 'var(--tg-ink-dim)' }}>{product.category}</p>
        <h1 className="text-xl font-bold mt-1" style={{ fontFamily: 'var(--tg-display)' }}>{product.name}</h1>
        <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--tg-ink-muted)' }}>{product.description}</p>
        <div className="flex items-baseline gap-3 mt-3">
          <span className="text-lg font-semibold" style={{ color: product.originalPrice ? 'var(--tg-sale)' : 'var(--tg-ink)' }}>{formatINR(product.price)}</span>
          {product.originalPrice && <span className="text-sm line-through" style={{ color: 'var(--tg-ink-dim)' }}>{formatINR(product.originalPrice)}</span>}
        </div>

        {product.colors.length > 0 && (
          <div className="mt-5">
            <p className="text-xs uppercase font-medium mb-2" style={{ color: 'var(--tg-ink-dim)' }}>Color — {color}</p>
            <div className="flex gap-2">
              {product.colors.map(c => (
                <button key={c} onClick={() => setColor(c)} className="text-xs px-3 py-1.5 rounded-full border" style={color === c ? { background: 'var(--tg-ink)', color: 'var(--tg-bg)', borderColor: 'var(--tg-ink)' } : { borderColor: 'var(--tg-line)' }}>{c}</button>
              ))}
            </div>
          </div>
        )}

        {product.sizes.length > 0 && (
          <div className="mt-5">
            <p className="text-xs uppercase font-medium mb-2" style={{ color: 'var(--tg-ink-dim)' }}>Size</p>
            <div className="flex gap-2 flex-wrap">
              {product.sizes.map(s => (
                <button key={s} onClick={() => setSize(s)} className="text-xs min-w-10 h-10 px-3 rounded-full border flex items-center justify-center" style={size === s ? { background: 'var(--tg-ink)', color: 'var(--tg-bg)', borderColor: 'var(--tg-ink)' } : { borderColor: 'var(--tg-line)' }}>{s}</button>
              ))}
            </div>
          </div>
        )}

        <button onClick={handleAdd} className="w-full py-3.5 rounded-full text-sm font-semibold mt-6" style={{ background: 'var(--tg-accent)', color: 'var(--tg-accent-ink)' }}>
          {added ? 'Added to Bag ✓' : 'Add to Bag'}
        </button>
        <p className="text-[11px] text-center mt-3" style={{ color: 'var(--tg-ink-dim)' }}>Free shipping across India &middot; Ships in 3–5 business days</p>
      </div>

      {related.length > 0 && (
        <section className="mt-12">
          <Reveal><p className="text-sm font-semibold mb-3" style={{ color: 'var(--tg-ink-muted)' }}>More from the grid</p></Reveal>
          <div className="grid grid-cols-3 gap-0.5">
            {related.map(p => <TheGridTile key={p.id} product={p} slug={slug} />)}
          </div>
        </section>
      )}
    </div>
  )
}
