'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { BLOOM_CAMPAIGN } from '@/lib/bloom/catalog'
import { useCuratedForYou } from '@/lib/flagship/use-recently-viewed'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'
import { BloomProductCard } from './BloomProductCard'
import { Reveal } from '@/components/flagship/Reveal'

const HOW_IT_WORKS = [
  { n: '01', title: 'Answer four questions', body: 'Occasion, palette, fit, and the one piece you can\'t live without. Takes about a minute.' },
  { n: '02', title: 'Get your capsule', body: 'We score the whole collection against your answers and assemble a real, matching capsule — not a random grid.' },
  { n: '03', title: 'Add it to your bag', body: 'One tap adds the whole capsule, or pick pieces individually. Either way, it was built to combine.' },
]

export function BloomHome({ brand, products }: { brand: ThemeBrand; products: ThemeProduct[] }) {
  const slug = brand.slug

  const categories = useMemo(() => {
    const list = brand.categories.length ? brand.categories : Array.from(new Set(products.map(p => p.category)))
    return list.map(c => ({ name: c, image: products.find(p => p.category === c)?.image ?? products[0]?.image }))
  }, [brand.categories, products])

  const { products: curated, personalized } = useCuratedForYou('bloom_viewed_v1', products, 4)
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

      {/* Hero — the Style Quiz is the primary CTA, not a widget bolted onto a
          browse-first homepage. Mount-triggered fade only, never scroll-linked
          (see January's Reveal.tsx fix, applied fresh here). */}
      <div className="relative h-[92vh] min-h-[560px] overflow-hidden">
        <div className="absolute inset-0">
          <img src={BLOOM_CAMPAIGN.hero} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(250,245,236,0.05) 0%, rgba(43,38,32,0.45) 100%)' }} />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative h-full flex flex-col items-center justify-center text-center px-6"
        >
          <p className="text-[11px] tracking-[0.3em] uppercase mb-5" style={{ color: 'rgba(255,255,255,0.85)' }}>Skip the scroll</p>
          <h1 className="bloom-display italic text-[13vw] sm:text-6xl md:text-7xl leading-[0.98] tracking-tight" style={{ color: '#FAF5EC' }}>
            {brand.tagline}
          </h1>
          <p className="text-sm md:text-base mt-5 mb-9 max-w-md" style={{ color: 'rgba(255,255,255,0.85)' }}>
            Answer four quick questions and we&apos;ll assemble your capsule for you.
          </p>
          <div className="flex items-center gap-4">
            <Link href={`/store/${slug}/quiz`} className="px-8 py-3.5 rounded-full text-sm tracking-wide font-medium transition-transform hover:scale-105" style={{ background: '#FAF5EC', color: '#2B2620' }}>
              Take the Style Quiz
            </Link>
            <Link href={`/store/${slug}/shop`} className="px-7 py-3.5 rounded-full text-sm tracking-wide border transition-opacity hover:opacity-70" style={{ borderColor: 'rgba(255,255,255,0.5)', color: '#FAF5EC' }}>
              Or browse everything
            </Link>
          </div>
        </motion.div>
      </div>

      {/* How it works — reinforces quiz-first as the mechanic, not a footnote */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-10 py-24 grid grid-cols-1 md:grid-cols-3 gap-12">
        {HOW_IT_WORKS.map((s, i) => (
          <Reveal key={s.n} delay={i * 0.1}>
            <p className="bloom-display italic text-3xl mb-4" style={{ color: 'var(--bl-accent)' }}>{s.n}</p>
            <h3 className="text-lg mb-2.5 font-medium">{s.title}</h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--bl-ink-muted)' }}>{s.body}</p>
          </Reveal>
        ))}
      </section>

      {/* Editorial — botanical story */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-10 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-stretch">
          <Reveal className="md:row-span-2">
            <img src={BLOOM_CAMPAIGN.botanicalStudy} alt="" className="w-full h-full object-cover rounded-xl min-h-[320px]" />
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex flex-col justify-center h-full py-8 md:py-0 md:pl-8">
              <p className="text-[11px] tracking-[0.25em] uppercase mb-4 font-medium" style={{ color: 'var(--bl-accent)' }}>Considered growth</p>
              <h2 className="bloom-display italic text-4xl md:text-5xl leading-tight mb-5">Better math, not more clothes.</h2>
              <p className="text-sm leading-relaxed max-w-md" style={{ color: 'var(--bl-ink-muted)' }}>
                {brand.name} is eighteen pieces built to combine, not compete. Every color was chosen to talk to every other color in the capsule — so the wardrobe grows in outfits, not in things you own.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <img src={BLOOM_CAMPAIGN.texture} alt="" className="w-full h-full object-cover rounded-xl min-h-[220px]" />
          </Reveal>
        </div>
      </section>

      {/* Browse instead — secondary path, de-emphasized but not hidden */}
      {categories.length > 0 && (
        <section className="max-w-[1440px] mx-auto px-6 md:px-10 pb-24">
          <Reveal>
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="bloom-display italic text-3xl md:text-4xl">Prefer to browse?</h2>
                <p className="text-sm mt-1.5" style={{ color: 'var(--bl-ink-muted)' }}>The full capsule, by category.</p>
              </div>
              <Link href={`/store/${slug}/shop`} className="text-sm underline underline-offset-4 hover:opacity-70" style={{ color: 'var(--bl-ink-muted)' }}>View all</Link>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
            {categories.map((c, i) => (
              <Reveal key={c.name} delay={i * 0.05}>
                <Link href={`/store/${slug}/shop?category=${encodeURIComponent(c.name)}`} className="group block relative aspect-[3/4] overflow-hidden rounded-xl">
                  {c.image && <img src={c.image} alt={c.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]" />}
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(43,38,32,0.55) 100%)' }} />
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
            <h2 className="bloom-display italic text-3xl md:text-4xl">{personalized ? 'Curated for you' : 'Capsule favorites'}</h2>
            <p className="text-sm mt-1.5" style={{ color: 'var(--bl-ink-muted)' }}>
              {personalized ? 'Based on what you’ve been looking at.' : 'The pieces that anchor the whole capsule.'}
            </p>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
          {(personalized ? curated : fallbackFeatured).map((p, i) => (
            <Reveal key={p.id} delay={i * 0.06}>
              <BloomProductCard product={p} slug={slug} priority={i < 2} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Quiz CTA band */}
      <section className="pb-24">
        <Reveal>
          <div className="max-w-[1440px] mx-auto px-6 md:px-10">
            <div className="relative rounded-xl overflow-hidden">
              <img src={BLOOM_CAMPAIGN.flatlayOutfit} alt="" className="w-full h-[380px] md:h-[460px] object-cover" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6" style={{ background: 'linear-gradient(180deg, rgba(43,38,32,0.08) 0%, rgba(43,38,32,0.68) 100%)' }}>
                <p className="text-[11px] tracking-[0.25em] uppercase mb-4 font-medium" style={{ color: 'rgba(255,255,255,0.85)' }}>Haven&apos;t taken the quiz yet?</p>
                <h2 className="bloom-display italic text-3xl md:text-5xl mb-6" style={{ color: '#FAF5EC' }}>See how many outfits four answers can build.</h2>
                <Link
                  href={`/store/${slug}/quiz`}
                  className="px-8 py-3.5 rounded-full text-sm tracking-wide font-medium transition-transform hover:scale-105"
                  style={{ background: '#FAF5EC', color: '#2B2620' }}
                >
                  Take the Style Quiz
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
