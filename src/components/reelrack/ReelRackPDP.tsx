'use client'

import { useEffect, useRef, useState } from 'react'
import { recordProductView } from '@/lib/flagship/use-recently-viewed'
import { useFlagshipCart } from '@/lib/flagship/cart-context'
import { productToJsonLd } from '@/lib/schema-org'
import { formatINR } from '@/lib/reelrack/catalog'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'
import { ReelRackProductCard } from './ReelRackShopGrid'
import { ReelRackImg } from './ReelRackShell'
import { Reveal } from '@/components/flagship/Reveal'

export function ReelRackPDP({ brand, product, related = [] }: { brand: ThemeBrand; product: ThemeProduct; related?: ThemeProduct[] }) {
  const slug = brand.slug
  const { addLine, openCart } = useFlagshipCart()
  const [size, setSize] = useState(product.sizes[0] ?? '')
  const [color, setColor] = useState(product.colors[0] ?? '')
  const [added, setAdded] = useState(false)
  const [muted, setMuted] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => { recordProductView('reelrack_viewed_v1', product.id) }, [product.id])

  function handleAdd() {
    addLine(product, size, color, 1)
    setAdded(true)
    setTimeout(() => openCart(), 400)
  }

  function toggleSound() {
    if (!videoRef.current) return
    videoRef.current.muted = !videoRef.current.muted
    setMuted(videoRef.current.muted)
  }

  const pctOff = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : null

  const jsonLd = productToJsonLd(
    { id: product.id, name: product.name, description: product.description, category: product.category, price_inr: product.price, original_price_inr: product.originalPrice ?? null, garment_image_url: product.image, slug: product.slug, sizes: product.sizes, colors: product.colors, tags: product.tags },
    { brandName: brand.name, currency: brand.currency, baseUrl: process.env.NEXT_PUBLIC_APP_URL ?? 'https://instastarz.in', storeSlug: slug }
  )

  return (
    <div className="max-w-[1440px] mx-auto px-6 md:px-10 pt-6 pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14">
        <div className="relative aspect-[3/4] md:aspect-auto md:h-[calc(100vh-6rem)] md:sticky md:top-24 overflow-hidden rounded-xl" style={{ background: 'var(--rr-card)' }}>
          <ReelRackImg src={product.image} alt={product.name} wrapperClassName="absolute inset-0" priority />
          {product.video && (
            <>
              <video ref={videoRef} src={product.video} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" />
              <button onClick={toggleSound} className="absolute bottom-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-sm" style={{ background: 'rgba(36,20,25,0.6)', color: '#fff' }} aria-label={muted ? 'Unmute' : 'Mute'}>
                {muted ? '🔇' : '🔊'}
              </button>
            </>
          )}
          {pctOff !== null && (
            <span className="absolute top-4 left-4 text-xs font-bold px-2.5 py-1.5 rounded-md" style={{ background: 'var(--rr-sale)', color: '#fff' }}>-{pctOff}% OFF</span>
          )}
        </div>

        <div className="pt-2">
          <p className="text-xs uppercase tracking-wide mb-2 font-medium" style={{ color: 'var(--rr-ink-dim)' }}>{product.category}</p>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-3" style={{ fontFamily: 'var(--rr-display)' }}>{product.name}</h1>
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-xl font-semibold" style={{ color: product.originalPrice ? 'var(--rr-sale)' : 'var(--rr-ink)' }}>{formatINR(product.price)}</span>
            {product.originalPrice && <span className="text-sm line-through" style={{ color: 'var(--rr-ink-dim)' }}>{formatINR(product.originalPrice)}</span>}
          </div>
          <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--rr-ink-muted)' }}>{product.description}</p>

          {product.colors.length > 0 && (
            <div className="mb-6">
              <p className="text-xs uppercase tracking-wide mb-2.5 font-medium" style={{ color: 'var(--rr-ink-dim)' }}>Color — {color}</p>
              <div className="flex gap-2">
                {product.colors.map(c => (
                  <button key={c} onClick={() => setColor(c)} className="text-xs px-3.5 py-2 rounded-full border transition-opacity hover:opacity-80"
                    style={color === c ? { background: 'var(--rr-ink)', color: 'var(--rr-bg)', borderColor: 'var(--rr-ink)' } : { borderColor: 'var(--rr-line)' }}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.sizes.length > 0 && (
            <div className="mb-8">
              <p className="text-xs uppercase tracking-wide mb-2.5 font-medium" style={{ color: 'var(--rr-ink-dim)' }}>Size</p>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map(s => (
                  <button key={s} onClick={() => setSize(s)} className="text-xs min-w-11 h-11 px-3 rounded-full border flex items-center justify-center transition-opacity hover:opacity-80"
                    style={size === s ? { background: 'var(--rr-ink)', color: 'var(--rr-bg)', borderColor: 'var(--rr-ink)' } : { borderColor: 'var(--rr-line)' }}>
                    {s}
                  </button>
                ))}
              </div>
              {product.fit && <p className="text-xs mt-2.5" style={{ color: 'var(--rr-ink-dim)' }}>{product.fit}</p>}
            </div>
          )}

          <button onClick={handleAdd} className="w-full py-4 rounded-full text-sm font-semibold transition-opacity hover:opacity-90 mb-3" style={{ background: 'var(--rr-accent)', color: 'var(--rr-accent-ink)' }}>
            {added ? 'Added to Bag ✓' : 'Add to Bag'}
          </button>
          <p className="text-[11px] text-center mb-8" style={{ color: 'var(--rr-ink-dim)' }}>Free shipping across India &middot; Ships in 3–5 business days</p>

          {(product.detail || product.fabric) && (
            <div className="border-t pt-5" style={{ borderColor: 'var(--rr-line)' }}>
              <p className="text-xs uppercase tracking-wide mb-2 font-medium" style={{ color: 'var(--rr-ink-dim)' }}>Details</p>
              {product.detail && <p className="text-sm leading-relaxed mb-1.5" style={{ color: 'var(--rr-ink-muted)' }}>{product.detail}</p>}
              {product.fabric && <p className="text-sm leading-relaxed" style={{ color: 'var(--rr-ink-muted)' }}>{product.fabric}</p>}
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <Reveal><h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ fontFamily: 'var(--rr-display)' }}>You may also like</h2></Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {related.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.05}><ReelRackProductCard product={p} slug={slug} /></Reveal>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
