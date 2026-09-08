'use client'

import { AnimatePresence, motion } from 'framer-motion'
import type { ReactNode } from 'react'

// Shared bottom-sheet/modal chrome for every generic mechanic — the same
// visual container EmberMoodMatch/etc. hand-build per theme, parameterized
// off --fg-* vars instead of a theme-specific class.
export function MechanicModal({ open, title, onClose, children }: { open: boolean; title: string; onClose: () => void; children: ReactNode }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-[90]" style={{ background: 'rgba(0,0,0,0.6)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            className="fixed bottom-0 sm:bottom-6 left-1/2 -translate-x-1/2 z-[91] w-full sm:w-[440px] sm:rounded-2xl border overflow-hidden max-h-[85vh] flex flex-col"
            style={{ background: 'var(--fg-glass)', backdropFilter: 'blur(16px)', borderColor: 'var(--fg-line)', color: 'var(--fg-ink)' }}
            initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} transition={{ type: 'spring', damping: 30, stiffness: 320 }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b flex-shrink-0" style={{ borderColor: 'var(--fg-line)' }}>
              <span className="text-base tracking-tight" style={{ fontWeight: 800 }}>{title}</span>
              <button onClick={onClose} aria-label="Close" className="w-7 h-7 flex items-center justify-center hover:opacity-60 transition-opacity">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
            </div>
            <div className="p-5 overflow-y-auto">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
