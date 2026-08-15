'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { AUGUST_CAMPAIGN } from '@/lib/august/catalog'
import { useCuratedForYou } from '@/lib/flagship/use-recently-viewed'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'
import { AugustProductCard } from './AugustProductCard'
import { Reveal } from '@/components/flagship/Reveal'

export function AugustHome({ brand, products }: { brand: ThemeBrand; products: ThemeProduct[] }) {
  const slug = brand.slug

  const manifesto = useMemo(() => ([
    { n: '01', title: 'One collection', body: `No drops, no seasons rushed to obsolescence — every ${brand.name} piece is reasoned through and worn for years.` },
    { n: '02', title: 'Considered materials', body: 'Fabrics chosen for how they age, not just how they photograph on day one.' },
    { n: '03', title: 'Quietly intelligent', body: `An AI stylist that knows the collection, and a store that gets better the more it learns what you actually wear.` },
  ]), [brand.name])

  const categories = useMemo(() => {
    const list = brand.categories.length ? brand.categories : Array.from(new Set(products.map(p => p.category)))
    return list.map(c => ({ name: c, image: products.find(p => p.category === c)?.image ?? products[0]?.image }))
  }, [brand.categories, products])

  const { products: curated, personalized } = useCuratedForYou('august_viewed_v1', products, 4)
  const bestsellers = products.filter(p => p.tags.includes('bestseller')).slice(0, 4)
  const fallbackFeatured = bestsellers.length ? bestsellers : products.slice(0, 4)

  return (
    <div>
      {/* Structured data for AI shopping agents / discovery */}
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

      {/* Hero — mount-triggered fade only, never scroll-linked. A scroll-tied
          opacity/parallax here previously depended on useScroll measuring a
          ref correctly; if that measurement ever failed (some browser
          contexts), the entire hero — and everything below it — rendered
          invisible with no error shown. A plain initial/animate fade has no
          such failure mode: it always resolves. */}
      <div className="relative h-[92vh] min-h-[560px] overflow-hidden">
        <div className="absolute inset-0">
          <img src={AUGUST_CAMPAIGN.hero} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(11,10,8,0.15) 0%, rgba(11,10,8,0.55) 100%)' }} />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative h-full flex flex-col items-center justify-center text-center px-6"
        >
          <p className="text-[11px] tracking-[0.3em] uppercase mb-5" style={{ color: 'rgba(255,255,255,0.75)' }}>The Considered Collection</p>
          <h1 className="august-serif text-[13vw] sm:text-6xl md:text-7xl leading-[0.98] tracking-tight" style={{ color: '#F3EFE6' }}>
            {brand.tagline.split('. ').map((line, i, arr) => (
              <span key={i}>{line}{i < arr.length - 1 ? '.' : ''}{i < arr.length - 1 ? <br /> : null}</span>
            ))}
          </h1>
          <div className="flex items-center gap-4 mt-9">
            <Link href={`/store/${slug}/shop`} className="px-7 py-3.5 rounded-full text-sm tracking-wide transition-opacity hover:opacity-85" style={{ background: '#F3EFE6', color: '#0B0A08' }}>
              Explore the Collection
            </Link>
            <a href="#atelier" className="px-7 py-3.5 rounded-full text-sm tracking-wide border transition-opacity hover:opacity-70" style={{ borderColor: 'rgba(255,255,255,0.4)', color: '#F3EFE6' }}>
              The Atelier
            </a>
          </div>
        </motion.div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[11px] tracking-[0.2em] uppercase" style={{ color: 'rgba(255,255,255,0.6)' }}>
          Scroll
        </div>
      </div>

      {/* Manifesto strip */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-10 py-24 grid grid-cols-1 md:grid-cols-3 gap-12">
        {manifesto.map((m, i) => (
          <Reveal key={m.n} delay={i * 0.1}>
            <p className="august-serif text-3xl mb-4" style={{ color: 'var(--a-accent)' }}>{m.n}</p>
            <h3 className="text-lg mb-2.5">{m.title}</h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--a-ink-muted)' }}>{m.body}</p>
          </Reveal>
        ))}
      </section>

      {/* Category tiles */}
      {categories.length > 0 && (
        <section className="max-w-[1440px] mx-auto px-6 md:px-10 pb-24">
          <Reveal>
            <div className="flex items-end justify-between mb-8">
              <h2 className="august-serif text-2xl md:text-3xl">Shop by category</h2>
              <Link href={`/store/${slug}/shop`} className="text-sm underline underline-offset-4 hover:opacity-70" style={{ color: 'var(--a-ink-muted)' }}>View all</Link>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
            {categories.map((c, i) => (
              <Reveal key={c.name} delay={i * 0.05}>
                <Link href={`/store/${slug}/shop?category=${encodeURIComponent(c.name)}`} className="group block relative aspect-[3/4] overflow-hidden rounded-sm">
                  {c.image && <img src={c.image} alt={c.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]" />}
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.55) 100%)' }} />
                  <span className="absolute bottom-4 left-4 text-sm tracking-wide" style={{ color: '#fff' }}>{c.name}</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Curated for you — real, honest client-side personalization */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-10 pb-24">
        <Reveal>
          <div className="mb-8">
            <h2 className="august-serif text-2xl md:text-3xl">{personalized ? 'Curated for you' : 'Most considered'}</h2>
            <p className="text-sm mt-1.5" style={{ color: 'var(--a-ink-muted)' }}>
              {personalized ? 'Based on what you’ve been looking at.' : 'What our clients return to, season after season.'}
            </p>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
          {(personalized ? curated : fallbackFeatured).map((p, i) => (
            <Reveal key={p.id} delay={i * 0.06}>
              <AugustProductCard product={p} slug={slug} priority={i < 2} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* The Atelier — editorial craft story */}
      <section id="atelier" className="max-w-[1440px] mx-auto px-6 md:px-10 pb-24 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-stretch">
          <Reveal className="md:row-span-2">
            <img src={AUGUST_CAMPAIGN.architecture} alt="" className="w-full h-full object-cover rounded-sm min-h-[320px]" />
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex flex-col justify-center h-full py-8 md:py-0 md:pl-8">
              <p className="text-[11px] tracking-[0.25em] uppercase mb-4" style={{ color: 'var(--a-accent)' }}>The Atelier</p>
              <h2 className="august-serif text-3xl md:text-4xl leading-tight mb-5">Fewer things,<br />reasoned through.</h2>
              <p className="text-sm leading-relaxed max-w-md" style={{ color: 'var(--a-ink-muted)' }}>
                Every {brand.name} piece is chosen for what it does in year five, not week one. We work in small runs with makers who measure quality the same way — by how something wears, not how it photographs on day one.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <img src={AUGUST_CAMPAIGN.fabricMacro} alt="" className="w-full h-full object-cover rounded-sm min-h-[220px]" />
          </Reveal>
        </div>
      </section>

      {/* Ask [brand] CTA band */}
      <section className="pb-24">
        <Reveal>
          <div className="max-w-[1440px] mx-auto px-6 md:px-10">
            <div className="relative rounded-sm overflow-hidden">
              <img src={AUGUST_CAMPAIGN.flatlayOutfit} alt="" className="w-full h-[380px] md:h-[460px] object-cover" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6" style={{ background: 'linear-gradient(180deg, rgba(11,10,8,0.1) 0%, rgba(11,10,8,0.68) 100%)' }}>
                <p className="text-[11px] tracking-[0.25em] uppercase mb-4" style={{ color: 'rgba(255,255,255,0.75)' }}>Not sure where to start?</p>
                <h2 className="august-serif text-2xl md:text-4xl mb-6" style={{ color: '#F3EFE6' }}>Ask {brand.name} to build the outfit.</h2>
                <p className="text-sm max-w-md" style={{ color: 'rgba(255,255,255,0.8)' }}>
                  Our AI stylist knows every fabric, fit and pairing in the collection — open it from the header, anytime.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
