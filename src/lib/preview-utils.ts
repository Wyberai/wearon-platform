import { FLAGSHIP_DEMO_SLUG } from './themes'

export interface PreviewTheme {
  name: string
  slug: string
}

// THEME_TILES pass their demo store's slug (e.g. 'august'), but the real
// theme_id a signup needs to apply is the registry id (e.g. 'january' —
// FLAGSHIP_DEMO_SLUG maps id -> slug, so this reverses it). Every demo slug
// is unique across the map, so this always resolves.
export function demoSlugToThemeId(slug: string): string {
  return Object.entries(FLAGSHIP_DEMO_SLUG).find(([, s]) => s === slug)?.[0] ?? slug
}

// Turns an email's local-part into a plausible boutique name, e.g.
// "priya.designs21@gmail.com" -> "Priya Designs21". Purely cosmetic —
// the seller can rename their store for real during signup.
export function deriveBrandName(email: string): string {
  const local = email.split('@')[0] ?? ''
  const words = local.replace(/[^a-zA-Z0-9]+/g, ' ').trim().split(/\s+/).filter(Boolean)
  if (!words.length) return 'My Boutique'
  return words.slice(0, 3).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')
}

export interface SubmitPreviewResult {
  ok: boolean
  error?: string
  redirectUrl?: string
}

// Shared by both the inline capture box and the persistent sticky bar so
// they behave identically — records the lead, then builds the redirect into
// that theme's real flagship demo with the derived name applied.
export async function submitPreviewLead(email: string, theme: PreviewTheme): Promise<SubmitPreviewResult> {
  const brandName = deriveBrandName(email)
  const themeId = demoSlugToThemeId(theme.slug)

  const res = await fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, brand_name: brandName, theme_id: themeId }),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    return { ok: false, error: data.error ?? 'Something went wrong — try again' }
  }

  const params = new URLSearchParams({ preview_name: brandName, preview_email: email, theme: themeId })
  return { ok: true, redirectUrl: `/store/${theme.slug}?${params.toString()}` }
}
