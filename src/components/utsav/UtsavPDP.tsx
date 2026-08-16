'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { recordProductView } from '@/lib/flagship/use-recently-viewed'
import { useFlagshipCart } from '@/lib/flagship/cart-context'
import { productToJsonLd } from '@/lib/schema-org'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'
import { UtsavProductCard, UtsavImg } from './UtsavShell'
import { Reveal } from '@/components/flagship/Reveal'

function money(n: number) {
  return `₹${n.toLocaleString('en-IN')}`
}

export function UtsavPDP({ brand, product, related = [] }: { brand: ThemeBrand; product: ThemeProduct; related?: ThemeProduct[] }) {
  const slug = brand.slug
  const { addLine, openCart } = useFlagshipCart()
  const [size, setSize] = useState(product.sizes[0] ?? '')
  const [color, setColor] = useState(product.colors[0] ?? '')
  const [openPanel, setOpenPanel] = useState<'detail' | 'fit' | null>('detail')
  const [added, setAdded] = useState(false)

  useEffect(() => {
    recordProductView('utsav_viewed_v1', product.id)
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
    <div className="max-w-[1440px] mx-auto px-6 md:px-10 pt-8 pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
        <UtsavImg
          src={product.image}
          alt={product.name}
          className="relative aspect-[4/5] md:aspect-auto md:h-[calc(100vh-8rem)] md:sticky md:top-24 rounded-xl"
        />

        <div className="pt-2">
          <p className="text-[11px] tracking-[0.2em] uppercase mb-2" style={{ color: 'var(--ut-ink-dim)' }}>{product.category}</p>
          <h1 className="utsav-display text-4xl md:text-5xl leading-tight mb-3">{product.name}</h1>
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-lg" style={{ color: product.originalPrice ? 'var(--ut-accent)' : 'var(--ut-ink)' }}>{money(product.price)}</span>
            {product.originalPrice && <span className="text-sm line-through" style={{ color: 'var(--ut-ink-dim)' }}>{money(product.originalPrice)}</span>}
          </div>
          <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--ut-ink-muted)' }}>{product.description}</p>

          {product.colors.length > 0 && (
            <div className="mb-6">
              <p className="text-xs tracking-wide uppercase mb-2.5" style={{ color: 'var(--ut-ink-dim)' }}>Colour — {color}</p>
              <div className="flex gap-2">
                {product.colors.map(c => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className="text-xs px-3.5 py-2 rounded-full border transition-opacity hover:opacity-80"
                    style={color === c ? { background: 'var(--ut-ink)', color: 'var(--ut-bg)', borderColor: 'var(--ut-ink)' } : { borderColor: 'var(--ut-line)' }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.sizes.length > 0 && (
            <div className="mb-8">
              <p className="text-xs tracking-wide uppercase mb-2.5" style={{ color: 'var(--ut-ink-dim)' }}>Size</p>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map(s => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className="text-xs min-w-11 h-11 px-3 rounded-full border flex items-center justify-center transition-opacity hover:opacity-80"
                    style={size === s ? { background: 'var(--ut-ink)', color: 'var(--ut-bg)', borderColor: 'var(--ut-ink)' } : { borderColor: 'var(--ut-line)' }}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {product.fit && <p className="text-xs mt-2.5" style={{ color: 'var(--ut-ink-dim)' }}>{product.fit}</p>}
            </div>
          )}

          <button
            onClick={handleAdd}
            className="w-full py-4 rounded-full text-sm tracking-wide font-medium transition-opacity hover:opacity-90 mb-3"
            style={{ background: 'var(--ut-accent)', color: 'var(--ut-accent-ink)' }}
          >
            {added ? 'Added to bag ✓' : 'Add to Bag'}
          </button>
          <Link
            href={`/store/${slug}/gift-finder`}
            className="block w-full py-3.5 rounded-full text-sm tracking-wide font-medium text-center border transition-opacity hover:opacity-80 mb-3"
            style={{ borderColor: 'var(--ut-accent)', color: 'var(--ut-accent)' }}
          >
            ✦ Not sure? Let the Gift Finder decide
          </Link>
          <p className="text-[11px] text-center mb-8" style={{ color: 'var(--ut-ink-dim)' }}>Free shipping across India · Ships in 2–4 business days</p>

          {(product.detail || product.fabric || product.fit) && (
            <div className="border-t" style={{ borderColor: 'var(--ut-line)' }}>
              {(['detail', 'fit'] as const).map(panel => (
                <div key={panel} className="border-b" style={{ borderColor: 'var(--ut-line)' }}>
                  <button
                    onClick={() => setOpenPanel(openPanel === panel ? null : panel)}
                    className="w-full flex items-center justify-between py-4 text-sm tracking-wide"
                  >
                    <span>{panel === 'detail' ? 'Details & Material' : 'Fit & Care'}</span>
                    <span>{openPanel === panel ? '−' : '+'}</span>
                  </button>
                  {openPanel === panel && (
                    <div className="pb-4 text-sm leading-relaxed" style={{ color: 'var(--ut-ink-muted)' }}>
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
            <h2 className="utsav-display text-3xl md:text-4xl mb-8">You may also consider</h2>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
            {related.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.06}>
                <UtsavProductCard product={p} slug={slug} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
