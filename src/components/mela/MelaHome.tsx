'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { MELA_CAMPAIGN } from '@/lib/mela/catalog'
import { useCuratedForYou } from '@/lib/flagship/use-recently-viewed'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'
import { MelaImg, MelaProductCard } from './MelaShell'
import { Reveal } from '@/components/flagship/Reveal'

const CATEGORY_COLORS: Record<string, string> = {
  Kurtis: 'var(--me-pink)',
  'Co-ord Sets': 'var(--me-turquoise)',
  'Ethnic Sets': 'var(--me-marigold)',
  Footwear: 'var(--me-pink)',
  Jewellery: 'var(--me-turquoise)',
}

const HOW_IT_WORKS = [
  { n: '01', title: 'Pick anything', body: 'Kurtis, co-ord sets, ethnic sets, footwear, jewellery — every tag on the site is a starting price, not a final one.' },
  { n: '02', title: 'Name your price', body: 'Open the "Make an Offer" box on any product page and type what you actually want to pay.' },
  { n: '03', title: 'Haggle it out', body: 'Our stall-owner counters, you counter back — real back-and-forth, settled in under a minute.' },
]

export function MelaHome({ brand, products }: { brand: ThemeBrand; products: ThemeProduct[] }) {
  const slug = brand.slug

  const categories = useMemo(() => {
    const list = brand.categories.length ? brand.categories : Array.from(new Set(products.map(p => p.category)))
    return list.map(c => ({ name: c, image: products.find(p => p.category === c)?.image ?? products[0]?.image }))
  }, [brand.categories, products])

  const { products: curated, personalized } = useCuratedForYou('mela_viewed_v1', products, 4)
  const bestsellers = products.filter(p => p.tags.includes('bestseller')).slice(0, 4)
  const fallbackFeatured = bestsellers.length ? bestsellers : products.slice(0, 4)
  const dealPieces = products.filter(p => p.originalPrice).slice(0, 4)

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ClothingStore',
            name: brand.name,
            description: brand.description,
          }),
        }}
      />

      {/* Hero — loud, dense, market-stall energy. Mount-triggered fade only,
          never scroll-linked (see Reveal.tsx's rule — applied fresh here). */}
      <div className="relative h-[86vh] min-h-[540px] overflow-hidden">
        <div className="absolute inset-0">
          <MelaImg src={MELA_CAMPAIGN.hero} alt="" className="w-full h-full" bg="var(--me-pink)" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(26,16,21,0.15) 0%, rgba(26,16,21,0.68) 100%)' }} />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative h-full flex flex-col items-center justify-center text-center px-6"
        >
          <p className="text-[11px] tracking-[0.3em] uppercase mb-4 font-bold px-3 py-1 rounded-full" style={{ color: 'var(--me-ink)', background: 'var(--me-marigold)' }}>
            ₹399 — ₹2499 · New stock every Friday
          </p>
          <h1 className="mela-display text-[12vw] sm:text-6xl md:text-7xl font-extrabold leading-[0.98] tracking-tight" style={{ color: '#FFF8EF' }}>
            {brand.tagline}
          </h1>
          <p className="text-sm md:text-base mt-5 mb-9 max-w-md font-medium" style={{ color: 'rgba(255,248,239,0.9)' }}>
            No fixed price here. Type what you want to pay right on the product page — our stall-owner will meet you somewhere in the middle.
          </p>
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <Link href={`/store/${slug}/shop`} className="px-8 py-3.5 rounded-full text-sm tracking-wide font-bold transition-transform hover:scale-105" style={{ background: 'var(--me-pink)', color: '#fff' }}>
              Shop All 18 Pieces
            </Link>
            <Link href={`/store/${slug}/shop?category=Kurtis`} className="px-7 py-3.5 rounded-full text-sm tracking-wide font-bold border-2 transition-opacity hover:opacity-80" style={{ borderColor: '#FFF8EF', color: '#FFF8EF' }}>
              Browse Kurtis
            </Link>
          </div>
        </motion.div>
      </div>

      {/* How it works — Make an Offer explained up front */}
      <section className="max-w-[1440px] mx-auto px-5 md:px-10 py-20 grid grid-cols-1 md:grid-cols-3 gap-10">
        {HOW_IT_WORKS.map((s, i) => (
          <Reveal key={s.n} delay={i * 0.1}>
            <p className="mela-display text-3xl font-extrabold mb-3" style={{ color: CATEGORY_COLORS[categories[i]?.name ?? ''] ?? 'var(--me-pink)' }}>{s.n}</p>
            <h3 className="text-lg mb-2 font-bold">{s.title}</h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--me-ink-muted)' }}>{s.body}</p>
          </Reveal>
        ))}
      </section>

      {/* Category tiles — dense grid, loud color-blocked labels */}
      {categories.length > 0 && (
        <section className="max-w-[1440px] mx-auto px-5 md:px-10 pb-20">
          <Reveal>
            <h2 className="mela-display text-3xl md:text-4xl font-extrabold mb-8">Shop the Stalls</h2>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
            {categories.map((c, i) => (
              <Reveal key={c.name} delay={i * 0.05}>
                <Link href={`/store/${slug}/shop?category=${encodeURIComponent(c.name)}`} className="group block relative aspect-[3/4] overflow-hidden rounded-xl border-2" style={{ borderColor: 'var(--me-line)' }}>
                  {c.image && <MelaImg src={c.image} alt={c.name} className="w-full h-full" imgClassName="transition-transform duration-500 group-hover:scale-[1.08]" bg={CATEGORY_COLORS[c.name] ?? 'var(--me-pink)'} />}
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 45%, rgba(26,16,21,0.72) 100%)' }} />
                  <span className="absolute bottom-3 left-3 text-sm font-bold uppercase tracking-wide" style={{ color: '#fff' }}>{c.name}</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Deal band */}
      {dealPieces.length > 0 && (
        <section className="max-w-[1440px] mx-auto px-5 md:px-10 pb-20">
          <Reveal>
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="mela-display text-3xl md:text-4xl font-extrabold" style={{ color: 'var(--me-pink)' }}>Today&apos;s Deals</h2>
                <p className="text-sm mt-1.5 font-medium" style={{ color: 'var(--me-ink-muted)' }}>Already marked down. Still worth an offer.</p>
              </div>
              <Link href={`/store/${slug}/shop`} className="text-sm font-bold underline underline-offset-4 hover:opacity-70" style={{ color: 'var(--me-turquoise)' }}>View all</Link>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {dealPieces.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.06}>
                <MelaProductCard product={p} slug={slug} priority={i < 2} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Editorial — bazaar imagery, not studio polish, by design */}
      <section className="max-w-[1440px] mx-auto px-5 md:px-10 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-stretch">
          <Reveal className="md:row-span-2">
            <MelaImg src={MELA_CAMPAIGN.rack} alt="" className="w-full h-full rounded-xl min-h-[320px]" bg="var(--me-turquoise)" />
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex flex-col justify-center h-full py-8 md:py-0 md:pl-8">
              <p className="text-[11px] tracking-[0.25em] uppercase mb-4 font-bold" style={{ color: 'var(--me-pink)' }}>Real bazaar, real racks</p>
              <h2 className="mela-display text-4xl md:text-5xl font-extrabold leading-tight mb-5">Not a studio. A stall.</h2>
              <p className="text-sm leading-relaxed max-w-md font-medium" style={{ color: 'var(--me-ink-muted)' }}>
                {brand.name} looks like the market it's named after — garments on metal racks, piled on cloth, priced to move fast. No quiet-luxury lighting here, just eighteen pieces and a price you get to argue with.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <MelaImg src={MELA_CAMPAIGN.pile} alt="" className="w-full h-full rounded-xl min-h-[220px]" bg="var(--me-marigold)" />
          </Reveal>
        </div>
      </section>

      {/* Curated for you */}
      <section className="max-w-[1440px] mx-auto px-5 md:px-10 pb-24">
        <Reveal>
          <div className="mb-8">
            <h2 className="mela-display text-3xl md:text-4xl font-extrabold">{personalized ? 'Curated for you' : 'Stall favourites'}</h2>
            <p className="text-sm mt-1.5 font-medium" style={{ color: 'var(--me-ink-muted)' }}>
              {personalized ? 'Based on what you’ve been looking at.' : 'The pieces that move fastest off the rack.'}
            </p>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {(personalized ? curated : fallbackFeatured).map((p, i) => (
            <Reveal key={p.id} delay={i * 0.06}>
              <MelaProductCard product={p} slug={slug} priority={i < 2} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Make an Offer CTA band */}
      <section className="pb-24">
        <Reveal>
          <div className="max-w-[1440px] mx-auto px-5 md:px-10">
            <div className="relative rounded-xl overflow-hidden">
              <MelaImg src={MELA_CAMPAIGN.jewelleryTable} alt="" className="w-full h-[340px] md:h-[420px]" bg="var(--me-pink)" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6" style={{ background: 'linear-gradient(180deg, rgba(26,16,21,0.1) 0%, rgba(26,16,21,0.75) 100%)' }}>
                <p className="text-[11px] tracking-[0.25em] uppercase mb-4 font-bold" style={{ color: 'var(--me-marigold)' }}>Every tag is a starting price</p>
                <h2 className="mela-display text-3xl md:text-5xl font-extrabold mb-6" style={{ color: '#FFF8EF' }}>Go on. Make an offer.</h2>
                <Link
                  href={`/store/${slug}/shop`}
                  className="px-8 py-3.5 rounded-full text-sm tracking-wide font-bold transition-transform hover:scale-105"
                  style={{ background: 'var(--me-marigold)', color: 'var(--me-ink)' }}
                >
                  Find Something to Haggle Over
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
