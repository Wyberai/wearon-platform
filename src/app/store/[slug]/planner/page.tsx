'use client'

import { useEffect, useState } from 'react'
import { useParams, notFound } from 'next/navigation'
import { SaajFunctionPlanner } from '@/components/saaj/SaajFunctionPlanner'
import { SAAJ_BRAND } from '@/lib/saaj/catalog'
import { configToThemeBrand } from '@/lib/flagship/adapters'
import type { ThemeBrand } from '@/lib/flagship/types'

// New route — SAAJ's ("June") signature AI mechanic is the Function
// Planner, a standalone multi-step wizard rather than a page section, same
// pattern as BLOOM's /quiz route. Only meaningful for SAAJ's demo or a real
// seller who picked "june"; every other tenant 404s here.
export default function PlannerPage() {
  const { slug } = useParams() as { slug: string }

  if (slug === 'saaj') {
    return <SaajFunctionPlanner brand={SAAJ_BRAND} />
  }

  return <RealSellerPlanner slug={slug} />
}

function RealSellerPlanner({ slug }: { slug: string }) {
  const [data, setData] = useState<ThemeBrand | 'not-june' | 'loading'>('loading')

  useEffect(() => {
    let cancelled = false
    fetch(`/api/store/config?slug=${slug}`)
      .then(r => r.json())
      .then(res => {
        if (cancelled) return
        if (res.config?.theme_id !== 'june') { setData('not-june'); return }
        setData(configToThemeBrand(res.config, slug))
      })
      .catch(() => setData('not-june'))
    return () => { cancelled = true }
  }, [slug])

  if (data === 'loading') return null
  if (data === 'not-june') return notFound()
  return <SaajFunctionPlanner brand={data} />
}
