// Deterministic language + location detection for scraped Instagram
// prospects. No AI call — sellers already write in their real script, so
// counting Unicode code points per script range is more reliable than
// guessing language from a city name, and it's free to run on every scrape.

const SCRIPT_RANGES: { lang: string; pattern: RegExp }[] = [
  { lang: 'hi', pattern: /[ऀ-ॿ]/g }, // Devanagari (Hindi/Marathi)
  { lang: 'ta', pattern: /[஀-௿]/g }, // Tamil
  { lang: 'kn', pattern: /[ಀ-೿]/g }, // Kannada
  { lang: 'te', pattern: /[ఀ-౿]/g }, // Telugu
  { lang: 'ml', pattern: /[ഀ-ൿ]/g }, // Malayalam
  { lang: 'bn', pattern: /[ঀ-৿]/g }, // Bengali
  { lang: 'gu', pattern: /[઀-૿]/g }, // Gujarati
  { lang: 'pa', pattern: /[਀-੿]/g }, // Gurmukhi (Punjabi)
  { lang: 'or', pattern: /[଀-୿]/g }, // Odia
]

/** Dominant non-Latin script in the text, falling back to 'en'. */
export function detectLanguage(text: string): string {
  if (!text) return 'en'
  let best = { lang: 'en', count: 0 }
  for (const { lang, pattern } of SCRIPT_RANGES) {
    const matches = text.match(pattern)
    const count = matches ? matches.length : 0
    if (count > best.count) best = { lang, count }
  }
  return best.count > 0 ? best.lang : 'en'
}

// Seeded from cities actually observed in this session's scrape; extend as
// new cities show up in bios. Lowercase keys, matched case-insensitively.
const CITY_TO_STATE: Record<string, string> = {
  'neyyattinkara': 'Kerala', 'trivandrum': 'Kerala', 'thiruvananthapuram': 'Kerala',
  'kochi': 'Kerala', 'cochin': 'Kerala', 'kottayam': 'Kerala', 'kozhikode': 'Kerala',
  'calicut': 'Kerala', 'palghat': 'Kerala', 'palakkad': 'Kerala', 'thrissur': 'Kerala',
  'karur': 'Tamil Nadu', 'chennai': 'Tamil Nadu', 'madurai': 'Tamil Nadu',
  'coimbatore': 'Tamil Nadu', 'salem': 'Tamil Nadu', 'tirupur': 'Tamil Nadu',
  'kothur': 'Telangana', 'hyderabad': 'Telangana', 'secunderabad': 'Telangana',
  'warangal': 'Telangana',
  'bangalore': 'Karnataka', 'bengaluru': 'Karnataka', 'mysore': 'Karnataka',
  'mysuru': 'Karnataka', 'mangalore': 'Karnataka', 'hubli': 'Karnataka',
  'indore': 'Madhya Pradesh', 'bhopal': 'Madhya Pradesh', 'jabalpur': 'Madhya Pradesh',
  'mumbai': 'Maharashtra', 'pune': 'Maharashtra', 'nagpur': 'Maharashtra',
  'nashik': 'Maharashtra', 'thane': 'Maharashtra',
  'delhi': 'Delhi', 'new delhi': 'Delhi',
  'jaipur': 'Rajasthan', 'jodhpur': 'Rajasthan', 'udaipur': 'Rajasthan',
  'lucknow': 'Uttar Pradesh', 'kanpur': 'Uttar Pradesh', 'varanasi': 'Uttar Pradesh',
  'agra': 'Uttar Pradesh', 'noida': 'Uttar Pradesh', 'ghaziabad': 'Uttar Pradesh',
  'kolkata': 'West Bengal', 'howrah': 'West Bengal',
  'ahmedabad': 'Gujarat', 'surat': 'Gujarat', 'vadodara': 'Gujarat', 'rajkot': 'Gujarat',
  'patna': 'Bihar', 'gaya': 'Bihar',
  'bhubaneswar': 'Odisha', 'cuttack': 'Odisha',
  'guwahati': 'Assam',
  'chandigarh': 'Punjab', 'ludhiana': 'Punjab', 'amritsar': 'Punjab',
  'vijayawada': 'Andhra Pradesh', 'visakhapatnam': 'Andhra Pradesh', 'vizag': 'Andhra Pradesh',
  'guntur': 'Andhra Pradesh', 'tirupati': 'Andhra Pradesh',
}

const LOCATION_MARKER_RE = /(?:📍|📌)\s*([A-Za-z][A-Za-z\s,.-]{1,60})/
const STATE_NAMES = [...new Set(Object.values(CITY_TO_STATE))]

function findKnownCityOrState(text: string): { city?: string; state?: string } | null {
  const lower = text.toLowerCase()
  for (const [city, state] of Object.entries(CITY_TO_STATE)) {
    if (new RegExp(`\\b${city}\\b`).test(lower)) return { city, state }
  }
  for (const state of STATE_NAMES) {
    if (new RegExp(`\\b${state.toLowerCase()}\\b`).test(lower)) return { state }
  }
  return null
}

/**
 * Extracts a city/state pair from a bio. Tries the common "📍 City, State"
 * marker pattern first (higher-confidence — it's clearly a location field,
 * not incidental text), then falls back to scanning the whole bio for any
 * known city/state name mentioned plainly (e.g. "Kerala | PAN India
 * Shipping" has no pin emoji at all, but is just as reliable a signal).
 */
export function detectLocation(bio: string): { city?: string; state?: string } {
  if (!bio) return {}

  const match = bio.match(LOCATION_MARKER_RE)
  if (match) {
    const raw = match[1].split('\n')[0].trim()
    const parts = raw.split(',').map(p => p.trim()).filter(Boolean)
    for (const part of parts) {
      const key = part.toLowerCase().replace(/[^a-z\s]/g, '').trim()
      if (CITY_TO_STATE[key]) return { city: part, state: CITY_TO_STATE[key] }
    }
    const fallback = findKnownCityOrState(bio)
    if (fallback) return fallback
    // A location was mentioned but matched no known city — keep the raw text as city.
    return parts[0] ? { city: parts[0] } : {}
  }

  return findKnownCityOrState(bio) ?? {}
}
