#!/usr/bin/env node
/**
 * BLOOM — Flagship theme asset generation ("March")
 *
 * Generates product + campaign photography for the fictional showcase brand
 * "BLOOM" using OpenAI's gpt-image-2, saved to public/bloom/. Bright, soft
 * natural daylight, sage/cream/blush/terracotta palette — distinct from both
 * AUGUST's controlled warm studio and EMBER's dramatic dark glow.
 *
 * Usage: node scripts/generate-bloom-assets.mjs
 * Requires: OPENAI_API_KEY in .env.local
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import OpenAI from 'openai'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

function loadEnv() {
  const path = resolve(ROOT, '.env.local')
  const txt = readFileSync(path, 'utf8')
  for (const line of txt.split('\n')) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
    if (m) process.env[m[1]] = process.env[m[1]] ?? m[2].trim()
  }
}
loadEnv()

if (!process.env.OPENAI_API_KEY) { console.error('Missing OPENAI_API_KEY in .env.local'); process.exit(1) }
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

async function generate(prompt, size) {
  const res = await client.images.generate({
    model: 'gpt-image-2',
    prompt,
    size,
    quality: 'high',
    output_format: 'jpeg',
  })
  const item = res.data[0]
  if (item.b64_json) return Buffer.from(item.b64_json, 'base64')
  if (item.url) {
    const imgRes = await fetch(item.url)
    return Buffer.from(await imgRes.arrayBuffer())
  }
  throw new Error('No image data in response')
}

async function generateAndSave(prompt, size, destPath) {
  if (existsSync(destPath)) { console.log(`skip ${destPath} (exists)`); return }
  const buf = await generate(prompt, size)
  mkdirSync(dirname(destPath), { recursive: true })
  writeFileSync(destPath, buf)
  console.log(`  saved ${destPath} (${(buf.length / 1024).toFixed(0)}kb)`)
}

// ---------------------------------------------------------------------------
// Shared style language — bright natural daylight, soft botanical
// ---------------------------------------------------------------------------
const STUDIO_FORM = 'shot on a headless linen-wrapped dress form against a sun-washed cream linen backdrop, soft natural window light, minimal airy shadow, bright and light, medium-format editorial fashion photography, photorealistic, no text, no logo, no visible brand marks, no readable labels or tags'
const STUDIO_FLAT = 'flat lay on a sun-washed cream linen surface, soft natural window light from one side, minimal airy shadow, bright and light, medium-format editorial fashion photography, photorealistic, no text, no logo, no visible brand marks, no readable labels or tags'

const PRODUCTS = [
  { slug: 'linen-wrap-top', prompt: `A sage green washed linen wrap top with a waist tie, cropped, ${STUDIO_FORM}` },
  { slug: 'poplin-blouse', prompt: `A cream cotton poplin blouse with a soft puff sleeve, ${STUDIO_FORM}` },
  { slug: 'rib-tank', prompt: `A blush pink fitted ribbed cotton tank top, scoop neck, ${STUDIO_FORM}` },
  { slug: 'botanical-camisole', prompt: `A terracotta silk camisole with a hand-painted botanical floral print, adjustable straps, ${STUDIO_FORM}` },
  { slug: 'wide-leg-linen-pant', prompt: `Sage green wide-leg linen trousers, high rise, ${STUDIO_FLAT}` },
  { slug: 'pleated-midi-skirt', prompt: `A cream cotton poplin pleated midi skirt, knife pleats, ${STUDIO_FORM}` },
  { slug: 'tailored-short', prompt: `Terracotta cotton twill tailored shorts, front crease, ${STUDIO_FLAT}` },
  { slug: 'cropped-trouser', prompt: `Blush pink cropped straight-leg trousers, ankle length, ${STUDIO_FLAT}` },
  { slug: 'wrap-midi-dress', prompt: `A sage green wrap midi dress with a botanical floral print, V-neck, flowing, ${STUDIO_FORM}` },
  { slug: 'poplin-shirtdress', prompt: `A cream cotton poplin belted shirtdress, ${STUDIO_FORM}` },
  { slug: 'slip-sundress', prompt: `A terracotta bias-cut cotton voile slip sundress, adjustable straps, ${STUDIO_FORM}` },
  { slug: 'linen-duster', prompt: `A sage green unstructured floor-length linen duster coat, open front, ${STUDIO_FORM}` },
  { slug: 'cropped-cardigan', prompt: `A blush pink cropped cotton-knit cardigan, horn buttons, ${STUDIO_FORM}` },
  { slug: 'utility-vest', prompt: `A cream linen utility vest with four patch pockets, ${STUDIO_FORM}` },
  { slug: 'woven-tote', prompt: `A natural raffia woven tote bag with reinforced handles, standing upright, ${STUDIO_FLAT}` },
  { slug: 'wide-brim-hat', prompt: `A cream woven straw wide-brim sun hat with a grosgrain band, ${STUDIO_FLAT}` },
  { slug: 'knot-headband', prompt: `A terracotta botanical-print knotted fabric headband, ${STUDIO_FLAT}` },
  { slug: 'leather-sandal', prompt: `A terracotta leather block-heel sandal with an ankle strap, single shoe, ${STUDIO_FLAT}` },
]

const CAMPAIGN = [
  { slug: 'hero', size: '1536x1024', prompt: 'Wide bright natural-light shot: a sage green linen wrap dress hanging on a wooden peg beside a sun-drenched window with sheer linen curtains, potted botanical plants nearby, warm morning light, airy cinematic still life, no people, photorealistic medium format film photography' },
  { slug: 'botanical-study', size: '1536x1024', prompt: 'Close-up botanical study: pressed sage leaves and terracotta-colored dried flowers arranged on cream linen fabric, soft natural window light, editorial fashion photography, no people, photorealistic' },
  { slug: 'texture', size: '1536x1024', prompt: 'Extreme macro close-up of washed linen fabric texture in sage green, soft natural side light revealing weave detail, editorial fashion photography, no people, photorealistic' },
  { slug: 'still-life', size: '1024x1024', prompt: 'Overhead still life on a cream linen surface: a woven raffia tote, a wide-brim straw hat, and terracotta leather sandals arranged with soft natural daylight, editorial fashion photography, no people, photorealistic' },
  { slug: 'detail', size: '1024x1024', prompt: 'Extreme close-up of a hand-painted botanical floral print on silk fabric, soft natural light, shallow depth of field, editorial fashion photography, no people, photorealistic' },
  { slug: 'flatlay-outfit', size: '1024x1536', prompt: 'Overhead flat lay of a considered capsule outfit on cream linen: a sage wrap top, wide-leg linen trousers, and a woven raffia tote, precisely composed, soft natural daylight, editorial fashion photography, no people, no text, no logos, no labels or tags of any kind, photorealistic' },
]

async function main() {
  console.log(`\nBLOOM asset generation (OpenAI gpt-image-2) — ${PRODUCTS.length} products + ${CAMPAIGN.length} campaign images\n`)

  for (const p of PRODUCTS) {
    const dest = resolve(ROOT, 'public/bloom/products', `${p.slug}.jpg`)
    console.log(`generating product: ${p.slug}...`)
    try {
      await generateAndSave(p.prompt, '1024x1536', dest)
    } catch (e) {
      console.error(`  FAILED ${p.slug}:`, e.message)
    }
  }

  for (const c of CAMPAIGN) {
    const dest = resolve(ROOT, 'public/bloom/campaign', `${c.slug}.jpg`)
    console.log(`generating campaign: ${c.slug}...`)
    try {
      await generateAndSave(c.prompt, c.size, dest)
    } catch (e) {
      console.error(`  FAILED ${c.slug}:`, e.message)
    }
  }

  console.log('\nDone.\n')
}

main().catch(err => { console.error(err); process.exit(1) })
