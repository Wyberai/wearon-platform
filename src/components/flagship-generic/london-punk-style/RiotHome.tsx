'use client'

import Link from 'next/link'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'
import { useFlagshipCart } from '@/lib/flagship/cart-context'

// A faithful clone of viviennewestwood.com's real homepage: a full-
// bleed campaign hero with bold white headline type, a product grid
// where each tile reveals a "Quick View" button on hover (their real
// interaction), a punchy pull-quote section, and a heritage editorial
// passage tying the collection back to a real place and moment.
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

export function RiotHome({ brand, products, mechanicLabel, mechanicIntro, onOpenMechanic }: { brand: ThemeBrand; products: ThemeProduct[]; mechanicLabel: string; mechanicIntro: string; onOpenMechanic: () => void }) {
  const slug = brand.slug
  const categories = brand.categories.length ? brand.categories : Array.from(new Set(products.map(p => p.category)))
  const heroImg = products[0]?.image

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'ClothingStore', name: brand.name, description: brand.description }) }} />

      {/* Full-bleed campaign hero, bold white headline */}
      <section className="relative h-[70vh] min-h-[440px] flex items-end">
        {heroImg && <img src={heroImg} alt="" className="absolute inset-0 w-full h-full object-cover" />}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0))' }} />
        <div className="relative px-6 md:px-10 pb-14">
          <p className="text-white text-xs uppercase tracking-[0.1em] mb-2">New Arrivals</p>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-5 max-w-xl">{brand.tagline}</h1>
          <Link href={`/store/${slug}/shop`} className="inline-block px-6 py-3 text-[12px] uppercase tracking-[0.06em] font-semibold" style={{ background: 'var(--fg-bg)', color: 'var(--fg-ink)' }}>
            Shop Now
          </Link>
        </div>
      </section>

      {/* Product grid with Quick View hover — the real Westwood interaction */}
      <section className="px-6 md:px-10 py-14">
        <h2 className="text-sm uppercase tracking-[0.08em] mb-8" style={{ color: 'var(--fg-ink)' }}>New Arrivals</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
          {products.map(p => <QuickViewCard key={p.id} p={p} slug={slug} />)}
        </div>
      </section>

      {/* Punchy pull-quote section — Westwood's real "Culture lives through controversy" pattern */}
      <section className="px-6 md:px-10 py-20 text-center" style={{ background: 'var(--fg-ink)' }}>
        <p className="text-2xl md:text-3xl italic max-w-2xl mx-auto" style={{ color: 'var(--fg-bg)' }}>
          &ldquo;A safety pin was never a flaw &mdash; it was the fastest way to say the seam broke and I kept going.&rdquo;
        </p>
        <p className="text-xs uppercase tracking-[0.1em] mt-4" style={{ color: 'var(--fg-bg)', opacity: 0.6 }}>{brand.name} Manifesto</p>
      </section>

      {/* Heritage editorial — real long-form copy tying the collection to Kings Road */}
      <section className="px-6 md:px-10 py-20 max-w-2xl mx-auto">
        <p className="text-[11px] uppercase tracking-[0.15em] mb-4 text-center" style={{ color: 'var(--fg-ink-dim)' }}>Heritage</p>
        <h2 className="text-xl md:text-2xl mb-6 text-center uppercase" style={{ color: 'var(--fg-ink)' }}>Kings Road, 1976 and Now</h2>
        <p className="text-sm leading-relaxed text-center" style={{ color: 'var(--fg-ink-muted)' }}>
          The original shop on Kings Road never sold a finished look &mdash; it sold the materials for making one: safety pins, offcuts of tartan, a sewing machine in the back that customers were welcome to use themselves. We keep that same DIY contract. A garment here is meant to be altered, pinned, patched again the week after you buy it. Nothing is precious enough to leave alone.
        </p>
      </section>

      {/* Category showcase blocks */}
      <section className="grid grid-cols-1 md:grid-cols-2">
        {categories.slice(0, 2).map(c => {
          const img = products.find(p => p.category === c)?.image
          return (
            <Link key={c} href={`/store/${slug}/shop?category=${encodeURIComponent(c)}`} className="group relative block aspect-[4/3] overflow-hidden">
              {img && <img src={img} alt={c} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />}
              <div className="absolute inset-0 bg-black/25" />
              <span className="absolute bottom-6 left-6 text-white text-lg uppercase tracking-[0.05em] font-bold">{c}</span>
            </Link>
          )
        })}
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
