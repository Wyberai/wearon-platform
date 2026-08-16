#!/usr/bin/env node
/**
 * MELA — Flagship theme asset generation ("April")
 *
 * Generates product + campaign photography for the fictional showcase brand
 * "MELA" using OpenAI's gpt-image-2, saved to public/mela/. Bright, saturated,
 * direct-flash market-stall energy — garments hung on metal racks or piled on
 * cloth, marigold/hot-pink/turquoise color pops, slightly chaotic composition.
 * Deliberately NOT a clean studio shot — that's the whole point, it should
 * feel like a bazaar, distinct from every other flagship theme's polish.
 *
 * Usage: node scripts/generate-mela-assets.mjs
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
// Shared style language — bright direct-flash bazaar energy, loud not muted
// ---------------------------------------------------------------------------
const STALL_RACK = 'shot hanging on a crowded metal garment rack at an Indian street market stall, bright direct on-camera flash photography, slightly chaotic composition, other garments visible blurred at the edges of frame, saturated hot pink and marigold yellow and turquoise color pops in the background, photorealistic, no text, no logo, no visible brand marks, no readable labels or tags'
const STALL_PILE = 'shot piled on colorful cloth at an Indian street market stall counter, bright direct on-camera flash photography, slightly chaotic busy composition, saturated hot pink and marigold yellow and turquoise color pops nearby, photorealistic, no text, no logo, no visible brand marks, no readable labels or tags'

const PRODUCTS = [
  { slug: 'rayon-solid-kurti', prompt: `A hot pink solid rayon straight-cut kurti, ${STALL_RACK}` },
  { slug: 'printed-a-line-kurti', prompt: `A marigold yellow block-print A-line kurti, ${STALL_RACK}` },
  { slug: 'angrakha-wrap-kurti', prompt: `A turquoise angrakha wrap-style kurti with side tie-up, ${STALL_RACK}` },
  { slug: 'chikankari-georgette-kurti', prompt: `An off-white chikankari embroidered georgette kurti, flowy, ${STALL_RACK}` },
  { slug: 'floral-coord-set', prompt: `A marigold floral print crop top and palazzo co-ord set, ${STALL_PILE}` },
  { slug: 'ikat-print-coord-set', prompt: `A hot pink ikat print top and pants co-ord set, ${STALL_PILE}` },
  { slug: 'tie-dye-coord-set', prompt: `A turquoise tie-dye top and shorts co-ord set, ${STALL_PILE}` },
  { slug: 'shrug-3pc-coord-set', prompt: `A marigold floral 3-piece set: cami, palazzo pants, and open shrug, ${STALL_PILE}` },
  { slug: 'anarkali-3pc-set', prompt: `A hot pink flared Anarkali kurta with churidar and net dupatta, festive, ${STALL_RACK}` },
  { slug: 'sharara-set', prompt: `A marigold embroidered sharara set with short kurti and dupatta, festive, ${STALL_RACK}` },
  { slug: 'palazzo-suit-set', prompt: `A turquoise printed kurti and palazzo suit set with dupatta, ${STALL_RACK}` },
  { slug: 'rayon-kurta-pant-set', prompt: `A jet black solid rayon kurta with cigarette pants set, ${STALL_RACK}` },
  { slug: 'mojari-juttis', prompt: `A pair of gold-embroidered Indian mojari juttis, flat sole, ${STALL_PILE}` },
  { slug: 'kolhapuri-chappals', prompt: `A pair of tan leather Kolhapuri chappals with braided straps, ${STALL_PILE}` },
  { slug: 'block-heel-sandals', prompt: `A pair of turquoise block-heel sandals with ankle strap, ${STALL_PILE}` },
  { slug: 'oxidised-jhumkas', prompt: `A pair of large oxidised silver jhumka earrings, ${STALL_PILE}` },
  { slug: 'kundan-choker-set', prompt: `A gold-tone kundan choker necklace with matching earrings, ${STALL_PILE}` },
  { slug: 'glass-bangles-set', prompt: `A stack of a dozen mixed hot pink, turquoise and marigold glass bangles, ${STALL_PILE}` },
]

const CAMPAIGN = [
  { slug: 'hero', size: '1536x1024', prompt: 'Wide bright direct-flash photograph of a crowded Indian street-market clothing stall at dusk, garments hung densely on metal racks in hot pink, marigold yellow and turquoise, string lights overhead, slightly chaotic and lively, no people, no text, no logos, photorealistic market photography' },
  { slug: 'rack', size: '1536x1024', prompt: 'A dense metal garment rack at an Indian bazaar stall packed with hot pink, marigold and turquoise kurtis and dresses on hangers, bright direct on-camera flash, busy chaotic composition, no people, no text, no logos, photorealistic' },
  { slug: 'pile', size: '1536x1024', prompt: 'A pile of colorful folded garments stacked on a market stall counter cloth, hot pink and marigold and turquoise fabrics, bright direct flash photography, slightly messy and abundant, no people, no text, no logos, photorealistic' },
  { slug: 'jewellery-table', size: '1024x1024', prompt: 'An overhead shot of a street-market jewellery stall table covered with oxidised jhumkas, kundan chokers, and stacks of glass bangles in hot pink, marigold and turquoise, bright direct flash, densely packed display, no people, no text, no logos, photorealistic' },
  { slug: 'footwear-row', size: '1024x1024', prompt: 'A row of juttis, Kolhapuri chappals and block-heel sandals lined up on a market stall floor mat, bright direct flash photography, saturated colors, slightly chaotic street-market composition, no people, no text, no logos, photorealistic' },
]

async function main() {
  console.log(`\nMELA asset generation (OpenAI gpt-image-2) — ${PRODUCTS.length} products + ${CAMPAIGN.length} campaign images\n`)

  for (const p of PRODUCTS) {
    const dest = resolve(ROOT, 'public/mela/products', `${p.slug}.jpg`)
    console.log(`generating product: ${p.slug}...`)
    try {
      await generateAndSave(p.prompt, '1024x1536', dest)
    } catch (e) {
      console.error(`  FAILED ${p.slug}:`, e.message)
    }
  }

  for (const c of CAMPAIGN) {
    const dest = resolve(ROOT, 'public/mela/campaign', `${c.slug}.jpg`)
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
