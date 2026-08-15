'use client'

import { useEffect, useState } from 'react'
import { useParams, notFound } from 'next/navigation'
import { AugustCheckout } from '@/components/august/AugustCheckout'
import { AUGUST_BRAND } from '@/lib/august/catalog'
import { configToThemeBrand } from '@/lib/august/adapters'
import type { ThemeBrand } from '@/lib/august/types'

// New route, only meaningful for the "January" flagship theme's bespoke
// component tree (the AUGUST demo, or any real seller who picked it) —
// every other tenant 404s here rather than affecting any existing shared
// behavior (the generic checkout flow lives in the PDP's WhatsApp/Razorpay
// buttons, not a dedicated page).
export default function CheckoutPage() {
  const { slug } = useParams() as { slug: string }

  if (slug === 'august') {
    return <AugustCheckout brand={AUGUST_BRAND} />
  }

  return <RealSellerCheckout slug={slug} />
}

function RealSellerCheckout({ slug }: { slug: string }) {
  const [brand, setBrand] = useState<ThemeBrand | 'not-january' | 'loading'>('loading')

  useEffect(() => {
    let cancelled = false
    fetch(`/api/store/config?slug=${slug}`)
      .then(r => r.json())
      .then(data => {
        if (cancelled) return
        if (data.config?.theme_id !== 'january') { setBrand('not-january'); return }
        setBrand(configToThemeBrand(data.config, slug))
      })
      .catch(() => setBrand('not-january'))
    return () => { cancelled = true }
  }, [slug])

  if (brand === 'loading') return null
  if (brand === 'not-january') return notFound()
  return <AugustCheckout brand={brand} />
}
