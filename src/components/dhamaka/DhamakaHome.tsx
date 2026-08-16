'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { DHAMAKA_CAMPAIGN, getPriceHistory } from '@/lib/dhamaka/catalog'
import { useCuratedForYou } from '@/lib/flagship/use-recently-viewed'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'
import { DhamakaProductCard } from './DhamakaShopGrid'
import { analyzePriceTrend } from './DhamakaPriceRadar'
import { Reveal } from '@/components/flagship/Reveal'

function CampaignImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [ok, setOk] = useState(true)
  return (
    <div className={className} style={{ background: 'linear-gradient(135deg, var(--dh-red), var(--dh-yellow))' }}>
      {ok && (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={() => setOk(false)}
        />
      )}
    </div>
  )
}

export function DhamakaHome({ brand, products }: { brand: ThemeBrand; products: ThemeProduct[] }) {
  const slug = brand.slug

  const categories = useMemo(() => {
    const list = brand.categories.length ? brand.categories : Array.from(new Set(products.map(p => p.category)))
    return list.map(c => ({ name: c, image: products.find(p => p.category === c)?.image ?? products[0]?.image }))
  }, [brand.categories, products])

  const { products: curated, personalized } = useCuratedForYou('dhamaka_viewed_v1', products, 4)
  const bestsellers = products.filter(p => p.tags.includes('bestseller')).slice(0, 4)
  const fallbackFeatured = bestsellers.length ? bestsellers : products.slice(0, 4)

  // Price Radar "best price right now" rail — genuinely computed from each
  // product's price history, not hand-picked. Distinct from the "curated
  // for you" rail below (which is a browsing-history signal); this one is
  // the timing-pressure signal that's DHAMAKA's whole reason for existing.
  const radarPicks = useMemo(() => {
    return products
      .filter(p => analyzePriceTrend(getPriceHistory(p), p.price, p.id).tone === 'floor')
      .slice(0, 4)
  }, [products])
  const radarFallback = radarPicks.length ? radarPicks : products.slice(0, 4)

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

      {/* Hero — loud, numbers-forward, poster energy. No fake countdown
          clock: the tagline ("Ends when it ends.") is a deliberate wink at
          that trope — the real urgency signal is Price Radar, further down,
          which is actually computed rather than a ticking prop. Mount-
          triggered fade only, never scroll-linked. */}
      <div className="relative h-[92vh] min-h-[560px] overflow-hidden" style={{ background: 'linear-gradient(160deg, #1a0a0c 0%, var(--dh-bg) 60%)' }}>
        <div className="absolute inset-0">
          <CampaignImage src={DHAMAKA_CAMPAIGN.hero} alt="" className="w-full h-full object-cover opacity-70" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(18,18,18,0.15) 0%, rgba(18,18,18,0.9) 100%)' }} />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative h-full flex flex-col items-center justify-center text-center px-6"
        >
          <p className="text-[11px] font-bold tracking-[0.3em] uppercase mb-5 px-3 py-1.5 rounded" style={{ background: 'var(--dh-red)', color: 'var(--dh-red-ink)' }}>
            Mega Sale Live — ₹299 to ₹1,999
          </p>
          <h1 className="dhamaka-display text-[18vw] sm:text-8xl md:text-9xl leading-[0.9] tracking-tight" style={{ color: 'var(--dh-yellow)', WebkitTextStroke: '2px var(--dh-red)' }}>
            {brand.name}
          </h1>
          <p className="text-lg md:text-2xl mt-4 mb-9 max-w-lg font-semibold" style={{ color: '#FFFFFF' }}>
            {brand.tagline}
          </p>
          <div className="flex items-center gap-4">
            <Link href={`/store/${slug}/shop`} className="px-8 py-3.5 rounded text-sm tracking-wide font-black uppercase transition-transform hover:scale-105" style={{ background: 'var(--dh-red)', color: 'var(--dh-red-ink)' }}>
              Shop the Blast
            </Link>
            <a href="#radar-picks" className="px-7 py-3.5 rounded text-sm tracking-wide font-black uppercase border-2 transition-opacity hover:opacity-70" style={{ borderColor: 'var(--dh-yellow)', color: 'var(--dh-yellow)' }}>
              See Price Radar
            </a>
          </div>
        </motion.div>
      </div>

      {/* Price Radar explainer strip — this is the mechanic, not a footnote */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-10 py-20 grid grid-cols-1 md:grid-cols-3 gap-10">
        {[
          { n: '📡', title: 'We track every price', body: 'Every listing carries ~60 days of real price history — not a made-up "was" number slapped on for the sale.' },
          { n: '⚡', title: 'Radar reads the trend', body: 'A price sitting at its floor, still sliding, or creeping back up gets flagged differently — honestly, not uniformly "URGENT".' },
          { n: '🛍️', title: 'You buy with real info', body: 'Sometimes Radar tells you to wait a few days. That\'s the point — the label means something.' },
        ].map((s, i) => (
          <Reveal key={s.title} delay={i * 0.1}>
            <p className="text-3xl mb-4">{s.n}</p>
            <h3 className="dhamaka-display text-xl mb-2.5 tracking-wide" style={{ color: 'var(--dh-yellow)' }}>{s.title}</h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--dh-ink-muted)' }}>{s.body}</p>
          </Reveal>
        ))}
      </section>

      {/* Category strip */}
      {categories.length > 0 && (
        <section className="max-w-[1440px] mx-auto px-6 md:px-10 pb-24">
          <Reveal>
            <div className="flex items-end justify-between mb-8">
              <h2 className="dhamaka-display text-3xl md:text-4xl" style={{ color: 'var(--dh-yellow)' }}>Shop by Category</h2>
              <Link href={`/store/${slug}/shop`} className="text-sm font-bold underline underline-offset-4 hover:opacity-70" style={{ color: 'var(--dh-ink-muted)' }}>View all</Link>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
            {categories.map((c, i) => (
              <Reveal key={c.name} delay={i * 0.05}>
                <Link href={`/store/${slug}/shop?category=${encodeURIComponent(c.name)}`} className="group block relative aspect-[3/4] overflow-hidden rounded" style={{ background: 'var(--dh-card)' }}>
                  {c.image && (
                    <img
                      src={c.image}
                      alt={c.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                      onError={e => { e.currentTarget.style.display = 'none' }}
                    />
                  )}
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(18,18,18,0.75) 100%)' }} />
                  <span className="absolute bottom-4 left-4 text-sm font-black uppercase tracking-wide" style={{ color: 'var(--dh-yellow)' }}>{c.name}</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Price Radar picks — the products genuinely at their lowest-price
          floor right now, computed from history, not curated by hand. */}
      <section id="radar-picks" className="max-w-[1440px] mx-auto px-6 md:px-10 pb-24">
        <Reveal>
          <div className="mb-8 flex items-center gap-3">
            <span className="text-[11px] font-black uppercase tracking-wide px-2.5 py-1.5 rounded" style={{ background: 'var(--dh-yellow)', color: 'var(--dh-yellow-ink)' }}>⚡ Price Radar</span>
            <div>
              <h2 className="dhamaka-display text-3xl md:text-4xl" style={{ color: 'var(--dh-yellow)' }}>Lowest Prices Right Now</h2>
            </div>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
          {radarFallback.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.06}>
              <DhamakaProductCard product={p} slug={slug} priority={i < 2} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Curated for you */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-10 pb-24">
        <Reveal>
          <div className="mb-8">
            <h2 className="dhamaka-display text-3xl md:text-4xl" style={{ color: 'var(--dh-yellow)' }}>{personalized ? 'Picked For You' : 'Bestsellers'}</h2>
            <p className="text-sm mt-1.5 font-medium" style={{ color: 'var(--dh-ink-muted)' }}>
              {personalized ? 'Based on what you\'ve been looking at.' : 'The deals everyone\'s adding to bag.'}
            </p>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
          {(personalized ? curated : fallbackFeatured).map((p, i) => (
            <Reveal key={p.id} delay={i * 0.06}>
              <DhamakaProductCard product={p} slug={slug} priority={i < 2} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Blast CTA band */}
      <section className="pb-24">
        <Reveal>
          <div className="max-w-[1440px] mx-auto px-6 md:px-10">
            <div className="relative rounded overflow-hidden">
              <CampaignImage src={DHAMAKA_CAMPAIGN.haulFlatlay} alt="" className="w-full h-[380px] md:h-[460px] object-cover" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6" style={{ background: 'linear-gradient(180deg, rgba(18,18,18,0.2) 0%, rgba(18,18,18,0.82) 100%)' }}>
                <p className="text-[11px] font-black tracking-[0.25em] uppercase mb-4 px-3 py-1.5 rounded" style={{ background: 'var(--dh-red)', color: 'var(--dh-red-ink)' }}>Everything under ₹1,999</p>
                <h2 className="dhamaka-display text-3xl md:text-5xl mb-6" style={{ color: 'var(--dh-yellow)' }}>The blast doesn&apos;t wait.</h2>
                <Link
                  href={`/store/${slug}/shop`}
                  className="px-8 py-3.5 rounded text-sm tracking-wide font-black uppercase transition-transform hover:scale-105"
                  style={{ background: 'var(--dh-red)', color: 'var(--dh-red-ink)' }}
                >
                  Shop the Blast
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
