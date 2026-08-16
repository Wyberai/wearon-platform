'use client'

import { useEffect, useState } from 'react'
import { recordProductView } from '@/lib/flagship/use-recently-viewed'
import { useFlagshipCart } from '@/lib/flagship/cart-context'
import { productToJsonLd } from '@/lib/schema-org'
import { getPriceHistory } from '@/lib/dhamaka/catalog'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'
import { DhamakaProductCard } from './DhamakaShopGrid'
import { DhamakaPriceRadarPanel } from './DhamakaPriceRadar'
import { Reveal } from '@/components/flagship/Reveal'

export function DhamakaPDP({ brand, product, related = [] }: { brand: ThemeBrand; product: ThemeProduct; related?: ThemeProduct[] }) {
  const slug = brand.slug
  const { addLine, openCart } = useFlagshipCart()
  const [size, setSize] = useState(product.sizes[0] ?? '')
  const [color, setColor] = useState(product.colors[0] ?? '')
  const [openPanel, setOpenPanel] = useState<'detail' | 'fit' | null>('detail')
  const [added, setAdded] = useState(false)
  const [imgOk, setImgOk] = useState(true)

  const discountPct = product.originalPrice && product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null

  useEffect(() => {
    recordProductView('dhamaka_viewed_v1', product.id)
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
    { brandName: brand.name, currency: brand.currency, baseUrl: process.env.NEXT_PUBLIC_APP_URL ?? 'https://wearon.in', storeSlug: slug }
  )

  return (
    <div className="max-w-[1440px] mx-auto px-6 md:px-10 pt-8 pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
        <div className="relative aspect-[4/5] md:aspect-auto md:h-[calc(100vh-8rem)] md:sticky md:top-24 overflow-hidden rounded" style={{ background: 'var(--dh-card)' }}>
          {imgOk && (
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" onError={() => setImgOk(false)} />
          )}
          {discountPct !== null && (
            <div
              className="absolute top-4 left-4 w-16 h-16 rounded-full flex items-center justify-center text-sm font-black text-center leading-tight"
              style={{ background: 'var(--dh-red)', color: 'var(--dh-red-ink)', transform: 'rotate(-10deg)' }}
            >
              -{discountPct}%
            </div>
          )}
        </div>

        <div className="pt-2">
          <p className="text-[11px] tracking-[0.2em] uppercase mb-2 font-bold" style={{ color: 'var(--dh-red)' }}>{product.category}</p>
          <h1 className="dhamaka-display text-3xl md:text-5xl leading-tight mb-3" style={{ color: 'var(--dh-yellow)' }}>{product.name}</h1>
          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-2xl font-black" style={{ color: 'var(--dh-ink)' }}>₹{product.price.toLocaleString('en-IN')}</span>
            {product.originalPrice && <span className="text-base line-through" style={{ color: 'var(--dh-ink-dim)' }}>₹{product.originalPrice.toLocaleString('en-IN')}</span>}
            {discountPct !== null && (
              <span className="text-sm font-bold px-2 py-0.5 rounded" style={{ background: 'var(--dh-red)', color: 'var(--dh-red-ink)' }}>{discountPct}% OFF</span>
            )}
          </div>
          <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--dh-ink-muted)' }}>{product.description}</p>

          <div className="mb-6">
            <DhamakaPriceRadarPanel history={getPriceHistory(product)} currentPrice={product.price} seedKey={product.id} />
          </div>

          {product.colors.length > 0 && (
            <div className="mb-6">
              <p className="text-xs tracking-wide uppercase mb-2.5 font-bold" style={{ color: 'var(--dh-ink-dim)' }}>Colour — {color}</p>
              <div className="flex gap-2">
                {product.colors.map(c => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className="text-xs px-3.5 py-2 rounded border font-semibold transition-opacity hover:opacity-80"
                    style={color === c ? { background: 'var(--dh-red)', color: 'var(--dh-red-ink)', borderColor: 'var(--dh-red)' } : { borderColor: 'var(--dh-line)' }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.sizes.length > 0 && (
            <div className="mb-8">
              <p className="text-xs tracking-wide uppercase mb-2.5 font-bold" style={{ color: 'var(--dh-ink-dim)' }}>Size</p>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map(s => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className="text-xs min-w-11 h-11 px-3 rounded border font-semibold flex items-center justify-center transition-opacity hover:opacity-80"
                    style={size === s ? { background: 'var(--dh-red)', color: 'var(--dh-red-ink)', borderColor: 'var(--dh-red)' } : { borderColor: 'var(--dh-line)' }}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {product.fit && <p className="text-xs mt-2.5" style={{ color: 'var(--dh-ink-dim)' }}>{product.fit}</p>}
            </div>
          )}

          <button
            onClick={handleAdd}
            className="w-full py-4 rounded text-sm tracking-wide font-black uppercase transition-opacity hover:opacity-90 mb-3"
            style={{ background: 'var(--dh-yellow)', color: 'var(--dh-yellow-ink)' }}
          >
            {added ? 'Added to Bag ✓' : 'Add to Bag'}
          </button>
          <p className="text-[11px] text-center mb-8 font-medium" style={{ color: 'var(--dh-ink-dim)' }}>Free shipping over ₹499 · Ships in 2–4 business days</p>

          {(product.detail || product.fabric || product.fit) && (
            <div className="border-t" style={{ borderColor: 'var(--dh-line)' }}>
              {(['detail', 'fit'] as const).map(panel => (
                <div key={panel} className="border-b" style={{ borderColor: 'var(--dh-line)' }}>
                  <button
                    onClick={() => setOpenPanel(openPanel === panel ? null : panel)}
                    className="w-full flex items-center justify-between py-4 text-sm tracking-wide font-semibold"
                  >
                    <span>{panel === 'detail' ? 'Details & Fabric' : 'Fit & Care'}</span>
                    <span>{openPanel === panel ? '−' : '+'}</span>
                  </button>
                  {openPanel === panel && (
                    <div className="pb-4 text-sm leading-relaxed" style={{ color: 'var(--dh-ink-muted)' }}>
                      {panel === 'detail' ? (
                        <>
                          {product.detail && <p className="mb-2">{product.detail}</p>}
                          {product.fabric && <p>{product.fabric}</p>}
                        </>
                      ) : (
                        <p>{product.fit ?? 'Care instructions available at checkout.'}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <Reveal>
            <h2 className="dhamaka-display text-3xl md:text-4xl mb-8" style={{ color: 'var(--dh-yellow)' }}>More From the Blast</h2>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
            {related.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.06}>
                <DhamakaProductCard product={p} slug={slug} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
