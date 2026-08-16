'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { TRYITON_CAMPAIGN } from '@/lib/tryiton/catalog'
import { useCuratedForYou } from '@/lib/flagship/use-recently-viewed'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'
import { TryItOnProductCard } from './TryItOnShopGrid'
import { TryItOnImg } from './TryItOnShell'
import { Reveal } from '@/components/flagship/Reveal'

export function TryItOnHome({ brand, products }: { brand: ThemeBrand; products: ThemeProduct[] }) {
  const slug = brand.slug

  const categories = useMemo(() => {
    const list = brand.categories.length ? brand.categories : Array.from(new Set(products.map(p => p.category)))
    return list.map(c => ({ name: c, image: products.find(p => p.category === c)?.image ?? products[0]?.image }))
  }, [brand.categories, products])

  const { products: curated, personalized } = useCuratedForYou('tryiton_viewed_v1', products, 8)
  const bestsellers = products.filter(p => p.tags.includes('bestseller')).slice(0, 4)

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'ClothingStore', name: brand.name, description: brand.description }) }} />

      <div className="relative h-[70vh] min-h-[440px] overflow-hidden">
        <TryItOnImg src={TRYITON_CAMPAIGN.hero} alt="" wrapperClassName="absolute inset-0" bg="var(--ti-card)" priority />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(20,17,22,0.2) 0%, rgba(20,17,22,0.75) 100%)' }} />
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative h-full flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-[9vw] sm:text-5xl md:text-6xl font-extrabold leading-[1.02] tracking-tight" style={{ color: 'var(--ti-ink)', fontFamily: 'var(--ti-display)' }}>{brand.tagline}</h1>
          <p className="text-sm md:text-base mt-5 mb-8 max-w-md" style={{ color: 'var(--ti-ink-muted)' }}>Every product page opens with the real reel playing — no more guessing how it moves.</p>
          <Link href={`/store/${slug}/shop`} className="px-8 py-3.5 rounded-full text-sm font-semibold transition-transform hover:scale-105" style={{ background: 'var(--ti-accent)', color: 'var(--ti-accent-ink)' }}>Shop Now</Link>
        </motion.div>
      </div>

      {categories.length > 0 && (
        <section className="max-w-[1440px] mx-auto px-6 md:px-10 py-14">
          <Reveal><h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ fontFamily: 'var(--ti-display)' }}>Shop by Category</h2></Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((c, i) => (
              <Reveal key={c.name} delay={i * 0.05}>
                <Link href={`/store/${slug}/shop?category=${encodeURIComponent(c.name)}`} className="group block relative aspect-[4/5] overflow-hidden rounded-xl">
                  {c.image && <TryItOnImg src={c.image} alt={c.name} wrapperClassName="w-full h-full" imgClassName="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />}
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 45%, rgba(20,17,22,0.75) 100%)' }} />
                  <span className="absolute bottom-4 left-4 text-sm font-semibold" style={{ color: 'var(--ti-ink)' }}>{c.name}</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <section className="max-w-[1440px] mx-auto px-6 md:px-10 pb-20">
        <Reveal>
          <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ fontFamily: 'var(--ti-display)' }}>{personalized ? 'Picked for you' : 'Bestsellers'}</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--ti-ink-muted)' }}>{personalized ? 'Based on what you’ve been looking at.' : 'What everyone’s buying right now.'}</p>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {(personalized ? curated : (bestsellers.length ? bestsellers : products.slice(0, 4))).map((p, i) => (
            <Reveal key={p.id} delay={i * 0.05}><TryItOnProductCard product={p} slug={slug} /></Reveal>
          ))}
        </div>
      </section>
    </div>
  )
}
