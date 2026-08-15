'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

type Mode = 'light' | 'dark'
const ModeContext = createContext<{ mode: Mode; toggle: () => void } | null>(null)

// storageKey must be unique per theme (e.g. 'august_mode_v1', 'ember_mode_v1').
export function FlagshipModeProvider({ children, storageKey, defaultMode = 'light' }: { children: ReactNode; storageKey: string; defaultMode?: Mode }) {
  const [mode, setMode] = useState<Mode>(defaultMode)

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey) as Mode | null
    if (stored === 'light' || stored === 'dark') setMode(stored)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function toggle() {
    setMode(prev => {
      const next = prev === 'light' ? 'dark' : 'light'
      window.localStorage.setItem(storageKey, next)
      return next
    })
  }

  return <ModeContext.Provider value={{ mode, toggle }}>{children}</ModeContext.Provider>
}

export function useFlagshipMode() {
  const ctx = useContext(ModeContext)
  if (!ctx) throw new Error('useFlagshipMode must be used within FlagshipModeProvider')
  return ctx
}
