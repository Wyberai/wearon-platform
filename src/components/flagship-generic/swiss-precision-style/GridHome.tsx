'use client'

import Link from 'next/link'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'
import { useFlagshipCart } from '@/lib/flagship/cart-context'

// A faithful clone of Akris' real homepage: a full-bleed campaign hero
// with a season label + "Discover More" overlay, a horizontal-scroll
// "NEW"-badged product rail, a named sub-collection split section with
// a circular architectural graphic, a two-column discover block, and a
// "Codes of the House"-style closing section naming signature
// materials (an original set, matching this brand's own catalog).
function RailCard({ p, slug }: { p: ThemeProduct; slug: string }) {
  const { addLine } = useFlagshipCart()
  const isNew = p.tags?.includes('new') || p.tags?.includes('bestseller')
  return (
    <Link href={`/store/${slug}/product/${p.slug}`} className="group block flex-shrink-0 w-[210px]">
      <div className="relative aspect-[3/4] overflow-hidden mb-3" style={{ background: 'var(--fg-card)' }}>
        {isNew && <span className="absolute top-2 left-2 z-10 text-[10px] uppercase tracking-[0.06em] px-2 py-1" style={{ background: 'var(--fg-bg)', color: 'var(--fg-ink)' }}>New</span>}
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

export function GridHome({ brand, products, mechanicLabel, mechanicIntro, onOpenMechanic }: { brand: ThemeBrand; products: ThemeProduct[]; mechanicLabel: string; mechanicIntro: string; onOpenMechanic: () => void }) {
  const slug = brand.slug
  const heroImg = products[0]?.image
  const splitImg = products[1]?.image
  const discoverA = products[4]?.image
  const discoverB = products[5]?.image

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'ClothingStore', name: brand.name, description: brand.description }) }} />

      {/* Full-bleed campaign hero — season label + Discover More overlay */}
      <section className="relative h-[70vh] min-h-[440px] flex flex-col justify-end">
        {heroImg && <img src={heroImg} alt="" className="absolute inset-0 w-full h-full object-cover" />}
        <div className="relative px-6 md:px-10 pb-6 flex items-center gap-3">
          <span className="text-[11px] uppercase tracking-[0.08em] font-semibold" style={{ color: 'white' }}>New Season</span>
          <button onClick={onOpenMechanic} className="text-[11px] uppercase tracking-[0.06em] underline hover:opacity-80 transition-opacity" style={{ color: 'white' }}>Discover More</button>
        </div>
      </section>

      {/* Horizontal NEW rail */}
      <section className="py-14">
        <div className="px-6 md:px-10 flex items-center gap-3 mb-6">
          <span className="text-[11px] uppercase tracking-[0.08em] font-semibold" style={{ color: 'var(--fg-ink)' }}>New Arrivals</span>
          <Link href={`/store/${slug}/shop`} className="text-[11px] uppercase tracking-[0.06em] underline hover:opacity-70 transition-opacity" style={{ color: 'var(--fg-ink-dim)' }}>Shop All</Link>
        </div>
        <div className="flex gap-5 overflow-x-auto px-6 md:px-10 pb-2">
          {products.map(p => <RailCard key={p.id} p={p} slug={slug} />)}
        </div>
      </section>

      {/* Named sub-collection split — circular architectural graphic */}
      <section className="px-6 md:px-10 py-14 flex flex-col md:flex-row items-center gap-10 border-t" style={{ borderColor: 'var(--fg-line)' }}>
        <div className="flex-1">
          <p className="text-[11px] uppercase tracking-[0.08em] mb-2" style={{ color: 'var(--fg-ink-dim)' }}>{brand.name} Studio</p>
          <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--fg-ink)' }}>Precision Tailoring</h2>
          <p className="text-sm leading-relaxed max-w-sm mb-5" style={{ color: 'var(--fg-ink-muted)' }}>Every seam sits on a grid. Every hem is squared to the line before it. Nothing here is decorative — the structure is the design.</p>
          <Link href={`/store/${slug}/shop`} className="text-sm uppercase tracking-[0.06em] font-semibold border-b-2 pb-1 hover:opacity-70 transition-opacity" style={{ color: 'var(--fg-ink)', borderColor: 'var(--fg-ink)' }}>
            Discover More
          </Link>
        </div>
        <div className="relative w-full md:w-80 aspect-[4/5] flex-shrink-0">
          <div className="absolute inset-0 rounded-full opacity-10" style={{ background: 'var(--fg-accent)' }} />
          {splitImg && <img src={splitImg} alt="" className="relative w-full h-full object-cover" />}
        </div>
      </section>

      {/* Two-column discover block */}
      <section className="grid grid-cols-1 md:grid-cols-2 border-t" style={{ borderColor: 'var(--fg-line)' }}>
        <div className="px-6 md:px-10 pt-10">
          <p className="text-[11px] uppercase tracking-[0.08em] mb-4" style={{ color: 'var(--fg-ink)' }}>Minimal Accents</p>
        </div>
        <div />
        {discoverA && <div className="aspect-[4/5]"><img src={discoverA} alt="" className="w-full h-full object-cover" /></div>}
        {discoverB && <div className="aspect-[4/5]"><img src={discoverB} alt="" className="w-full h-full object-cover" /></div>}
      </section>

      {/* Codes of the Studio — signature materials passage */}
      <section className="px-6 md:px-10 py-16 text-center border-t" style={{ borderColor: 'var(--fg-line)' }}>
        <h2 className="text-sm uppercase tracking-[0.1em] mb-6" style={{ color: 'var(--fg-ink)' }}>Codes of the Studio</h2>
        <div className="flex justify-center gap-8 md:gap-14 flex-wrap text-sm uppercase tracking-[0.04em]" style={{ color: 'var(--fg-ink-muted)' }}>
          <span>Structured Wool</span>
          <span>Engineered Cotton</span>
          <span>Merino Grid Knit</span>
        </div>
      </section>

      <section className="px-6 md:px-10 py-16 border-t text-center" style={{ borderColor: 'var(--fg-line)' }}>
        <h2 className="text-sm mb-3" style={{ color: 'var(--fg-ink)' }}>{mechanicLabel}</h2>
        <p className="text-sm leading-relaxed max-w-md mx-auto mb-5" style={{ color: 'var(--fg-ink-muted)' }}>{mechanicIntro}</p>
        <button onClick={onOpenMechanic} className="px-6 py-3 text-[12px] uppercase tracking-[0.06em] font-semibold hover:opacity-80 transition-opacity" style={{ background: 'var(--fg-ink)', color: 'var(--fg-bg)' }}>
          Begin
        </button>
      </section>
    </div>
  )
}
