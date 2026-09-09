'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'
import { useFlagshipCart } from '@/lib/flagship/cart-context'

// Modeled on vacation.inc's real homepage — the opposite of the quiet,
// refined boutique treatment every other rebuild in this kit has used:
// a huge loose cursive-script wordmark over a VHS-grain-textured photo,
// a location subtitle, star-rating social proof, a warm rounded pill CTA,
// and a diagonal folded-corner discount badge pinned in the corner.
function GridCard({ p, slug }: { p: ThemeProduct; slug: string }) {
  const { addLine } = useFlagshipCart()
  return (
    <Link href={`/store/${slug}/product/${p.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl border-2" style={{ background: 'var(--fg-card)', borderColor: 'var(--fg-ink)' }}>
        <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
        <button
          onClick={e => { e.preventDefault(); e.stopPropagation(); addLine(p, p.sizes[0] ?? '', p.colors[0] ?? '', 1) }}
          className="absolute bottom-2 left-2 right-2 py-2 text-[11px] font-bold text-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: 'var(--fg-accent)', color: 'var(--fg-accent-ink)' }}
        >
          + Add to Bag
        </button>
      </div>
      <p className="mt-3 text-[14px] font-bold" style={{ color: 'var(--fg-ink)' }}>{p.name}</p>
      <p className="text-[14px]" style={{ color: 'var(--fg-ink-dim)' }}>${p.price.toLocaleString('en-IN')}</p>
    </Link>
  )
}

export function ResortHome({ brand, products, mechanicLabel, onOpenMechanic }: { brand: ThemeBrand; products: ThemeProduct[]; mechanicLabel: string; onOpenMechanic: () => void }) {
  const slug = brand.slug
  const heroImage = products[0]?.image
  const categories = useMemo(() => brand.categories.length ? brand.categories : Array.from(new Set(products.map(p => p.category))), [brand.categories, products])

  return (
    <div>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Pacifico&family=Fredoka:wght@500;700&display=swap" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'ClothingStore', name: brand.name, description: brand.description }) }} />

      <div className="relative h-[88vh] min-h-[560px] overflow-hidden">
        {heroImage && <img src={heroImage} alt="" className="w-full h-full object-cover" style={{ filter: 'saturate(1.15) contrast(1.05) sepia(0.08)' }} />}
        {/* VHS grain + scanline overlay */}
        <div
          className="absolute inset-0 pointer-events-none mix-blend-overlay"
          style={{
            background: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 3px)',
          }}
        />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.25) 100%)' }} />

        <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
          <h1 style={{ fontFamily: "'Pacifico', cursive", fontSize: 'clamp(56px, 13vw, 150px)', color: '#fff', fontWeight: 400, textShadow: '0 3px 20px rgba(0,0,0,0.4)', lineHeight: 1 }}>
            {brand.name}
          </h1>
          <p className="text-base md:text-lg mt-2" style={{ color: '#fff', fontFamily: "'Fredoka', sans-serif", fontWeight: 500, textShadow: '0 1px 8px rgba(0,0,0,0.4)' }}>
            {brand.tagline}
          </p>
          <div className="flex items-center gap-1.5 mt-4 text-sm" style={{ color: '#fff', textShadow: '0 1px 8px rgba(0,0,0,0.4)' }}>
            <span>4.9 / 5</span>
            <span style={{ color: 'var(--fg-accent)' }}>★★★★★</span>
            <span style={{ opacity: 0.85 }}>2,300+ Reviews</span>
          </div>
          <Link href={`/store/${slug}/shop`} className="mt-6 px-8 py-3.5 rounded-full text-sm font-bold transition-transform hover:scale-105" style={{ background: 'var(--fg-accent)', color: 'var(--fg-accent-ink)', fontFamily: "'Fredoka', sans-serif" }}>
            Shop the Collection
          </Link>
        </div>

        {/* Diagonal folded-corner promo badge */}
        <button
          onClick={onOpenMechanic}
          className="absolute bottom-0 right-0 w-24 h-24 md:w-28 md:h-28 flex items-end justify-start pb-4 pl-3 text-[11px] font-bold text-center leading-tight"
          style={{
            background: 'var(--fg-accent)',
            color: 'var(--fg-accent-ink)',
            clipPath: 'polygon(100% 0, 0% 100%, 100% 100%)',
            fontFamily: "'Fredoka', sans-serif",
          }}
        >
          <span style={{ transform: 'rotate(-45deg)', display: 'block' }}>{mechanicLabel}</span>
        </button>
      </div>

      {categories.length > 0 && (
        <section className="px-6 md:px-10 py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {categories.map(c => {
              const img = products.find(p => p.category === c)?.image ?? products[0]?.image
              return (
                <Link key={c} href={`/store/${slug}/shop?category=${encodeURIComponent(c)}`} className="group block">
                  <div className="relative aspect-square overflow-hidden rounded-full border-2 mb-2" style={{ borderColor: 'var(--fg-accent)' }}>
                    {img && <img src={img} alt={c} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]" />}
                  </div>
                  <p className="text-center text-[13px] font-bold" style={{ color: 'var(--fg-ink)', fontFamily: "'Fredoka', sans-serif" }}>{c}</p>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      <section className="px-6 md:px-10 pb-16">
        <h2 className="text-center text-2xl mb-8" style={{ fontFamily: "'Pacifico', cursive", color: 'var(--fg-ink)', fontWeight: 400 }}>
          Shop the Collection
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-7">
          {products.map(p => <GridCard key={p.id} p={p} slug={slug} />)}
        </div>
      </section>

      <section className="px-6 md:px-10 py-16 text-center" style={{ background: 'var(--fg-accent)', color: 'var(--fg-accent-ink)' }}>
        <p className="text-[13px] font-bold mb-2" style={{ fontFamily: "'Fredoka', sans-serif" }}>NOT SURE WHERE TO START?</p>
        <h2 className="text-3xl mb-5" style={{ fontFamily: "'Pacifico', cursive", fontWeight: 400 }}>{mechanicLabel}</h2>
        <button onClick={onOpenMechanic} className="px-7 py-3.5 rounded-full text-sm font-bold" style={{ background: 'var(--fg-ink)', color: 'var(--fg-bg)', fontFamily: "'Fredoka', sans-serif" }}>
          Let's Go →
        </button>
      </section>
    </div>
  )
}
