'use client'

import Link from 'next/link'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'
import { useFlagshipCart } from '@/lib/flagship/cart-context'

// A faithful clone of santacruzskateboards.com's real homepage: a
// full-bleed skate-action hero with a rotating circular badge seal
// overlaid on the photo and a single "Browse X" CTA button, followed
// by several horizontal "Customer Favorites" / "Browse Category"
// merchandising rows instead of one flat grid.
function ScrollRow({ title, items, slug, href }: { title: string; items: ThemeProduct[]; slug: string; href: string }) {
  const { addLine } = useFlagshipCart()
  return (
    <section className="px-4 md:px-8 py-10 border-t" style={{ borderColor: 'var(--fg-line)' }}>
      <h2 className="text-sm uppercase tracking-[0.06em] font-bold mb-5" style={{ color: 'var(--fg-ink)' }}>{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {items.map(p => (
          <Link key={p.id} href={`/store/${slug}/product/${p.slug}`} className="group block">
            <div className="relative aspect-square overflow-hidden mb-2" style={{ background: 'var(--fg-card)' }}>
              <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
              <button
                onClick={e => { e.preventDefault(); e.stopPropagation(); addLine(p, p.sizes[0] ?? '', p.colors[0] ?? '', 1) }}
                className="absolute bottom-2 left-2 right-2 py-2 text-[11px] uppercase tracking-[0.06em] text-center opacity-0 group-hover:opacity-100 transition-opacity font-bold"
                style={{ background: 'var(--fg-ink)', color: 'var(--fg-bg)' }}
              >
                Add to Cart
              </button>
            </div>
            <p className="text-[12px] uppercase" style={{ color: 'var(--fg-ink)' }}>{p.name}</p>
            <p className="text-[12px]" style={{ color: 'var(--fg-ink-dim)' }}>${p.price.toLocaleString('en-IN')}</p>
          </Link>
        ))}
      </div>
      <Link href={href} className="inline-block mt-5 text-[12px] uppercase tracking-[0.06em] font-bold underline underline-offset-4 hover:opacity-60 transition-opacity" style={{ color: 'var(--fg-ink)' }}>
        {title}
      </Link>
    </section>
  )
}

export function VeniceHome({ brand, products, mechanicLabel, mechanicIntro, onOpenMechanic }: { brand: ThemeBrand; products: ThemeProduct[]; mechanicLabel: string; mechanicIntro: string; onOpenMechanic: () => void }) {
  const slug = brand.slug
  const categories = brand.categories.length ? brand.categories : Array.from(new Set(products.map(p => p.category)))
  const heroImg = products[0]?.image

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'ClothingStore', name: brand.name, description: brand.description }) }} />

      {/* Full-bleed action hero with rotating circular badge seal */}
      <section className="relative h-[65vh] min-h-[420px] flex items-center justify-start px-6 md:px-10">
        {heroImg && <img src={heroImg} alt="" className="absolute inset-0 w-full h-full object-cover" />}
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative flex flex-col items-start gap-6">
          <div className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 flex items-center justify-center text-center p-3" style={{ borderColor: 'white', color: 'white' }}>
            <span className="text-[11px] md:text-xs uppercase font-bold leading-tight">{brand.tagline}</span>
          </div>
          <Link href={`/store/${slug}/shop`} className="px-6 py-3 text-[12px] uppercase tracking-[0.06em] font-bold" style={{ background: 'var(--fg-bg)', color: 'var(--fg-ink)' }}>
            Browse {categories[0]}
          </Link>
        </div>
      </section>

      {/* Merchandising rows — the real Santa Cruz "Customer Favorites / Browse X" pattern */}
      {categories.map(c => (
        <ScrollRow key={c} title={c} items={products.filter(p => p.category === c)} slug={slug} href={`/store/${slug}/shop?category=${encodeURIComponent(c)}`} />
      ))}

      <section className="px-6 md:px-10 py-16 border-t" style={{ borderColor: 'var(--fg-line)' }}>
        <h2 className="text-sm mb-3 uppercase font-bold" style={{ color: 'var(--fg-ink)' }}>{mechanicLabel}</h2>
        <p className="text-sm leading-relaxed max-w-md mb-5" style={{ color: 'var(--fg-ink-muted)' }}>{mechanicIntro}</p>
        <button onClick={onOpenMechanic} className="px-6 py-3 text-[12px] uppercase tracking-[0.06em] font-bold hover:opacity-80 transition-opacity" style={{ background: 'var(--fg-accent)', color: 'var(--fg-bg)' }}>
          Begin
        </button>
      </section>
    </div>
  )
}
