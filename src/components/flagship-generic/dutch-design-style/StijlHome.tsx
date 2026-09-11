'use client'

import Link from 'next/link'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'
import { useFlagshipCart } from '@/lib/flagship/cart-context'

// A faithful clone of Scotch & Soda's real homepage: a split-image
// hero with a large italic serif title overlay, a 3-column editorial
// image grid, and bottom-left-labeled category tiles — with an
// original De Stijl / Mondrian-grid block sitting alongside the hero
// photo, matching this brand's own bold-primary-color-block identity.
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

export function StijlHome({ brand, products, mechanicLabel, mechanicIntro, onOpenMechanic }: { brand: ThemeBrand; products: ThemeProduct[]; mechanicLabel: string; mechanicIntro: string; onOpenMechanic: () => void }) {
  const slug = brand.slug
  const categories = brand.categories.length ? brand.categories : Array.from(new Set(products.map(p => p.category)))
  const heroImg = products[0]?.image

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'ClothingStore', name: brand.name, description: brand.description }) }} />

      {/* Split hero — De Stijl grid block + campaign photo */}
      <section className="relative grid grid-cols-1 md:grid-cols-2 h-[68vh] min-h-[440px]">
        <div className="relative hidden md:grid grid-cols-2 grid-rows-2" style={{ background: 'var(--fg-bg)' }}>
          <div style={{ background: 'var(--fg-ink)' }} />
          <div style={{ background: '#D6362A' }} />
          <div style={{ background: '#F0B429' }} />
          <div style={{ background: 'var(--fg-accent)' }} />
          <div className="absolute inset-0 border-[10px]" style={{ borderColor: 'var(--fg-bg)' }} />
        </div>
        {heroImg && <img src={heroImg} alt="" className="w-full h-full object-cover" />}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <div className="px-6 py-5 max-w-lg" style={{ background: 'var(--fg-bg)' }}>
            <h1 className="text-3xl md:text-5xl italic" style={{ color: 'var(--fg-ink)', fontWeight: 700 }}>{brand.tagline.split(',')[0]}</h1>
            <p className="text-sm md:text-base mt-3" style={{ color: 'var(--fg-ink-muted)' }}>{brand.tagline}</p>
          </div>
        </div>
      </section>

      {/* 3-column editorial grid */}
      <section className="grid grid-cols-1 md:grid-cols-3">
        {products.slice(0, 3).map(p => (
          <Link key={p.id} href={`/store/${slug}/product/${p.slug}`} className="relative aspect-square overflow-hidden block group">
            <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          </Link>
        ))}
      </section>

      {/* Category tiles — bottom-left labels */}
      <section className="grid grid-cols-2 md:grid-cols-4">
        {categories.map(c => {
          const img = products.find(p => p.category === c)?.image
          return (
            <Link key={c} href={`/store/${slug}/shop?category=${encodeURIComponent(c)}`} className="relative aspect-[4/5] overflow-hidden block group">
              {img && <img src={img} alt={c} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />}
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.45), transparent 50%)' }} />
              <p className="absolute bottom-3 left-3 text-xs uppercase tracking-[0.06em] font-semibold" style={{ color: 'white' }}>{c}</p>
            </Link>
          )
        })}
      </section>

      <section className="px-6 md:px-10 py-16 border-t text-center" style={{ borderColor: 'var(--fg-line)' }}>
        <h2 className="text-sm mb-3" style={{ color: 'var(--fg-ink)' }}>{mechanicLabel}</h2>
        <p className="text-sm leading-relaxed max-w-md mx-auto mb-5" style={{ color: 'var(--fg-ink-muted)' }}>{mechanicIntro}</p>
        <button onClick={onOpenMechanic} className="px-6 py-3 text-[12px] uppercase tracking-[0.06em] font-semibold hover:opacity-80 transition-opacity" style={{ background: 'var(--fg-ink)', color: 'var(--fg-bg)' }}>
          Notify Me
        </button>
      </section>

      <section className="px-6 md:px-10 py-14 border-t" style={{ borderColor: 'var(--fg-line)' }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
          {products.map(p => <GridCard key={p.id} p={p} slug={slug} />)}
        </div>
      </section>
    </div>
  )
}
