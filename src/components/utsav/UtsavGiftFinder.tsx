'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import { useFlagshipCart } from '@/lib/flagship/cart-context'
import { UTSAV_PRODUCTS, type DemoProduct } from '@/lib/utsav/catalog'
import { productToThemeProduct } from '@/lib/flagship/adapters'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'
import { UtsavProductCard } from './UtsavShell'

// UTSAV's signature mechanic — Gift Finder. Every other flagship theme's AI
// feature (style quiz, mood picker, capsule builder, ...) helps a shopper
// dress THEMSELVES. This one is recipient-based: the shopper describes who
// they're buying FOR (free text) and a budget, we deterministically curate
// a real bundle from the catalog (a primary item + 1-2 complementary
// add-ons that fit), and only then ask the AI to (a) explain why the bundle
// suits that person and (b) write a short, usable gift-card message. The
// AI never chooses the products — same honesty rule as Bloom's Style Quiz.

const BUDGET_PRESETS = [1500, 2999, 4999, 5999]

const GIFT_NOTE_DELIMITER = '===GIFT NOTE==='

type ScorableProduct = ThemeProduct & { giftKeywords?: string[]; role?: 'primary' | 'addon' }

// A real seller's own catalog won't carry giftKeywords/role — this infers a
// reasonable role from the category name so the mechanic still degrades
// gracefully for any tenant on this theme, not just the UTSAV demo data.
function inferRole(p: ThemeProduct): 'primary' | 'addon' {
  const c = p.category.toLowerCase()
  if (c.includes('sweet') || c.includes('hamper') || c.includes('decor') || c.includes('snack')) return 'addon'
  return 'primary'
}

function scoreProduct(p: ScorableProduct, description: string): number {
  const text = description.toLowerCase()
  let score = 0
  for (const kw of p.giftKeywords ?? []) {
    if (text.includes(kw)) score += 2
  }
  const blob = `${p.name} ${p.category} ${p.description} ${p.tags.join(' ')}`.toLowerCase()
  for (const word of text.split(/\W+/).filter(w => w.length > 3)) {
    if (blob.includes(word)) score += 0.5
  }
  if (p.tags.includes('bestseller') || p.tags.includes('signature')) score += 0.5
  return score
}

interface Bundle {
  primary: ThemeProduct
  addons: ThemeProduct[]
  total: number
  overBudget: boolean
}

function buildBundle(products: ThemeProduct[], description: string, budget: number): Bundle | null {
  const scorable: ScorableProduct[] = products.map(p => ({ ...p, giftKeywords: (p as DemoProduct).giftKeywords, role: (p as DemoProduct).role ?? inferRole(p) }))
  const scored = scorable.map(p => ({ p, score: scoreProduct(p, description) })).sort((a, b) => b.score - a.score)

  const primaries = scored.filter(x => x.p.role === 'primary')
  if (primaries.length === 0) return null

  const affordablePrimaries = primaries.filter(x => x.p.price <= budget)
  const chosenPrimary = (affordablePrimaries[0] ?? [...primaries].sort((a, b) => a.p.price - b.p.price)[0]).p
  const overBudget = chosenPrimary.price > budget

  let remaining = budget - chosenPrimary.price
  const addonCandidates = scored.filter(x => x.p.role === 'addon' && x.p.id !== chosenPrimary.id)
  const chosenAddons: ThemeProduct[] = []
  const usedCategories = new Set<string>()
  for (const { p } of addonCandidates) {
    if (chosenAddons.length >= 2) break
    if (usedCategories.has(p.category)) continue
    if (p.price <= remaining) {
      chosenAddons.push(p)
      usedCategories.add(p.category)
      remaining -= p.price
    }
  }

  const total = chosenPrimary.price + chosenAddons.reduce((sum, a) => sum + a.price, 0)
  return { primary: chosenPrimary, addons: chosenAddons, total, overBudget }
}

export function UtsavGiftFinder({ brand }: { brand: ThemeBrand }) {
  const slug = brand.slug
  const { addLine } = useFlagshipCart()
  const [description, setDescription] = useState('')
  const [budget, setBudget] = useState(2999)
  const [bundle, setBundle] = useState<Bundle | null>(null)
  const [reason, setReason] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [addedAll, setAddedAll] = useState(false)
  const catalogRef = useRef<ThemeProduct[] | null>(null)

  async function getCatalog(): Promise<ThemeProduct[]> {
    if (catalogRef.current) return catalogRef.current
    if (!brand.sellerId) {
      catalogRef.current = UTSAV_PRODUCTS
      return UTSAV_PRODUCTS
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

  async function handleFind(e: React.FormEvent) {
    e.preventDefault()
    if (!description.trim()) return
    setLoading(true)
    setReason('')
    setNote('')

    const catalog = await getCatalog()
    const built = buildBundle(catalog, description, budget)
    setBundle(built)

    if (!built) {
      setLoading(false)
      return
    }

    const bundleItems = [built.primary, ...built.addons]
    const bundleText = bundleItems.map(p => `${p.name} (₹${p.price.toLocaleString('en-IN')})`).join(', ')

    try {
      const res = await fetch('/api/style-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `A shopper is buying a Diwali/festival gift for: "${description}". Their budget is ₹${budget.toLocaleString('en-IN')}. We've curated this bundle for them: ${bundleText} — total ₹${built.total.toLocaleString('en-IN')}. Write two short parts, plainly labelled.\n\nFirst, in 2-3 sentences, explain why this bundle suits the person described, referencing the relationship or personality naturally.\n\nThen on its own line write exactly: ${GIFT_NOTE_DELIMITER}\n\nAfter that line, write a warm, ready-to-use 2-3 sentence gift card message the shopper could write inside a card, addressed to the recipient, mentioning the festival — do not mention prices or product names in this part.`,
          brand_name: brand.name,
          catalog: catalog.map(p => ({ name: p.name, price: p.price, category: p.category, description: p.description })),
        }),
      })
      const full = await res.text()
      if (full.includes(GIFT_NOTE_DELIMITER)) {
        const [reasonPart, notePart] = full.split(GIFT_NOTE_DELIMITER)
        setReason(reasonPart.trim())
        setNote(notePart.trim())
      } else {
        setReason(full.trim() || `A bundle built around ${built.primary.name.toLowerCase()} for the person you described.`)
        setNote('Wishing you a Diwali full of light, warmth and good company. This is a small token of that.')
      }
    } catch {
      setReason(`A bundle built around ${built.primary.name.toLowerCase()} for the person you described.`)
      setNote('Wishing you a Diwali full of light, warmth and good company. This is a small token of that.')
    } finally {
      setLoading(false)
    }
  }

  function addBundleToBag() {
    if (!bundle) return
    for (const p of [bundle.primary, ...bundle.addons]) addLine(p, p.sizes[0] ?? '', p.colors[0] ?? '', 1)
    setAddedAll(true)
  }

  function restart() {
    setDescription('')
    setBudget(2999)
    setBundle(null)
    setReason('')
    setNote('')
    setAddedAll(false)
  }

  if (bundle) {
    const items = [bundle.primary, ...bundle.addons]
    return (
      <div className="max-w-[1100px] mx-auto px-6 md:px-10 pt-14 pb-24 text-center">
        <p className="text-[11px] tracking-[0.25em] uppercase mb-4 font-medium" style={{ color: 'var(--ut-accent)' }}>Your Gift Bundle</p>
        <h1 className="utsav-display text-4xl md:text-5xl mb-6">Found it.</h1>

        {bundle.overBudget && (
          <p className="text-xs max-w-md mx-auto mb-6 rounded-lg px-4 py-2" style={{ background: 'rgba(168,25,59,0.08)', color: 'var(--ut-accent)' }}>
            The best match ran slightly over your ₹{budget.toLocaleString('en-IN')} budget — here it is anyway, without the extra add-ons.
          </p>
        )}

        <div
          className="text-sm md:text-base leading-relaxed max-w-xl mx-auto mb-8 rounded-xl p-5 min-h-[4.5rem] flex items-center justify-center"
          style={{ background: 'var(--ut-card)', border: '1px solid var(--ut-line)', color: 'var(--ut-ink-muted)' }}
        >
          {loading ? 'Curating your bundle…' : reason}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-8 text-left mb-10 max-w-3xl mx-auto">
          {items.map(p => (
            <UtsavProductCard key={p.id} product={p} slug={slug} />
          ))}
        </div>

        <div
          className="max-w-md mx-auto mb-10 rounded-xl p-6 text-left"
          style={{ background: 'linear-gradient(135deg, var(--ut-accent), #7A1230)', color: '#FDF6EC' }}
        >
          <p className="text-[11px] tracking-[0.2em] uppercase mb-3" style={{ color: 'var(--ut-gold)' }}>Gift Card Message</p>
          <p className="utsav-display text-lg leading-relaxed">
            {loading ? '…' : `“${note}”`}
          </p>
        </div>

        <div className="flex items-center justify-center gap-4 mb-2 text-sm" style={{ color: 'var(--ut-ink-muted)' }}>
          <span>Bundle total</span>
          <span className="text-base font-medium" style={{ color: 'var(--ut-ink)' }}>₹{bundle.total.toLocaleString('en-IN')}</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
          <button
            onClick={addBundleToBag}
            disabled={loading}
            className="px-8 py-3.5 rounded-full text-sm tracking-wide font-medium transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ background: 'var(--ut-accent)', color: 'var(--ut-accent-ink)' }}
          >
            {addedAll ? 'Added the bundle ✓' : 'Add bundle to bag'}
          </button>
          <button onClick={restart} className="text-sm underline underline-offset-4" style={{ color: 'var(--ut-ink-muted)' }}>
            Find a different gift
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto px-6 pt-16 pb-24 min-h-[60vh] flex flex-col justify-center">
      <div className="text-center mb-10">
        <p className="text-[11px] tracking-[0.25em] uppercase mb-4 font-medium" style={{ color: 'var(--ut-accent)' }}>Gift Finder</p>
        <h1 className="utsav-display text-3xl md:text-4xl mb-3">Tell us who it&apos;s for.</h1>
        <p className="text-sm" style={{ color: 'var(--ut-ink-muted)' }}>A relationship, a personality, a habit — however you&apos;d describe them.</p>
      </div>

      <form onSubmit={handleFind} className="flex flex-col gap-6">
        <textarea
          required
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="e.g. my mother-in-law who loves traditional sarees, or my college friend, fun and colorful"
          rows={4}
          className="w-full border rounded-xl px-4 py-3 text-sm bg-transparent outline-none resize-none"
          style={{ borderColor: 'var(--ut-line)' }}
        />

        <div>
          <p className="text-xs tracking-wide uppercase mb-3" style={{ color: 'var(--ut-ink-dim)' }}>Budget — ₹{budget.toLocaleString('en-IN')}</p>
          <input
            type="range"
            min={999}
            max={5999}
            step={100}
            value={budget}
            onChange={e => setBudget(Number(e.target.value))}
            className="w-full"
            style={{ accentColor: 'var(--ut-accent)' }}
          />
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            {BUDGET_PRESETS.map(b => (
              <button
                type="button"
                key={b}
                onClick={() => setBudget(b)}
                className="text-xs tracking-wide px-3 py-1.5 rounded-full border transition-opacity hover:opacity-80"
                style={budget === b ? { background: 'var(--ut-ink)', color: 'var(--ut-bg)', borderColor: 'var(--ut-ink)' } : { borderColor: 'var(--ut-line)', color: 'var(--ut-ink-muted)' }}
              >
                ₹{b.toLocaleString('en-IN')}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !description.trim()}
          className="w-full py-4 rounded-full text-sm tracking-wide font-medium transition-opacity hover:opacity-90 disabled:opacity-60"
          style={{ background: 'var(--ut-accent)', color: 'var(--ut-accent-ink)' }}
        >
          {loading ? 'Finding the gift…' : 'Find the Gift'}
        </button>
      </form>

      <Link href={`/store/${slug}/shop`} className="text-sm underline underline-offset-4 mt-10 text-center" style={{ color: 'var(--ut-ink-dim)' }}>
        Prefer to browse instead? See the full collection →
      </Link>
    </div>
  )
}
