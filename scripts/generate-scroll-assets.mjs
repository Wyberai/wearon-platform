#!/usr/bin/env node
/**
 * SCROLL — Flagship theme asset generation ("July", theme #7)
 *
 * Generates product + story-teaser photography for the fictional showcase
 * brand "SCROLL" using OpenAI's gpt-image-2, saved to public/scroll/.
 *
 * Photography direction is the deliberate opposite of every other flagship
 * theme's polished studio/campaign shoot: authentic UGC/content-creator
 * aesthetic — natural phone-camera look, mirror selfies, candid poses,
 * un-retouched natural light, slightly imperfect framing. Product shots are
 * square (1:1) to match a real feed post; story teasers are vertical
 * (9:16-ish) to match a real phone story.
 *
 * Usage: node scripts/generate-scroll-assets.mjs
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
// Shared style language — authentic creator-UGC, the opposite of a studio
// shoot. No polish, no even lighting, no perfect crop — that imperfection is
// the entire point of this theme's photography.
// ---------------------------------------------------------------------------
const UGC_SELFIE = 'candid mirror selfie of a young Indian woman, shot on a phone camera, natural indoor window light, slightly imperfect off-center framing, visible phone in one hand, authentic content-creator Instagram-story aesthetic, unretouched, realistic skin texture, casual bedroom or hallway setting, photorealistic, no text, no logo, no visible brand marks, no readable labels or tags'
const UGC_CANDID = 'candid full-length photo of a young Indian woman wearing the outfit, shot on a phone camera with natural daylight, casual un-posed stance, authentic content-creator aesthetic, slightly imperfect framing, realistic and unretouched, photorealistic, no text, no logo, no visible brand marks, no readable labels or tags'
const UGC_CLOSEUP = 'candid close-up phone-camera photo, natural light, authentic content-creator aesthetic, unretouched, realistic, photorealistic, no text, no logo, no visible brand marks, no readable labels or tags'

const PRODUCTS = [
  { slug: 'boxy-crop-tee', prompt: `${UGC_SELFIE}, wearing an ivory boxy cropped t-shirt` },
  { slug: 'ruched-bodycon-cami', prompt: `${UGC_SELFIE}, wearing a black ruched bodycon cami top` },
  { slug: 'oversized-graphic-tee', prompt: `${UGC_CANDID}, an oversized sand-coloured graphic t-shirt` },
  { slug: 'halter-neck-top', prompt: `${UGC_SELFIE}, wearing a coral halter neck top` },
  { slug: 'puff-sleeve-blouse', prompt: `${UGC_SELFIE}, wearing a butter-yellow puff sleeve blouse` },
  { slug: 'bodycon-mini-dress', prompt: `${UGC_CANDID}, a cherry red bodycon mini dress` },
  { slug: 'coord-slip-dress', prompt: `${UGC_CANDID}, a lilac satin slip dress` },
  { slug: 'wrap-dress', prompt: `${UGC_CANDID}, an emerald green wrap dress` },
  { slug: 'denim-mini-dress', prompt: `${UGC_CANDID}, a mid-blue wash denim mini dress` },
  { slug: 'corset-midi-dress', prompt: `${UGC_CANDID}, a black corset midi dress` },
  { slug: 'indo-western-kurti-set', prompt: `${UGC_CANDID}, a mustard indo-western kurti set with a jacket panel` },
  { slug: 'ethnic-print-coord', prompt: `${UGC_CANDID}, a rani pink ethnic block-print co-ord set` },
  { slug: 'fusion-jacket-kurta', prompt: `${UGC_CANDID}, an indigo fusion jacket layered over a short kurta` },
  { slug: 'bandhani-wrap-top', prompt: `${UGC_SELFIE}, wearing a magenta bandhani wrap top` },
  { slug: 'chikankari-shirt-dress', prompt: `${UGC_CANDID}, a white chikankari embroidered shirt dress` },
  { slug: 'chunky-hoop-earrings', prompt: `${UGC_CLOSEUP}, close-up of a young Indian woman's ear wearing gold chunky hoop earrings, hair tucked back` },
  { slug: 'mini-sling-bag', prompt: `${UGC_CLOSEUP}, a young Indian woman holding a black mini sling bag against an outfit, phone-camera candid` },
  { slug: 'layered-chain-necklace', prompt: `${UGC_CLOSEUP}, close-up of a young Indian woman wearing a silver layered chain necklace set` },
]

// Story teasers — vertical, phone-story shaped, each tied to one product's
// PDP via SCROLL_STORIES in src/lib/scroll/catalog.ts.
const STORIES = [
  { slug: 'story-new-drop', size: '1024x1536', prompt: `${UGC_SELFIE}, wearing an ivory boxy cropped t-shirt, vertical phone-story framing` },
  { slug: 'story-restock', size: '1024x1536', prompt: `${UGC_SELFIE}, wearing a black ruched bodycon cami top, vertical phone-story framing` },
  { slug: 'story-ethnic-edit', size: '1024x1536', prompt: `${UGC_CANDID}, a mustard indo-western kurti set, vertical phone-story framing` },
  { slug: 'story-flash-sale', size: '1024x1536', prompt: `${UGC_CANDID}, a cherry red bodycon mini dress, vertical phone-story framing` },
  { slug: 'story-accessorize', size: '1024x1536', prompt: `${UGC_CLOSEUP}, a young Indian woman holding a black mini sling bag, vertical phone-story framing` },
  { slug: 'story-behind-seams', size: '1024x1536', prompt: 'candid phone-camera close-up of hands hand-embroidering white chikankari fabric, natural window light, authentic behind-the-scenes content-creator aesthetic, unretouched, photorealistic, no text, no logo, no visible brand marks, vertical phone-story framing' },
  { slug: 'story-style-hack', size: '1024x1536', prompt: `${UGC_CANDID}, an emerald green wrap dress, vertical phone-story framing` },
]

async function main() {
  console.log(`\nSCROLL asset generation (OpenAI gpt-image-2) — ${PRODUCTS.length} products + ${STORIES.length} story teasers\n`)

  for (const p of PRODUCTS) {
    const dest = resolve(ROOT, 'public/scroll/products', `${p.slug}.jpg`)
    console.log(`generating product: ${p.slug}...`)
    try {
      await generateAndSave(p.prompt, '1024x1024', dest)
    } catch (e) {
      console.error(`  FAILED ${p.slug}:`, e.message)
    }
  }

  for (const s of STORIES) {
    const dest = resolve(ROOT, 'public/scroll/campaign', `${s.slug}.jpg`)
    console.log(`generating story: ${s.slug}...`)
    try {
      await generateAndSave(s.prompt, s.size, dest)
    } catch (e) {
      console.error(`  FAILED ${s.slug}:`, e.message)
    }
  }

  console.log('\nDone.\n')
}

main().catch(err => { console.error(err); process.exit(1) })
