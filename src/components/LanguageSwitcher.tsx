'use client'

import { useRouter } from 'next/navigation'
import { LOCALES, LOCALE_LABELS, LOCALE_COOKIE, type Locale } from '@/lib/i18n/config'

export function LanguageSwitcher({ current, dark }: { current: Locale; dark?: boolean }) {
  const router = useRouter()

  function setLocale(locale: Locale) {
    document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${60 * 60 * 24 * 365}`
    router.refresh()
  }

  return (
    <select
      value={current}
      onChange={e => setLocale(e.target.value as Locale)}
      aria-label="Language"
      style={{
        fontSize: 12, fontWeight: 600, padding: '4px 8px', borderRadius: 8, cursor: 'pointer',
        background: dark ? 'rgba(255,255,255,0.08)' : '#f3f4f6',
        color: dark ? '#fff' : '#374151',
        border: dark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #e5e7eb',
      }}
    >
      {LOCALES.map(l => (
        <option key={l} value={l}>{LOCALE_LABELS[l]}</option>
      ))}
    </select>
  )
}
