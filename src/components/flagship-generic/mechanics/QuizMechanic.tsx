'use client'

import { useMemo, useState } from 'react'
import { MechanicModal } from './MechanicModal'
import type { ThemeProduct } from '@/lib/flagship/types'

const QUESTIONS = [
  { key: 'occasion', label: 'What’s the occasion?', options: ['Everyday', 'Special event', 'Travel', 'Gift'] },
  { key: 'fit', label: 'How do you like it to fit?', options: ['Relaxed', 'Fitted', 'Oversized', 'No preference'] },
  { key: 'budget', label: 'What’s your budget?', options: ['Under $1,500', '$1,500–$3,000', '$3,000+', 'No limit'] },
]

const BUDGET_CEILING: Record<string, number> = { 'Under $1,500': 1500, '$1,500–$3,000': 3000, '$3,000+': Infinity, 'No limit': Infinity }

export function QuizMechanic({ products, open, intro, onClose }: { products: ThemeProduct[]; open: boolean; intro: string; onClose: () => void }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})

  function pick(key: string, value: string) {
    const next = { ...answers, [key]: value }
    setAnswers(next)
    if (step < QUESTIONS.length - 1) setStep(step + 1)
    else setStep(QUESTIONS.length)
  }

  function reset() {
    setStep(0)
    setAnswers({})
  }

  const results = useMemo(() => {
    if (step < QUESTIONS.length) return []
    const ceiling = BUDGET_CEILING[answers.budget] ?? Infinity
    const within = products.filter(p => p.price <= ceiling)
    const pool = within.length >= 3 ? within : products
    return [...pool].sort((a, b) => a.price - b.price).slice(0, 4)
  }, [step, answers, products])

  return (
    <MechanicModal open={open} title="Find My Fit" onClose={onClose}>
      {step < QUESTIONS.length ? (
        <>
          <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--fg-ink-muted)' }}>{step === 0 ? intro : QUESTIONS[step].label}</p>
          {step === 0 && <p className="text-sm font-medium mb-3">{QUESTIONS[0].label}</p>}
          <div className="grid grid-cols-2 gap-2.5">
            {QUESTIONS[step].options.map(o => (
              <button key={o} onClick={() => pick(QUESTIONS[step].key, o)} className="rounded-xl border py-3 px-2 text-xs font-medium transition-transform hover:scale-[1.03]" style={{ borderColor: 'var(--fg-line)', background: 'var(--fg-card)' }}>
                {o}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5 mt-5 justify-center">
            {QUESTIONS.map((_, i) => (<span key={i} className="rounded-full" style={{ width: 6, height: 6, background: i <= step ? 'var(--fg-accent)' : 'var(--fg-line)' }} />))}
          </div>
        </>
      ) : (
        <>
          <p className="text-sm mb-4" style={{ color: 'var(--fg-ink-muted)' }}>Based on your answers, here’s what fits:</p>
          <div className="flex flex-col gap-3 mb-4">
            {results.map(p => (
              <div key={p.id} className="flex items-center gap-3 rounded-xl p-2" style={{ background: 'var(--fg-card)' }}>
                <img src={p.image} alt={p.name} className="w-12 h-14 object-cover rounded-lg flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p.name}</p>
                  <p className="text-xs" style={{ color: 'var(--fg-ink-dim)' }}>${p.price.toLocaleString('en-IN')}</p>
                </div>
              </div>
            ))}
          </div>
          <button onClick={reset} className="w-full py-3 rounded-full text-sm tracking-wide font-semibold" style={{ background: 'var(--fg-accent)', color: 'var(--fg-accent-ink)' }}>
            Start over
          </button>
        </>
      )}
    </MechanicModal>
  )
}
