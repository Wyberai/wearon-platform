'use client'

import { useEffect, useState } from 'react'
import { useParams, notFound } from 'next/navigation'
import { AugustCheckout } from '@/components/august/AugustCheckout'
import { AUGUST_BRAND } from '@/lib/august/catalog'
import { EmberCheckout } from '@/components/ember/EmberCheckout'
import { EMBER_BRAND } from '@/lib/ember/catalog'
import { BloomCheckout } from '@/components/bloom/BloomCheckout'
import { BLOOM_BRAND } from '@/lib/bloom/catalog'
import { MelaCheckout } from '@/components/mela/MelaCheckout'
import { MELA_BRAND } from '@/lib/mela/catalog'
import { TaanaCheckout } from '@/components/taana/TaanaCheckout'
import { TAANA_BRAND } from '@/lib/taana/catalog'
import { SaajCheckout } from '@/components/saaj/SaajCheckout'
import { SAAJ_BRAND } from '@/lib/saaj/catalog'
import { ScrollCheckout } from '@/components/scroll/ScrollCheckout'
import { SCROLL_BRAND } from '@/lib/scroll/catalog'
import { DhamakaCheckout } from '@/components/dhamaka/DhamakaCheckout'
import { DHAMAKA_BRAND } from '@/lib/dhamaka/catalog'
import { AaramCheckout } from '@/components/aaram/AaramCheckout'
import { AARAM_BRAND } from '@/lib/aaram/catalog'
import { UtsavCheckout } from '@/components/utsav/UtsavCheckout'
import { UTSAV_BRAND } from '@/lib/utsav/catalog'
import { GalliCheckout } from '@/components/galli/GalliCheckout'
import { GALLI_BRAND } from '@/lib/galli/catalog'
import { KirayaCheckout } from '@/components/kiraya/KirayaCheckout'
import { KIRAYA_BRAND } from '@/lib/kiraya/catalog'
import { ReelRackCheckout } from '@/components/reelrack/ReelRackCheckout'
import { REELRACK_BRAND } from '@/lib/reelrack/catalog'
import { TheGridCheckout } from '@/components/thegrid/TheGridCheckout'
import { THEGRID_BRAND } from '@/lib/thegrid/catalog'
import { TryItOnCheckout } from '@/components/tryiton/TryItOnCheckout'
import { TRYITON_BRAND } from '@/lib/tryiton/catalog'
import { configToThemeBrand } from '@/lib/flagship/adapters'
import type { ThemeBrand } from '@/lib/flagship/types'

const FLAGSHIP_THEME_IDS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december', 'reelrack', 'thegrid', 'tryiton'] as const
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
  if (slug === 'mela') {
    return <MelaCheckout brand={MELA_BRAND} />
  }
  if (slug === 'taana') {
    return <TaanaCheckout brand={TAANA_BRAND} />
  }
  if (slug === 'saaj') {
    return <SaajCheckout brand={SAAJ_BRAND} />
  }
  if (slug === 'scroll') {
    return <ScrollCheckout brand={SCROLL_BRAND} />
  }
  if (slug === 'dhamaka') {
    return <DhamakaCheckout brand={DHAMAKA_BRAND} />
  }
  if (slug === 'aaram') {
    return <AaramCheckout brand={AARAM_BRAND} />
  }
  if (slug === 'utsav') {
    return <UtsavCheckout brand={UTSAV_BRAND} />
  }
  if (slug === 'galli') {
    return <GalliCheckout brand={GALLI_BRAND} />
  }
  if (slug === 'kiraya') {
    return <KirayaCheckout brand={KIRAYA_BRAND} />
  }
  if (slug === 'reelrack') {
    return <ReelRackCheckout brand={REELRACK_BRAND} />
  }
  if (slug === 'thegrid') {
    return <TheGridCheckout brand={THEGRID_BRAND} />
  }
  if (slug === 'tryiton') {
    return <TryItOnCheckout brand={TRYITON_BRAND} />
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
  if (data.themeId === 'april') return <MelaCheckout brand={data.brand} />
  if (data.themeId === 'may') return <TaanaCheckout brand={data.brand} />
  if (data.themeId === 'june') return <SaajCheckout brand={data.brand} />
  if (data.themeId === 'july') return <ScrollCheckout brand={data.brand} />
  if (data.themeId === 'august') return <DhamakaCheckout brand={data.brand} />
  if (data.themeId === 'september') return <AaramCheckout brand={data.brand} />
  if (data.themeId === 'october') return <UtsavCheckout brand={data.brand} />
  if (data.themeId === 'november') return <GalliCheckout brand={data.brand} />
  if (data.themeId === 'december') return <KirayaCheckout brand={data.brand} />
  if (data.themeId === 'reelrack') return <ReelRackCheckout brand={data.brand} />
  if (data.themeId === 'thegrid') return <TheGridCheckout brand={data.brand} />
  if (data.themeId === 'tryiton') return <TryItOnCheckout brand={data.brand} />
  return <AugustCheckout brand={data.brand} />
}
