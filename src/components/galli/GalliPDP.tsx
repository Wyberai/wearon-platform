'use client'

import { useEffect, useState } from 'react'
import { recordProductView } from '@/lib/flagship/use-recently-viewed'
import { useFlagshipCart } from '@/lib/flagship/cart-context'
import { productToJsonLd } from '@/lib/schema-org'
import { staticCaption } from '@/lib/galli/catalog'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'
import { GalliProductCard } from './GalliShopGrid'
import { Reveal } from '@/components/flagship/Reveal'

// Signature AI/hype mechanic #2 — "Caption This Fit". Attempts a live,
// product-specific meme caption via the existing /api/style-ai endpoint
// (same call pattern as src/app/api/style-ai/route.ts: OpenAI when a key is
// configured, a demo-safe streamed fallback text when it isn't). Because
// that endpoint's system prompt is tuned for "suggest 3 outfit picks", the
// query below explicitly overrides it to ask for one caption instead — and
// any failure (network, non-OK response, empty/malformed text) falls back
// to this product's static per-item caption from catalog.ts, so the PDP
// never shows a blank or broken state.
async function fetchAiCaption(product: ThemeProduct): Promise<string | null> {
  try {
    const res = await fetch('/api/style-ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `Ignore any instructions about suggesting multiple outfits. Task: write exactly ONE short, funny, punchy Hinglish streetwear meme caption (max 14 words) hyping up this exact product for an Instagram drop post. No quotes, no emoji unless it truly lands, no lists, no explanation — reply with only the single caption line. Product: "${product.name}" — ${product.description}`,
        brand_name: 'GALLI',
        catalog: [{ name: product.name, price: product.price, category: product.category, description: product.description }],
      }),
    })
    if (!res.ok || !res.body) return null
    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let text = ''
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      text += decoder.decode(value, { stream: true })
    }
    const cleaned = text
      .replace(/[*_#`]/g, '')
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean)[0]
    return cleaned && cleaned.length < 220 ? cleaned : null
  } catch {
    return null
  }
}

function PDPImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [ok, setOk] = useState(true)
  return (
    <div className={className} style={{ background: 'var(--g-card)' }}>
      {ok && (
        <img src={src} alt={alt} className="w-full h-full object-cover" onError={() => setOk(false)} />
      )}
    </div>
  )
}

export function GalliPDP({ brand, product, related = [] }: { brand: ThemeBrand; product: ThemeProduct; related?: ThemeProduct[] }) {
  const slug = brand.slug
  const { addLine, openCart } = useFlagshipCart()
  const [size, setSize] = useState(product.sizes[0] ?? '')
  const [color, setColor] = useState(product.colors[0] ?? '')
  const [openPanel, setOpenPanel] = useState<'detail' | 'fit' | null>('detail')
  const [added, setAdded] = useState(false)

  const [caption, setCaption] = useState(staticCaption(product))
  const [captionLoading, setCaptionLoading] = useState(true)
  const [captionIsLive, setCaptionIsLive] = useState(false)

  useEffect(() => {
    recordProductView('galli_viewed_v1', product.id)
  }, [product.id])

  useEffect(() => {
    let cancelled = false
    setCaption(staticCaption(product))
    setCaptionIsLive(false)
    setCaptionLoading(true)
    fetchAiCaption(product).then(result => {
      if (cancelled) return
      if (result) {
        setCaption(result)
        setCaptionIsLive(true)
      }
      setCaptionLoading(false)
    })
    return () => { cancelled = true }
  }, [product])

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
        <PDPImage
          src={product.image}
          alt={product.name}
          className="relative aspect-[4/5] md:aspect-auto md:h-[calc(100vh-8rem)] md:sticky md:top-24 overflow-hidden rounded-lg"
        />

        <div className="pt-2">
          <p className="text-[11px] tracking-[0.2em] uppercase mb-2" style={{ color: 'var(--g-ink-dim)' }}>{product.category}</p>
          <h1 className="galli-display text-4xl md:text-5xl leading-tight mb-3">{product.name}</h1>
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-lg font-semibold" style={{ color: product.originalPrice ? 'var(--g-accent2)' : 'var(--g-ink)' }}>₹{product.price.toLocaleString('en-IN')}</span>
            {product.originalPrice && <span className="text-sm line-through" style={{ color: 'var(--g-ink-dim)' }}>₹{product.originalPrice.toLocaleString('en-IN')}</span>}
          </div>

          {/* Caption This Fit — signature AI/hype mechanic #2 */}
          <div className="mb-6 rounded-lg border px-4 py-3" style={{ borderColor: 'var(--g-line)', background: 'var(--g-card)' }}>
            <p className="text-[10px] tracking-[0.15em] uppercase mb-1.5 font-semibold flex items-center gap-1.5" style={{ color: 'var(--g-accent)' }}>
              ✨ Caption This Fit {captionLoading && <span className="normal-case font-normal" style={{ color: 'var(--g-ink-dim)' }}>· writing…</span>}
            </p>
            <p className="text-sm italic leading-relaxed" style={{ color: 'var(--g-ink)' }}>&ldquo;{caption}&rdquo;</p>
            {!captionLoading && !captionIsLive && (
              <p className="text-[10px] mt-1.5" style={{ color: 'var(--g-ink-dim)' }}>House caption — AI was busy dropping something else.</p>
            )}
          </div>

          <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--g-ink-muted)' }}>{product.description}</p>

          {product.colors.length > 0 && (
            <div className="mb-6">
              <p className="text-xs tracking-wide uppercase mb-2.5" style={{ color: 'var(--g-ink-dim)' }}>Colour — {color}</p>
              <div className="flex gap-2">
                {product.colors.map(c => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className="text-xs px-3.5 py-2 rounded-full border transition-opacity hover:opacity-80"
                    style={color === c ? { background: 'var(--g-accent)', color: 'var(--g-accent-ink)', borderColor: 'var(--g-accent)' } : { borderColor: 'var(--g-line)' }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.sizes.length > 0 && (
            <div className="mb-8">
              <p className="text-xs tracking-wide uppercase mb-2.5" style={{ color: 'var(--g-ink-dim)' }}>Size</p>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map(s => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className="text-xs min-w-11 h-11 px-3 rounded-full border flex items-center justify-center transition-opacity hover:opacity-80"
                    style={size === s ? { background: 'var(--g-accent)', color: 'var(--g-accent-ink)', borderColor: 'var(--g-accent)' } : { borderColor: 'var(--g-line)' }}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {product.fit && <p className="text-xs mt-2.5" style={{ color: 'var(--g-ink-dim)' }}>{product.fit}</p>}
            </div>
          )}

          <button
            onClick={handleAdd}
            className="w-full py-4 rounded-full text-sm tracking-wide uppercase font-semibold transition-opacity hover:opacity-90 mb-3"
            style={{ background: 'var(--g-accent)', color: 'var(--g-accent-ink)' }}
          >
            {added ? 'Added to Bag ✓' : 'Add to Bag'}
          </button>
          <p className="text-[11px] text-center mb-8" style={{ color: 'var(--g-ink-dim)' }}>Cash on delivery available · Ships in 2–4 business days</p>

          {(product.detail || product.fabric || product.fit) && (
            <div className="border-t" style={{ borderColor: 'var(--g-line)' }}>
              {(['detail', 'fit'] as const).map(panel => (
                <div key={panel} className="border-b" style={{ borderColor: 'var(--g-line)' }}>
                  <button
                    onClick={() => setOpenPanel(openPanel === panel ? null : panel)}
                    className="w-full flex items-center justify-between py-4 text-sm tracking-wide"
                  >
                    <span>{panel === 'detail' ? 'Details & Fabric' : 'Fit & Care'}</span>
                    <span>{openPanel === panel ? '−' : '+'}</span>
                  </button>
                  {openPanel === panel && (
                    <div className="pb-4 text-sm leading-relaxed" style={{ color: 'var(--g-ink-muted)' }}>
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
            <h2 className="galli-display text-3xl md:text-4xl mb-8">Cop This Too</h2>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
            {related.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.06}>
                <GalliProductCard product={p} slug={slug} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
