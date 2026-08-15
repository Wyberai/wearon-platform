'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

type Mode = 'light' | 'dark'
const ModeContext = createContext<{ mode: Mode; toggle: () => void } | null>(null)
const STORAGE_KEY = 'august_mode_v1'

export function AugustModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>('light')

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Mode | null
    if (stored === 'light' || stored === 'dark') setMode(stored)
  }, [])

  function toggle() {
    setMode(prev => {
      const next = prev === 'light' ? 'dark' : 'light'
      window.localStorage.setItem(STORAGE_KEY, next)
      return next
    })
  }

  return <ModeContext.Provider value={{ mode, toggle }}>{children}</ModeContext.Provider>
}

export function useAugustMode() {
  const ctx = useContext(ModeContext)
  if (!ctx) throw new Error('useAugustMode must be used within AugustModeProvider')
  return ctx
}
