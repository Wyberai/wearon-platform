'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'
import { useFlagshipCart } from '@/lib/flagship/cart-context'

// Modeled on aimeleondore.com's real homepage — NOT a lifestyle hero photo
// with a headline. Their pattern: full-bleed, tightly-cropped macro product
// photography stacked in tall sections with no text overlay at all, then a
// plain product grid underneath. Quiet, archive-like, product-forward —
// the opposite of every other Generic* home's centered-headline treatment.
function GridCard({ p, slug }: { p: ThemeProduct; slug: string }) {
  const { addLine } = useFlagshipCart()
  return (
    <Link href={`/store/${slug}/product/${p.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden" style={{ background: 'var(--fg-card)' }}>
        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
        <button
          onClick={e => { e.preventDefault(); e.stopPropagation(); addLine(p, p.sizes[0] ?? '', p.colors[0] ?? '', 1) }}
          className="absolute bottom-0 left-0 right-0 py-2.5 text-[10px] tracking-[0.12em] uppercase text-center opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: 'var(--fg-ink)', color: 'var(--fg-bg)' }}
        >
          Quick Add
        </button>
      </div>
      <p className="mt-2.5 text-[12px] tracking-wide uppercase" style={{ color: 'var(--fg-ink)' }}>{p.name}</p>
      <p className="text-[12px]" style={{ color: 'var(--fg-ink-dim)' }}>
        {p.originalPrice && <span className="line-through mr-1.5">${p.originalPrice.toLocaleString('en-IN')}</span>}
        ${p.price.toLocaleString('en-IN')}
      </p>
    </Link>
  )
}

export function NycGrungeHome({ brand, products, mechanicLabel, onOpenMechanic }: { brand: ThemeBrand; products: ThemeProduct[]; mechanicLabel: string; onOpenMechanic: () => void }) {
  const slug = brand.slug
  const featured = useMemo(() => products.slice(0, 2), [products])

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'ClothingStore', name: brand.name, description: brand.description }) }} />

      {/* Full-bleed macro product shots, stacked, no text — the actual
          Aimé Leon Dore pattern, not a lifestyle-photo-with-headline hero */}
      {featured.map(p => (
        <Link key={p.id} href={`/store/${slug}/product/${p.slug}`} className="block relative h-[70vh] min-h-[420px] overflow-hidden">
          <img src={p.image} alt="" className="w-full h-full object-cover" />
        </Link>
      ))}

      <section className="px-6 md:px-10 py-8 text-center border-b" style={{ borderColor: 'var(--fg-line)' }}>
        <p className="text-[13px] tracking-[0.1em] uppercase" style={{ color: 'var(--fg-ink-muted)' }}>{brand.tagline}</p>
      </section>

      <section className="px-6 md:px-10 py-14">
        <div className="flex items-end justify-between mb-8">
          <h2 className="text-sm tracking-[0.15em] uppercase" style={{ color: 'var(--fg-ink)', fontWeight: 700 }}>All Products</h2>
          <Link href={`/store/${slug}/shop`} className="text-[11px] tracking-wide uppercase underline underline-offset-4 hover:opacity-60 transition-opacity" style={{ color: 'var(--fg-ink)' }}>
            shop all
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.map(p => <GridCard key={p.id} p={p} slug={slug} />)}
        </div>
      </section>

      <section className="px-6 md:px-10 py-16 border-t text-center" style={{ borderColor: 'var(--fg-line)' }}>
        <p className="text-[11px] tracking-[0.15em] uppercase mb-3" style={{ color: 'var(--fg-ink-dim)' }}>Not sure where to start?</p>
        <h2 className="text-xl md:text-2xl mb-5 tracking-wide uppercase" style={{ fontWeight: 700 }}>{mechanicLabel}</h2>
        <button onClick={onOpenMechanic} className="px-6 py-3 text-[11px] tracking-[0.15em] uppercase" style={{ background: 'var(--fg-ink)', color: 'var(--fg-bg)' }}>
          {mechanicLabel}
        </button>
      </section>
    </div>
  )
}
