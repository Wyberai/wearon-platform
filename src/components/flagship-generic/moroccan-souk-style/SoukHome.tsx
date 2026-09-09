'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'
import { useFlagshipCart } from '@/lib/flagship/cart-context'

// Modeled on freepeople.com's real homepage — no single hero. Their pattern:
// a 2x2 grid of small "torn-paper" collage promo tiles right below the
// search bar, then a sequence of alternating full-bleed category banners
// (not a uniform grid), then a plain product grid. Eclectic, market-stall,
// discovery-first — the opposite of every other Generic* home's centered
// hero-then-grid rhythm.
function GridCard({ p, slug }: { p: ThemeProduct; slug: string }) {
  const { addLine } = useFlagshipCart()
  return (
    <Link href={`/store/${slug}/product/${p.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg" style={{ background: 'var(--fg-card)' }}>
        <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
        <button
          onClick={e => { e.preventDefault(); e.stopPropagation(); addLine(p, p.sizes[0] ?? '', p.colors[0] ?? '', 1) }}
          className="absolute bottom-2 left-2 right-2 py-2 text-[10px] tracking-[0.1em] uppercase text-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: 'var(--fg-bg)', color: 'var(--fg-ink)' }}
        >
          Quick Add
        </button>
      </div>
      <p className="mt-2.5 text-[13px]" style={{ color: 'var(--fg-ink)' }}>{p.name}</p>
      <p className="text-[13px]" style={{ color: 'var(--fg-ink-dim)' }}>${p.price.toLocaleString('en-IN')}</p>
    </Link>
  )
}

export function SoukHome({ brand, products, mechanicLabel, onOpenMechanic }: { brand: ThemeBrand; products: ThemeProduct[]; mechanicLabel: string; onOpenMechanic: () => void }) {
  const slug = brand.slug
  const categories = useMemo(() => brand.categories.length ? brand.categories : Array.from(new Set(products.map(p => p.category))), [brand.categories, products])

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'ClothingStore', name: brand.name, description: brand.description }) }} />

      {/* 2x2 collage promo grid — the actual Free People opener, not a hero */}
      <section className="px-4 md:px-6 pt-4 pb-2">
        <div className="grid grid-cols-2 gap-2 max-w-[900px] mx-auto">
          {categories.slice(0, 4).map((c, i) => {
            const img = products.find(p => p.category === c)?.image ?? products[0]?.image
            return (
              <Link key={c} href={`/store/${slug}/shop?category=${encodeURIComponent(c)}`} className="relative h-28 md:h-36 overflow-hidden rounded-sm border" style={{ borderColor: 'var(--fg-accent)', transform: i % 2 === 0 ? 'rotate(-0.4deg)' : 'rotate(0.4deg)' }}>
                {img && <img src={img} alt="" className="w-full h-full object-cover" style={{ filter: 'brightness(0.75)' }} />}
                <span className="absolute inset-0 flex items-center justify-center text-[13px] md:text-[15px] tracking-[0.1em] uppercase text-center px-2" style={{ color: '#fff', fontWeight: 700, textShadow: '0 1px 6px rgba(0,0,0,0.5)' }}>
                  {c}
                </span>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Alternating full-bleed category banners */}
      {categories.slice(0, 3).map((c, i) => {
        const img = products.find(p => p.category === c)?.image ?? products[i]?.image
        return (
          <Link key={c} href={`/store/${slug}/shop?category=${encodeURIComponent(c)}`} className="block relative h-[46vh] min-h-[280px] overflow-hidden">
            {img && <img src={img} alt="" className="w-full h-full object-cover" />}
            <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.18)' }}>
              <span className="text-2xl md:text-3xl tracking-[0.12em] uppercase" style={{ color: '#fff', fontWeight: 700, textShadow: '0 1px 10px rgba(0,0,0,0.5)' }}>{c}</span>
            </div>
          </Link>
        )
      })}

      <section className="px-6 md:px-10 py-14">
        <div className="text-center mb-8">
          <h2 className="text-sm tracking-[0.15em] uppercase mb-2" style={{ color: 'var(--fg-ink)', fontWeight: 700 }}>{brand.name}</h2>
          <p className="text-[13px]" style={{ color: 'var(--fg-ink-muted)' }}>{brand.tagline}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.map(p => <GridCard key={p.id} p={p} slug={slug} />)}
        </div>
      </section>

      <section className="px-6 md:px-10 py-16 border-t text-center" style={{ borderColor: 'var(--fg-line)' }}>
        <p className="text-[11px] tracking-[0.15em] uppercase mb-3" style={{ color: 'var(--fg-ink-dim)' }}>Not sure where to start?</p>
        <h2 className="text-xl md:text-2xl mb-5" style={{ fontWeight: 600 }}>{mechanicLabel}</h2>
        <button onClick={onOpenMechanic} className="px-6 py-3 rounded-full text-[11px] tracking-[0.15em] uppercase" style={{ background: 'var(--fg-accent)', color: 'var(--fg-accent-ink)' }}>
          {mechanicLabel}
        </button>
      </section>
    </div>
  )
}
