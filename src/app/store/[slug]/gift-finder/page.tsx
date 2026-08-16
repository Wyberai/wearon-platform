'use client'

import { useEffect, useState } from 'react'
import { useParams, notFound } from 'next/navigation'
import { UtsavGiftFinder } from '@/components/utsav/UtsavGiftFinder'
import { UTSAV_BRAND } from '@/lib/utsav/catalog'
import { configToThemeBrand } from '@/lib/flagship/adapters'
import type { ThemeBrand } from '@/lib/flagship/types'

// New route — UTSAV's ("October") signature mechanic is recipient-based
// gift curation (describe who it's for + a budget, get a bundle + a gift
// note), so this page is the primary AI entry point, same role as BLOOM's
// /quiz route. Only meaningful for UTSAV's demo or a real seller who picked
// "october"; every other tenant 404s here.
export default function GiftFinderPage() {
  const { slug } = useParams() as { slug: string }

  if (slug === 'utsav') {
    return <UtsavGiftFinder brand={UTSAV_BRAND} />
  }

  return <RealSellerGiftFinder slug={slug} />
}

function RealSellerGiftFinder({ slug }: { slug: string }) {
  const [data, setData] = useState<ThemeBrand | 'not-october' | 'loading'>('loading')

  useEffect(() => {
    let cancelled = false
    fetch(`/api/store/config?slug=${slug}`)
      .then(r => r.json())
      .then(res => {
        if (cancelled) return
        if (res.config?.theme_id !== 'october') { setData('not-october'); return }
        setData(configToThemeBrand(res.config, slug))
      })
      .catch(() => setData('not-october'))
    return () => { cancelled = true }
  }, [slug])

  if (data === 'loading') return null
  if (data === 'not-october') return notFound()
  return <UtsavGiftFinder brand={data} />
}
