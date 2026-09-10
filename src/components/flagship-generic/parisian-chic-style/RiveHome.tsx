'use client'

import Link from 'next/link'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'
import { useFlagshipCart } from '@/lib/flagship/cart-context'

// A faithful clone of sezane.com's real homepage: no headline hero at
// all — instead a grid of full-bleed campaign photos, each carrying only
// a centered white serif category label, functioning as the entire nav
// at a glance. Followed by a members'-circle editorial section (their
// "Les Composantes" pattern, reframed here around a made-in-small-runs
// atelier philosophy) before any flat product grid.
function CategoryTile({ label, image, href }: { label: string; image?: string; href: string }) {
  return (
    <Link href={href} className="group relative block aspect-[4/5] overflow-hidden" style={{ background: 'var(--fg-card)' }}>
      {image && <img src={image} alt={label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />}
      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
      <span className="absolute inset-0 flex items-center justify-center text-white text-lg tracking-[0.08em] uppercase text-center px-4" style={{ fontWeight: 500, textShadow: '0 1px 8px rgba(0,0,0,0.35)' }}>
        {label}
      </span>
    </Link>
  )
}

function GridCard({ p, slug }: { p: ThemeProduct; slug: string }) {
  const { addLine } = useFlagshipCart()
  return (
    <Link href={`/store/${slug}/product/${p.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden mb-3" style={{ background: 'var(--fg-card)' }}>
        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
        <button
          onClick={e => { e.preventDefault(); e.stopPropagation(); addLine(p, p.sizes[0] ?? '', p.colors[0] ?? '', 1) }}
          className="absolute bottom-2 left-2 right-2 py-2 text-[11px] uppercase tracking-[0.08em] text-center opacity-0 group-hover:opacity-100 transition-opacity"
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

export function RiveHome({ brand, products, mechanicLabel, mechanicIntro, onOpenMechanic }: { brand: ThemeBrand; products: ThemeProduct[]; mechanicLabel: string; mechanicIntro: string; onOpenMechanic: () => void }) {
  const slug = brand.slug
  const categories = brand.categories.length ? brand.categories : Array.from(new Set(products.map(p => p.category)))
  const imgFor = (c: string) => products.find(p => p.category === c)?.image

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'ClothingStore', name: brand.name, description: brand.description }) }} />

      {/* Category-tile grid hero — no headline, exactly the sezane.com pattern */}
      <section className="grid grid-cols-2 md:grid-cols-4">
        {categories.map(c => (
          <CategoryTile key={c} label={c} image={imgFor(c)} href={`/store/${slug}/shop?category=${encodeURIComponent(c)}`} />
        ))}
      </section>

      {/* Members'-circle editorial section — the Les Composantes pattern */}
      <section className="px-6 md:px-10 py-20 max-w-2xl mx-auto text-center">
        <p className="text-[11px] uppercase tracking-[0.15em] mb-4" style={{ color: 'var(--fg-ink-dim)' }}>L&rsquo;Atelier</p>
        <h2 className="text-2xl md:text-3xl mb-6" style={{ color: 'var(--fg-ink)', fontStyle: 'italic' }}>{brand.tagline}</h2>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--fg-ink-muted)' }}>
          Each run is cut small, in the same two arrondissements our patternmakers have worked in for years, using cloth we've fitted in person rather than approved from a swatch card. A piece leaves the atelier once it holds its shape without trying — that is the only finish line we recognise.
        </p>
        <Link href={`/store/${slug}/shop`} className="inline-block mt-8 text-sm underline underline-offset-4 hover:opacity-60 transition-opacity" style={{ color: 'var(--fg-ink)' }}>
          Découvrir la collection
        </Link>
      </section>

      <section className="px-6 md:px-10 py-16 border-t" style={{ borderColor: 'var(--fg-line)' }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
          {products.map(p => <GridCard key={p.id} p={p} slug={slug} />)}
        </div>
      </section>

      <section className="px-6 md:px-10 py-16 border-t" style={{ borderColor: 'var(--fg-line)' }}>
        <h2 className="text-sm mb-3" style={{ color: 'var(--fg-ink)' }}>{mechanicLabel}</h2>
        <p className="text-sm leading-relaxed max-w-md mb-5" style={{ color: 'var(--fg-ink-muted)' }}>{mechanicIntro}</p>
        <button onClick={onOpenMechanic} className="text-sm underline underline-offset-4 hover:opacity-60 transition-opacity" style={{ color: 'var(--fg-ink)' }}>
          Begin
        </button>
      </section>
    </div>
  )
}
