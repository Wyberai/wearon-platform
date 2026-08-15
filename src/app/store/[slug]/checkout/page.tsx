'use client'

import { useEffect, useState } from 'react'
import { useParams, notFound } from 'next/navigation'
import { AugustCheckout } from '@/components/august/AugustCheckout'
import { AUGUST_BRAND } from '@/lib/august/catalog'
import { EmberCheckout } from '@/components/ember/EmberCheckout'
import { EMBER_BRAND } from '@/lib/ember/catalog'
import { BloomCheckout } from '@/components/bloom/BloomCheckout'
import { BLOOM_BRAND } from '@/lib/bloom/catalog'
import { configToThemeBrand } from '@/lib/flagship/adapters'
import type { ThemeBrand } from '@/lib/flagship/types'

const FLAGSHIP_THEME_IDS = ['january', 'february', 'march'] as const
type FlagshipThemeId = (typeof FLAGSHIP_THEME_IDS)[number]

// New route, only meaningful for a flagship theme's bespoke component tree
// (a demo brand, or any real seller who picked one) — every other tenant
// 404s here rather than affecting any existing shared behavior (the generic
// checkout flow lives in the PDP's WhatsApp/Razorpay buttons, not a
// dedicated page).
export default function CheckoutPage() {
  const { slug } = useParams() as { slug: string }

  if (slug === 'august') {
    return <AugustCheckout brand={AUGUST_BRAND} />
  }
  if (slug === 'ember') {
    return <EmberCheckout brand={EMBER_BRAND} />
  }
  if (slug === 'bloom') {
    return <BloomCheckout brand={BLOOM_BRAND} />
  }

  return <RealSellerCheckout slug={slug} />
}

type RealSellerData = { themeId: FlagshipThemeId; brand: ThemeBrand } | 'not-flagship' | 'loading'

function RealSellerCheckout({ slug }: { slug: string }) {
  const [data, setData] = useState<RealSellerData>('loading')

  useEffect(() => {
    let cancelled = false
    fetch(`/api/store/config?slug=${slug}`)
      .then(r => r.json())
      .then(res => {
        if (cancelled) return
        const themeId = res.config?.theme_id
        if (!FLAGSHIP_THEME_IDS.includes(themeId)) { setData('not-flagship'); return }
        setData({ themeId, brand: configToThemeBrand(res.config, slug) })
      })
      .catch(() => setData('not-flagship'))
    return () => { cancelled = true }
  }, [slug])

  if (data === 'loading') return null
  if (data === 'not-flagship') return notFound()
  if (data.themeId === 'february') return <EmberCheckout brand={data.brand} />
  if (data.themeId === 'march') return <BloomCheckout brand={data.brand} />
  return <AugustCheckout brand={data.brand} />
}
