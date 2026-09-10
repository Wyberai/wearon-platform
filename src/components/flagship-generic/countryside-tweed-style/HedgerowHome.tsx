'use client'

import Link from 'next/link'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'
import { useFlagshipCart } from '@/lib/flagship/cart-context'

// A faithful clone of barbour.com's real homepage: a split 2-column
// campaign hero with a headline and dual CTA buttons, category
// showcase blocks, and a "Repair Hub" heritage-craft passage (their
// real sustainability pattern) reframed around Hedgerow & Hound.
function GridCard({ p, slug }: { p: ThemeProduct; slug: string }) {
  const { addLine } = useFlagshipCart()
  return (
    <Link href={`/store/${slug}/product/${p.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden mb-3" style={{ background: 'var(--fg-card)' }}>
        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
        <button
          onClick={e => { e.preventDefault(); e.stopPropagation(); addLine(p, p.sizes[0] ?? '', p.colors[0] ?? '', 1) }}
          className="absolute bottom-2 left-2 right-2 py-2 text-[11px] uppercase tracking-[0.08em] text-center opacity-0 group-hover:opacity-100 transition-opacity font-semibold"
          style={{ background: 'var(--fg-ink)', color: 'var(--fg-bg)' }}
        >
          Add to Bag
        </button>
      </div>
      <p className="text-[13px]" style={{ color: 'var(--fg-ink)' }}>{p.name}</p>
      <p className="text-[13px]" style={{ color: 'var(--fg-ink-dim)' }}>${p.price.toLocaleString('en-IN')}</p>
    </Link>
  )
}

export function HedgerowHome({ brand, products, mechanicLabel, mechanicIntro, onOpenMechanic }: { brand: ThemeBrand; products: ThemeProduct[]; mechanicLabel: string; mechanicIntro: string; onOpenMechanic: () => void }) {
  const slug = brand.slug
  const categories = brand.categories.length ? brand.categories : Array.from(new Set(products.map(p => p.category)))
  const left = products[0]?.image
  const right = products[1]?.image

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'ClothingStore', name: brand.name, description: brand.description }) }} />

      {/* Split 2-column campaign hero, dual CTA */}
      <section className="relative grid grid-cols-1 md:grid-cols-2">
        <div className="relative aspect-[4/5] md:aspect-auto md:h-[65vh]">{left && <img src={left} alt="" className="w-full h-full object-cover grayscale" />}</div>
        <div className="relative aspect-[4/5] md:aspect-auto md:h-[65vh]">{right && <img src={right} alt="" className="w-full h-full object-cover grayscale" />}</div>
        <div className="absolute bottom-8 left-6 md:left-10 text-white max-w-md">
          <h1 className="text-2xl md:text-3xl font-bold mb-4" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>{brand.tagline}</h1>
          <div className="flex gap-3">
            <Link href={`/store/${slug}/shop`} className="px-5 py-2.5 text-[12px] uppercase tracking-[0.06em] font-semibold" style={{ background: 'var(--fg-bg)', color: 'var(--fg-ink)' }}>
              Shop Now
            </Link>
            <button onClick={onOpenMechanic} className="px-5 py-2.5 text-[12px] uppercase tracking-[0.06em] font-semibold border border-white text-white">
              Discover More
            </button>
          </div>
        </div>
      </section>

      {/* Category showcase blocks */}
      <section className="grid grid-cols-2 md:grid-cols-4">
        {categories.map(c => {
          const img = products.find(p => p.category === c)?.image
          return (
            <Link key={c} href={`/store/${slug}/shop?category=${encodeURIComponent(c)}`} className="group relative block aspect-[3/4] overflow-hidden">
              {img && <img src={img} alt={c} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />}
              <div className="absolute inset-0 bg-black/15" />
              <span className="absolute bottom-4 left-4 text-white text-sm font-bold uppercase">{c}</span>
            </Link>
          )
        })}
      </section>

      {/* The Repair Hub — Barbour's real heritage/craft pattern, reframed */}
      <section className="px-6 md:px-10 py-20 max-w-2xl mx-auto text-center border-t" style={{ borderColor: 'var(--fg-line)' }}>
        <p className="text-[11px] uppercase tracking-[0.15em] mb-4" style={{ color: 'var(--fg-ink-dim)' }}>The Mending Room</p>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--fg-ink-muted)' }}>
          We've spent over a century making things meant to outlast a single season of weather. But no coat crosses a hedgerow unscathed &mdash; a snagged sleeve on barbed wire, a hem caught by a gate latch, an elbow worn thin from leaning on a shooting stick. Bring it back to us. A re-woven patch or a reinforced seam costs less than replacing the whole, and a mended coat has more character than a new one ever will.
        </p>
      </section>

      <section className="px-6 md:px-10 py-16 border-t" style={{ borderColor: 'var(--fg-line)' }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
          {products.map(p => <GridCard key={p.id} p={p} slug={slug} />)}
        </div>
      </section>

      <section className="px-6 md:px-10 py-16 border-t" style={{ borderColor: 'var(--fg-line)' }}>
        <h2 className="text-sm mb-3" style={{ color: 'var(--fg-ink)' }}>{mechanicLabel}</h2>
        <p className="text-sm leading-relaxed max-w-md mb-5" style={{ color: 'var(--fg-ink-muted)' }}>{mechanicIntro}</p>
        <button onClick={onOpenMechanic} className="px-6 py-3 text-[12px] uppercase tracking-[0.06em] font-semibold hover:opacity-80 transition-opacity" style={{ background: 'var(--fg-accent)', color: 'var(--fg-bg)' }}>
          Begin
        </button>
      </section>
    </div>
  )
}
