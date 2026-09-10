'use client'

import Link from 'next/link'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'
import { useFlagshipCart } from '@/lib/flagship/cart-context'

// A faithful clone of trinaturk.com's real homepage: a split 2-column
// vivid campaign hero with "INTRODUCING / [tagline] / EXPLORE NOW"
// overlay text, a "MODERN RESORT LIFESTYLE" brand-story passage (their
// real "Since 1995..." pattern, reframed around South Beach), and
// category showcase blocks by product type before the flat grid.
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

export function OceanHome({ brand, products, mechanicLabel, mechanicIntro, onOpenMechanic }: { brand: ThemeBrand; products: ThemeProduct[]; mechanicLabel: string; mechanicIntro: string; onOpenMechanic: () => void }) {
  const slug = brand.slug
  const categories = brand.categories.length ? brand.categories : Array.from(new Set(products.map(p => p.category)))
  const left = products[0]?.image
  const right = products[1]?.image

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'ClothingStore', name: brand.name, description: brand.description }) }} />

      {/* Split 2-column vivid hero, text overlay bottom-left of left panel */}
      <section className="grid grid-cols-1 md:grid-cols-2">
        <div className="relative aspect-[3/4] md:aspect-auto md:h-[65vh]">
          {left && <img src={left} alt="" className="w-full h-full object-cover" />}
          <div className="absolute bottom-8 left-6 text-white">
            <p className="text-xs uppercase tracking-[0.1em] mb-1">Introducing</p>
            <h1 className="text-2xl md:text-3xl font-bold mb-3 max-w-xs" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}>{brand.tagline}</h1>
            <Link href={`/store/${slug}/shop`} className="text-sm underline underline-offset-4 uppercase tracking-[0.05em] hover:opacity-70 transition-opacity">
              Explore Now
            </Link>
          </div>
        </div>
        <div className="relative aspect-[3/4] md:aspect-auto md:h-[65vh]">
          {right && <img src={right} alt="" className="w-full h-full object-cover" />}
        </div>
      </section>

      {/* Modern Resort Lifestyle editorial — the real Trina Turk brand-story pattern */}
      <section className="px-6 md:px-10 py-20 max-w-2xl mx-auto text-center">
        <p className="text-[11px] uppercase tracking-[0.15em] mb-4" style={{ color: 'var(--fg-ink-dim)' }}>The South Beach Lifestyle</p>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--fg-ink-muted)' }}>
          Since the neon first hit the Deco hotels on Ocean Drive, this stretch of sand has defined a distinctly Florida point of view &mdash; vivid color, palm silhouettes, and an unhurried sense of glamour that never took itself too seriously. Inspired by the pastel architecture, the ease of the boardwalk, and an evening that starts at sunset and doesn&rsquo;t plan on ending, {brand.name} is clothing built for exactly one mood: golden hour, always.
        </p>
      </section>

      {/* Category showcase blocks by product type */}
      <section className="grid grid-cols-2 md:grid-cols-4">
        {categories.map(c => {
          const img = products.find(p => p.category === c)?.image
          return (
            <Link key={c} href={`/store/${slug}/shop?category=${encodeURIComponent(c)}`} className="group relative block aspect-[3/4] overflow-hidden">
              {img && <img src={img} alt={c} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />}
              <div className="absolute inset-0 bg-black/15" />
              <div className="absolute bottom-4 left-4 text-white">
                <p className="text-[10px] uppercase tracking-[0.1em] opacity-80">New Arrivals</p>
                <p className="text-sm font-bold uppercase">{c}</p>
              </div>
            </Link>
          )
        })}
      </section>

      <section className="px-6 md:px-10 py-16 border-t" style={{ borderColor: 'var(--fg-line)' }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
          {products.map(p => <GridCard key={p.id} p={p} slug={slug} />)}
        </div>
      </section>

      <section className="px-6 md:px-10 py-16 border-t" style={{ borderColor: 'var(--fg-line)' }}>
        <h2 className="text-sm mb-3" style={{ color: 'var(--fg-ink)' }}>{mechanicLabel}</h2>
        <p className="text-sm leading-relaxed max-w-md mb-5" style={{ color: 'var(--fg-ink-muted)' }}>{mechanicIntro}</p>
        <button onClick={onOpenMechanic} className="px-6 py-3 text-[12px] uppercase tracking-[0.06em] font-semibold hover:opacity-80 transition-opacity" style={{ background: 'var(--fg-accent)', color: 'white' }}>
          Begin
        </button>
      </section>
    </div>
  )
}
