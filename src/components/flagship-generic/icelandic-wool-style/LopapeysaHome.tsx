'use client'

import Link from 'next/link'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'
import { useFlagshipCart } from '@/lib/flagship/cart-context'

// A faithful clone of farmersmarket.is' real homepage: a full-bleed
// campaign-photo hero with a star-badge crest icon overlaid on one side
// and a stacked wordmark on the other, a category-tile grid styled as
// bold-labeled flatlays, and a founder-voice brand passage (an original
// quote in similar spirit to the real one, not a reproduction of it).
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

function StarBadge() {
  return (
    <svg width="72" height="72" viewBox="0 0 100 100" fill="none" aria-hidden>
      <circle cx="50" cy="50" r="47" stroke="white" strokeWidth="1.5" />
      <path d="M50 20 L57 43 L80 43 L61 57 L68 80 L50 66 L32 80 L39 57 L20 43 L43 43 Z" stroke="white" strokeWidth="1.5" fill="none" />
    </svg>
  )
}

export function LopapeysaHome({ brand, products, mechanicLabel, mechanicIntro, onOpenMechanic }: { brand: ThemeBrand; products: ThemeProduct[]; mechanicLabel: string; mechanicIntro: string; onOpenMechanic: () => void }) {
  const slug = brand.slug
  const categories = brand.categories.length ? brand.categories : Array.from(new Set(products.map(p => p.category)))
  const heroImg = products[4]?.image

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'ClothingStore', name: brand.name, description: brand.description }) }} />

      {/* Full-bleed campaign hero: star-badge crest + stacked wordmark */}
      <section className="relative h-[72vh] min-h-[460px] flex items-end">
        {heroImg && <img src={heroImg} alt="" className="absolute inset-0 w-full h-full object-cover" />}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0.05) 50%)' }} />
        <div className="relative w-full px-6 md:px-10 pb-10 flex items-end justify-between">
          <div style={{ color: 'white' }}><StarBadge /></div>
          <div className="text-right leading-none">
            <p className="text-3xl md:text-5xl uppercase" style={{ color: 'white', fontWeight: 700, letterSpacing: '0.02em' }}>{brand.name.split(' ')[0]}</p>
            <p className="text-xs md:text-sm uppercase tracking-[0.35em] mt-2" style={{ color: 'white', opacity: 0.85 }}>Iceland</p>
          </div>
        </div>
      </section>

      {/* Category tile grid — bold white labels over flatlays */}
      <section className="px-6 md:px-10 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {categories.map(c => {
            const img = products.find(p => p.category === c)?.image
            return (
              <Link key={c} href={`/store/${slug}/shop?category=${encodeURIComponent(c)}`} className="group relative block aspect-[4/5] overflow-hidden">
                {img && <img src={img} alt={c} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />}
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent 60%)' }} />
                <p className="absolute bottom-4 left-4 text-sm md:text-base uppercase font-bold tracking-[0.04em]" style={{ color: 'white' }}>{c}</p>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Founder-voice brand passage — original quote, similar spirit to the real site's, not a reproduction */}
      <section className="px-6 md:px-10 py-16 max-w-2xl mx-auto text-center border-t" style={{ borderColor: 'var(--fg-line)' }}>
        <p className="text-lg md:text-xl leading-relaxed italic mb-4" style={{ color: 'var(--fg-ink)' }}>
          &ldquo;We knit the way the weather taught us to &mdash; thick where the wind cuts, loose where the fire is close. Nothing about a lopapeysa is decorative. It is all function, worn as a pattern.&rdquo;
        </p>
        <p className="text-xs uppercase tracking-[0.1em]" style={{ color: 'var(--fg-ink-dim)' }}>&mdash; {brand.name}, founding knitters</p>
      </section>

      <section className="px-6 md:px-10 py-16 border-t" style={{ borderColor: 'var(--fg-line)' }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
          {products.map(p => <GridCard key={p.id} p={p} slug={slug} />)}
        </div>
      </section>

      <section className="px-6 md:px-10 py-16 border-t text-center" style={{ borderColor: 'var(--fg-line)' }}>
        <h2 className="text-sm mb-3" style={{ color: 'var(--fg-ink)' }}>{mechanicLabel}</h2>
        <p className="text-sm leading-relaxed max-w-md mx-auto mb-5" style={{ color: 'var(--fg-ink-muted)' }}>{mechanicIntro}</p>
        <button onClick={onOpenMechanic} className="px-6 py-3 text-[12px] uppercase tracking-[0.06em] font-semibold hover:opacity-80 transition-opacity" style={{ background: 'var(--fg-ink)', color: 'var(--fg-bg)' }}>
          Join
        </button>
      </section>
    </div>
  )
}
