'use client'

import Link from 'next/link'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'
import { useFlagshipCart } from '@/lib/flagship/cart-context'

// A faithful clone of norseprojects.com's real homepage structure:
//   1. Full-bleed tall hero photo — no headline, no CTA button, just a
//      small caption + "Explore" text link bottom-left.
//   2. A sequence of asymmetric editorial sections, each pairing a large
//      image with generous negative space, a lowercase category label,
//      and a genuine long-form paragraph about materials/construction
//      (real editorial copywriting, not marketing headlines).
//   3. A full-bleed two-image detail pair (close-up crops, minimal text).
//   4. A plain product grid.
// This is the opposite of every other Generic* home: no big typography
// moment anywhere, the writing carries the brand instead.
const EDITORIAL: Record<string, string> = {
  'Charcoal Outer': `${''}outerwear spans wool-blend overcoats, storm-sealed trenches and structured shearling — cut for cities where the wind doesn't ask permission. Raglan sleeves and welted seams reference archetypal military and equestrian tailoring, finished with horn or matte-black buttons. Fabrics run dense and felted, chosen to hold a silhouette through a long, grey winter.`,
  'Structured Knits': `${''}knitwear is worked in merino and lambswool, ribbed dense enough to read as armor rather than layering. High necks and structured shoulders keep the line clean under a coat; nothing here is meant to slouch. Yarn-dyed navies and near-blacks are chosen to hold their depth indoors and out.`,
  'Noir Denim': `${''}denim is cut straight and dry, rinsed to a slate that reads black from across a room. Riveted pockets and a raw selvedge nod to the archetypal jean without chasing distress for its own sake. Ink-wash jackets are garment-dyed after construction, so the fade that comes will be yours alone.`,
  'Muted Accents': `${''}accents are worked in brushed steel and matte leather — nothing polished enough to catch the light unless you want it to. A cuff, a belt, one considered piece finishes what the rest of the wardrobe already said quietly.`,
}

function EditorialSection({ brand, category, image, index, slug }: { brand: string; category: string; image?: string; index: number; slug: string }) {
  const reversed = index % 2 === 1
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 min-h-[70vh]">
      <div className={`flex flex-col justify-center px-6 md:px-16 py-16 ${reversed ? 'md:order-2' : ''}`}>
        <p className="text-sm mb-5" style={{ color: 'var(--fg-ink)' }}>{category}</p>
        <p className="text-sm leading-relaxed max-w-md mb-6" style={{ color: 'var(--fg-ink-muted)' }}>
          <span style={{ textTransform: 'capitalize' }}>{brand}</span> {EDITORIAL[category] ?? ''}
        </p>
        <Link href={`/store/${slug}/shop?category=${encodeURIComponent(category)}`} className="text-sm underline underline-offset-4 hover:opacity-60 transition-opacity w-fit" style={{ color: 'var(--fg-ink)' }}>
          Explore
        </Link>
      </div>
      <div className={`relative min-h-[400px] ${reversed ? 'md:order-1' : ''}`} style={{ background: 'var(--fg-card)' }}>
        {image && <img src={image} alt={category} className="absolute inset-0 w-full h-full object-cover" />}
      </div>
    </section>
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
          className="absolute bottom-0 left-0 right-0 py-2.5 text-[11px] tracking-[0.1em] uppercase text-center opacity-0 group-hover:opacity-100 transition-opacity"
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

export function NoirHome({ brand, products, mechanicLabel, mechanicIntro, onOpenMechanic }: { brand: ThemeBrand; products: ThemeProduct[]; mechanicLabel: string; mechanicIntro: string; onOpenMechanic: () => void }) {
  const slug = brand.slug
  const heroImage = products[0]?.image
  const categories = brand.categories.length ? brand.categories : Array.from(new Set(products.map(p => p.category)))

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'ClothingStore', name: brand.name, description: brand.description }) }} />

      {/* Hero — no headline, no CTA, just a quiet caption + Explore link.
          Negative margin pulls it up under the sticky transparent header
          without needing the header itself to be position:fixed (which
          would otherwise require compensating padding on every other
          route this Shell also renders — shop/PDP/checkout). */}
      <div className="relative h-screen min-h-[600px] overflow-hidden -mt-16">

        {heroImage && <img src={heroImage} alt="" className="w-full h-full object-cover" />}
        <div className="absolute bottom-10 left-6 md:left-10">
          <p className="text-sm mb-2" style={{ color: '#fff', textShadow: '0 1px 6px rgba(0,0,0,0.5)' }}>Introducing — {brand.name}</p>
          <Link href={`/store/${slug}/shop`} className="text-sm underline underline-offset-4" style={{ color: '#fff', textShadow: '0 1px 6px rgba(0,0,0,0.5)' }}>
            Explore
          </Link>
        </div>
      </div>

      {categories.map((c, i) => (
        <EditorialSection key={c} brand={brand.name} category={c} image={products.find(p => p.category === c)?.image} index={i} slug={slug} />
      ))}

      {/* Full-bleed detail pair */}
      <div className="grid grid-cols-2">
        <div className="relative aspect-[4/5] md:aspect-auto md:h-[60vh]" style={{ background: 'var(--fg-card)' }}>
          {products[4]?.image && <img src={products[4].image} alt="" className="absolute inset-0 w-full h-full object-cover" />}
        </div>
        <div className="relative aspect-[4/5] md:aspect-auto md:h-[60vh]" style={{ background: 'var(--fg-card)' }}>
          {products[6]?.image && <img src={products[6].image} alt="" className="absolute inset-0 w-full h-full object-cover" />}
        </div>
      </div>

      <section className="px-6 md:px-10 py-16">
        <p className="text-sm mb-8" style={{ color: 'var(--fg-ink)' }}>All Products</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
          {products.map(p => <GridCard key={p.id} p={p} slug={slug} />)}
        </div>
      </section>

      <section className="px-6 md:px-16 py-20 border-t" style={{ borderColor: 'var(--fg-line)' }}>
        <p className="text-sm mb-2" style={{ color: 'var(--fg-ink)' }}>{mechanicLabel}</p>
        <p className="text-sm leading-relaxed max-w-md mb-6" style={{ color: 'var(--fg-ink-muted)' }}>
          {mechanicIntro}
        </p>
        <button onClick={onOpenMechanic} className="text-sm underline underline-offset-4 hover:opacity-60 transition-opacity" style={{ color: 'var(--fg-ink)' }}>
          Explore
        </button>
      </section>
    </div>
  )
}
