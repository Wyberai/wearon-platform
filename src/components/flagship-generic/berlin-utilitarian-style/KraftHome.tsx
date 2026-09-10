'use client'

import Link from 'next/link'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'
import { useFlagshipCart } from '@/lib/flagship/cart-context'

// A faithful clone of acrnm.com's real homepage: no hero image at
// all — the dense product grid IS the homepage, and each tile is
// labeled with a cryptic alphanumeric code instead of a name,
// mirroring ACRONYM's real J121-E / SP62A-M product-code convention.
const SUFFIXES = ['DS', 'M', 'E', 'GT', 'KI', 'WS', 'PS', 'AK']

function codeFor(name: string, i: number): string {
  const letters = name.replace(/[^A-Za-z]/g, '').slice(0, 2).toUpperCase()
  const num = 10 + i * 7
  return `${letters}${num}-${SUFFIXES[i % SUFFIXES.length]}`
}

function GridCard({ p, slug, code }: { p: ThemeProduct; slug: string; code: string }) {
  const { addLine } = useFlagshipCart()
  return (
    <Link href={`/store/${slug}/product/${p.slug}`} className="group block">
      <div className="relative aspect-square overflow-hidden mb-2" style={{ background: 'var(--fg-card)' }}>
        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
        <button
          onClick={e => { e.preventDefault(); e.stopPropagation(); addLine(p, p.sizes[0] ?? '', p.colors[0] ?? '', 1) }}
          className="absolute bottom-2 left-2 right-2 py-2 text-[10px] uppercase tracking-[0.08em] text-center opacity-0 group-hover:opacity-100 transition-opacity font-bold"
          style={{ background: 'var(--fg-ink)', color: 'var(--fg-bg)' }}
        >
          Add
        </button>
      </div>
      <p className="text-[12px] font-mono tracking-[0.02em]" style={{ color: 'var(--fg-ink)' }}>{code}</p>
      <p className="text-[11px]" style={{ color: 'var(--fg-ink-dim)' }}>{p.name} &mdash; ${p.price.toLocaleString('en-IN')}</p>
    </Link>
  )
}

export function KraftHome({ brand, products, mechanicLabel, mechanicIntro, onOpenMechanic }: { brand: ThemeBrand; products: ThemeProduct[]; mechanicLabel: string; mechanicIntro: string; onOpenMechanic: () => void }) {
  const slug = brand.slug
  const categories = brand.categories.length ? brand.categories : Array.from(new Set(products.map(p => p.category)))

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'ClothingStore', name: brand.name, description: brand.description }) }} />

      {/* Terse technical statement, no hero image — straight to the grid */}
      <section className="px-4 md:px-8 py-6 border-b" style={{ borderColor: 'var(--fg-line)' }}>
        <p className="text-[13px] font-mono" style={{ color: 'var(--fg-ink-muted)' }}>{brand.tagline}</p>
      </section>

      {/* Category filter chips — plain text, function-first */}
      <section className="px-4 md:px-8 py-4 flex flex-wrap gap-x-6 gap-y-2 border-b" style={{ borderColor: 'var(--fg-line)' }}>
        {categories.map(c => (
          <Link key={c} href={`/store/${slug}/shop?category=${encodeURIComponent(c)}`} className="text-[11px] uppercase tracking-[0.06em] font-semibold hover:opacity-60 transition-opacity" style={{ color: 'var(--fg-ink)' }}>
            {c}
          </Link>
        ))}
      </section>

      {/* Dense product grid — the entire homepage, ACRONYM-style */}
      <section className="px-4 md:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-8">
          {products.map((p, i) => <GridCard key={p.id} p={p} slug={slug} code={codeFor(p.name, i)} />)}
        </div>
      </section>

      <section className="px-4 md:px-8 py-16 border-t" style={{ borderColor: 'var(--fg-line)' }}>
        <h2 className="text-[13px] uppercase font-bold font-mono mb-3" style={{ color: 'var(--fg-ink)' }}>{'>'} {mechanicLabel}</h2>
        <p className="text-sm leading-relaxed max-w-md mb-5" style={{ color: 'var(--fg-ink-muted)' }}>{mechanicIntro}</p>
        <button onClick={onOpenMechanic} className="px-6 py-3 text-[11px] uppercase tracking-[0.08em] font-bold" style={{ background: 'var(--fg-ink)', color: 'var(--fg-bg)' }}>
          Run
        </button>
      </section>
    </div>
  )
}
