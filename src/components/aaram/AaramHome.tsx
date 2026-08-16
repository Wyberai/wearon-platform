'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { AARAM_CAMPAIGN, DAY_TYPES } from '@/lib/aaram/catalog'
import { useCuratedForYou } from '@/lib/flagship/use-recently-viewed'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'
import { AaramProductCard, AaramImg } from './AaramShopGrid'
import { Reveal } from '@/components/flagship/Reveal'
import { OPEN_DAY_MATCH_EVENT } from './AaramShell'

export function AaramHome({ brand, products }: { brand: ThemeBrand; products: ThemeProduct[] }) {
  const slug = brand.slug

  const categories = useMemo(() => {
    const list = brand.categories.length ? brand.categories : Array.from(new Set(products.map(p => p.category)))
    return list.map(c => ({ name: c, image: products.find(p => p.category === c)?.image ?? products[0]?.image }))
  }, [brand.categories, products])

  const { products: curated, personalized } = useCuratedForYou('aaram_viewed_v1', products, 4)
  const bestsellers = products.filter(p => p.tags.includes('bestseller')).slice(0, 4)
  const fallbackFeatured = bestsellers.length ? bestsellers : products.slice(0, 4)

  function openDay(dayKey: string) {
    window.dispatchEvent(new CustomEvent(OPEN_DAY_MATCH_EVENT, { detail: { dayKey } }))
  }

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

      {/* Hero — the Day Match chips are embedded directly in the hero so
          the AI feature is the first thing a visitor can act on. Mount-
          triggered fade only, never scroll-linked (see January's
          Reveal.tsx fix, applied fresh here). */}
      <div className="relative h-[92vh] min-h-[600px] overflow-hidden">
        <AaramImg src={AARAM_CAMPAIGN.hero} alt="" bg="var(--ar-accent)" priority className="absolute inset-0 w-full h-full" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(46,42,38,0.15) 0%, rgba(46,42,38,0.72) 100%)' }} />
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative h-full flex flex-col items-center justify-center text-center px-6"
        >
          <p className="text-[11px] tracking-[0.3em] uppercase mb-5" style={{ color: 'rgba(232,223,209,0.85)' }}>aaram · आराम</p>
          <h1 className="aaram-display text-[9vw] sm:text-5xl md:text-6xl leading-[1.1] tracking-tight max-w-2xl" style={{ color: '#F3ECE0' }}>
            {brand.tagline}
          </h1>
          <p className="text-sm md:text-base mt-5 mb-8 max-w-md" style={{ color: 'rgba(243,236,224,0.82)' }}>
            Tell us what kind of day it is — we&apos;ll pick the outfit that actually fits it.
          </p>
          <div className="flex items-center gap-2.5 flex-wrap justify-center max-w-lg mb-3">
            {DAY_TYPES.map(d => (
              <button
                key={d.key}
                onClick={() => openDay(d.key)}
                className="flex items-center gap-1.5 rounded-full px-4 py-2 text-xs tracking-wide uppercase font-semibold transition-transform hover:scale-105"
                style={{ background: 'rgba(243,236,224,0.12)', border: '1px solid rgba(243,236,224,0.3)', color: '#F3ECE0', backdropFilter: 'blur(8px)' }}
              >
                <span>{d.emoji}</span> {d.label}
              </button>
            ))}
          </div>
          <p className="text-[11px] tracking-[0.15em] uppercase mb-8" style={{ color: 'rgba(243,236,224,0.6)' }}>
            Tap a day — we&apos;ll build the outfit
          </p>
          <Link href={`/store/${slug}/shop`} className="px-7 py-3.5 rounded-full text-sm tracking-wide font-medium transition-transform hover:scale-105" style={{ background: 'var(--ar-accent)', color: 'var(--ar-accent-ink)' }}>
            Shop the Collection
          </Link>
        </motion.div>
      </div>

      {/* Category tiles */}
      {categories.length > 0 && (
        <section className="max-w-[1440px] mx-auto px-6 md:px-10 py-24">
          <Reveal>
            <div className="flex items-end justify-between mb-8">
              <h2 className="aaram-display text-2xl md:text-3xl">Shop by category</h2>
              <Link href={`/store/${slug}/shop`} className="text-sm underline underline-offset-4 hover:opacity-70" style={{ color: 'var(--ar-ink-muted)' }}>View all</Link>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
            {categories.map((c, i) => (
              <Reveal key={c.name} delay={i * 0.05}>
                <Link href={`/store/${slug}/shop?category=${encodeURIComponent(c.name)}`} className="group block relative aspect-[3/4] overflow-hidden rounded-xl">
                  {c.image && <AaramImg src={c.image} alt={c.name} className="w-full h-full transition-transform duration-700 group-hover:scale-[1.05]" />}
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(46,42,38,0.6) 100%)' }} />
                  <span className="absolute bottom-4 left-4 text-sm tracking-wide" style={{ color: '#fff' }}>{c.name}</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Curated for you — same honest client-side personalization pattern
          as every other flagship theme, different presentation */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-10 pb-24">
        <Reveal>
          <div className="mb-8">
            <h2 className="aaram-display text-2xl md:text-3xl">{personalized ? 'Curated for you' : 'The comfort favorites'}</h2>
            <p className="text-sm mt-1.5" style={{ color: 'var(--ar-ink-muted)' }}>
              {personalized ? 'Based on what you’ve been looking at.' : 'The pieces people don\'t take off.'}
            </p>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
          {(personalized ? curated : fallbackFeatured).map((p, i) => (
            <Reveal key={p.id} delay={i * 0.06}>
              <AaramProductCard product={p} slug={slug} priority={i < 2} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Editorial — soft home-lifestyle story */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-10 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-stretch">
          <Reveal className="md:row-span-2">
            <AaramImg src={AARAM_CAMPAIGN.homeStudy} alt="" bg="var(--ar-sage)" className="w-full h-full rounded-xl min-h-[320px]" />
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex flex-col justify-center h-full py-8 md:py-0 md:pl-8">
              <p className="text-[11px] tracking-[0.25em] uppercase mb-4 font-medium" style={{ color: 'var(--ar-accent)' }}>Unhurried, on purpose</p>
              <h2 className="aaram-display text-3xl md:text-4xl leading-tight mb-5">Comfort first. Everything else can wait.</h2>
              <p className="text-sm leading-relaxed max-w-md" style={{ color: 'var(--ar-ink-muted)' }}>
                {brand.name} exists for the ten hours a day you spend at home and mean it — soft fabrics, forgiving fits, and outfits that never ask you to sit up straighter than you feel.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <AaramImg src={AARAM_CAMPAIGN.texture} alt="" bg="var(--ar-card)" className="w-full h-full rounded-xl min-h-[220px]" />
          </Reveal>
        </div>
      </section>

      {/* Day Match CTA band */}
      <section className="pb-24">
        <Reveal>
          <div className="max-w-[1440px] mx-auto px-6 md:px-10">
            <div className="relative rounded-xl overflow-hidden">
              <AaramImg src={AARAM_CAMPAIGN.flatlayOutfit} alt="" bg="var(--ar-accent)" className="w-full h-[380px] md:h-[460px]" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6" style={{ background: 'linear-gradient(180deg, rgba(46,42,38,0.1) 0%, rgba(46,42,38,0.72) 100%)' }}>
                <p className="text-[11px] tracking-[0.25em] uppercase mb-4 font-medium" style={{ color: 'rgba(243,236,224,0.85)' }}>Not sure what to wear today?</p>
                <h2 className="aaram-display text-2xl md:text-4xl mb-6" style={{ color: '#F3ECE0' }}>Let your day pick the outfit.</h2>
                <p className="text-sm max-w-md mb-6" style={{ color: 'rgba(243,236,224,0.82)' }}>
                  Day Match is our AI stylist — tuned to how your day actually looks, not just what&apos;s trending.
                </p>
                <button
                  onClick={() => openDay('wfh')}
                  className="px-7 py-3.5 rounded-full text-sm tracking-wide font-medium transition-transform hover:scale-105"
                  style={{ background: 'var(--ar-accent)', color: 'var(--ar-accent-ink)' }}
                >
                  Try Day Match
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
