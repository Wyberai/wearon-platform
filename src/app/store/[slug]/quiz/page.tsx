'use client'

import { useEffect, useState } from 'react'
import { useParams, notFound } from 'next/navigation'
import { BloomQuiz } from '@/components/bloom/BloomQuiz'
import { BLOOM_BRAND } from '@/lib/bloom/catalog'
import { configToThemeBrand } from '@/lib/flagship/adapters'
import type { ThemeBrand } from '@/lib/flagship/types'

// New route — BLOOM's ("March") primary shopping mechanic is quiz-to-cart,
// not browse-first, so this page (not the homepage grid) is the main entry
// point into the store. Only meaningful for BLOOM's demo or a real seller
// who picked "march"; every other tenant 404s here.
export default function QuizPage() {
  const { slug } = useParams() as { slug: string }

  if (slug === 'bloom') {
    return <BloomQuiz brand={BLOOM_BRAND} />
  }

  return <RealSellerQuiz slug={slug} />
}

function RealSellerQuiz({ slug }: { slug: string }) {
  const [data, setData] = useState<ThemeBrand | 'not-march' | 'loading'>('loading')

  useEffect(() => {
    let cancelled = false
    fetch(`/api/store/config?slug=${slug}`)
      .then(r => r.json())
      .then(res => {
        if (cancelled) return
        if (res.config?.theme_id !== 'march') { setData('not-march'); return }
        setData(configToThemeBrand(res.config, slug))
      })
      .catch(() => setData('not-march'))
    return () => { cancelled = true }
  }, [slug])

  if (data === 'loading') return null
  if (data === 'not-march') return notFound()
  return <BloomQuiz brand={data} />
}
