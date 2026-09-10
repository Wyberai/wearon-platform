'use client'

import Link from 'next/link'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'
import { useFlagshipCart } from '@/lib/flagship/cart-context'

// A faithful clone of loropiana.com's real homepage: a full-bleed
// campaign hero with a bottom-positioned white card (title + two
// "— Category —" links styled with em-dashes, no big type), then "The
// Look" — a full outfit broken into named, material-tagged pieces — a
// fabric/craft editorial passage, a three-item service bar, and a
// dated "Inside" magazine carousel, all before the flat product grid.
const MATERIALS: Record<string, string> = {
  'Double-Breasted Blazer': 'Wool, Mohair',
  'Pleated Wool Trouser': 'Virgin Wool',
  'Silk Charmeuse Shirt': 'Silk',
  'Printed Silk Camisole': 'Silk, Cotton',
  'Cashmere Overcoat': 'Cashmere',
  'Suede Trench': 'Suede, Cotton',
  'Gold Chain Belt': 'Brass, Leather',
  'Signet Cuff': 'Gold Vermeil',
}

const INSIDE = [
  { title: 'The Loom in Solomeo', when: '4 days ago', body: `Our mill still runs the same slow water-powered looms it opened with — a deliberate ceiling on how much cloth can exist in a season. We have never asked it to run faster. The wait is the quality control.` },
  { title: 'A Note on Undyed Wool', when: '2 weeks ago', body: `The greige stage — wool before any dye touches it — is where a mill's real character shows. Ours is chosen for handle and drape first, colour a distant third. Most of what we reject never reaches a customer's eye; it simply never becomes cloth.` },
  { title: 'Casa Sartoria at Pitti Uomo', when: '3 weeks ago', body: `We showed the Autumn cut in Florence's Fortezza da Basso this year, on a stand built from the same reclaimed walnut as our Milan atelier's fitting room. Buyers kept asking where the fabric was sourced. That question is the entire brand strategy.` },
]

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
      <p className="text-[11px] uppercase tracking-[0.04em] mb-0.5" style={{ color: 'var(--fg-accent)' }}>{MATERIALS[p.name] ?? ''}</p>
      <p className="text-[13px]" style={{ color: 'var(--fg-ink-dim)' }}>${p.price.toLocaleString('en-IN')}</p>
    </Link>
  )
}

export function SartoriaHome({ brand, products, mechanicLabel, mechanicIntro, onOpenMechanic }: { brand: ThemeBrand; products: ThemeProduct[]; mechanicLabel: string; mechanicIntro: string; onOpenMechanic: () => void }) {
  const slug = brand.slug
  const categories = brand.categories.length ? brand.categories : Array.from(new Set(products.map(p => p.category)))
  const heroImg = products[0]?.image
  const primary = categories[0] ?? 'Tailored Suiting'
  const secondary = categories[2] ?? categories[1] ?? 'Luxury Outerwear'

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'ClothingStore', name: brand.name, description: brand.description }) }} />

      {/* Full-bleed hero, white card with em-dash category links — no headline type */}
      <section className="relative h-[75vh] min-h-[480px]">
        {heroImg && <img src={heroImg} alt="" className="w-full h-full object-cover" />}
        <div className="absolute bottom-8 left-6 md:left-10 px-8 py-8 max-w-xs" style={{ background: 'var(--fg-bg)' }}>
          <h1 className="text-lg mb-5" style={{ color: 'var(--fg-ink)' }}>{brand.tagline}</h1>
          <div className="flex flex-col gap-3">
            <Link href={`/store/${slug}/shop?category=${encodeURIComponent(primary)}`} className="text-sm hover:opacity-60 transition-opacity" style={{ color: 'var(--fg-accent)' }}>
              &mdash; {primary} &mdash;
            </Link>
            <Link href={`/store/${slug}/shop?category=${encodeURIComponent(secondary)}`} className="text-sm hover:opacity-60 transition-opacity" style={{ color: 'var(--fg-accent)' }}>
              &mdash; {secondary} &mdash;
            </Link>
          </div>
        </div>
      </section>

      {/* The Look — a full outfit, named + material-tagged pieces */}
      <section className="px-6 md:px-10 py-16 border-t" style={{ borderColor: 'var(--fg-line)' }}>
        <h2 className="text-sm uppercase tracking-[0.1em] mb-10 text-center" style={{ color: 'var(--fg-ink)' }}>The Look</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {products.slice(0, 4).map(p => (
            <Link key={p.id} href={`/store/${slug}/product/${p.slug}`} className="group block text-center">
              <div className="relative aspect-[3/4] overflow-hidden mb-3" style={{ background: 'var(--fg-card)' }}>
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
              </div>
              <p className="text-[13px]" style={{ color: 'var(--fg-ink)' }}>{p.name}</p>
              <p className="text-[11px] uppercase tracking-[0.04em]" style={{ color: 'var(--fg-accent)' }}>{MATERIALS[p.name] ?? ''}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Fabric/craft editorial passage */}
      <section className="px-6 md:px-10 py-20 max-w-2xl mx-auto text-center border-t" style={{ borderColor: 'var(--fg-line)' }}>
        <p className="text-[11px] uppercase tracking-[0.15em] mb-4" style={{ color: 'var(--fg-ink-dim)' }}>Emblems of Quiet Craft</p>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--fg-ink-muted)' }}>
          A shoulder is only as sharp as the hand that padded it. Ours are built by patternmakers who trained in Milan's tailoring houses before the ready-to-wear label existed at all, and every cut still passes through the same three fittings a bespoke commission would receive &mdash; even at scale, even on a deadline.
        </p>
      </section>

      {/* Service bar */}
      <section className="px-6 md:px-10 py-8 border-t border-b grid grid-cols-1 md:grid-cols-3 gap-6 text-center" style={{ borderColor: 'var(--fg-line)' }}>
        <p className="text-[13px]" style={{ color: 'var(--fg-ink)' }}>Complimentary Alterations</p>
        <p className="text-[13px]" style={{ color: 'var(--fg-ink)' }}>Free Returns &amp; Exchange</p>
        <p className="text-[13px]" style={{ color: 'var(--fg-ink)' }}>Book a Private Fitting In Store</p>
      </section>

      {/* Inside Casa Sartoria — dated magazine carousel */}
      <section className="px-6 md:px-10 py-16 border-b" style={{ borderColor: 'var(--fg-line)' }}>
        <h2 className="text-sm uppercase tracking-[0.1em] mb-10" style={{ color: 'var(--fg-ink)' }}>Inside {brand.name}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {INSIDE.map((article, i) => (
            <div key={article.title}>
              <div className="relative aspect-[4/3] overflow-hidden mb-4" style={{ background: 'var(--fg-card)' }}>
                {products[i + 4]?.image && <img src={products[i + 4].image} alt="" className="w-full h-full object-cover" />}
              </div>
              <p className="text-[11px] uppercase tracking-[0.08em] mb-2" style={{ color: 'var(--fg-ink-dim)' }}>{article.when}</p>
              <h3 className="text-base mb-3" style={{ color: 'var(--fg-ink)' }}>{article.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--fg-ink-muted)' }}>{article.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-10 py-16">
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
