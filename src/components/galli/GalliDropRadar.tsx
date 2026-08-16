'use client'

import { useEffect, useState } from 'react'

// Signature AI/hype mechanic #1 — "Drop Radar". A live countdown to a fixed
// future timestamp (computed client-side, no backend) plus a local-state
// waitlist capture. No real send happens; this is the demo storefront's
// scarcity mechanic, honestly labelled as such in the confirmation copy.
const NEXT_DROP_AT = '2026-08-20T19:00:00+05:30' // Drop 04 — Thursday, 7:00 PM IST
const DROP_LABEL = 'Drop 04'

interface Remaining {
  days: number
  hours: number
  minutes: number
  seconds: number
  done: boolean
}

function getRemaining(target: number): Remaining {
  const diff = target - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true }
  const seconds = Math.floor(diff / 1000)
  return {
    days: Math.floor(seconds / 86400),
    hours: Math.floor((seconds % 86400) / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60,
    done: false,
  }
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

export function GalliDropRadar({ compact = false }: { compact?: boolean }) {
  const target = new Date(NEXT_DROP_AT).getTime()
  // Server-render a stable placeholder, then swap to the live countdown once
  // mounted — avoids any SSR/client clock mismatch flashing on load.
  const [mounted, setMounted] = useState(false)
  const [remaining, setRemaining] = useState<Remaining>({ days: 0, hours: 0, minutes: 0, seconds: 0, done: false })

  useEffect(() => {
    setMounted(true)
    setRemaining(getRemaining(target))
    const id = setInterval(() => setRemaining(getRemaining(target)), 1000)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [contact, setContact] = useState('')
  const [joined, setJoined] = useState(false)
  const [error, setError] = useState('')

  function handleJoin(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = contact.trim()
    if (!trimmed) {
      setError('Drop dega toh contact toh de bhai.')
      return
    }
    setError('')
    // Demo storefront — no backend call, this only simulates the capture.
    setJoined(true)
  }

  const units: Array<[string, number]> = [
    ['Days', remaining.days],
    ['Hrs', remaining.hours],
    ['Min', remaining.minutes],
    ['Sec', remaining.seconds],
  ]

  return (
    <div
      id="drop-radar"
      className="rounded-xl border px-6 py-6 md:px-8 md:py-8 w-full"
      style={{ borderColor: 'var(--g-accent)', background: 'rgba(182,255,60,0.06)' }}
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: 'var(--g-accent)', boxShadow: '0 0 10px var(--g-accent)' }} />
        <p className="text-[11px] tracking-[0.2em] uppercase font-semibold" style={{ color: 'var(--g-accent)' }}>
          Drop Radar · {DROP_LABEL}
        </p>
      </div>

      {remaining.done ? (
        <p className="galli-display text-2xl md:text-4xl mb-5" style={{ color: 'var(--g-ink)' }}>
          It&apos;s live. Go cop it.
        </p>
      ) : (
        <div className="flex items-end gap-3 md:gap-5 mb-6" aria-live="polite">
          {units.map(([label, value]) => (
            <div key={label} className="text-center">
              <p className="galli-display text-4xl md:text-6xl leading-none tabular-nums" style={{ color: 'var(--g-ink)' }}>
                {mounted ? pad(value) : '--'}
              </p>
              <p className="text-[10px] tracking-[0.15em] uppercase mt-1.5" style={{ color: 'var(--g-ink-dim)' }}>{label}</p>
            </div>
          ))}
        </div>
      )}

      {!compact && (
        joined ? (
          <p className="text-sm" style={{ color: 'var(--g-accent)' }}>
            ✓ You&apos;re on the list. We&apos;ll ping you before it drops — not after.
          </p>
        ) : (
          <form onSubmit={handleJoin} className="flex flex-col sm:flex-row gap-2.5">
            <input
              value={contact}
              onChange={e => setContact(e.target.value)}
              placeholder="Email or phone — no spam, just drops"
              className="flex-1 border rounded-full px-4 py-2.5 text-sm bg-transparent outline-none"
              style={{ borderColor: 'var(--g-line)', color: 'var(--g-ink)' }}
            />
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full text-sm tracking-wide uppercase font-semibold transition-transform hover:scale-105 whitespace-nowrap"
              style={{ background: 'var(--g-accent)', color: 'var(--g-accent-ink)' }}
            >
              Join the Waitlist
            </button>
          </form>
        )
      )}
      {error && <p className="text-xs mt-2" style={{ color: 'var(--g-accent2)' }}>{error}</p>}
    </div>
  )
}
