'use client'

import Link from 'next/link'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'
import { useFlagshipCart } from '@/lib/flagship/cart-context'

// A faithful clone of rowingblazers.com's real homepage: a season-
// labeled campus-life hero ("FALL 2026 / Back on Campus"), a plain-
// text "Shop By Category" link row, a named collab campaign banner
// (their real "x Cambridge" pattern), and a product grid where each
// tile reveals a "Quick View" button on hover.
function QuickViewCard({ p, slug }: { p: ThemeProduct; slug: string }) {
  const { addLine } = useFlagshipCart()
  return (
    <Link href={`/store/${slug}/product/${p.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden mb-3" style={{ background: 'var(--fg-card)' }}>
        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
        <button
          onClick={e => { e.preventDefault(); e.stopPropagation(); addLine(p, p.sizes[0] ?? '', p.colors[0] ?? '', 1) }}
          className="absolute bottom-3 left-3 right-3 py-2 text-[11px] uppercase tracking-[0.08em] text-center opacity-0 group-hover:opacity-100 transition-opacity font-semibold"
          style={{ background: 'var(--fg-bg)', color: 'var(--fg-ink)', border: '1px solid var(--fg-ink)' }}
        >
          Quick View
        </button>
      </div>
      <p className="text-[13px] uppercase" style={{ color: 'var(--fg-ink)' }}>{p.name}</p>
      <p className="text-[13px]" style={{ color: 'var(--fg-ink-dim)' }}>${p.price.toLocaleString('en-IN')}</p>
    </Link>
  )
}

export function CampusHome({ brand, products, mechanicLabel, mechanicIntro, onOpenMechanic }: { brand: ThemeBrand; products: ThemeProduct[]; mechanicLabel: string; mechanicIntro: string; onOpenMechanic: () => void }) {
  const slug = brand.slug
  const categories = brand.categories.length ? brand.categories : Array.from(new Set(products.map(p => p.category)))
  const heroImg = products[0]?.image
  const collabImg = products[4]?.image

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'ClothingStore', name: brand.name, description: brand.description }) }} />

      {/* Season-labeled campus-life hero */}
      <section className="relative h-[65vh] min-h-[420px] flex items-end">
        {heroImg && <img src={heroImg} alt="" className="absolute inset-0 w-full h-full object-cover" />}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5), rgba(0,0,0,0))' }} />
        <div className="relative px-6 md:px-10 pb-12">
          <p className="text-white text-xs uppercase tracking-[0.1em] mb-2">Fall 2026</p>
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">Back on Campus</h1>
          <p className="text-white text-sm mb-5 max-w-md opacity-90">{brand.tagline}</p>
          <Link href={`/store/${slug}/shop`} className="inline-block px-6 py-3 text-[12px] uppercase tracking-[0.06em] font-semibold" style={{ background: 'var(--fg-bg)', color: 'var(--fg-ink)' }}>
            Shop Now
          </Link>
        </div>
      </section>

      {/* Shop By Category — plain text link row */}
      <section className="px-6 md:px-10 py-8 flex flex-wrap justify-center gap-x-8 gap-y-2 border-b" style={{ borderColor: 'var(--fg-line)' }}>
        {categories.map(c => (
          <Link key={c} href={`/store/${slug}/shop?category=${encodeURIComponent(c)}`} className="text-[12px] uppercase tracking-[0.06em] font-semibold hover:opacity-60 transition-opacity" style={{ color: 'var(--fg-ink)' }}>
            {c}
          </Link>
        ))}
      </section>

      {/* Named collab campaign banner — the real "x Cambridge" pattern */}
      <section className="relative h-[40vh] min-h-[260px] flex items-center justify-center text-center">
        {collabImg && <img src={collabImg} alt="" className="absolute inset-0 w-full h-full object-cover" />}
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative text-white">
          <p className="text-xl md:text-2xl font-bold mb-3">{brand.name} x The Fieldhouse Archive</p>
          <Link href={`/store/${slug}/shop`} className="inline-block px-5 py-2.5 text-[12px] uppercase tracking-[0.06em] font-semibold" style={{ background: 'var(--fg-bg)', color: 'var(--fg-ink)' }}>
            Shop Now
          </Link>
        </div>
      </section>

      <section className="px-6 md:px-10 py-16 border-t" style={{ borderColor: 'var(--fg-line)' }}>
        <h2 className="text-sm uppercase tracking-[0.08em] mb-8" style={{ color: 'var(--fg-ink)' }}>New Arrivals</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
          {products.map(p => <QuickViewCard key={p.id} p={p} slug={slug} />)}
        </div>
      </section>

      <section className="px-6 md:px-10 py-16 border-t" style={{ borderColor: 'var(--fg-line)' }}>
        <h2 className="text-sm mb-3" style={{ color: 'var(--fg-ink)' }}>{mechanicLabel}</h2>
        <p className="text-sm leading-relaxed max-w-md mb-5" style={{ color: 'var(--fg-ink-muted)' }}>{mechanicIntro}</p>
        <button onClick={onOpenMechanic} className="px-6 py-3 text-[12px] uppercase tracking-[0.06em] font-semibold hover:opacity-80 transition-opacity" style={{ background: 'var(--fg-ink)', color: 'var(--fg-bg)' }}>
          Begin
        </button>
      </section>
    </div>
  )
}
