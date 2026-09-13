'use client'

import Link from 'next/link'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'
import { useFlagshipCart } from '@/lib/flagship/cart-context'

// A faithful clone of the real Bauhaus-Shop's homepage: a big stacked
// display headline over a photo hero with a black pill "Discover now"
// CTA, a "Bestseller" product grid, a mission-statement passage
// ("Design for the good.") with a "Learn more" link, and a spotlight
// block naming a design principle in this brand's own original voice
// (not the real museum's featured historical object).
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
          Add to cart
        </button>
      </div>
      <p className="text-[13px]" style={{ color: 'var(--fg-ink)' }}>{p.name}</p>
      <p className="text-[13px]" style={{ color: 'var(--fg-ink-dim)' }}>${p.price.toLocaleString('en-IN')}</p>
    </Link>
  )
}

export function WerkstattHome({ brand, products, mechanicLabel, mechanicIntro, onOpenMechanic }: { brand: ThemeBrand; products: ThemeProduct[]; mechanicLabel: string; mechanicIntro: string; onOpenMechanic: () => void }) {
  const slug = brand.slug
  const heroImg = products[0]?.image

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'ClothingStore', name: brand.name, description: brand.description }) }} />

      {/* Big stacked headline + photo hero + pill CTA */}
      <section className="grid grid-cols-1 md:grid-cols-2">
        <div className="px-6 md:px-10 py-14 flex flex-col justify-center order-2 md:order-1" style={{ background: 'var(--fg-card)' }}>
          <p className="text-xs uppercase tracking-[0.08em] mb-3" style={{ color: 'var(--fg-ink-dim)' }}>Form follows function.</p>
          <h1 className="text-4xl md:text-5xl leading-[1.05]" style={{ color: 'var(--fg-ink)', fontWeight: 800 }}>
            Primary<br />shapes,<br />worn.
          </h1>
          <p className="text-sm mt-4 max-w-xs" style={{ color: 'var(--fg-ink-muted)' }}>{brand.tagline}</p>
          <Link href={`/store/${slug}/shop`} className="inline-block mt-6 px-6 py-3 text-[12px] uppercase tracking-[0.06em] font-semibold rounded-full w-fit hover:opacity-80 transition-opacity" style={{ background: 'var(--fg-ink)', color: 'var(--fg-bg)' }}>
            Discover now
          </Link>
        </div>
        <div className="relative aspect-[4/5] md:aspect-auto order-1 md:order-2">
          {heroImg && <img src={heroImg} alt="" className="w-full h-full object-cover" />}
        </div>
      </section>

      {/* Bestseller grid */}
      <section className="px-6 md:px-10 py-14 border-t" style={{ borderColor: 'var(--fg-line)' }}>
        <p className="text-xs uppercase tracking-[0.08em] mb-6" style={{ color: 'var(--fg-ink-dim)' }}>Bestseller</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
          {products.map(p => <GridCard key={p.id} p={p} slug={slug} />)}
        </div>
      </section>

      {/* Mission-statement passage */}
      <section className="px-6 md:px-10 py-16 border-t text-center max-w-2xl mx-auto" style={{ borderColor: 'var(--fg-line)' }}>
        <h2 className="text-2xl mb-3" style={{ color: 'var(--fg-ink)', fontWeight: 700 }}>Design for the good.</h2>
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--fg-ink-muted)' }}>
          Every piece here follows the same rule the workshop set in 1919: strip a shape down until only the function is left, then let the color do the talking. A circle is a circle. A square is a square. Nothing is decorated that doesn&rsquo;t need to be.
        </p>
        <Link href={`/store/${slug}/shop`} className="text-sm uppercase tracking-[0.06em] font-semibold border-b-2 pb-1 hover:opacity-70 transition-opacity" style={{ color: 'var(--fg-ink)', borderColor: 'var(--fg-ink)' }}>
          Learn more
        </Link>
      </section>

      <section className="px-6 md:px-10 py-16 border-t text-center" style={{ borderColor: 'var(--fg-line)' }}>
        <h2 className="text-sm mb-3" style={{ color: 'var(--fg-ink)' }}>{mechanicLabel}</h2>
        <p className="text-sm leading-relaxed max-w-md mx-auto mb-5" style={{ color: 'var(--fg-ink-muted)' }}>{mechanicIntro}</p>
        <button onClick={onOpenMechanic} className="px-6 py-3 text-[12px] uppercase tracking-[0.06em] font-semibold rounded-full hover:opacity-80 transition-opacity" style={{ background: 'var(--fg-accent)', color: 'var(--fg-bg)' }}>
          Begin
        </button>
      </section>
    </div>
  )
}
