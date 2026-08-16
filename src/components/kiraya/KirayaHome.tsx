'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { KIRAYA_CAMPAIGN } from '@/lib/kiraya/catalog'
import { useCuratedForYou } from '@/lib/flagship/use-recently-viewed'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'
import { KirayaProductCard } from './KirayaShopGrid'
import { Reveal } from '@/components/flagship/Reveal'

const HOW_IT_WORKS = [
  { n: '01', title: 'Pick your event date', body: 'Wedding, sangeet, reception — tell us the date and we work out delivery and return around it, automatically.' },
  { n: '02', title: 'We check availability', body: 'Each piece is one of a kind, so we confirm your exact window is free before you commit — no surprises later.' },
  { n: '03', title: 'Wear it. Return it happy.', body: 'It arrives two days before your event, dry-cleaned and pressed. Pack it back up and it\'s collected two days after.' },
]

export function KirayaHome({ brand, products }: { brand: ThemeBrand; products: ThemeProduct[] }) {
  const slug = brand.slug

  const categories = useMemo(() => {
    const list = brand.categories.length ? brand.categories : Array.from(new Set(products.map(p => p.category)))
    return list.map(c => ({ name: c, image: products.find(p => p.category === c)?.image ?? products[0]?.image }))
  }, [brand.categories, products])

  const { products: curated, personalized } = useCuratedForYou('kiraya_viewed_v1', products, 4)
  const signature = products.filter(p => p.tags.includes('signature')).slice(0, 4)
  const fallbackFeatured = signature.length ? signature : products.slice(0, 4)

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

      {/* Hero — mount-triggered fade only, never scroll-linked (Reveal.tsx). */}
      <div className="relative h-[92vh] min-h-[560px] overflow-hidden" style={{ background: 'var(--ki-plum)' }}>
        <div className="absolute inset-0">
          <img src={KIRAYA_CAMPAIGN.hero} alt="" className="w-full h-full object-cover" onError={e => { e.currentTarget.style.display = 'none' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(21,11,22,0.15) 0%, rgba(21,11,22,0.72) 100%)' }} />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative h-full flex flex-col items-center justify-center text-center px-6"
        >
          <p className="text-[11px] tracking-[0.3em] uppercase mb-5" style={{ color: 'var(--ki-accent)' }}>A rental wardrobe, for one perfect night</p>
          <h1 className="kiraya-display italic text-[12vw] sm:text-6xl md:text-7xl leading-[0.98] tracking-tight" style={{ color: '#F3E9E6' }}>
            {brand.tagline}
          </h1>
          <p className="text-sm md:text-base mt-5 mb-9 max-w-md" style={{ color: 'rgba(243,233,230,0.85)' }}>
            Bridal-grade lehengas, sherwanis, sarees, gowns and jewellery — rented for your event at a fraction of retail.
          </p>
          <div className="flex items-center gap-4">
            <Link href={`/store/${slug}/shop`} className="px-8 py-3.5 rounded-full text-sm tracking-wide font-medium transition-transform hover:scale-105" style={{ background: 'var(--ki-accent)', color: 'var(--ki-accent-ink)' }}>
              Browse the collection
            </Link>
            <a href="#how-it-works" className="px-7 py-3.5 rounded-full text-sm tracking-wide border transition-opacity hover:opacity-70" style={{ borderColor: 'rgba(243,233,230,0.5)', color: '#F3E9E6' }}>
              How renting works
            </a>
          </div>
        </motion.div>
      </div>

      {/* How it works — the Rent for the Date mechanic, explained up front */}
      <section id="how-it-works" className="max-w-[1440px] mx-auto px-6 md:px-10 py-24 grid grid-cols-1 md:grid-cols-3 gap-12">
        {HOW_IT_WORKS.map((s, i) => (
          <Reveal key={s.n} delay={i * 0.1}>
            <p className="kiraya-display italic text-3xl mb-4" style={{ color: 'var(--ki-accent)' }}>{s.n}</p>
            <h3 className="text-lg mb-2.5 font-medium">{s.title}</h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--ki-ink-muted)' }}>{s.body}</p>
          </Reveal>
        ))}
      </section>

      {/* Editorial — dressing-room story */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-10 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-stretch">
          <Reveal className="md:row-span-2">
            <div className="w-full h-full rounded-xl min-h-[320px] overflow-hidden" style={{ background: 'var(--ki-plum)' }}>
              <img src={KIRAYA_CAMPAIGN.dressingRoom} alt="" className="w-full h-full object-cover" onError={e => { e.currentTarget.style.display = 'none' }} />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex flex-col justify-center h-full py-8 md:py-0 md:pl-8">
              <p className="text-[11px] tracking-[0.25em] uppercase mb-4 font-medium" style={{ color: 'var(--ki-accent)' }}>Considered, not disposable</p>
              <h2 className="kiraya-display italic text-4xl md:text-5xl leading-tight mb-5">One perfect night, without the one-time-wear guilt.</h2>
              <p className="text-sm leading-relaxed max-w-md" style={{ color: 'var(--ki-ink-muted)' }}>
                {brand.name} exists for the outfit you&apos;ll wear exactly once — a wedding, a sangeet, a reception. Rent the piece, wear it beautifully, send it back. No storage, no dry-cleaning bill, no lehenga taking up a shelf for the next ten years.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="w-full h-full rounded-xl min-h-[220px] overflow-hidden" style={{ background: 'var(--ki-plum)' }}>
              <img src={KIRAYA_CAMPAIGN.texture} alt="" className="w-full h-full object-cover" onError={e => { e.currentTarget.style.display = 'none' }} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Browse by category */}
      {categories.length > 0 && (
        <section className="max-w-[1440px] mx-auto px-6 md:px-10 pb-24">
          <Reveal>
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="kiraya-display italic text-3xl md:text-4xl">Shop by occasion</h2>
                <p className="text-sm mt-1.5" style={{ color: 'var(--ki-ink-muted)' }}>Every category, ready to rent.</p>
              </div>
              <Link href={`/store/${slug}/shop`} className="text-sm underline underline-offset-4 hover:opacity-70" style={{ color: 'var(--ki-ink-muted)' }}>View all</Link>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
            {categories.map((c, i) => (
              <Reveal key={c.name} delay={i * 0.05}>
                <Link href={`/store/${slug}/shop?category=${encodeURIComponent(c.name)}`} className="group block relative aspect-[3/4] overflow-hidden rounded-xl" style={{ background: 'var(--ki-plum)' }}>
                  {c.image && <img src={c.image} alt={c.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]" onError={e => { e.currentTarget.style.display = 'none' }} />}
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(21,11,22,0.7) 100%)' }} />
                  <span className="absolute bottom-4 left-4 text-sm tracking-wide" style={{ color: '#fff' }}>{c.name}</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Curated for you */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-10 pb-24">
        <Reveal>
          <div className="mb-8">
            <h2 className="kiraya-display italic text-3xl md:text-4xl">{personalized ? 'Curated for you' : 'Signature pieces'}</h2>
            <p className="text-sm mt-1.5" style={{ color: 'var(--ki-ink-muted)' }}>
              {personalized ? 'Based on what you’ve been looking at.' : 'The pieces our renters ask for by name.'}
            </p>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
          {(personalized ? curated : fallbackFeatured).map((p, i) => (
            <Reveal key={p.id} delay={i * 0.06}>
              <KirayaProductCard product={p} slug={slug} priority={i < 2} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA band */}
      <section className="pb-24">
        <Reveal>
          <div className="max-w-[1440px] mx-auto px-6 md:px-10">
            <div className="relative rounded-xl overflow-hidden" style={{ background: 'var(--ki-plum)' }}>
              <img src={KIRAYA_CAMPAIGN.flatlayOutfit} alt="" className="w-full h-[380px] md:h-[460px] object-cover" onError={e => { e.currentTarget.style.display = 'none' }} />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6" style={{ background: 'linear-gradient(180deg, rgba(21,11,22,0.1) 0%, rgba(21,11,22,0.75) 100%)' }}>
                <p className="text-[11px] tracking-[0.25em] uppercase mb-4 font-medium" style={{ color: 'var(--ki-accent)' }}>Got a date on the calendar?</p>
                <h2 className="kiraya-display italic text-3xl md:text-5xl mb-6" style={{ color: '#F3E9E6' }}>Rent the outfit. Keep the memory.</h2>
                <Link
                  href={`/store/${slug}/shop`}
                  className="px-8 py-3.5 rounded-full text-sm tracking-wide font-medium transition-transform hover:scale-105"
                  style={{ background: 'var(--ki-accent)', color: 'var(--ki-accent-ink)' }}
                >
                  Browse the collection
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
