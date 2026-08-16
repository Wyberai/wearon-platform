'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import { useFlagshipCart } from '@/lib/flagship/cart-context'
import { SAAJ_PRODUCTS, type SaajFunctionTag, type SaajGenderTag } from '@/lib/saaj/catalog'
import { productToThemeProduct } from '@/lib/flagship/adapters'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'

// SAAJ's signature AI mechanic — the Function Planner. Unlike BLOOM's
// single-pass quiz-to-capsule, this is a genuine multi-step wizard: role,
// then which functions you're attending (multi-select), then a budget —
// one screen per question, with a progress indicator. The plan itself
// (one real product per function) is picked deterministically from the
// actual catalog, same honesty rule as every other flagship theme's AI
// mechanic — the AI is only asked, once, to narrate why the plan works,
// exactly the same call/stream pattern as BLOOM's quiz uses against
// /api/style-ai. Every per-pick "reason" line is generated deterministically
// from real product data, so it never depends on the AI call succeeding.

type WizardStep = 'role' | 'functions' | 'budget' | 'results'

interface RoleOption {
  value: string
  label: string
  gender: SaajGenderTag
}

const ROLES: RoleOption[] = [
  { value: 'bride-friend', label: "Bride's friend", gender: 'womens' },
  { value: 'bride-cousin', label: "Bride's cousin", gender: 'womens' },
  { value: 'family-women', label: 'Immediate family (mother / aunt)', gender: 'womens' },
  { value: 'groom-friend', label: "Groom's friend", gender: 'mens' },
  { value: 'groom-cousin', label: "Groom's cousin", gender: 'mens' },
  { value: 'family-men', label: 'Immediate family (father / uncle)', gender: 'mens' },
]

const FUNCTIONS: { value: SaajFunctionTag; label: string }[] = [
  { value: 'mehendi', label: 'Mehendi' },
  { value: 'sangeet', label: 'Sangeet' },
  { value: 'haldi', label: 'Haldi' },
  { value: 'wedding', label: 'Wedding' },
  { value: 'reception', label: 'Reception' },
]

const BUDGET_TIERS: { label: string; max: number }[] = [
  { label: 'Under ₹6,000 per outfit', max: 6000 },
  { label: '₹6,000 – ₹12,000 per outfit', max: 12000 },
  { label: '₹12,000 – ₹20,000 per outfit', max: 20000 },
  { label: 'No limit — show me everything', max: Infinity },
]

interface PlanItem {
  fn: SaajFunctionTag
  product: ThemeProduct
  reason: string
}

function scorePick(p: ThemeProduct): number {
  let s = 0
  if (p.tags.includes('signature')) s += 2
  if (p.tags.includes('bestseller')) s += 1
  return s
}

function pickForFunction(products: ThemeProduct[], fn: SaajFunctionTag, gender: SaajGenderTag, budgetMax: number, used: Set<string>): ThemeProduct | null {
  const byFn = products.filter(p => p.tags.includes(fn))
  const byGender = byFn.filter(p => p.tags.includes(gender))
  const genderPool = byGender.length ? byGender : byFn
  const unused = genderPool.filter(p => !used.has(p.id))
  const pool = unused.length ? unused : genderPool
  if (pool.length === 0) return null

  const within = pool.filter(p => p.price <= budgetMax)
  const finalPool = within.length ? within : pool

  const sorted = [...finalPool].sort((a, b) => {
    const scoreDiff = scorePick(b) - scorePick(a)
    if (scoreDiff !== 0) return scoreDiff
    return within.length ? b.price - a.price : a.price - b.price
  })
  return sorted[0]
}

function buildReason(p: ThemeProduct, fn: SaajFunctionTag, budgetMax: number): string {
  const fnLabel = FUNCTIONS.find(f => f.value === fn)?.label ?? fn
  const withinBudget = p.price <= budgetMax
  const budgetNote = budgetMax === Infinity
    ? ''
    : withinBudget
      ? ' — comfortably inside your budget'
      : ' — just over budget, but the closest real match we have for this function'
  return `${p.fabric} in ${p.colors[0]}, built for ${fnLabel.toLowerCase()}${budgetNote}.`
}

function buildPlan(products: ThemeProduct[], gender: SaajGenderTag, functions: SaajFunctionTag[], budgetMax: number): PlanItem[] {
  const used = new Set<string>()
  const orderedFns = FUNCTIONS.map(f => f.value).filter(fn => functions.includes(fn))
  const plan: PlanItem[] = []
  for (const fn of orderedFns) {
    const product = pickForFunction(products, fn, gender, budgetMax, used)
    if (!product) continue
    used.add(product.id)
    plan.push({ fn, product, reason: buildReason(product, fn, budgetMax) })
  }
  return plan
}

function PlanImage({ src, alt }: { src: string; alt: string }) {
  const [ok, setOk] = useState(true)
  return (
    <div className="w-24 h-28 rounded-lg overflow-hidden flex-shrink-0" style={{ background: 'var(--sj-emerald)' }}>
      {ok && <img src={src} alt={alt} className="w-full h-full object-cover" onError={() => setOk(false)} />}
    </div>
  )
}

export function SaajFunctionPlanner({ brand }: { brand: ThemeBrand }) {
  const slug = brand.slug
  const { addLine } = useFlagshipCart()
  const [step, setStep] = useState<WizardStep>('role')
  const [role, setRole] = useState<RoleOption | null>(null)
  const [selectedFunctions, setSelectedFunctions] = useState<SaajFunctionTag[]>([])
  const [budgetIdx, setBudgetIdx] = useState<number | null>(null)
  const [plan, setPlan] = useState<PlanItem[] | null>(null)
  const [narration, setNarration] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [addedAll, setAddedAll] = useState(false)
  const catalogRef = useRef<ThemeProduct[] | null>(null)

  const STEP_ORDER: WizardStep[] = ['role', 'functions', 'budget']
  const stepIndex = STEP_ORDER.indexOf(step)

  async function getCatalog(): Promise<ThemeProduct[]> {
    if (catalogRef.current) return catalogRef.current
    if (!brand.sellerId) {
      catalogRef.current = SAAJ_PRODUCTS
      return SAAJ_PRODUCTS
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

  function chooseRole(r: RoleOption) {
    setRole(r)
    setStep('functions')
  }

  function toggleFunction(fn: SaajFunctionTag) {
    setSelectedFunctions(prev => prev.includes(fn) ? prev.filter(f => f !== fn) : [...prev, fn])
  }

  async function chooseBudget(idx: number) {
    setBudgetIdx(idx)
    if (!role || selectedFunctions.length === 0) return

    setStreaming(true)
    const catalog = await getCatalog()
    const budgetMax = BUDGET_TIERS[idx].max
    const computedPlan = buildPlan(catalog, role.gender, selectedFunctions, budgetMax)
    setPlan(computedPlan)
    setStep('results')

    // The plan itself is already computed above from real catalog data — the
    // AI call below only narrates why it works overall, same honest pattern
    // and same /api/style-ai call/stream shape as BLOOM's quiz.
    try {
      const functionList = computedPlan.map(item => `${FUNCTIONS.find(f => f.value === item.fn)?.label}: ${item.product.name}`).join(', ')
      const res = await fetch('/api/style-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `I'm attending a wedding as "${role.label}". I'm going to these functions: ${selectedFunctions.join(', ')}. My budget is roughly "${BUDGET_TIERS[idx].label}". Here is the function-by-function plan we've matched: ${functionList}. In 2-3 sentences, explain why this plan works across the whole wedding and how the pieces fit the budget.`,
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
      setNarration('Here is your function-by-function plan — built from your role, your functions and your budget.')
    } finally {
      setStreaming(false)
    }
  }

  function addAllToBag() {
    if (!plan) return
    for (const item of plan) addLine(item.product, item.product.sizes[0] ?? '', item.product.colors[0] ?? '', 1)
    setAddedAll(true)
  }

  function restart() {
    setStep('role')
    setRole(null)
    setSelectedFunctions([])
    setBudgetIdx(null)
    setPlan(null)
    setNarration('')
    setAddedAll(false)
  }

  // ---- Results screen ----
  if (step === 'results' && plan) {
    const total = plan.reduce((sum, item) => sum + item.product.price, 0)
    return (
      <div className="max-w-[1100px] mx-auto px-6 md:px-10 pt-14 pb-24">
        <div className="text-center mb-10">
          <p className="text-[11px] tracking-[0.25em] uppercase mb-4 font-medium" style={{ color: 'var(--sj-accent)' }}>Your Function Plan</p>
          <h1 className="saaj-display text-4xl md:text-5xl mb-6 font-semibold">One outfit, function by function.</h1>
          <div
            className="text-sm md:text-base leading-relaxed max-w-xl mx-auto rounded-xl p-5"
            style={{ background: 'var(--sj-card)', border: '1px solid var(--sj-line)', color: 'var(--sj-ink-muted)' }}
          >
            {narration || (streaming ? '…' : '')}
          </div>
        </div>

        {plan.length === 0 ? (
          <p className="text-sm text-center" style={{ color: 'var(--sj-ink-muted)' }}>
            We couldn&apos;t match a product to your functions — try a different budget tier.
          </p>
        ) : (
          <div className="flex flex-col gap-5 mb-10">
            {plan.map(item => (
              <div key={item.fn} className="flex gap-5 items-start rounded-xl border p-4 md:p-5" style={{ borderColor: 'var(--sj-line)' }}>
                <PlanImage src={item.product.image} alt={item.product.name} />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] tracking-[0.2em] uppercase mb-1.5 font-medium" style={{ color: 'var(--sj-accent)' }}>
                    {FUNCTIONS.find(f => f.value === item.fn)?.label}
                  </p>
                  <Link href={`/store/${slug}/product/${item.product.slug}`} className="text-base font-medium hover:underline underline-offset-4">
                    {item.product.name}
                  </Link>
                  <p className="text-sm mt-1" style={{ color: 'var(--sj-ink-muted)' }}>{item.reason}</p>
                  <p className="text-sm mt-2 font-medium">₹{item.product.price.toLocaleString('en-IN')}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {plan.length > 0 && (
          <div className="flex flex-col items-center gap-1 mb-8">
            <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--sj-ink-dim)' }}>Plan total</p>
            <p className="saaj-display text-2xl font-semibold">₹{total.toLocaleString('en-IN')}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {plan.length > 0 && (
            <button
              onClick={addAllToBag}
              className="px-8 py-3.5 rounded-full text-sm tracking-wide font-medium transition-opacity hover:opacity-90"
              style={{ background: 'var(--sj-accent)', color: 'var(--sj-accent-ink)' }}
            >
              {addedAll ? 'Added the whole plan ✓' : 'Add all to bag'}
            </button>
          )}
          <button onClick={restart} className="text-sm underline underline-offset-4" style={{ color: 'var(--sj-ink-muted)' }}>
            Start over
          </button>
        </div>
      </div>
    )
  }

  // ---- Wizard screens (one question per screen) ----
  return (
    <div className="max-w-xl mx-auto px-6 pt-16 pb-24 text-center min-h-[60vh] flex flex-col justify-center">
      <div className="flex items-center justify-center gap-2 mb-8">
        {STEP_ORDER.map((s, i) => (
          <span key={s} className="h-1.5 rounded-full transition-all" style={{ width: i === stepIndex ? 28 : 8, background: i <= stepIndex ? 'var(--sj-accent)' : 'var(--sj-line)' }} />
        ))}
      </div>

      {step === 'role' && (
        <>
          <p className="text-[11px] tracking-[0.25em] uppercase mb-4 font-medium" style={{ color: 'var(--sj-accent)' }}>Step 1 of 3</p>
          <h1 className="saaj-display text-3xl md:text-4xl mb-10 font-semibold">Who are you at this wedding?</h1>
          <div className="flex flex-col gap-3">
            {ROLES.map(r => (
              <button
                key={r.value}
                onClick={() => chooseRole(r)}
                className="w-full py-4 rounded-full border text-sm tracking-wide transition-all hover:border-[var(--sj-accent)] hover:scale-[1.01]"
                style={{ borderColor: 'var(--sj-line)', color: 'var(--sj-ink)' }}
              >
                {r.label}
              </button>
            ))}
          </div>
        </>
      )}

      {step === 'functions' && (
        <>
          <p className="text-[11px] tracking-[0.25em] uppercase mb-4 font-medium" style={{ color: 'var(--sj-accent)' }}>Step 2 of 3</p>
          <h1 className="saaj-display text-3xl md:text-4xl mb-3 font-semibold">Which functions are you attending?</h1>
          <p className="text-sm mb-8" style={{ color: 'var(--sj-ink-muted)' }}>Pick as many as apply — we&apos;ll shortlist one outfit for each.</p>
          <div className="grid grid-cols-1 gap-3 mb-8">
            {FUNCTIONS.map(f => {
              const active = selectedFunctions.includes(f.value)
              return (
                <button
                  key={f.value}
                  onClick={() => toggleFunction(f.value)}
                  className="w-full py-4 rounded-full border text-sm tracking-wide transition-all flex items-center justify-center gap-2"
                  style={active ? { background: 'var(--sj-ink)', color: 'var(--sj-bg)', borderColor: 'var(--sj-ink)' } : { borderColor: 'var(--sj-line)', color: 'var(--sj-ink)' }}
                >
                  {active && <span aria-hidden>✓</span>}
                  {f.label}
                </button>
              )
            })}
          </div>
          <button
            onClick={() => selectedFunctions.length > 0 && setStep('budget')}
            disabled={selectedFunctions.length === 0}
            className="w-full py-4 rounded-full text-sm tracking-wide font-medium transition-opacity disabled:opacity-40"
            style={{ background: 'var(--sj-accent)', color: 'var(--sj-accent-ink)' }}
          >
            Continue
          </button>
        </>
      )}

      {step === 'budget' && (
        <>
          <p className="text-[11px] tracking-[0.25em] uppercase mb-4 font-medium" style={{ color: 'var(--sj-accent)' }}>Step 3 of 3</p>
          <h1 className="saaj-display text-3xl md:text-4xl mb-10 font-semibold">What&apos;s your budget, per outfit?</h1>
          <div className="flex flex-col gap-3">
            {BUDGET_TIERS.map((b, i) => (
              <button
                key={b.label}
                onClick={() => chooseBudget(i)}
                disabled={budgetIdx !== null && streaming}
                className="w-full py-4 rounded-full border text-sm tracking-wide transition-all hover:border-[var(--sj-accent)] hover:scale-[1.01] disabled:opacity-60"
                style={{ borderColor: 'var(--sj-line)', color: 'var(--sj-ink)' }}
              >
                {b.label}
              </button>
            ))}
          </div>
        </>
      )}

      <Link href={`/store/${slug}/shop`} className="text-sm underline underline-offset-4 mt-10" style={{ color: 'var(--sj-ink-dim)' }}>
        Prefer to browse instead? See the full collection →
      </Link>
    </div>
  )
}
