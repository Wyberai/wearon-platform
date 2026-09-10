'use client'

import Link from 'next/link'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'
import { useFlagshipCart } from '@/lib/flagship/cart-context'

// A faithful clone of motelrocks.com's real homepage: a full-bleed
// campaign hero with a bold white headline and an underlined link with
// a short dash beneath it, a "MOST WANTED" curated tile row, a
// drop-guide callout (their real "denim fit guide" pattern), and a
// square Instagram-style UGC grid before the flat product grid.
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

export function GangnamHome({ brand, products, mechanicLabel, mechanicIntro, onOpenMechanic }: { brand: ThemeBrand; products: ThemeProduct[]; mechanicLabel: string; mechanicIntro: string; onOpenMechanic: () => void }) {
  const slug = brand.slug
  const categories = brand.categories.length ? brand.categories : Array.from(new Set(products.map(p => p.category)))
  const heroImg = products[0]?.image
  const mostWanted = products.slice(0, 4)

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'ClothingStore', name: brand.name, description: brand.description }) }} />

      {/* Full-bleed hero, bold white headline + underlined dash link */}
      <section className="relative h-[70vh] min-h-[440px] flex items-end">
        {heroImg && <img src={heroImg} alt="" className="absolute inset-0 w-full h-full object-cover" />}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0))' }} />
        <div className="relative px-6 md:px-10 pb-12 max-w-lg">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{brand.tagline}</h1>
          <Link href={`/store/${slug}/shop`} className="inline-block text-white text-sm uppercase tracking-[0.06em] font-semibold border-b-2 pb-1 hover:opacity-70 transition-opacity" style={{ borderColor: 'white' }}>
            Shop Now
          </Link>
        </div>
      </section>

      {/* Most Wanted — curated tile row */}
      <section className="px-6 md:px-10 py-14">
        <h2 className="text-lg font-bold uppercase tracking-[0.05em] mb-6" style={{ color: 'var(--fg-ink)' }}>Most Wanted</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {mostWanted.map(p => (
            <Link key={p.id} href={`/store/${slug}/product/${p.slug}`} className="group block">
              <div className="relative aspect-[3/4] overflow-hidden mb-2" style={{ background: 'var(--fg-card)' }}>
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
              </div>
              <p className="text-[13px]" style={{ color: 'var(--fg-ink)' }}>{p.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Drop guide callout — the real "denim fit guide" pattern */}
      <section className="px-6 md:px-10 py-14 flex flex-col md:flex-row items-center gap-8" style={{ background: 'var(--fg-card)' }}>
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--fg-ink)' }}>Not sure what fits the drop?</h2>
          <p className="text-sm leading-relaxed mb-5 max-w-md" style={{ color: 'var(--fg-ink-muted)' }}>Low-rise runs differently across every era it's borrowed from. Our size and styling guide breaks down exactly how each cut is meant to sit before you buy.</p>
          <Link href={`/store/${slug}/shop`} className="inline-block text-sm uppercase tracking-[0.06em] font-semibold border-b-2 pb-1 hover:opacity-70 transition-opacity" style={{ color: 'var(--fg-ink)', borderColor: 'var(--fg-ink)' }}>
            View Fit Guide
          </Link>
        </div>
        {products[4]?.image && (
          <div className="w-full md:w-64 aspect-[3/4] overflow-hidden flex-shrink-0">
            <img src={products[4].image} alt="" className="w-full h-full object-cover" />
          </div>
        )}
      </section>

      {/* Instagram-style UGC grid */}
      <section className="px-6 md:px-10 py-14">
        <h2 className="text-lg font-bold uppercase tracking-[0.05em] mb-6 text-center" style={{ color: 'var(--fg-ink)' }}>Shop Our Instagram</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {products.map(p => (
            <div key={p.id} className="relative aspect-square overflow-hidden" style={{ background: 'var(--fg-card)' }}>
              <img src={p.image} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-10 py-14 border-t" style={{ borderColor: 'var(--fg-line)' }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
          {products.map(p => <GridCard key={p.id} p={p} slug={slug} />)}
        </div>
      </section>

      <section className="px-6 md:px-10 py-16 border-t" style={{ borderColor: 'var(--fg-line)' }}>
        <h2 className="text-sm mb-3 uppercase font-bold" style={{ color: 'var(--fg-ink)' }}>{mechanicLabel}</h2>
        <p className="text-sm leading-relaxed max-w-md mb-5" style={{ color: 'var(--fg-ink-muted)' }}>{mechanicIntro}</p>
        <button onClick={onOpenMechanic} className="px-6 py-3 text-[12px] uppercase tracking-[0.06em] font-semibold hover:opacity-80 transition-opacity" style={{ background: 'var(--fg-accent)', color: 'var(--fg-bg)' }}>
          Begin
        </button>
      </section>
    </div>
  )
}
