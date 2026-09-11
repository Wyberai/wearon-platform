'use client'

import Link from 'next/link'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'
import { useFlagshipCart } from '@/lib/flagship/cart-context'

// A faithful clone of injiri.com's real homepage: a poetic seasonal
// headline over a full-bleed craft photograph, a literary-quote
// collection passage, a "CRAFT" section naming real Indian block-
// print techniques and towns, and an "OUR STORY" etymology note.
const CRAFT = [
  { title: 'Dabu Mud-Resist of Bagru', body: `Before a single block touches cloth, the pattern is drawn in reverse — in wet mud and gum, pressed onto cotton in the villages around Bagru. Where the mud sits, the dye can't reach. It's a print made almost entirely of what the dye is kept from touching.` },
  { title: 'Ajrakh of Kachchh', body: `A finished Ajrakh cloth passes through a dozen or more rounds of resist, mordant and dye before it's called done — deep indigo and madder red, laid down in geometry that traces back centuries along the trade routes of Kachchh.` },
  { title: 'Sanganeri Floral Block', body: `The floral sprig repeated across a length of Sanganeri cotton is carved once, by hand, into a block of seasoned teak — and then struck, by hand, thousands of times more, each impression close enough to the last that the fabric reads as a single unbroken field.` },
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

export function RajwadaHome({ brand, products, mechanicLabel, mechanicIntro, onOpenMechanic }: { brand: ThemeBrand; products: ThemeProduct[]; mechanicLabel: string; mechanicIntro: string; onOpenMechanic: () => void }) {
  const slug = brand.slug
  const heroImg = products[0]?.image

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'ClothingStore', name: brand.name, description: brand.description }) }} />

      {/* Full-bleed hero, poetic seasonal headline */}
      <section className="relative h-[70vh] min-h-[460px] flex items-center justify-center text-center">
        {heroImg && <img src={heroImg} alt="" className="absolute inset-0 w-full h-full object-cover" />}
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative text-white px-6">
          <h1 className="text-3xl md:text-5xl mb-6" style={{ fontFamily: 'Georgia, serif' }}>The Dye Remembers the Field</h1>
          <Link href={`/store/${slug}/shop`} className="inline-block px-8 py-3 text-[12px] uppercase tracking-[0.15em] border border-white hover:bg-white hover:text-black transition-colors">
            Discover
          </Link>
        </div>
      </section>

      {/* Literary-quote collection passage */}
      <section className="px-6 md:px-10 py-16 max-w-xl mx-auto text-center border-b" style={{ borderColor: 'var(--fg-line)' }}>
        <p className="text-lg italic mb-4" style={{ color: 'var(--fg-ink)', fontFamily: 'Georgia, serif' }}>&ldquo;What the hand repeats, the hand remembers.&rdquo;</p>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--fg-ink-muted)' }}>{brand.tagline} Every length that leaves our workshop still carries the rhythm of the hand that struck it &mdash; slightly uneven, never quite the same twice, which is exactly how you know it wasn't made by a machine.</p>
      </section>

      {/* CRAFT section — real named techniques and towns */}
      <section className="px-6 md:px-10 py-16 border-b" style={{ borderColor: 'var(--fg-line)' }}>
        <h2 className="text-sm uppercase tracking-[0.1em] mb-10 text-center" style={{ color: 'var(--fg-ink)' }}>Craft</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {CRAFT.map((c, i) => (
            <div key={c.title}>
              <div className="relative aspect-[4/5] overflow-hidden mb-4" style={{ background: 'var(--fg-card)' }}>
                {products[i + 2]?.image && <img src={products[i + 2].image} alt="" className="w-full h-full object-cover" />}
              </div>
              <h3 className="text-base mb-3" style={{ color: 'var(--fg-ink)' }}>{c.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--fg-ink-muted)' }}>{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-10 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
          {products.map(p => <GridCard key={p.id} p={p} slug={slug} />)}
        </div>
      </section>

      {/* Our Story — etymology note */}
      <section className="px-6 md:px-10 py-20 max-w-2xl mx-auto text-center border-t" style={{ borderColor: 'var(--fg-line)' }}>
        <p className="text-[11px] uppercase tracking-[0.15em] mb-4" style={{ color: 'var(--fg-ink-dim)' }}>Our Story</p>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--fg-ink-muted)' }}>
          {brand.name} takes its name from the old Rajwada courtyards of Rajasthan &mdash; the printing yards attached to royal households, where dyers and block-carvers worked in the open air, close enough to the palace to be seen, but never quite inside it. We still work the same way: in the open, close to the source, cloth by cloth.
        </p>
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
