'use client'

import { useEffect, useState } from 'react'
import { recordProductView } from '@/lib/flagship/use-recently-viewed'
import { useFlagshipCart } from '@/lib/flagship/cart-context'
import { productToJsonLd } from '@/lib/schema-org'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'
import { MelaImg, MelaProductCard } from './MelaShell'
import { MelaOfferBox } from './MelaOfferBox'
import { Reveal } from '@/components/flagship/Reveal'

export function MelaPDP({ brand, product, related = [] }: { brand: ThemeBrand; product: ThemeProduct; related?: ThemeProduct[] }) {
  const slug = brand.slug
  const { addLine, openCart } = useFlagshipCart()
  const [size, setSize] = useState(product.sizes[0] ?? '')
  const [color, setColor] = useState(product.colors[0] ?? '')
  const [openPanel, setOpenPanel] = useState<'detail' | 'fit' | null>('detail')
  const [added, setAdded] = useState(false)
  const [dealPrice, setDealPrice] = useState<number | null>(null)

  useEffect(() => {
    recordProductView('mela_viewed_v1', product.id)
  }, [product.id])

  function handleAdd(atPrice?: number) {
    addLine(product, size, color, 1)
    if (atPrice != null) setDealPrice(atPrice)
    setAdded(true)
    setTimeout(() => openCart(), 400)
  }

  const discountPct = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0

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
    <div className="max-w-[1440px] mx-auto px-5 md:px-10 pt-6 pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14">
        <div className="relative aspect-[4/5] md:aspect-auto md:h-[calc(100vh-8rem)] md:sticky md:top-28 overflow-hidden rounded-xl border-2" style={{ borderColor: 'var(--me-line)' }}>
          <MelaImg src={product.image} alt={product.name} className="w-full h-full" />
          {discountPct >= 10 && (
            <span className="absolute top-4 left-4 text-xs tracking-wide uppercase px-3 py-1.5 rounded-full font-extrabold" style={{ background: 'var(--me-pink)', color: '#fff' }}>
              {discountPct}% OFF
            </span>
          )}
        </div>

        <div className="pt-2">
          <p className="text-[11px] tracking-[0.2em] uppercase mb-2 font-bold" style={{ color: 'var(--me-turquoise)' }}>{product.category}</p>
          <h1 className="mela-display text-4xl md:text-5xl font-extrabold leading-tight mb-3">{product.name}</h1>
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-2xl font-extrabold" style={{ color: product.originalPrice ? 'var(--me-pink)' : 'var(--me-ink)' }}>&#8377;{product.price.toLocaleString('en-IN')}</span>
            {product.originalPrice && <span className="text-base line-through" style={{ color: 'var(--me-ink-dim)' }}>&#8377;{product.originalPrice.toLocaleString('en-IN')}</span>}
          </div>
          <p className="text-sm leading-relaxed mb-8 font-medium" style={{ color: 'var(--me-ink-muted)' }}>{product.description}</p>

          {product.colors.length > 0 && (
            <div className="mb-6">
              <p className="text-xs tracking-wide uppercase mb-2.5 font-bold" style={{ color: 'var(--me-ink-dim)' }}>Colour — {color}</p>
              <div className="flex gap-2 flex-wrap">
                {product.colors.map(c => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className="text-xs px-3.5 py-2 rounded-full border-2 font-semibold transition-opacity hover:opacity-80"
                    style={color === c ? { background: 'var(--me-ink)', color: 'var(--me-bg)', borderColor: 'var(--me-ink)' } : { borderColor: 'var(--me-line)' }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.sizes.length > 0 && (
            <div className="mb-8">
              <p className="text-xs tracking-wide uppercase mb-2.5 font-bold" style={{ color: 'var(--me-ink-dim)' }}>Size</p>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map(s => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className="text-xs min-w-11 h-11 px-3 rounded-full border-2 font-semibold flex items-center justify-center transition-opacity hover:opacity-80"
                    style={size === s ? { background: 'var(--me-ink)', color: 'var(--me-bg)', borderColor: 'var(--me-ink)' } : { borderColor: 'var(--me-line)' }}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {product.fit && <p className="text-xs mt-2.5 font-medium" style={{ color: 'var(--me-ink-dim)' }}>{product.fit}</p>}
            </div>
          )}

          <button
            onClick={() => handleAdd()}
            className="w-full py-4 rounded-full text-sm tracking-wide font-extrabold transition-transform hover:scale-[1.01] mb-3"
            style={{ background: 'var(--me-pink)', color: '#fff' }}
          >
            {added && dealPrice == null ? 'Added to Bag ✓' : `Add to Bag · ₹${product.price.toLocaleString('en-IN')}`}
          </button>
          <p className="text-[11px] text-center mb-8 font-medium" style={{ color: 'var(--me-ink-dim)' }}>COD available &middot; Ships in 3&ndash;6 business days</p>

          {/* Signature mechanic — see MelaOfferBox.tsx */}
          <div className="mb-8">
            <MelaOfferBox
              product={product}
              brandName={brand.name}
              onDealAccepted={(price) => handleAdd(price)}
            />
          </div>

          {(product.detail || product.fabric || product.fit) && (
            <div className="border-t" style={{ borderColor: 'var(--me-line)' }}>
              {(['detail', 'fit'] as const).map(panel => (
                <div key={panel} className="border-b" style={{ borderColor: 'var(--me-line)' }}>
                  <button
                    onClick={() => setOpenPanel(openPanel === panel ? null : panel)}
                    className="w-full flex items-center justify-between py-4 text-sm tracking-wide font-semibold"
                  >
                    <span>{panel === 'detail' ? 'Details & Fabric' : 'Fit & Care'}</span>
                    <span>{openPanel === panel ? '−' : '+'}</span>
                  </button>
                  {openPanel === panel && (
                    <div className="pb-4 text-sm leading-relaxed font-medium" style={{ color: 'var(--me-ink-muted)' }}>
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
            <h2 className="mela-display text-3xl md:text-4xl font-extrabold mb-8">More From The Bazaar</h2>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {related.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.06}>
                <MelaProductCard product={p} slug={slug} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
