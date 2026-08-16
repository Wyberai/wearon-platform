'use client'

import { useEffect, useState } from 'react'
import { recordProductView } from '@/lib/flagship/use-recently-viewed'
import { useFlagshipCart } from '@/lib/flagship/cart-context'
import { productToJsonLd } from '@/lib/schema-org'
import { formatINR } from '@/lib/taana/catalog'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'
import { TaanaProductCard } from './TaanaShopGrid'
import { TaanaImg } from './TaanaShell'
import { TaanaWeaversNote } from './TaanaWeaversNote'
import { Reveal } from '@/components/flagship/Reveal'

// technique/region are additive fields the TAANA demo catalog sets on top
// of ThemeProduct (see src/lib/taana/catalog.ts) — optional here so a real
// seller's own product (converted via flagship/adapters.ts, which never
// sets them) still satisfies this same prop type. The Weaver's Note simply
// falls back to a generic craft story in that case.
type TaanaProduct = ThemeProduct & { technique?: string; region?: string }

export function TaanaPDP({ brand, product, related = [] }: { brand: ThemeBrand; product: TaanaProduct; related?: ThemeProduct[] }) {
  const slug = brand.slug
  const { addLine, openCart } = useFlagshipCart()
  const [size, setSize] = useState(product.sizes[0] ?? '')
  const [color, setColor] = useState(product.colors[0] ?? '')
  const [openPanel, setOpenPanel] = useState<'detail' | 'fit' | null>('detail')
  const [added, setAdded] = useState(false)

  useEffect(() => {
    recordProductView('taana_viewed_v1', product.id)
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
        <TaanaImg
          src={product.image} alt={product.name} bg="var(--ta-card)"
          wrapperClassName="relative aspect-[4/5] md:aspect-auto md:h-[calc(100vh-8rem)] md:sticky md:top-24 overflow-hidden rounded-xl"
        />

        <div className="pt-2">
          <p className="text-[11px] tracking-[0.2em] uppercase mb-2" style={{ color: 'var(--ta-ink-dim)' }}>{product.category}</p>
          <h1 className="italic text-4xl md:text-5xl leading-tight mb-3" style={{ fontFamily: 'var(--ta-display)' }}>{product.name}</h1>
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-lg" style={{ color: product.originalPrice ? 'var(--ta-rust)' : 'var(--ta-ink)' }}>{formatINR(product.price)}</span>
            {product.originalPrice && <span className="text-sm line-through" style={{ color: 'var(--ta-ink-dim)' }}>{formatINR(product.originalPrice)}</span>}
          </div>
          <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--ta-ink-muted)' }}>{product.description}</p>

          {product.colors.length > 0 && (
            <div className="mb-6">
              <p className="text-xs tracking-wide uppercase mb-2.5" style={{ color: 'var(--ta-ink-dim)' }}>Colourway — {color}</p>
              <div className="flex gap-2">
                {product.colors.map(c => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className="text-xs px-3.5 py-2 rounded-full border transition-opacity hover:opacity-80"
                    style={color === c ? { background: 'var(--ta-ink)', color: 'var(--ta-bg)', borderColor: 'var(--ta-ink)' } : { borderColor: 'var(--ta-line)' }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.sizes.length > 0 && (
            <div className="mb-8">
              <p className="text-xs tracking-wide uppercase mb-2.5" style={{ color: 'var(--ta-ink-dim)' }}>Size</p>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map(s => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className="text-xs min-w-11 h-11 px-3 rounded-full border flex items-center justify-center transition-opacity hover:opacity-80"
                    style={size === s ? { background: 'var(--ta-ink)', color: 'var(--ta-bg)', borderColor: 'var(--ta-ink)' } : { borderColor: 'var(--ta-line)' }}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {product.fit && <p className="text-xs mt-2.5" style={{ color: 'var(--ta-ink-dim)' }}>{product.fit}</p>}
            </div>
          )}
          {product.sizes.length === 0 && product.fit && (
            <p className="text-xs mb-8" style={{ color: 'var(--ta-ink-dim)' }}>{product.fit}</p>
          )}

          <button
            onClick={handleAdd}
            className="w-full py-4 rounded-full text-sm tracking-wide font-medium transition-opacity hover:opacity-90 mb-3"
            style={{ background: 'var(--ta-accent)', color: 'var(--ta-accent-ink)' }}
          >
            {added ? 'Added to bag ✓' : 'Add to Bag'}
          </button>
          <p className="text-[11px] text-center mb-8" style={{ color: 'var(--ta-ink-dim)' }}>Free shipping across India &middot; Ships in 3–5 business days</p>

          <div className="mb-8">
            <TaanaWeaversNote product={{ name: product.name, category: product.category, technique: product.technique, region: product.region, fabric: product.fabric }} />
          </div>

          {(product.detail || product.fabric || product.fit) && (
            <div className="border-t" style={{ borderColor: 'var(--ta-line)' }}>
              {(['detail', 'fit'] as const).map(panel => (
                <div key={panel} className="border-b" style={{ borderColor: 'var(--ta-line)' }}>
                  <button
                    onClick={() => setOpenPanel(openPanel === panel ? null : panel)}
                    className="w-full flex items-center justify-between py-4 text-sm tracking-wide"
                  >
                    <span>{panel === 'detail' ? 'Weave & Fabric' : 'Fit & Care'}</span>
                    <span>{openPanel === panel ? '−' : '+'}</span>
                  </button>
                  {openPanel === panel && (
                    <div className="pb-4 text-sm leading-relaxed" style={{ color: 'var(--ta-ink-muted)' }}>
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
            <h2 className="italic text-3xl md:text-4xl mb-8" style={{ fontFamily: 'var(--ta-display)' }}>More from the loom</h2>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
            {related.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.06}>
                <TaanaProductCard product={p} slug={slug} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
