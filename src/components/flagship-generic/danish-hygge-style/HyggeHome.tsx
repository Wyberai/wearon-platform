'use client'

import Link from 'next/link'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'
import { useFlagshipCart } from '@/lib/flagship/cart-context'

// A faithful clone of Tekla's real homepage: a split two-panel hero —
// one side pure negative space, one side a full photo — each captioned
// bottom-left, followed by a stream of full-bleed named product blocks
// captioned the same way (their real "Calder Plaid fringed blanket" /
// "Kodiak Stripes classic bathrobe" pattern), matching this brand's
// own candlelit-neutral, soft-knit catalog.
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

function NamedBlock({ img, label, href }: { img?: string; label: string; href: string }) {
  return (
    <Link href={href} className="relative block aspect-[16/10] md:aspect-[21/9] overflow-hidden group">
      {img && <img src={img} alt={label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.35), transparent 45%)' }} />
      <p className="absolute bottom-4 left-4 text-sm md:text-base" style={{ color: 'white' }}>{label}</p>
    </Link>
  )
}

export function HyggeHome({ brand, products, mechanicLabel, mechanicIntro, onOpenMechanic }: { brand: ThemeBrand; products: ThemeProduct[]; mechanicLabel: string; mechanicIntro: string; onOpenMechanic: () => void }) {
  const slug = brand.slug
  const heroImg = products[4]?.image

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'ClothingStore', name: brand.name, description: brand.description }) }} />

      {/* Split two-panel hero — negative space + photo, both bottom-left captioned */}
      <section className="grid grid-cols-1 md:grid-cols-2">
        <div className="relative aspect-[4/5] md:aspect-auto md:h-[64vh] flex items-end p-5" style={{ background: 'var(--fg-card)' }}>
          <p className="text-sm" style={{ color: 'var(--fg-ink-dim)' }}>{brand.tagline}</p>
        </div>
        <div className="relative aspect-[4/5] md:aspect-auto md:h-[64vh]">
          {heroImg && <img src={heroImg} alt="" className="w-full h-full object-cover" />}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.3), transparent 40%)' }} />
          <p className="absolute bottom-5 left-5 text-sm" style={{ color: 'white' }}>{brand.categories[0] ?? 'New arrivals'}</p>
        </div>
      </section>

      {/* Stream of named product blocks */}
      <section className="flex flex-col gap-1 py-1" style={{ background: 'var(--fg-line)' }}>
        {products.map(p => (
          <NamedBlock key={p.id} img={p.image} label={p.name} href={`/store/${slug}/product/${p.slug}`} />
        ))}
      </section>

      <section className="px-6 md:px-10 py-16 border-t text-center" style={{ borderColor: 'var(--fg-line)' }}>
        <h2 className="text-sm mb-3" style={{ color: 'var(--fg-ink)' }}>{mechanicLabel}</h2>
        <p className="text-sm leading-relaxed max-w-md mx-auto mb-5" style={{ color: 'var(--fg-ink-muted)' }}>{mechanicIntro}</p>
        <button onClick={onOpenMechanic} className="px-6 py-3 text-[12px] uppercase tracking-[0.06em] font-semibold hover:opacity-80 transition-opacity" style={{ background: 'var(--fg-ink)', color: 'var(--fg-bg)' }}>
          Join
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
