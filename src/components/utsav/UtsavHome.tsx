'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { UTSAV_CAMPAIGN } from '@/lib/utsav/catalog'
import { useCuratedForYou } from '@/lib/flagship/use-recently-viewed'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'
import { UtsavProductCard, UtsavImg } from './UtsavShell'
import { Reveal } from '@/components/flagship/Reveal'

const HOW_IT_WORKS = [
  { n: '01', title: 'Tell us who it’s for', body: 'A parent, a colleague, a college friend — describe them in your own words, however loosely.' },
  { n: '02', title: 'Set a budget', body: 'From a small token to a generous hamper. We only suggest bundles that actually fit it.' },
  { n: '03', title: 'Get the bundle & the card', body: 'A real gift built from the catalog, plus a short note you can actually put on the card.' },
]

export function UtsavHome({ brand, products }: { brand: ThemeBrand; products: ThemeProduct[] }) {
  const slug = brand.slug

  const categories = useMemo(() => {
    const list = brand.categories.length ? brand.categories : Array.from(new Set(products.map(p => p.category)))
    return list.map(c => ({ name: c, image: products.find(p => p.category === c)?.image ?? products[0]?.image }))
  }, [brand.categories, products])

  const { products: curated, personalized } = useCuratedForYou('utsav_viewed_v1', products, 4)
  const bestsellers = products.filter(p => p.tags.includes('bestseller')).slice(0, 4)
  const fallbackFeatured = bestsellers.length ? bestsellers : products.slice(0, 4)

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

      {/* Hero — Find a Gift is the primary CTA, not a widget bolted onto a
          browse-first homepage. Mount-triggered fade only, never scroll-linked
          (see the Reveal.tsx house rule). */}
      <div className="relative h-[92vh] min-h-[560px] overflow-hidden">
        <UtsavImg src={UTSAV_CAMPAIGN.hero} alt="" className="absolute inset-0" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(59,31,31,0.15) 0%, rgba(35,15,15,0.6) 100%)' }} />
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative h-full flex flex-col items-center justify-center text-center px-6"
        >
          <p className="text-[11px] tracking-[0.3em] uppercase mb-5" style={{ color: 'var(--ut-gold)' }}>Shopping for someone else?</p>
          <h1 className="utsav-display text-[10vw] sm:text-5xl md:text-6xl leading-[1.05] tracking-tight" style={{ color: '#FDF6EC' }}>
            {brand.tagline}
          </h1>
          <p className="text-sm md:text-base mt-5 mb-9 max-w-md" style={{ color: 'rgba(253,246,236,0.85)' }}>
            Describe who the gift is for and your budget — we&apos;ll build the bundle and write the card.
          </p>
          <div className="flex items-center gap-4">
            <Link href={`/store/${slug}/gift-finder`} className="px-8 py-3.5 rounded-full text-sm tracking-wide font-medium transition-transform hover:scale-105" style={{ background: 'var(--ut-accent)', color: 'var(--ut-accent-ink)' }}>
              Find a Gift
            </Link>
            <Link href={`/store/${slug}/shop`} className="px-7 py-3.5 rounded-full text-sm tracking-wide border transition-opacity hover:opacity-70" style={{ borderColor: 'rgba(253,246,236,0.5)', color: '#FDF6EC' }}>
              Or browse everything
            </Link>
          </div>
        </motion.div>
      </div>

      {/* How it works — reinforces recipient-first as the mechanic */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-10 py-24 grid grid-cols-1 md:grid-cols-3 gap-12">
        {HOW_IT_WORKS.map((s, i) => (
          <Reveal key={s.n} delay={i * 0.1}>
            <p className="utsav-display text-3xl mb-4" style={{ color: 'var(--ut-accent)' }}>{s.n}</p>
            <h3 className="text-lg mb-2.5 font-medium">{s.title}</h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--ut-ink-muted)' }}>{s.body}</p>
          </Reveal>
        ))}
      </section>

      {/* Editorial — festive story */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-10 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-stretch">
          <Reveal className="md:row-span-2">
            <UtsavImg src={UTSAV_CAMPAIGN.diyaSpread} alt="" className="w-full h-full rounded-xl min-h-[320px]" />
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex flex-col justify-center h-full py-8 md:py-0 md:pl-8">
              <p className="text-[11px] tracking-[0.25em] uppercase mb-4 font-medium" style={{ color: 'var(--ut-accent)' }}>Give generously</p>
              <h2 className="utsav-display text-4xl md:text-5xl leading-tight mb-5">Every gift is chosen for someone specific.</h2>
              <p className="text-sm leading-relaxed max-w-md" style={{ color: 'var(--ut-ink-muted)' }}>
                {brand.name} exists for the moment you&apos;re shopping for a person, not for yourself — a mother who loves tradition, a friend who loves color, a boss you barely know. We match the gift to them, not the other way around.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <UtsavImg src={UTSAV_CAMPAIGN.marigoldDetail} alt="" className="w-full h-full rounded-xl min-h-[220px]" />
          </Reveal>
        </div>
      </section>

      {/* Browse instead — secondary path, de-emphasized but not hidden */}
      {categories.length > 0 && (
        <section className="max-w-[1440px] mx-auto px-6 md:px-10 pb-24">
          <Reveal>
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="utsav-display text-3xl md:text-4xl">Prefer to browse?</h2>
                <p className="text-sm mt-1.5" style={{ color: 'var(--ut-ink-muted)' }}>The full collection, by category.</p>
              </div>
              <Link href={`/store/${slug}/shop`} className="text-sm underline underline-offset-4 hover:opacity-70" style={{ color: 'var(--ut-ink-muted)' }}>View all</Link>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
            {categories.map((c, i) => (
              <Reveal key={c.name} delay={i * 0.05}>
                <Link href={`/store/${slug}/shop?category=${encodeURIComponent(c.name)}`} className="group block relative aspect-[3/4] overflow-hidden rounded-xl">
                  {c.image && <UtsavImg src={c.image} alt={c.name} className="absolute inset-0" />}
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(35,15,15,0.6) 100%)' }} />
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
            <h2 className="utsav-display text-3xl md:text-4xl">{personalized ? 'Curated for you' : 'Festival favorites'}</h2>
            <p className="text-sm mt-1.5" style={{ color: 'var(--ut-ink-muted)' }}>
              {personalized ? 'Based on what you’ve been looking at.' : 'The pieces most gifted this season.'}
            </p>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
          {(personalized ? curated : fallbackFeatured).map((p, i) => (
            <Reveal key={p.id} delay={i * 0.06}>
              <UtsavProductCard product={p} slug={slug} priority={i < 2} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Gift Finder CTA band */}
      <section className="pb-24">
        <Reveal>
          <div className="max-w-[1440px] mx-auto px-6 md:px-10">
            <div className="relative rounded-xl overflow-hidden">
              <UtsavImg src={UTSAV_CAMPAIGN.giftTable} alt="" className="w-full h-[380px] md:h-[460px]" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6" style={{ background: 'linear-gradient(180deg, rgba(35,15,15,0.1) 0%, rgba(35,15,15,0.72) 100%)' }}>
                <p className="text-[11px] tracking-[0.25em] uppercase mb-4 font-medium" style={{ color: 'var(--ut-gold)' }}>Still not sure what to get?</p>
                <h2 className="utsav-display text-3xl md:text-5xl mb-6" style={{ color: '#FDF6EC' }}>Tell us who. We&apos;ll find the gift.</h2>
                <Link
                  href={`/store/${slug}/gift-finder`}
                  className="px-8 py-3.5 rounded-full text-sm tracking-wide font-medium transition-transform hover:scale-105"
                  style={{ background: 'var(--ut-accent)', color: 'var(--ut-accent-ink)' }}
                >
                  Find a Gift
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
