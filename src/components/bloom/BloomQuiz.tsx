'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import { useFlagshipCart } from '@/lib/flagship/cart-context'
import { BLOOM_PRODUCTS } from '@/lib/bloom/catalog'
import { productToThemeProduct } from '@/lib/flagship/adapters'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'
import { BloomProductCard } from './BloomProductCard'

// BLOOM's shopping mechanic — quiz-to-cart personal styling, not a
// browse-first catalog with an AI widget bolted on. The quiz produces the
// primary path into the store; deterministic scoring picks real matching
// products (not the AI), and the AI is used honestly — only to narrate why
// the capsule works, on top of a real filter, not to fabricate the picks.

interface Question {
  key: 'occasion' | 'palette' | 'fit' | 'anchor'
  prompt: string
  options: { label: string; value: string }[]
}

const QUESTIONS: Question[] = [
  { key: 'occasion', prompt: "What's your day mostly made of?", options: [
    { label: 'Desk & meetings', value: 'work' },
    { label: 'Errands & everyday', value: 'everyday' },
    { label: 'Dinners & events', value: 'evening' },
    { label: 'A bit of everything', value: 'mixed' },
  ]},
  { key: 'palette', prompt: 'Pick your palette', options: [
    { label: 'Sage & neutrals', value: 'sage' },
    { label: 'Blush & warm tones', value: 'warm' },
    { label: 'Mix it all', value: 'mixed' },
  ]},
  { key: 'fit', prompt: 'How do you like clothes to fit?', options: [
    { label: 'Fitted', value: 'fitted' },
    { label: 'Relaxed & flowy', value: 'relaxed' },
    { label: 'No preference', value: 'any' },
  ]},
  { key: 'anchor', prompt: "One thing you can't live without?", options: [
    { label: 'A great dress', value: 'Dresses' },
    { label: 'Trousers that go anywhere', value: 'Bottoms' },
    { label: 'A layer for everything', value: 'Layers' },
    { label: 'The right accessories', value: 'Accessories' },
  ]},
]

function scoreProduct(p: ThemeProduct, answers: Record<string, string>): number {
  let score = 0
  const occasion = answers.occasion
  if (occasion === 'work' && (p.category === 'Tops' || p.category === 'Layers')) score += 2
  if (occasion === 'evening' && p.category === 'Dresses') score += 2
  if (occasion === 'everyday' && (p.category === 'Bottoms' || p.category === 'Tops')) score += 2
  if (occasion === 'mixed') score += 1

  const palette = answers.palette
  const colorText = p.colors.join(' ').toLowerCase()
  if (palette === 'sage' && (colorText.includes('sage') || colorText.includes('cream'))) score += 2
  if (palette === 'warm' && (colorText.includes('blush') || colorText.includes('terracotta'))) score += 2
  if (palette === 'mixed') score += 1

  const fit = answers.fit
  const fitText = (p.fit ?? '').toLowerCase()
  if (fit === 'fitted' && fitText.includes('true to size')) score += 1
  if (fit === 'relaxed' && (fitText.includes('relaxed') || fitText.includes('oversized') || fitText.includes('fluid'))) score += 1
  if (fit === 'any') score += 0.5

  if (p.category === answers.anchor) score += 3
  if (p.tags.includes('bestseller') || p.tags.includes('signature')) score += 0.5

  return score
}

function buildCapsule(products: ThemeProduct[], answers: Record<string, string>, count = 8): ThemeProduct[] {
  const ranked = [...products].sort((a, b) => scoreProduct(b, answers) - scoreProduct(a, answers))
  const capsule: ThemeProduct[] = []
  const perCategory = new Map<string, number>()
  for (const p of ranked) {
    const used = perCategory.get(p.category) ?? 0
    if (used >= 3) continue
    capsule.push(p)
    perCategory.set(p.category, used + 1)
    if (capsule.length >= count) break
  }
  return capsule
}

export function BloomQuiz({ brand }: { brand: ThemeBrand }) {
  const slug = brand.slug
  const { addLine } = useFlagshipCart()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [capsule, setCapsule] = useState<ThemeProduct[] | null>(null)
  const [narration, setNarration] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [addedAll, setAddedAll] = useState(false)
  const catalogRef = useRef<ThemeProduct[] | null>(null)

  async function getCatalog(): Promise<ThemeProduct[]> {
    if (catalogRef.current) return catalogRef.current
    if (!brand.sellerId) {
      catalogRef.current = BLOOM_PRODUCTS
      return BLOOM_PRODUCTS
    }
    try {
      const res = await fetch(`/api/store/products?slug=${brand.slug}`)
      const data = await res.json()
      const products = (data.products ?? []).map(productToThemeProduct)
      catalogRef.current = products
      return products
    } catch {
      return []
    }
  }

  async function answer(key: string, value: string) {
    const next = { ...answers, [key]: value }
    setAnswers(next)
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1)
      return
    }

    // Last question — compute the real (deterministic) capsule, then ask the
    // AI only to narrate why it works. The AI never chooses the products.
    setStreaming(true)
    const catalog = await getCatalog()
    const picked = buildCapsule(catalog, next)
    setCapsule(picked)

    try {
      const res = await fetch('/api/style-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `I answered a style quiz: my days are mostly "${next.occasion}", I like the "${next.palette}" palette, I prefer "${next.fit}" fit, and I can't live without "${next.anchor}". Here is the capsule we've matched for me: ${picked.map(p => p.name).join(', ')}. In 2-3 sentences, explain why this capsule works for me and how the pieces combine.`,
          brand_name: brand.name,
          catalog: catalog.map(p => ({ name: p.name, price: p.price, category: p.category, description: p.description })),
        }),
      })
      if (!res.body) throw new Error('No stream')
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      for (;;) {
        const { done, value: chunk } = await reader.read()
        if (done) break
        setNarration(prev => prev + decoder.decode(chunk))
      }
    } catch {
      setNarration('Here is your capsule — built from your answers.')
    } finally {
      setStreaming(false)
    }
  }

  function addAllToBag() {
    if (!capsule) return
    for (const p of capsule) addLine(p, p.sizes[0] ?? '', p.colors[0] ?? '', 1)
    setAddedAll(true)
  }

  function restart() {
    setStep(0)
    setAnswers({})
    setCapsule(null)
    setNarration('')
    setAddedAll(false)
  }

  if (capsule) {
    return (
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 pt-14 pb-24 text-center">
        <p className="text-[11px] tracking-[0.25em] uppercase mb-4 font-medium" style={{ color: 'var(--bl-accent)' }}>Your Capsule</p>
        <h1 className="bloom-display italic text-4xl md:text-5xl mb-6">Built from your answers.</h1>
        <div
          className="text-sm md:text-base leading-relaxed max-w-xl mx-auto mb-10 rounded-xl p-5"
          style={{ background: 'var(--bl-card)', border: '1px solid var(--bl-line)', color: 'var(--bl-ink-muted)' }}
        >
          {narration || (streaming ? '…' : '')}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8 text-left mb-10">
          {capsule.map(p => (
            <BloomProductCard key={p.id} product={p} slug={slug} />
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={addAllToBag}
            className="px-8 py-3.5 rounded-full text-sm tracking-wide font-medium transition-opacity hover:opacity-90"
            style={{ background: 'var(--bl-accent)', color: 'var(--bl-accent-ink)' }}
          >
            {addedAll ? 'Added the capsule ✓' : 'Add my capsule to bag'}
          </button>
          <button onClick={restart} className="text-sm underline underline-offset-4" style={{ color: 'var(--bl-ink-muted)' }}>
            Retake the quiz
          </button>
        </div>
      </div>
    )
  }

  const q = QUESTIONS[step]

  return (
    <div className="max-w-xl mx-auto px-6 pt-16 pb-24 text-center min-h-[60vh] flex flex-col justify-center">
      <div className="flex items-center justify-center gap-2 mb-8">
        {QUESTIONS.map((_, i) => (
          <span key={i} className="h-1.5 rounded-full transition-all" style={{ width: i === step ? 28 : 8, background: i <= step ? 'var(--bl-accent)' : 'var(--bl-line)' }} />
        ))}
      </div>
      <p className="text-[11px] tracking-[0.25em] uppercase mb-4 font-medium" style={{ color: 'var(--bl-accent)' }}>Question {step + 1} of {QUESTIONS.length}</p>
      <h1 className="bloom-display italic text-3xl md:text-4xl mb-10">{q.prompt}</h1>
      <div className="flex flex-col gap-3">
        {q.options.map(o => (
          <button
            key={o.value}
            onClick={() => answer(q.key, o.value)}
            className="w-full py-4 rounded-full border text-sm tracking-wide transition-all hover:border-[var(--bl-accent)] hover:scale-[1.01]"
            style={{ borderColor: 'var(--bl-line)', color: 'var(--bl-ink)' }}
          >
            {o.label}
          </button>
        ))}
      </div>
      <Link href={`/store/${slug}/shop`} className="text-sm underline underline-offset-4 mt-10" style={{ color: 'var(--bl-ink-dim)' }}>
        Prefer to browse instead? See the full collection →
      </Link>
    </div>
  )
}
