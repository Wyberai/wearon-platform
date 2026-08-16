import { cookies } from 'next/headers'
import { LOCALES, DEFAULT_LOCALE, LOCALE_COOKIE, type Locale } from './config'

// Server-only — call from a server component (page.tsx / layout.tsx),
// never from a client component (use the useLocale() hook there instead).
export async function getLocale(): Promise<Locale> {
  const store = await cookies()
  const value = store.get(LOCALE_COOKIE)?.value
  return (LOCALES as readonly string[]).includes(value ?? '') ? (value as Locale) : DEFAULT_LOCALE
}
