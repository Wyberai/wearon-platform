'use client'

import Link from 'next/link'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'
import { useFlagshipCart } from '@/lib/flagship/cart-context'

// A faithful clone of loveshackfancy.com's real homepage: a hero with
// mixed typography (small-caps serif eyebrow + huge flowing script line)
// over a boxy white rectangular CTA, then category tiles on a PINK section
// background (not white) with underlined small-caps labels, then a
// floral-bordered "brand moment" panel, then a plain product grid.
function GridCard({ p, slug }: { p: ThemeProduct; slug: string }) {
  const { addLine } = useFlagshipCart()
  return (
    <Link href={`/store/${slug}/product/${p.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden mb-3" style={{ background: 'var(--fg-card)' }}>
        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
        <button
          onClick={e => { e.preventDefault(); e.stopPropagation(); addLine(p, p.sizes[0] ?? '', p.colors[0] ?? '', 1) }}
          className="absolute bottom-2 left-2 right-2 py-2 text-[10px] tracking-[0.1em] uppercase text-center opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: '#fff', color: 'var(--fg-ink)', border: '1px solid var(--fg-ink)' }}
        >
          Quick Shop
        </button>
      </div>
      <p className="text-[13px]" style={{ color: 'var(--fg-ink)' }}>{p.name}</p>
      <p className="text-[13px]" style={{ color: 'var(--fg-ink-dim)' }}>${p.price.toLocaleString('en-IN')}</p>
    </Link>
  )
}

export function PrairieHome({ brand, products, mechanicLabel, onOpenMechanic }: { brand: ThemeBrand; products: ThemeProduct[]; mechanicLabel: string; onOpenMechanic: () => void }) {
  const slug = brand.slug
  const heroImage = products[0]?.image
  const categories = brand.categories.length ? brand.categories : Array.from(new Set(products.map(p => p.category)))

  return (
    <div>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Playfair+Display:ital@0;1&display=swap" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'ClothingStore', name: brand.name, description: brand.description }) }} />

      {/* Hero — mixed serif + script headline over photo, boxy white CTA */}
      <div className="relative h-[85vh] min-h-[540px] overflow-hidden">
        {heroImage && <img src={heroImage} alt="" className="w-full h-full object-cover" />}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.4) 100%)' }} />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <p className="text-sm md:text-base tracking-[0.15em] uppercase mb-1" style={{ color: '#fff', fontFamily: "'Playfair Display', serif" }}>
            Introducing the New
          </p>
          <h1 style={{ fontFamily: "'Alex Brush', cursive", fontSize: 'clamp(52px, 10vw, 110px)', color: '#fff', lineHeight: 1.1 }}>
            {brand.name}
          </h1>
          <Link href={`/store/${slug}/shop`} className="mt-6 px-8 py-4 text-sm tracking-[0.1em] uppercase" style={{ background: '#fff', color: 'var(--fg-ink)' }}>
            Shop New Arrivals
          </Link>
        </div>
      </div>

      {/* Category tiles on a tinted section background */}
      {categories.length > 0 && (
        <section className="py-16 px-6 md:px-10" style={{ background: `color-mix(in srgb, var(--fg-accent) 12%, var(--fg-bg))` }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-[1100px] mx-auto">
            {categories.map(c => {
              const img = products.find(p => p.category === c)?.image ?? products[0]?.image
              return (
                <Link key={c} href={`/store/${slug}/shop?category=${encodeURIComponent(c)}`} className="group block">
                  <div className="relative aspect-[3/4] overflow-hidden mb-3">
                    {img && <img src={img} alt={c} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />}
                  </div>
                  <p className="text-center text-[12px] tracking-[0.1em] uppercase underline underline-offset-4" style={{ color: 'var(--fg-ink)' }}>{c}</p>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* Floral-bordered brand moment */}
      <section className="py-20 px-6 text-center" style={{ background: `color-mix(in srgb, var(--fg-accent) 18%, var(--fg-bg))` }}>
        <div className="max-w-lg mx-auto py-14 px-8" style={{ border: '3px double var(--fg-accent)' }}>
          <p style={{ fontFamily: "'Alex Brush', cursive", fontSize: 'clamp(36px, 6vw, 56px)', color: 'var(--fg-ink)' }}>{brand.name}</p>
          <p className="text-sm mt-3 tracking-[0.05em]" style={{ color: 'var(--fg-ink-muted)', fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>
            {brand.tagline}
          </p>
        </div>
      </section>

      <section className="px-6 md:px-10 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
          {products.map(p => <GridCard key={p.id} p={p} slug={slug} />)}
        </div>
      </section>

      <section className="px-6 md:px-10 py-16 text-center border-t" style={{ borderColor: 'var(--fg-line)' }}>
        <p className="text-[13px] tracking-[0.1em] uppercase mb-3" style={{ color: 'var(--fg-ink-dim)' }}>Not sure where to start?</p>
        <h2 style={{ fontFamily: "'Alex Brush', cursive", fontSize: 'clamp(32px, 5vw, 44px)', color: 'var(--fg-ink)', marginBottom: 20 }}>{mechanicLabel}</h2>
        <button onClick={onOpenMechanic} className="px-8 py-4 text-sm tracking-[0.1em] uppercase" style={{ background: 'var(--fg-ink)', color: 'var(--fg-bg)' }}>
          {mechanicLabel}
        </button>
      </section>
    </div>
  )
}
