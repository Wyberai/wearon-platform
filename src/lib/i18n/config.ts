// Cookie-based locale, not URL-based (no /hi/... route segments) —
// deliberately avoids restructuring every route in a live app the night
// before a real launch. A server component reads the cookie via
// getLocale() and renders the right dictionary; LanguageSwitcher (a client
// component) sets the cookie and refreshes.
export const LOCALES = ['en', 'hi', 'kn', 'te', 'mr', 'ta'] as const
export type Locale = (typeof LOCALES)[number]

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  hi: 'हिन्दी',
  kn: 'ಕನ್ನಡ',
  te: 'తెలుగు',
  mr: 'मराठी',
  ta: 'தமிழ்',
}

export const DEFAULT_LOCALE: Locale = 'en'
export const LOCALE_COOKIE = 'lang'
