'use client'

import { Suspense, useEffect, useState } from 'react'
import { useParams, useSearchParams, notFound } from 'next/navigation'
import { AugustShopGrid } from '@/components/august/AugustShopGrid'
import { AUGUST_BRAND, AUGUST_PRODUCTS } from '@/lib/august/catalog'
import { configToThemeBrand, productToThemeProduct } from '@/lib/august/adapters'
import type { ThemeBrand, ThemeProduct } from '@/lib/august/types'

// New route, only meaningful for the "January" flagship theme's bespoke
// component tree (the AUGUST demo, or any real seller who picked it) —
// every other tenant 404s here rather than affecting any existing shared
// behavior.
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

  return <RealSellerShopGrid slug={slug} initialCategory={searchParams.get('category')} />
}

function RealSellerShopGrid({ slug, initialCategory }: { slug: string; initialCategory: string | null }) {
  const [data, setData] = useState<{ brand: ThemeBrand; products: ThemeProduct[] } | 'not-january' | 'loading'>('loading')

  useEffect(() => {
    let cancelled = false
    Promise.all([
      fetch(`/api/store/config?slug=${slug}`).then(r => r.json()),
      fetch(`/api/store/products?slug=${slug}`).then(r => r.json()),
    ]).then(([cfgData, prodData]) => {
      if (cancelled) return
      if (cfgData.config?.theme_id !== 'january') { setData('not-january'); return }
      setData({
        brand: configToThemeBrand(cfgData.config, slug),
        products: (prodData.products ?? []).filter((p: { is_active: boolean }) => p.is_active).map(productToThemeProduct),
      })
    }).catch(() => setData('not-january'))
    return () => { cancelled = true }
  }, [slug])

  if (data === 'loading') return null
  if (data === 'not-january') return notFound()
  return <AugustShopGrid brand={data.brand} products={data.products} initialCategory={initialCategory} />
}
