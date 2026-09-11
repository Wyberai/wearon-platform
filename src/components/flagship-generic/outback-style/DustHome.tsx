'use client'

import Link from 'next/link'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'
import { useFlagshipCart } from '@/lib/flagship/cart-context'

// A faithful clone of R.M.Williams' real homepage: a full-bleed
// rustic-porch hero with rounded pill CTA buttons, an "Explore our
// range" category tile grid, a named product-collection block (their
// real "Light layers — reliable jackets for everyday wear" pattern),
// and a heritage brand-story passage closing with "Since [year]".
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

export function DustHome({ brand, products, mechanicLabel, mechanicIntro, onOpenMechanic }: { brand: ThemeBrand; products: ThemeProduct[]; mechanicLabel: string; mechanicIntro: string; onOpenMechanic: () => void }) {
  const slug = brand.slug
  const categories = brand.categories.length ? brand.categories : Array.from(new Set(products.map(p => p.category)))
  const heroImg = products[0]?.image

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'ClothingStore', name: brand.name, description: brand.description }) }} />

      {/* Full-bleed rustic hero, pill CTA buttons */}
      <section className="relative h-[65vh] min-h-[420px] flex flex-col items-center justify-end pb-12 text-center">
        {heroImg && <img src={heroImg} alt="" className="absolute inset-0 w-full h-full object-cover" />}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0.1))' }} />
        <div className="relative">
          <h1 className="text-2xl md:text-3xl text-white mb-2">{brand.tagline}</h1>
          <p className="text-sm text-white opacity-80 mb-6">Built for the outback, worn everywhere.</p>
          <div className="flex gap-3 justify-center">
            <Link href={`/store/${slug}/shop`} className="px-6 py-2.5 rounded-full text-[12px] uppercase tracking-[0.06em] font-semibold border border-white text-white hover:bg-white hover:text-black transition-colors">
              Shop Now
            </Link>
            <button onClick={onOpenMechanic} className="px-6 py-2.5 rounded-full text-[12px] uppercase tracking-[0.06em] font-semibold border border-white text-white hover:bg-white hover:text-black transition-colors">
              {mechanicLabel}
            </button>
          </div>
        </div>
      </section>

      {/* Explore our range — category tile grid */}
      <section className="px-6 md:px-10 py-14">
        <h2 className="text-sm uppercase tracking-[0.08em] mb-8 text-center" style={{ color: 'var(--fg-ink)' }}>Explore Our Range</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {categories.map(c => {
            const img = products.find(p => p.category === c)?.image
            return (
              <Link key={c} href={`/store/${slug}/shop?category=${encodeURIComponent(c)}`} className="group block">
                <div className="relative aspect-square overflow-hidden mb-2" style={{ background: 'var(--fg-card)' }}>
                  {img && <img src={img} alt={c} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />}
                </div>
                <p className="text-[13px] text-center" style={{ color: 'var(--fg-ink)' }}>{c}</p>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Named product-collection block */}
      <section className="px-6 md:px-10 py-14 flex flex-col md:flex-row items-center gap-8 border-t" style={{ borderColor: 'var(--fg-line)' }}>
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--fg-ink)' }}>Field-ready layers</h2>
          <p className="text-sm leading-relaxed mb-5 max-w-md" style={{ color: 'var(--fg-ink-muted)' }}>Reliable canvas and oilskin, cut for a day that starts before sunrise and doesn't plan on stopping for weather.</p>
          <Link href={`/store/${slug}/shop`} className="inline-block text-sm uppercase tracking-[0.06em] font-semibold border-b-2 pb-1 hover:opacity-70 transition-opacity" style={{ color: 'var(--fg-ink)', borderColor: 'var(--fg-ink)' }}>
            Shop the Layers
          </Link>
        </div>
        {products[1]?.image && (
          <div className="w-full md:w-64 aspect-[3/4] overflow-hidden flex-shrink-0">
            <img src={products[1].image} alt="" className="w-full h-full object-cover" />
          </div>
        )}
      </section>

      <section className="px-6 md:px-10 py-16 border-t" style={{ borderColor: 'var(--fg-line)' }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
          {products.map(p => <GridCard key={p.id} p={p} slug={slug} />)}
        </div>
      </section>

      {/* Heritage brand-story passage */}
      <section className="px-6 md:px-10 py-20 max-w-2xl mx-auto text-center border-t" style={{ borderColor: 'var(--fg-line)' }}>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--fg-ink-muted)' }}>
          Since the first canvas jacket left our workshop, {brand.name} has stood for one thing: gear that outlasts the job it was bought for. No fashion cycle, no seasonal reinvention &mdash; just the same durable cut, remade in the same durable cloth, for as long as the outback keeps asking for it.
        </p>
      </section>

      <section className="px-6 md:px-10 py-16 border-t" style={{ borderColor: 'var(--fg-line)' }}>
        <h2 className="text-sm mb-3" style={{ color: 'var(--fg-ink)' }}>{mechanicLabel}</h2>
        <p className="text-sm leading-relaxed max-w-md mb-5" style={{ color: 'var(--fg-ink-muted)' }}>{mechanicIntro}</p>
        <button onClick={onOpenMechanic} className="px-6 py-3 rounded-full text-[12px] uppercase tracking-[0.06em] font-semibold hover:opacity-80 transition-opacity" style={{ background: 'var(--fg-accent)', color: 'var(--fg-bg)' }}>
          Begin
        </button>
      </section>
    </div>
  )
}
