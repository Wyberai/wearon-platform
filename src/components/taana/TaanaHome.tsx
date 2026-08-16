'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { TAANA_CAMPAIGN } from '@/lib/taana/catalog'
import { useCuratedForYou } from '@/lib/flagship/use-recently-viewed'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'
import { TaanaProductCard } from './TaanaShopGrid'
import { TaanaImg } from './TaanaShell'
import { Reveal } from '@/components/flagship/Reveal'

const TECHNIQUES = [
  { name: 'Banarasi', region: 'Varanasi, UP' },
  { name: 'Kanjivaram', region: 'Kanchipuram, TN' },
  { name: 'Ikat', region: 'Odisha & Telangana' },
  { name: 'Chanderi', region: 'Madhya Pradesh' },
  { name: 'Jamdani', region: 'West Bengal' },
  { name: 'Bagh Block-Print', region: 'Madhya Pradesh' },
]

export function TaanaHome({ brand, products }: { brand: ThemeBrand; products: ThemeProduct[] }) {
  const slug = brand.slug

  const categories = useMemo(() => {
    const list = brand.categories.length ? brand.categories : Array.from(new Set(products.map(p => p.category)))
    return list.map(c => ({ name: c, image: products.find(p => p.category === c)?.image ?? products[0]?.image }))
  }, [brand.categories, products])

  const { products: curated, personalized } = useCuratedForYou('taana_viewed_v1', products, 4)
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

      {/* Hero — quiet, editorial, not a bazaar's brightness. Mount-triggered
          fade only, never scroll-linked (see Reveal.tsx's own note). */}
      <div className="relative h-[92vh] min-h-[560px] overflow-hidden">
        <TaanaImg src={TAANA_CAMPAIGN.hero} alt="" wrapperClassName="absolute inset-0" bg="var(--ta-indigo)" priority />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(31,58,95,0.12) 0%, rgba(20,17,15,0.6) 100%)' }} />
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative h-full flex flex-col items-center justify-center text-center px-6"
        >
          <p className="text-[11px] tracking-[0.3em] uppercase mb-5" style={{ color: 'rgba(245,240,230,0.85)' }}>Handloom, considered</p>
          <h1 className="italic text-[11vw] sm:text-6xl md:text-7xl leading-[0.98] tracking-tight" style={{ color: '#F5F0E6', fontFamily: 'var(--ta-display)' }}>
            {brand.tagline}
          </h1>
          <p className="text-sm md:text-base mt-5 mb-9 max-w-md" style={{ color: 'rgba(245,240,230,0.85)' }}>
            Sarees, kurta sets and home textiles from India&apos;s weaving belts — each piece names its weave, and the hands behind it.
          </p>
          <div className="flex items-center gap-4">
            <Link href={`/store/${slug}/shop`} className="px-8 py-3.5 rounded-full text-sm tracking-wide font-medium transition-transform hover:scale-105" style={{ background: '#F5F0E6', color: '#241F1B' }}>
              Explore the Collection
            </Link>
            <a href="#weavers-note-teaser" className="px-7 py-3.5 rounded-full text-sm tracking-wide border transition-opacity hover:opacity-70" style={{ borderColor: 'rgba(245,240,230,0.5)', color: '#F5F0E6' }}>
              What is a Weaver&apos;s Note?
            </a>
          </div>
        </motion.div>
      </div>

      {/* Editorial — the taana (warp thread) story */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-10 py-24 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-stretch">
        <Reveal className="md:row-span-2">
          <TaanaImg src={TAANA_CAMPAIGN.loomStudio} alt="" wrapperClassName="w-full h-full min-h-[320px] rounded-xl overflow-hidden" bg="var(--ta-indigo)" />
        </Reveal>
        <Reveal delay={0.1}>
          <div className="flex flex-col justify-center h-full py-8 md:py-0 md:pl-8">
            <p className="text-[11px] tracking-[0.25em] uppercase mb-4 font-medium" style={{ color: 'var(--ta-gold)' }}>Why &quot;Taana&quot;</p>
            <h2 className="italic text-4xl md:text-5xl leading-tight mb-5" style={{ fontFamily: 'var(--ta-display)' }}>The warp holds the story.</h2>
            <p className="text-sm leading-relaxed max-w-md" style={{ color: 'var(--ta-ink-muted)' }}>
              In handloom weaving, the taana — the warp — is fixed to the loom before a single weft thread crosses it. Every pattern, every technique, is set against it. We named this collection for that thread because it&apos;s the part of the weave that decides what kind of story the fabric can tell.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <TaanaImg src={TAANA_CAMPAIGN.weaveMacro} alt="" wrapperClassName="w-full h-full min-h-[220px] rounded-xl overflow-hidden" bg="var(--ta-rust)" />
        </Reveal>
      </section>

      {/* The Weaver's Note — signature mechanic teaser */}
      <section id="weavers-note-teaser" className="max-w-[1440px] mx-auto px-6 md:px-10 pb-24">
        <Reveal>
          <div className="rounded-2xl border p-8 md:p-12 grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-8 items-center" style={{ borderColor: 'var(--ta-line)', background: 'var(--ta-card)' }}>
            <div>
              <p className="text-[11px] tracking-[0.25em] uppercase mb-4 font-medium" style={{ color: 'var(--ta-gold)' }}>Signature feature</p>
              <h2 className="italic text-3xl md:text-4xl leading-tight mb-4" style={{ fontFamily: 'var(--ta-display)' }}>The Weaver&apos;s Note</h2>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--ta-ink-muted)' }}>
                Every product page carries a short, AI-composed provenance story — written live from that piece&apos;s specific weaving technique and region — instead of a generic description. Open any piece below to read one.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {TECHNIQUES.map(t => (
                <span key={t.name} className="text-xs px-3.5 py-2 rounded-full border" style={{ borderColor: 'var(--ta-line)', color: 'var(--ta-ink-muted)' }}>
                  {t.name} <span style={{ color: 'var(--ta-ink-dim)' }}>· {t.region}</span>
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* Browse by category */}
      {categories.length > 0 && (
        <section className="max-w-[1440px] mx-auto px-6 md:px-10 pb-24">
          <Reveal>
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="italic text-3xl md:text-4xl" style={{ fontFamily: 'var(--ta-display)' }}>The Collection</h2>
                <p className="text-sm mt-1.5" style={{ color: 'var(--ta-ink-muted)' }}>Sarees, kurta sets, stoles, jackets and home textiles.</p>
              </div>
              <Link href={`/store/${slug}/shop`} className="text-sm underline underline-offset-4 hover:opacity-70" style={{ color: 'var(--ta-ink-muted)' }}>View all</Link>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
            {categories.map((c, i) => (
              <Reveal key={c.name} delay={i * 0.05}>
                <Link href={`/store/${slug}/shop?category=${encodeURIComponent(c.name)}`} className="group block relative aspect-[3/4] overflow-hidden rounded-xl">
                  {c.image && (
                    <TaanaImg src={c.image} alt={c.name} wrapperClassName="w-full h-full" bg="var(--ta-card)"
                      imgClassName="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]" />
                  )}
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(36,31,27,0.6) 100%)' }} />
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
            <h2 className="italic text-3xl md:text-4xl" style={{ fontFamily: 'var(--ta-display)' }}>{personalized ? 'Curated for you' : 'The Atelier\'s Selection'}</h2>
            <p className="text-sm mt-1.5" style={{ color: 'var(--ta-ink-muted)' }}>
              {personalized ? 'Based on what you’ve been looking at.' : 'The pieces we consider the heart of this collection.'}
            </p>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
          {(personalized ? curated : fallbackFeatured).map((p, i) => (
            <Reveal key={p.id} delay={i * 0.06}>
              <TaanaProductCard product={p} slug={slug} priority={i < 2} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Closing editorial band */}
      <section className="pb-24">
        <Reveal>
          <div className="max-w-[1440px] mx-auto px-6 md:px-10">
            <div className="relative rounded-xl overflow-hidden">
              <TaanaImg src={TAANA_CAMPAIGN.artisanHands} alt="" wrapperClassName="w-full h-[380px] md:h-[460px]" bg="var(--ta-indigo)" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6" style={{ background: 'linear-gradient(180deg, rgba(36,31,27,0.1) 0%, rgba(36,31,27,0.72) 100%)' }}>
                <p className="text-[11px] tracking-[0.25em] uppercase mb-4 font-medium" style={{ color: 'rgba(245,240,230,0.85)' }}>Slow, by design</p>
                <h2 className="italic text-3xl md:text-5xl mb-6" style={{ color: '#F5F0E6', fontFamily: 'var(--ta-display)' }}>Made on a loom, not a production line.</h2>
                <Link
                  href={`/store/${slug}/shop`}
                  className="px-8 py-3.5 rounded-full text-sm tracking-wide font-medium transition-transform hover:scale-105"
                  style={{ background: '#F5F0E6', color: '#241F1B' }}
                >
                  Explore the Collection
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
