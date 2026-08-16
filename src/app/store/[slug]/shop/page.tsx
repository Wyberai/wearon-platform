'use client'

import { Suspense, useEffect, useState } from 'react'
import { useParams, useSearchParams, notFound } from 'next/navigation'
import { AugustShopGrid } from '@/components/august/AugustShopGrid'
import { AUGUST_BRAND, AUGUST_PRODUCTS } from '@/lib/august/catalog'
import { EmberShopGrid } from '@/components/ember/EmberShopGrid'
import { EMBER_BRAND, EMBER_PRODUCTS } from '@/lib/ember/catalog'
import { BloomShopGrid } from '@/components/bloom/BloomShopGrid'
import { BLOOM_BRAND, BLOOM_PRODUCTS } from '@/lib/bloom/catalog'
import { MelaShopGrid } from '@/components/mela/MelaShopGrid'
import { MELA_BRAND, MELA_PRODUCTS } from '@/lib/mela/catalog'
import { TaanaShopGrid } from '@/components/taana/TaanaShopGrid'
import { TAANA_BRAND, TAANA_PRODUCTS } from '@/lib/taana/catalog'
import { SaajShopGrid } from '@/components/saaj/SaajShopGrid'
import { SAAJ_BRAND, SAAJ_PRODUCTS } from '@/lib/saaj/catalog'
import { ScrollShopGrid } from '@/components/scroll/ScrollShopGrid'
import { SCROLL_BRAND, SCROLL_PRODUCTS } from '@/lib/scroll/catalog'
import { DhamakaShopGrid } from '@/components/dhamaka/DhamakaShopGrid'
import { DHAMAKA_BRAND, DHAMAKA_PRODUCTS } from '@/lib/dhamaka/catalog'
import { AaramShopGrid } from '@/components/aaram/AaramShopGrid'
import { AARAM_BRAND, AARAM_PRODUCTS } from '@/lib/aaram/catalog'
import { UtsavShopGrid } from '@/components/utsav/UtsavShopGrid'
import { UTSAV_BRAND, UTSAV_PRODUCTS } from '@/lib/utsav/catalog'
import { GalliShopGrid } from '@/components/galli/GalliShopGrid'
import { GALLI_BRAND, GALLI_PRODUCTS } from '@/lib/galli/catalog'
import { KirayaShopGrid } from '@/components/kiraya/KirayaShopGrid'
import { KIRAYA_BRAND, KIRAYA_PRODUCTS } from '@/lib/kiraya/catalog'
import { configToThemeBrand, productToThemeProduct } from '@/lib/flagship/adapters'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'

const FLAGSHIP_THEME_IDS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'] as const
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
  if (slug === 'mela') {
    return <MelaShopGrid brand={MELA_BRAND} products={MELA_PRODUCTS} initialCategory={searchParams.get('category')} />
  }
  if (slug === 'taana') {
    return <TaanaShopGrid brand={TAANA_BRAND} products={TAANA_PRODUCTS} initialCategory={searchParams.get('category')} />
  }
  if (slug === 'saaj') {
    return <SaajShopGrid brand={SAAJ_BRAND} products={SAAJ_PRODUCTS} initialCategory={searchParams.get('category')} />
  }
  if (slug === 'scroll') {
    return <ScrollShopGrid brand={SCROLL_BRAND} products={SCROLL_PRODUCTS} initialCategory={searchParams.get('category')} />
  }
  if (slug === 'dhamaka') {
    return <DhamakaShopGrid brand={DHAMAKA_BRAND} products={DHAMAKA_PRODUCTS} initialCategory={searchParams.get('category')} />
  }
  if (slug === 'aaram') {
    return <AaramShopGrid brand={AARAM_BRAND} products={AARAM_PRODUCTS} initialCategory={searchParams.get('category')} />
  }
  if (slug === 'utsav') {
    return <UtsavShopGrid brand={UTSAV_BRAND} products={UTSAV_PRODUCTS} initialCategory={searchParams.get('category')} />
  }
  if (slug === 'galli') {
    return <GalliShopGrid brand={GALLI_BRAND} products={GALLI_PRODUCTS} initialCategory={searchParams.get('category')} />
  }
  if (slug === 'kiraya') {
    return <KirayaShopGrid brand={KIRAYA_BRAND} products={KIRAYA_PRODUCTS} initialCategory={searchParams.get('category')} />
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
  if (data.themeId === 'april') return <MelaShopGrid brand={data.brand} products={data.products} initialCategory={initialCategory} />
  if (data.themeId === 'may') return <TaanaShopGrid brand={data.brand} products={data.products} initialCategory={initialCategory} />
  if (data.themeId === 'june') return <SaajShopGrid brand={data.brand} products={data.products} initialCategory={initialCategory} />
  if (data.themeId === 'july') return <ScrollShopGrid brand={data.brand} products={data.products} initialCategory={initialCategory} />
  if (data.themeId === 'august') return <DhamakaShopGrid brand={data.brand} products={data.products} initialCategory={initialCategory} />
  if (data.themeId === 'september') return <AaramShopGrid brand={data.brand} products={data.products} initialCategory={initialCategory} />
  if (data.themeId === 'october') return <UtsavShopGrid brand={data.brand} products={data.products} initialCategory={initialCategory} />
  if (data.themeId === 'november') return <GalliShopGrid brand={data.brand} products={data.products} initialCategory={initialCategory} />
  if (data.themeId === 'december') return <KirayaShopGrid brand={data.brand} products={data.products} initialCategory={initialCategory} />
  return <AugustShopGrid brand={data.brand} products={data.products} initialCategory={initialCategory} />
}
