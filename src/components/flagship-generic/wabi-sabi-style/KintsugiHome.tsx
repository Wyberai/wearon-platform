'use client'

import Link from 'next/link'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'
import { useFlagshipCart } from '@/lib/flagship/cart-context'

// A faithful clone of toa.st's real homepage rhythm: a two-column split
// hero (no big headline — two small boxed text-links), a seasonal poetic
// editorial passage, a craft/maker "Magazine" section with dated real
// articles, then a plain grid. Reframed here around kintsugi — the
// philosophy the brand is literally named for.
const JOURNAL = [
  {
    title: 'The Art of the Visible Mend',
    category: 'MAKING & CRAFT',
    when: '3 days ago',
    body: `Kintsugi does not disguise a break — it dusts the crack in gold and asks you to look at it. The vessel is not returned to what it was; it becomes a record of what happened to it, and that record is treated as the more valuable object. We think about clothes the same way: a hem left raw, a seam left visible, a dye left uneven, is not a flaw to correct but a fact to keep.`,
  },
  {
    title: 'Notes from a Potter’s Studio in Bizen',
    category: 'ARTS & CULTURE',
    when: '1 week ago',
    body: `No glaze, no drawn pattern — a Bizen piece is shaped entirely by ash falling through a wood-fired kiln across four days. The potter cannot fully control the result and has stopped trying to. What returns is always slightly different from what went in, and that gap between intention and outcome is where the studio says the work actually happens.`,
  },
  {
    title: 'On Undyed Cloth',
    category: 'MATERIALS',
    when: '2 weeks ago',
    body: `Leaving linen undyed is not an absence of a decision — it is the decision. The fibre keeps the exact tone the flax grew in, one field to the next, one bolt to the next. Nothing here is trying to be consistent. It is trying to be honest about where it came from.`,
  },
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
      <p className="text-[13px]" style={{ color: 'var(--fg-ink-dim)' }}>${p.price.toLocaleString('en-IN')}</p>
    </Link>
  )
}

export function KintsugiHome({ brand, products, mechanicLabel, mechanicIntro, onOpenMechanic }: { brand: ThemeBrand; products: ThemeProduct[]; mechanicLabel: string; mechanicIntro: string; onOpenMechanic: () => void }) {
  const slug = brand.slug
  const categories = brand.categories.length ? brand.categories : Array.from(new Set(products.map(p => p.category)))
  const left = categories[0] ?? 'Undyed Layers'
  const right = categories[2] ?? categories[1] ?? 'Raw Hem Bottoms'
  const leftImg = products.find(p => p.category === left)?.image ?? products[0]?.image
  const rightImg = products.find(p => p.category === right)?.image ?? products[4]?.image

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'ClothingStore', name: brand.name, description: brand.description }) }} />

      {/* Split hero — two columns, no headline, small boxed text-link CTAs, exactly as toa.st does it */}
      <section className="grid grid-cols-1 md:grid-cols-2">
        <Link href={`/store/${slug}/shop?category=${encodeURIComponent(left)}`} className="group relative block h-[62vh] min-h-[420px] overflow-hidden">
          {leftImg && <img src={leftImg} alt={left} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />}
          <span className="absolute bottom-6 left-6 px-4 py-2 text-[12px] uppercase tracking-[0.1em] border" style={{ background: 'var(--fg-bg)', color: 'var(--fg-ink)', borderColor: 'var(--fg-ink)' }}>
            {left}
          </span>
        </Link>
        <Link href={`/store/${slug}/shop?category=${encodeURIComponent(right)}`} className="group relative block h-[62vh] min-h-[420px] overflow-hidden">
          {rightImg && <img src={rightImg} alt={right} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />}
          <span className="absolute bottom-6 left-6 px-4 py-2 text-[12px] uppercase tracking-[0.1em] border" style={{ background: 'var(--fg-bg)', color: 'var(--fg-ink)', borderColor: 'var(--fg-ink)' }}>
            {right}
          </span>
        </Link>
      </section>

      {/* Seasonal poetic editorial passage — the "Finding Balance" pattern */}
      <section className="px-6 md:px-10 py-20 max-w-2xl mx-auto text-center">
        <p className="text-[11px] uppercase tracking-[0.15em] mb-4" style={{ color: 'var(--fg-ink-dim)' }}>Kintsugi &mdash; The Golden Repair</p>
        <h2 className="text-2xl md:text-3xl mb-6" style={{ color: 'var(--fg-ink)' }}>{brand.tagline}</h2>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--fg-ink-muted)' }}>
          Every crack filled with gold is a decision to keep the break in view rather than erase it. We cut cloth the same way &mdash; a slub left in the weave, a hem left unfinished, a dye lot left slightly uneven from the one before it. Nothing here is smoothed over. The imperfection is the record, and the record is the point.
        </p>
        <Link href={`/store/${slug}/shop`} className="inline-block mt-8 text-sm underline underline-offset-4 hover:opacity-60 transition-opacity" style={{ color: 'var(--fg-ink)' }}>
          Explore the collection
        </Link>
      </section>

      {/* Craft/maker magazine section — real dated articles, TOAST Magazine pattern */}
      <section className="px-6 md:px-10 py-16 border-t" style={{ borderColor: 'var(--fg-line)' }}>
        <h2 className="text-sm mb-10" style={{ color: 'var(--fg-ink)' }}>{brand.name} Journal</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {JOURNAL.map((article, i) => (
            <div key={article.title}>
              <div className="relative aspect-[4/3] overflow-hidden mb-4" style={{ background: 'var(--fg-card)' }}>
                {products[i + 5]?.image && <img src={products[i + 5].image} alt="" className="w-full h-full object-cover" />}
              </div>
              <p className="text-[11px] uppercase tracking-[0.08em] mb-2" style={{ color: 'var(--fg-ink-dim)' }}>{article.category} &middot; {article.when}</p>
              <h3 className="text-base mb-3" style={{ color: 'var(--fg-ink)' }}>{article.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--fg-ink-muted)' }}>{article.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Category text list */}
      <section className="px-6 md:px-10 py-8 flex flex-wrap gap-x-8 gap-y-3 border-t" style={{ borderColor: 'var(--fg-line)' }}>
        {categories.map(c => (
          <Link key={c} href={`/store/${slug}/shop?category=${encodeURIComponent(c)}`} className="text-sm hover:opacity-60 transition-opacity" style={{ color: 'var(--fg-ink)' }}>
            {c}
          </Link>
        ))}
      </section>

      <section className="px-6 md:px-10 py-16 border-t" style={{ borderColor: 'var(--fg-line)' }}>
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
