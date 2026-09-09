'use client'

import Link from 'next/link'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'
import { useFlagshipCart } from '@/lib/flagship/cart-context'

// A faithful clone of arket.com's real homepage — the most unusual pattern
// in this kit: the page opens with a calm campaign line, a plain-text
// category link list (not tiles), and then a genuine JOURNAL section —
// dated, categorized articles with real long-form writing — BEFORE any
// product grid. Commerce is secondary to substance here, which is the
// entire point of "function over ornament."
const JOURNAL = [
  {
    title: 'On the quiet confidence of wearing less',
    category: 'Journal',
    body: `A considered wardrobe isn't built by adding — it's built by noticing what earns its place and letting the rest go. Fewer pieces, chosen for how they wear rather than how they photograph, tend to outlast every trend they were never trying to follow. This is less a rule than a habit: buy less, ask more of what you keep.`,
  },
  {
    title: 'The wool we choose, and why',
    category: 'Materials',
    body: `Wool is graded long before it becomes a garment — by fibre length, crimp, and the altitude the sheep grazed at. We favour wool spun slightly heavier than fashion typically calls for, because a coat meant to be worn for a decade needs more structure than one meant for a season. The result reads plainer in a photograph and better in a winter.`,
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

export function FjordHome({ brand, products, mechanicLabel, mechanicIntro, onOpenMechanic }: { brand: ThemeBrand; products: ThemeProduct[]; mechanicLabel: string; mechanicIntro: string; onOpenMechanic: () => void }) {
  const slug = brand.slug
  const categories = brand.categories.length ? brand.categories : Array.from(new Set(products.map(p => p.category)))
  const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'ClothingStore', name: brand.name, description: brand.description }) }} />

      {/* Campaign line — plain, confident, no script/serif flourish */}
      <section className="px-6 md:px-10 pt-14 pb-10">
        <p className="text-xl md:text-2xl max-w-lg mb-2" style={{ color: 'var(--fg-ink)' }}>{brand.tagline}</p>
        <Link href={`/store/${slug}/shop`} className="text-sm underline underline-offset-4 hover:opacity-60 transition-opacity" style={{ color: 'var(--fg-ink)' }}>
          Discover the collection
        </Link>
      </section>

      {products[0]?.image && (
        <div className="relative h-[60vh] min-h-[380px]">
          <img src={products[0].image} alt="" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Plain-text category list — not tiles */}
      <section className="px-6 md:px-10 py-10 flex flex-wrap gap-x-8 gap-y-3 border-b" style={{ borderColor: 'var(--fg-line)' }}>
        {categories.map(c => (
          <Link key={c} href={`/store/${slug}/shop?category=${encodeURIComponent(c)}`} className="text-sm hover:opacity-60 transition-opacity" style={{ color: 'var(--fg-ink)' }}>
            {c}
          </Link>
        ))}
      </section>

      {/* Journal — the real Arket pattern: dated, categorized long-form
          writing before any product grid */}
      <section className="px-6 md:px-10 py-16">
        <h2 className="text-sm" style={{ color: 'var(--fg-ink)' }}>{brand.name} Journal</h2>
        <Link href={`/store/${slug}/shop`} className="text-sm underline underline-offset-4 hover:opacity-60 transition-opacity" style={{ color: 'var(--fg-ink)' }}>
          View more
        </Link>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-8">
          {JOURNAL.map((article, i) => (
            <div key={article.title}>
              <div className="relative aspect-[4/3] overflow-hidden mb-4" style={{ background: 'var(--fg-card)' }}>
                {products[i + 1]?.image && <img src={products[i + 1].image} alt="" className="w-full h-full object-cover" />}
              </div>
              <h3 className="text-base mb-2" style={{ color: 'var(--fg-ink)' }}>{article.title}</h3>
              <p className="text-[11px] uppercase tracking-[0.08em] mb-3" style={{ color: 'var(--fg-ink-dim)' }}>{article.category} | {dateStr}</p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--fg-ink-muted)' }}>{article.body}</p>
            </div>
          ))}
        </div>
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
