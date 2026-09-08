'use client'

import { useEffect, useState } from 'react'
import { MechanicModal } from './MechanicModal'

function useCountdown(targetMs: number) {
  const [remaining, setRemaining] = useState(Math.max(0, targetMs - Date.now()))
  useEffect(() => {
    const id = setInterval(() => setRemaining(Math.max(0, targetMs - Date.now())), 1000)
    return () => clearInterval(id)
  }, [targetMs])
  const d = Math.floor(remaining / 86400000)
  const h = Math.floor((remaining % 86400000) / 3600000)
  const m = Math.floor((remaining % 3600000) / 60000)
  const s = Math.floor((remaining % 60000) / 1000)
  return { d, h, m, s }
}

// Countdown target is deterministic per mount (48h from first render, kept in
// module state) rather than a fixed date, so the drop always reads "coming
// soon" in this demo context instead of drifting into the past.
let cachedTarget: number | null = null
function getTarget() {
  if (cachedTarget === null) cachedTarget = Date.now() + 48 * 3600 * 1000
  return cachedTarget
}

export function CountdownMechanic({ open, brandName, intro, onClose }: { open: boolean; brandName: string; intro: string; onClose: () => void }) {
  const { d, h, m, s } = useCountdown(getTarget())
  const [email, setEmail] = useState('')
  const [joined, setJoined] = useState(false)

  function join(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setJoined(true)
  }

  return (
    <MechanicModal open={open} title="Drop Radar" onClose={onClose}>
      <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--fg-ink-muted)' }}>{intro}</p>
      <div className="grid grid-cols-4 gap-2 mb-6 text-center">
        {[{ v: d, l: 'Days' }, { v: h, l: 'Hrs' }, { v: m, l: 'Min' }, { v: s, l: 'Sec' }].map(u => (
          <div key={u.l} className="rounded-xl py-3" style={{ background: 'var(--fg-card)' }}>
            <p className="text-xl font-bold tabular-nums">{String(u.v).padStart(2, '0')}</p>
            <p className="text-[10px] uppercase tracking-wide mt-1" style={{ color: 'var(--fg-ink-dim)' }}>{u.l}</p>
          </div>
        ))}
      </div>
      {joined ? (
        <p className="text-sm text-center" style={{ color: 'var(--fg-accent)' }}>You're on the list — {brandName} will notify you the moment it drops.</p>
      ) : (
        <form onSubmit={join} className="flex gap-2">
          <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" className="flex-1 rounded-full border px-4 py-2.5 text-sm bg-transparent outline-none" style={{ borderColor: 'var(--fg-line)' }} />
          <button type="submit" className="px-5 py-2.5 rounded-full text-sm font-semibold" style={{ background: 'var(--fg-accent)', color: 'var(--fg-accent-ink)' }}>Notify Me</button>
        </form>
      )}
    </MechanicModal>
  )
}
