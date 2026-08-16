#!/usr/bin/env node
/**
 * Instastarz — Outbound Prospect Importer
 *
 * Takes the JSON produced by the Apify hashtag+profile scrape pipeline
 * (an array of { username, fullName, phone, email, sourceUrl, hashtag, bio? })
 * and upserts each into the outbound_prospects table, running language +
 * location detection on the way in. Safe to re-run on the same or overlapping
 * batches — upserts on instagram_username, so nothing is duplicated as new
 * hashtag rounds get scraped.
 *
 * Usage:
 *   node scripts/import-outbound-prospects.mjs path/to/owners.json
 *
 * Required env vars (export before running, or prefix inline):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */
import { readFileSync } from 'fs'
import { createClient } from '@supabase/supabase-js'

// Plain-JS mirror of src/lib/outbound/detect.ts (Node can't import .ts
// directly here, and no other script in this dir pulls from src/, so this
// stays a duplicate on purpose — keep both in sync if the ranges change).
const SCRIPT_RANGES = [
  { lang: 'hi', pattern: /[ऀ-ॿ]/g },
  { lang: 'ta', pattern: /[஀-௿]/g },
  { lang: 'kn', pattern: /[ಀ-೿]/g },
  { lang: 'te', pattern: /[ఀ-౿]/g },
  { lang: 'ml', pattern: /[ഀ-ൿ]/g },
  { lang: 'bn', pattern: /[ঀ-৿]/g },
  { lang: 'gu', pattern: /[઀-૿]/g },
  { lang: 'pa', pattern: /[਀-੿]/g },
  { lang: 'or', pattern: /[଀-୿]/g },
]

function detectLanguage(text) {
  if (!text) return 'en'
  let best = { lang: 'en', count: 0 }
  for (const { lang, pattern } of SCRIPT_RANGES) {
    const matches = text.match(pattern)
    const count = matches ? matches.length : 0
    if (count > best.count) best = { lang, count }
  }
  return best.count > 0 ? best.lang : 'en'
}

const CITY_TO_STATE = {
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

function findKnownCityOrState(text) {
  const lower = text.toLowerCase()
  for (const [city, state] of Object.entries(CITY_TO_STATE)) {
    if (new RegExp(`\\b${city}\\b`).test(lower)) return { city, state }
  }
  for (const state of STATE_NAMES) {
    if (new RegExp(`\\b${state.toLowerCase()}\\b`).test(lower)) return { state }
  }
  return null
}

function detectLocation(bio) {
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
    return parts[0] ? { city: parts[0] } : {}
  }
  return findKnownCityOrState(bio) ?? {}
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const inputPath = process.argv[2]
if (!inputPath) {
  console.error('Usage: node scripts/import-outbound-prospects.mjs path/to/owners.json')
  process.exit(1)
}

const owners = JSON.parse(readFileSync(inputPath, 'utf8'))
const admin = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })

const rows = []
let skipped = 0

for (const o of owners) {
  if (!o.username) { skipped++; continue }
  const text = `${o.bio || ''} ${o.caption || ''}`
  const language = detectLanguage(text)
  const { city, state } = detectLocation(o.bio || '')
  rows.push({
    instagram_username: o.username,
    full_name: o.fullName || null,
    phone: o.phone || null,
    email: o.email || null,
    bio: o.bio || null,
    detected_language: language,
    detected_city: city || null,
    detected_state: state || null,
    source_hashtag: o.hashtag || null,
    source_post_url: o.sourceUrl || null,
  })
}

// Single batched upsert (PostgREST accepts an array body) instead of one
// row per request — this is what makes re-running on overlapping hashtag
// batches cheap and fast, not just correct.
const CHUNK = 100
let upserted = 0
for (let i = 0; i < rows.length; i += CHUNK) {
  const chunk = rows.slice(i, i + CHUNK)
  const { error } = await admin.from('outbound_prospects').upsert(chunk, { onConflict: 'instagram_username' })
  if (error) {
    console.error(`Chunk ${i / CHUNK} failed:`, error.message)
    continue
  }
  upserted += chunk.length
}

console.log(`Done. Upserted: ${upserted}, Skipped (no username): ${skipped}`)
