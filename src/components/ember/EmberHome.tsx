'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { EMBER_CAMPAIGN, MOODS } from '@/lib/ember/catalog'
import { useCuratedForYou } from '@/lib/flagship/use-recently-viewed'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'
import { EmberProductCard } from './EmberProductCard'
import { Reveal } from '@/components/flagship/Reveal'
import { OPEN_MOOD_MATCH_EVENT } from './EmberShell'

export function EmberHome({ brand, products }: { brand: ThemeBrand; products: ThemeProduct[] }) {
  const slug = brand.slug

  const categories = useMemo(() => {
    const list = brand.categories.length ? brand.categories : Array.from(new Set(products.map(p => p.category)))
    return list.map(c => ({ name: c, image: products.find(p => p.category === c)?.image ?? products[0]?.image }))
  }, [brand.categories, products])

  const { products: curated, personalized } = useCuratedForYou('ember_viewed_v1', products, 4)
  const bestsellers = products.filter(p => p.tags.includes('bestseller')).slice(0, 4)
  const fallbackFeatured = bestsellers.length ? bestsellers : products.slice(0, 4)

  function openMood(moodKey: string) {
    window.dispatchEvent(new CustomEvent(OPEN_MOOD_MATCH_EVENT, { detail: { moodKey } }))
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

      {/* Hero — bold typographic wordmark over campaign photography, with
          the Mood Match chips embedded directly in the hero so the AI
          feature is the first thing a visitor can act on. Mount-triggered
          fade only, never scroll-linked (see January's Reveal.tsx fix). */}
      <div className="relative h-[92vh] min-h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <img src={EMBER_CAMPAIGN.hero} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(18,13,18,0.35) 0%, rgba(18,13,18,0.85) 100%)' }} />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative h-full flex flex-col items-center justify-center text-center px-6"
        >
          <h1 className="ember-display text-[16vw] sm:text-7xl md:text-8xl leading-[0.92] tracking-tight" style={{ color: '#F5EFE8', fontWeight: 800 }}>
            EMBER
          </h1>
          <p className="text-sm md:text-base tracking-[0.15em] uppercase mt-4 mb-9" style={{ color: 'rgba(245,239,232,0.8)' }}>
            {brand.tagline}
          </p>
          <div className="flex items-center gap-2.5 flex-wrap justify-center max-w-lg mb-3">
            {MOODS.map(m => (
              <button
                key={m.key}
                onClick={() => openMood(m.key)}
                className="flex items-center gap-1.5 rounded-full px-4 py-2 text-xs tracking-wide uppercase font-semibold transition-transform hover:scale-105"
                style={{ background: 'rgba(245,239,232,0.1)', border: '1px solid rgba(245,239,232,0.25)', color: '#F5EFE8', backdropFilter: 'blur(8px)' }}
              >
                <span>{m.emoji}</span> {m.label}
              </button>
            ))}
          </div>
          <p className="text-[11px] tracking-[0.15em] uppercase mb-8" style={{ color: 'rgba(245,239,232,0.55)' }}>
            Tap a mood — we&apos;ll build the outfit
          </p>
          <Link href={`/store/${slug}/shop`} className="px-7 py-3.5 rounded-full text-sm tracking-wide font-semibold transition-transform hover:scale-105" style={{ background: 'var(--e-accent)', color: 'var(--e-accent-ink)' }}>
            Shop the Collection
          </Link>
        </motion.div>
      </div>

      {/* Category tiles */}
      {categories.length > 0 && (
        <section className="max-w-[1440px] mx-auto px-6 md:px-10 py-24">
          <Reveal>
            <div className="flex items-end justify-between mb-8">
              <h2 className="ember-display text-2xl md:text-3xl" style={{ fontWeight: 600 }}>Shop by category</h2>
              <Link href={`/store/${slug}/shop`} className="text-sm underline underline-offset-4 hover:opacity-70" style={{ color: 'var(--e-ink-muted)' }}>View all</Link>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
            {categories.map((c, i) => (
              <Reveal key={c.name} delay={i * 0.05}>
                <Link href={`/store/${slug}/shop?category=${encodeURIComponent(c.name)}`} className="group block relative aspect-[3/4] overflow-hidden rounded-lg">
                  {c.image && <img src={c.image} alt={c.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]" />}
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(18,13,18,0.7) 100%)' }} />
                  <span className="absolute bottom-4 left-4 text-sm tracking-wide font-medium" style={{ color: '#fff' }}>{c.name}</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Curated for you — same honest client-side personalization pattern
          as January, different presentation */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-10 pb-24">
        <Reveal>
          <div className="mb-8">
            <h2 className="ember-display text-2xl md:text-3xl" style={{ fontWeight: 600 }}>{personalized ? 'Curated for you' : 'Fan favorites'}</h2>
            <p className="text-sm mt-1.5" style={{ color: 'var(--e-ink-muted)' }}>
              {personalized ? 'Based on what you’ve been looking at.' : 'The pieces everyone asks about.'}
            </p>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
          {(personalized ? curated : fallbackFeatured).map((p, i) => (
            <Reveal key={p.id} delay={i * 0.06}>
              <EmberProductCard product={p} slug={slug} priority={i < 2} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Color story — editorial section, the equivalent beat to January's
          "Atelier" but built around texture/color instead of craft/material */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-10 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-stretch">
          <Reveal className="md:row-span-2">
            <img src={EMBER_CAMPAIGN.colorStudy} alt="" className="w-full h-full object-cover rounded-lg min-h-[320px]" />
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex flex-col justify-center h-full py-8 md:py-0 md:pl-8">
              <p className="text-[11px] tracking-[0.25em] uppercase mb-4 font-semibold" style={{ color: 'var(--e-accent)' }}>Color, on purpose</p>
              <h2 className="ember-display text-3xl md:text-4xl leading-tight mb-5" style={{ fontWeight: 600 }}>No neutrals unless you ask for them.</h2>
              <p className="text-sm leading-relaxed max-w-md" style={{ color: 'var(--e-ink-muted)' }}>
                {brand.name} exists for the days you don&apos;t want to disappear into the background. Every piece is dyed, not diluted — color chosen for how it makes you feel, not how safely it sells.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <img src={EMBER_CAMPAIGN.texture} alt="" className="w-full h-full object-cover rounded-lg min-h-[220px]" />
          </Reveal>
        </div>
      </section>

      {/* Mood Match CTA band */}
      <section className="pb-24">
        <Reveal>
          <div className="max-w-[1440px] mx-auto px-6 md:px-10">
            <div className="relative rounded-lg overflow-hidden">
              <img src={EMBER_CAMPAIGN.flatlayOutfit} alt="" className="w-full h-[380px] md:h-[460px] object-cover" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6" style={{ background: 'linear-gradient(180deg, rgba(18,13,18,0.2) 0%, rgba(18,13,18,0.82) 100%)' }}>
                <p className="text-[11px] tracking-[0.25em] uppercase mb-4 font-semibold" style={{ color: 'var(--e-accent)' }}>Not sure where to start?</p>
                <h2 className="ember-display text-2xl md:text-4xl mb-6" style={{ color: '#F5EFE8', fontWeight: 800 }}>Let your mood pick the outfit.</h2>
                <p className="text-sm max-w-md mb-6" style={{ color: 'rgba(245,239,232,0.8)' }}>
                  Mood Match is our AI stylist, tuned to how you feel today — not just what&apos;s trending.
                </p>
                <button
                  onClick={() => openMood('bold')}
                  className="px-7 py-3.5 rounded-full text-sm tracking-wide font-semibold transition-transform hover:scale-105 ember-glow"
                  style={{ background: 'var(--e-accent)', color: 'var(--e-accent-ink)' }}
                >
                  Try Mood Match
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
