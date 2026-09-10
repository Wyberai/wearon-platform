'use client'

import Link from 'next/link'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'
import { useFlagshipCart } from '@/lib/flagship/cart-context'

// A faithful clone of draperjames.com's real homepage: a full-bleed
// hero built around a single warm pull-quote headline, an "In with
// the New" narrative passage, the flat grid, and a founder's-story
// section closing with a quoted family saying — their real pattern,
// with an original voice instead of a real person's name.
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
        {p.tags?.includes('new') && (
          <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] uppercase tracking-[0.05em] font-bold" style={{ background: 'var(--fg-bg)', color: 'var(--fg-ink)' }}>New</span>
        )}
      </div>
      <p className="text-[13px]" style={{ color: 'var(--fg-ink)' }}>{p.name}</p>
      <p className="text-[13px]" style={{ color: 'var(--fg-ink-dim)' }}>${p.price.toLocaleString('en-IN')}</p>
    </Link>
  )
}

export function MagnoliaHome({ brand, products, mechanicLabel, mechanicIntro, onOpenMechanic }: { brand: ThemeBrand; products: ThemeProduct[]; mechanicLabel: string; mechanicIntro: string; onOpenMechanic: () => void }) {
  const slug = brand.slug
  const heroImg = products[0]?.image

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'ClothingStore', name: brand.name, description: brand.description }) }} />

      {/* Full-bleed hero, single pull-quote headline */}
      <section className="relative h-[65vh] min-h-[420px] flex items-end justify-center text-center">
        {heroImg && <img src={heroImg} alt="" className="absolute inset-0 w-full h-full object-cover" />}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5), rgba(0,0,0,0))' }} />
        <div className="relative pb-14 px-6">
          <h1 className="text-2xl md:text-4xl text-white mb-5 italic" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.4)' }}>A Love Letter to Southern Style</h1>
          <Link href={`/store/${slug}/shop`} className="inline-block px-6 py-3 text-[12px] uppercase tracking-[0.06em] font-semibold" style={{ background: 'var(--fg-bg)', color: 'var(--fg-ink)' }}>
            Shop the Collection
          </Link>
        </div>
      </section>

      {/* "In with the New" narrative passage */}
      <section className="px-6 md:px-10 py-16 max-w-2xl mx-auto text-center">
        <p className="text-[11px] uppercase tracking-[0.15em] mb-4" style={{ color: 'var(--fg-ink-dim)' }}>In with the New</p>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--fg-ink-muted)' }}>
          The beginning of something beautiful. Where garden-party manners meet a little city polish. New pieces that travel well &mdash; from the porch to the ballroom and everywhere charming in between. {brand.tagline}
        </p>
      </section>

      <section className="px-6 md:px-10 py-14 border-t" style={{ borderColor: 'var(--fg-line)' }}>
        <h2 className="text-sm uppercase tracking-[0.08em] mb-8 text-center" style={{ color: 'var(--fg-ink)' }}>New Arrivals</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
          {products.map(p => <GridCard key={p.id} p={p} slug={slug} />)}
        </div>
      </section>

      {/* Founder's-story section — original voice, no real person's name */}
      <section className="px-6 md:px-10 py-20 max-w-2xl mx-auto text-center border-t" style={{ borderColor: 'var(--fg-line)' }}>
        <p className="text-[11px] uppercase tracking-[0.15em] mb-4" style={{ color: 'var(--fg-ink-dim)' }}>Our Story</p>
        <p className="text-sm leading-relaxed italic" style={{ color: 'var(--fg-ink-muted)' }}>
          &ldquo;I started {brand.name} because I wanted clothes that felt like the women who raised me &mdash; special but not precious, easy to put together, polished without trying too hard. My grandmother kept a saying above her sewing table my whole childhood: &lsquo;Dress like you mean it, and the rest will follow.&rsquo; That's still the only rule here.&rdquo;
        </p>
      </section>

      <section className="px-6 md:px-10 py-16 border-t" style={{ borderColor: 'var(--fg-line)' }}>
        <h2 className="text-sm mb-3" style={{ color: 'var(--fg-ink)' }}>{mechanicLabel}</h2>
        <p className="text-sm leading-relaxed max-w-md mb-5" style={{ color: 'var(--fg-ink-muted)' }}>{mechanicIntro}</p>
        <button onClick={onOpenMechanic} className="px-6 py-3 text-[12px] uppercase tracking-[0.06em] font-semibold hover:opacity-80 transition-opacity" style={{ background: 'var(--fg-ink)', color: 'var(--fg-bg)' }}>
          Begin
        </button>
      </section>
    </div>
  )
}
