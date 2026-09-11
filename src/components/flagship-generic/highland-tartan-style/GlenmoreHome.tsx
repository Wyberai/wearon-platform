'use client'

import Link from 'next/link'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'
import { useFlagshipCart } from '@/lib/flagship/cart-context'

// A faithful clone of kinlochanderson.com's real homepage: a formal
// "Made To Measure ... Since [year]" hero, craft-copy product callout
// blocks (their real "Handmade to order in our Edinburgh factory"
// pattern), a "Refurbish your kilt" heritage-repair section, and a
// dated magazine section with real Scottish-culture story beats.
const MAGAZINE = [
  { title: 'What Your Tartan Says About You', when: '4 days ago', body: `A tartan was never decorative first — it was a map. Which glen you were from, which chief you answered to, which side of a long-settled argument your family stood on. We still cut every length the same way a weaver two centuries ago would have: on a loom that can't lie about where the thread came from.` },
  { title: 'The Sporran, Explained', when: '2 weeks ago', body: `Before pockets were sewn into Highland dress, everything a man carried travelled at his waist in a pouch of hide and horsehair. The sporran survived every redesign of the kilt because it never stopped being useful — it just got better at looking ceremonial while it did the job.` },
  { title: 'A Season on the Estate', when: '1 month ago', body: `Tweed exists because someone needed to walk through gorse for eight hours and come home dry. The weave is dense enough to shrug off weather and loose enough to breathe on the climb back up. Fashion borrowed it decades later; the estate never needed convincing.` },
]

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

export function GlenmoreHome({ brand, products, mechanicLabel, mechanicIntro, onOpenMechanic }: { brand: ThemeBrand; products: ThemeProduct[]; mechanicLabel: string; mechanicIntro: string; onOpenMechanic: () => void }) {
  const slug = brand.slug
  const heroImg = products[0]?.image
  const callouts = [
    { title: 'Clan Tartans', body: 'Woven to order from the registered sett of your choosing, cut and finished by hand.', img: products[0]?.image },
    { title: 'Highland Knitwear', body: 'Pure new wool, spun heavier than fashion calls for, because a jumper meant for the glen needs more structure than one meant for a season.', img: products[2]?.image },
    { title: 'Clan Accents', body: 'Brooches, pins and sporrans finished by the same hands that cut the cloth.', img: products[6]?.image },
  ]

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'ClothingStore', name: brand.name, description: brand.description }) }} />

      {/* Formal hero */}
      <section className="relative h-[65vh] min-h-[420px] flex items-end">
        {heroImg && <img src={heroImg} alt="" className="absolute inset-0 w-full h-full object-cover" />}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0))' }} />
        <div className="relative px-6 md:px-10 pb-12">
          <h1 className="text-2xl md:text-4xl text-white mb-5 max-w-lg" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.4)' }}>{brand.tagline}</h1>
          <Link href={`/store/${slug}/shop`} className="inline-block px-6 py-3 text-[12px] uppercase tracking-[0.06em] font-semibold" style={{ background: 'var(--fg-bg)', color: 'var(--fg-ink)' }}>
            Shop the Collection
          </Link>
        </div>
      </section>

      {/* Craft-copy callout blocks */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: 'var(--fg-line)' }}>
        {callouts.map(c => (
          <div key={c.title} className="relative aspect-[4/5]" style={{ background: 'var(--fg-bg)' }}>
            {c.img && <img src={c.img} alt={c.title} className="w-full h-full object-cover" />}
            <div className="absolute inset-0 flex flex-col justify-end p-6" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65), rgba(0,0,0,0.05))' }}>
              <h3 className="text-white text-lg font-bold mb-2">{c.title}</h3>
              <p className="text-white text-xs leading-relaxed opacity-90">{c.body}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Refurbish your kilt — Kinloch Anderson's real heritage-repair pattern */}
      <section className="px-6 md:px-10 py-20 max-w-2xl mx-auto text-center border-t" style={{ borderColor: 'var(--fg-line)' }}>
        <p className="text-[11px] uppercase tracking-[0.15em] mb-4" style={{ color: 'var(--fg-ink-dim)' }}>Refurbish Your Kilt</p>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--fg-ink-muted)' }}>
          A kilt bought for one wedding tends to outlive the marriage, the next generation, and several changes of waistline. Bring yours back to us. We'll let out the pleats, reline the waistband, and send it home ready for whichever occasion finds it next &mdash; a kilt is the one garment in a wardrobe that is genuinely built to be re-worn by someone else entirely.
        </p>
      </section>

      {/* Magazine section */}
      <section className="px-6 md:px-10 py-16 border-t" style={{ borderColor: 'var(--fg-line)' }}>
        <h2 className="text-sm uppercase tracking-[0.08em] mb-10" style={{ color: 'var(--fg-ink)' }}>{brand.name} Magazine</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {MAGAZINE.map((article, i) => (
            <div key={article.title}>
              <div className="relative aspect-[4/3] overflow-hidden mb-4" style={{ background: 'var(--fg-card)' }}>
                {products[i + 3]?.image && <img src={products[i + 3].image} alt="" className="w-full h-full object-cover" />}
              </div>
              <p className="text-[11px] uppercase tracking-[0.08em] mb-2" style={{ color: 'var(--fg-ink-dim)' }}>{article.when}</p>
              <h3 className="text-base mb-3" style={{ color: 'var(--fg-ink)' }}>{article.title}</h3>
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
        <button onClick={onOpenMechanic} className="px-6 py-3 text-[12px] uppercase tracking-[0.06em] font-semibold hover:opacity-80 transition-opacity" style={{ background: 'var(--fg-accent)', color: 'var(--fg-bg)' }}>
          Begin
        </button>
      </section>
    </div>
  )
}
