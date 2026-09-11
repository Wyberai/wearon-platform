'use client'

import Link from 'next/link'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'
import { useFlagshipCart } from '@/lib/flagship/cart-context'

// A faithful clone of BIASA's real homepage: a brand-philosophy
// statement ("Extraordinary Simplicity"), a named seasonal-collection
// passage, and a product grid where each tile is labeled with a
// person's name before the descriptor (their real "Nehara - Plunged
// Neck Flowy Dress" convention) plus stock-urgency badges.
const FIRST_NAMES: Record<string, string> = {
  'Batik Wrap Dress': 'Wulan',
  'Batik Sarong Skirt': 'Kadek',
  'Linen Resort Set': 'Surya',
  'Batik Print Shirt': 'Made',
  'Temple Print Kimono': 'Dewi',
  'Batik Kaftan': 'Ayu',
  'Carved Wood Bangle': 'Gede',
  'Beaded Anklet': 'Putu',
}
const STOCK_TAGS: Record<string, string> = {
  'Batik Wrap Dress': 'Last stock!',
  'Temple Print Kimono': '1 in stock',
}

function GridCard({ p, slug }: { p: ThemeProduct; slug: string }) {
  const { addLine } = useFlagshipCart()
  const stockTag = STOCK_TAGS[p.name]
  return (
    <Link href={`/store/${slug}/product/${p.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden mb-3" style={{ background: 'var(--fg-card)' }}>
        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
        {stockTag && (
          <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] uppercase tracking-[0.05em] font-bold" style={{ background: 'var(--fg-accent)', color: 'var(--fg-bg)' }}>{stockTag}</span>
        )}
        <button
          onClick={e => { e.preventDefault(); e.stopPropagation(); addLine(p, p.sizes[0] ?? '', p.colors[0] ?? '', 1) }}
          className="absolute bottom-2 left-2 right-2 py-2 text-[11px] uppercase tracking-[0.08em] text-center opacity-0 group-hover:opacity-100 transition-opacity font-semibold"
          style={{ background: 'var(--fg-ink)', color: 'var(--fg-bg)' }}
        >
          Add to Bag
        </button>
      </div>
      <p className="text-[13px]" style={{ color: 'var(--fg-ink)' }}>{FIRST_NAMES[p.name] ?? ''} &ndash; {p.name}</p>
      <p className="text-[13px]" style={{ color: 'var(--fg-ink-dim)' }}>${p.price.toLocaleString('en-IN')}</p>
    </Link>
  )
}

export function UbudHome({ brand, products, mechanicLabel, mechanicIntro, onOpenMechanic }: { brand: ThemeBrand; products: ThemeProduct[]; mechanicLabel: string; mechanicIntro: string; onOpenMechanic: () => void }) {
  const slug = brand.slug
  const heroImg = products[0]?.image

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'ClothingStore', name: brand.name, description: brand.description }) }} />

      {/* Brand-philosophy statement — the real "Extraordinary Simplicity" pattern */}
      <section className="px-6 md:px-10 py-14 max-w-2xl mx-auto text-center border-b" style={{ borderColor: 'var(--fg-line)' }}>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--fg-ink-muted)' }}>
          Guided by exceptional craftsmanship, {brand.name} shapes natural fabrics into timeless forms. Every piece carries the mark of skilled hands, where intentional design and meaningful detail reflect our philosophy of Extraordinary Simplicity.
        </p>
      </section>

      {/* Named collection section */}
      <section className="relative h-[65vh] min-h-[420px] flex items-end">
        {heroImg && <img src={heroImg} alt="" className="absolute inset-0 w-full h-full object-cover" />}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0))' }} />
        <div className="relative px-6 md:px-10 pb-12 max-w-lg">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">Temple &amp; Terrace</h1>
          <p className="text-sm text-white opacity-90 mb-5">{brand.tagline} A collection that moves between rice terrace and temple gate, wax-resist pattern by wax-resist pattern.</p>
          <Link href={`/store/${slug}/shop`} className="inline-block px-6 py-3 text-[12px] uppercase tracking-[0.06em] font-semibold" style={{ background: 'var(--fg-bg)', color: 'var(--fg-ink)' }}>
            Discover Collection
          </Link>
        </div>
      </section>

      <section className="px-6 md:px-10 py-16">
        <h2 className="text-sm uppercase tracking-[0.08em] mb-8" style={{ color: 'var(--fg-ink)' }}>New Arrivals</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
          {products.map(p => <GridCard key={p.id} p={p} slug={slug} />)}
        </div>
      </section>

      <section className="px-6 md:px-10 py-16 border-t" style={{ borderColor: 'var(--fg-line)' }}>
        <h2 className="text-sm mb-3" style={{ color: 'var(--fg-ink)' }}>{mechanicLabel}</h2>
        <p className="text-sm leading-relaxed max-w-md mb-5" style={{ color: 'var(--fg-ink-muted)' }}>{mechanicIntro}</p>
        <button onClick={onOpenMechanic} className="px-6 py-3 text-[12px] uppercase tracking-[0.06em] font-semibold hover:opacity-80 transition-opacity" style={{ background: 'var(--fg-accent)', color: 'var(--fg-bg)' }}>
          Begin
        </button>
      </section>
    </div>
  )
}
