'use client'

import { useEffect, useState } from 'react'
import { LOCALES, DEFAULT_LOCALE, LOCALE_COOKIE, LOCALE_CHANGE_EVENT, type Locale } from './config'

function readLocaleCookie(): Locale {
  if (typeof document === 'undefined') return DEFAULT_LOCALE
  const match = document.cookie.match(new RegExp(`(?:^|; )${LOCALE_COOKIE}=([^;]*)`))
  const value = match ? decodeURIComponent(match[1]) : undefined
  return (LOCALES as readonly string[]).includes(value ?? '') ? (value as Locale) : DEFAULT_LOCALE
}

// Client-side counterpart to getLocale() — for 'use client' pages that can't
// call next/headers cookies(). Reacts to LanguageSwitcher's locale-change
// event so already-mounted client components update without a full reload.
export function useLocale(): Locale {
  const [locale, setLocaleState] = useState<Locale>(readLocaleCookie)

  useEffect(() => {
    function onChange(e: Event) {
      setLocaleState((e as CustomEvent<Locale>).detail)
    }
    window.addEventListener(LOCALE_CHANGE_EVENT, onChange)
    return () => window.removeEventListener(LOCALE_CHANGE_EVENT, onChange)
  }, [])

  return locale
}
