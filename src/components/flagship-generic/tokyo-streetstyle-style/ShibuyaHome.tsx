'use client'

import Link from 'next/link'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'
import { useFlagshipCart } from '@/lib/flagship/cart-context'

// A faithful clone of shop.doverstreetmarket.com's real homepage: a
// 2-column full-bleed campaign-photo grid with the caption sitting
// BELOW each image as massive bold black type — never overlaid on the
// photo — exactly the DSM "brand block" pattern, repeated instead of a
// single headline hero.
function CategoryBlock({ label, image, href }: { label: string; image?: string; href: string }) {
  return (
    <Link href={href} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden" style={{ background: 'var(--fg-card)' }}>
        {image && <img src={image} alt={label} className="w-full h-full object-cover" />}
      </div>
      <p className="text-xl md:text-2xl uppercase mt-3 leading-none" style={{ color: 'var(--fg-ink)', fontWeight: 900, letterSpacing: '-0.01em' }}>{label}</p>
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
          className="absolute bottom-2 left-2 right-2 py-2 text-[11px] uppercase tracking-[0.08em] text-center opacity-0 group-hover:opacity-100 transition-opacity font-bold"
          style={{ background: 'var(--fg-ink)', color: 'var(--fg-bg)' }}
        >
          Add to Cart
        </button>
      </div>
      <p className="text-[13px] uppercase font-bold" style={{ color: 'var(--fg-ink)' }}>{p.name}</p>
      <p className="text-[13px]" style={{ color: 'var(--fg-ink-dim)' }}>${p.price.toLocaleString('en-IN')}</p>
    </Link>
  )
}

export function ShibuyaHome({ brand, products, mechanicLabel, mechanicIntro, onOpenMechanic }: { brand: ThemeBrand; products: ThemeProduct[]; mechanicLabel: string; mechanicIntro: string; onOpenMechanic: () => void }) {
  const slug = brand.slug
  const categories = brand.categories.length ? brand.categories : Array.from(new Set(products.map(p => p.category)))
  const imgFor = (c: string) => products.find(p => p.category === c)?.image

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'ClothingStore', name: brand.name, description: brand.description }) }} />

      <section className="px-4 md:px-8 py-6">
        <p className="text-sm md:text-base max-w-md" style={{ color: 'var(--fg-ink-muted)' }}>{brand.tagline}</p>
      </section>

      {/* Category-block grid — image, then bold black caption below it, DSM pattern */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 md:px-8">
        {categories.map(c => (
          <CategoryBlock key={c} label={c} image={imgFor(c)} href={`/store/${slug}/shop?category=${encodeURIComponent(c)}`} />
        ))}
      </section>

      <section className="px-4 md:px-8 py-16 border-t-4 mt-10" style={{ borderColor: 'var(--fg-ink)' }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
          {products.map(p => <GridCard key={p.id} p={p} slug={slug} />)}
        </div>
      </section>

      <section className="px-4 md:px-8 py-16 border-t-4" style={{ borderColor: 'var(--fg-ink)' }}>
        <h2 className="text-2xl uppercase mb-3" style={{ color: 'var(--fg-ink)', fontWeight: 900 }}>{mechanicLabel}</h2>
        <p className="text-sm leading-relaxed max-w-md mb-5" style={{ color: 'var(--fg-ink-muted)' }}>{mechanicIntro}</p>
        <button onClick={onOpenMechanic} className="px-6 py-3 text-[12px] uppercase tracking-[0.08em] font-bold hover:opacity-80 transition-opacity" style={{ background: 'var(--fg-ink)', color: 'var(--fg-bg)' }}>
          Begin
        </button>
      </section>
    </div>
  )
}
