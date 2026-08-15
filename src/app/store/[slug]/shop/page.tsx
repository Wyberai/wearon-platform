'use client'

import { Suspense, useEffect, useState } from 'react'
import { useParams, useSearchParams, notFound } from 'next/navigation'
import { AugustShopGrid } from '@/components/august/AugustShopGrid'
import { AUGUST_BRAND, AUGUST_PRODUCTS } from '@/lib/august/catalog'
import { EmberShopGrid } from '@/components/ember/EmberShopGrid'
import { EMBER_BRAND, EMBER_PRODUCTS } from '@/lib/ember/catalog'
import { BloomShopGrid } from '@/components/bloom/BloomShopGrid'
import { BLOOM_BRAND, BLOOM_PRODUCTS } from '@/lib/bloom/catalog'
import { configToThemeBrand, productToThemeProduct } from '@/lib/flagship/adapters'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'

const FLAGSHIP_THEME_IDS = ['january', 'february', 'march'] as const
type FlagshipThemeId = (typeof FLAGSHIP_THEME_IDS)[number]

// New route, only meaningful for a flagship theme's bespoke component tree
// (a demo brand, or any real seller who picked one) — every other tenant
// 404s here rather than affecting any existing shared behavior.
export default function ShopPage() {
  return (
    <Suspense fallback={null}>
      <ShopPageContent />
    </Suspense>
  )
}

function ShopPageContent() {
  const { slug } = useParams() as { slug: string }
  const searchParams = useSearchParams()

  if (slug === 'august') {
    return <AugustShopGrid brand={AUGUST_BRAND} products={AUGUST_PRODUCTS} initialCategory={searchParams.get('category')} />
  }
  if (slug === 'ember') {
    return <EmberShopGrid brand={EMBER_BRAND} products={EMBER_PRODUCTS} initialCategory={searchParams.get('category')} />
  }
  if (slug === 'bloom') {
    return <BloomShopGrid brand={BLOOM_BRAND} products={BLOOM_PRODUCTS} initialCategory={searchParams.get('category')} />
  }

  return <RealSellerShopGrid slug={slug} initialCategory={searchParams.get('category')} />
}

type RealSellerData = { themeId: FlagshipThemeId; brand: ThemeBrand; products: ThemeProduct[] } | 'not-flagship' | 'loading'

function RealSellerShopGrid({ slug, initialCategory }: { slug: string; initialCategory: string | null }) {
  const [data, setData] = useState<RealSellerData>('loading')

  useEffect(() => {
    let cancelled = false
    Promise.all([
      fetch(`/api/store/config?slug=${slug}`).then(r => r.json()),
      fetch(`/api/store/products?slug=${slug}`).then(r => r.json()),
    ]).then(([cfgData, prodData]) => {
      if (cancelled) return
      const themeId = cfgData.config?.theme_id
      if (!FLAGSHIP_THEME_IDS.includes(themeId)) { setData('not-flagship'); return }
      setData({
        themeId,
        brand: configToThemeBrand(cfgData.config, slug),
        products: (prodData.products ?? []).filter((p: { is_active: boolean }) => p.is_active).map(productToThemeProduct),
      })
    }).catch(() => setData('not-flagship'))
    return () => { cancelled = true }
  }, [slug])

  if (data === 'loading') return null
  if (data === 'not-flagship') return notFound()
  if (data.themeId === 'february') return <EmberShopGrid brand={data.brand} products={data.products} initialCategory={initialCategory} />
  if (data.themeId === 'march') return <BloomShopGrid brand={data.brand} products={data.products} initialCategory={initialCategory} />
  return <AugustShopGrid brand={data.brand} products={data.products} initialCategory={initialCategory} />
}
