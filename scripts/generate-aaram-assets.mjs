#!/usr/bin/env node
/**
 * AARAM — Flagship theme asset generation ("September")
 *
 * Generates product + campaign photography for the fictional showcase brand
 * "AARAM" (comfort/rest) using OpenAI's gpt-image-2, saved to public/aaram/.
 * Soft home-lifestyle photography — natural window light, unmade beds,
 * coffee mugs, house plants, relaxed candid poses at home. Warm clay/oat/
 * sage palette, calm and unhurried — distinct from every other theme's
 * studio-form or dramatic-glow energy.
 *
 * Usage: node scripts/generate-aaram-assets.mjs
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
// Shared style language — soft home-lifestyle photography, natural window
// light, warm clay/oat/sage palette, calm and unhurried, never staged-glam.
// ---------------------------------------------------------------------------
const HOME_LIFESTYLE = 'soft home-lifestyle photography, natural window light, warm and calm, an unmade bed or cozy bedroom corner nearby, muted warm clay and oat tones, relaxed candid mood, editorial lifestyle photography, photorealistic, no text, no logo, no visible brand marks, no readable labels or tags'
const STUDIO_FLAT = 'flat lay on a soft oat-colored linen surface, natural window light from one side, gentle shadow, warm and calm, editorial lifestyle photography, photorealistic, no text, no logo, no visible brand marks, no readable labels or tags'

const PRODUCTS = [
  { slug: 'clay-jogger', prompt: `Warm clay-colored brushed French terry jogger pants, elastic waist with drawstring, ${STUDIO_FLAT}` },
  { slug: 'oat-hoodie', prompt: `An oat-colored brushed fleece oversized pullover hoodie, kangaroo pocket, ${STUDIO_FLAT}` },
  { slug: 'weekend-oversized-tee', prompt: `A washed oat-colored oversized cotton t-shirt, dropped shoulder, draped casually on an unmade bed, ${HOME_LIFESTYLE}` },
  { slug: 'wrap-cardigan', prompt: `A soft sage green knit wrap cardigan with a self-tie waist, draped over a chair near a sunlit window, ${HOME_LIFESTYLE}` },
  { slug: 'rib-knit-coord', prompt: `A clay-colored ribbed knit fitted tee and elastic-waist shorts co-ord set, laid flat together, ${STUDIO_FLAT}` },
  { slug: 'textured-co-ord', prompt: `An oat-colored waffle-knit shirt and elastic-waist pants loungewear set, ${STUDIO_FLAT}` },
  { slug: 'linen-blend-coord', prompt: `A soft charcoal linen-blend camp-collar shirt and drawstring pants co-ord set, ${STUDIO_FLAT}` },
  { slug: 'terry-co-ord', prompt: `A blush-colored toweling terry short-sleeve top and shorts set, ${STUDIO_FLAT}` },
  { slug: 'cloud-nightsuit', prompt: `An oat-colored modal notch-collar nightsuit shirt and elastic-waist pants, draped over a bed with soft morning light, ${HOME_LIFESTYLE}` },
  { slug: 'slip-nightdress', prompt: `A blush-colored satin-finish slip nightdress with adjustable straps, hanging near a sunlit window, ${HOME_LIFESTYLE}` },
  { slug: 'printed-pyjama-set', prompt: `A sage-print cotton pyjama shirt and drawstring pants set, folded neatly on a linen bedspread, ${HOME_LIFESTYLE}` },
  { slug: 'cotton-nighty', prompt: `A dove-grey knee-length cotton nighty, round neck, short sleeves, ${STUDIO_FLAT}` },
  { slug: 'plush-slide', prompt: `A pair of oat-colored plush home slides with a wide strap, resting on a bedroom rug near a sunbeam, ${HOME_LIFESTYLE}` },
  { slug: 'memory-foam-slipper', prompt: `A pair of clay-colored closed-back knit slippers with a memory-foam footbed, ${HOME_LIFESTYLE}` },
  { slug: 'cozy-bootie-slipper', prompt: `A pair of charcoal ankle-height fleece-lined bootie slippers, ${HOME_LIFESTYLE}` },
  { slug: 'everyday-bralette', prompt: `A sage green wire-free cotton bralette with wide elastic band, ${STUDIO_FLAT}` },
  { slug: 'seamless-tank', prompt: `An oat-colored seamless fitted tank top, scoop neck, ${STUDIO_FLAT}` },
  { slug: 'soft-leggings', prompt: `A clay-colored soft-rib high-rise legging, folded neatly, ${STUDIO_FLAT}` },
]

const CAMPAIGN = [
  { slug: 'hero', size: '1536x1024', prompt: 'Wide soft-light shot: a warm clay-colored loungewear set draped over the edge of an unmade bed near a sunlit window with sheer curtains, a coffee mug and a small house plant on the nightstand, warm morning light, calm cinematic still life, no people, photorealistic lifestyle photography' },
  { slug: 'home-study', size: '1536x1024', prompt: 'A cozy sunlit bedroom corner with a rumpled oat-linen bed, a steaming coffee mug on a wooden tray, a house plant, soft natural window light, warm and calm, no people, editorial lifestyle photography, photorealistic' },
  { slug: 'texture', size: '1536x1024', prompt: 'Extreme macro close-up of soft brushed cotton fleece fabric texture in warm clay, soft natural window light revealing texture detail, editorial lifestyle photography, no people, photorealistic' },
  { slug: 'still-life', size: '1024x1024', prompt: 'Overhead still life on a rumpled oat-linen bed: a folded clay-colored loungewear set, a pair of plush slippers, and a coffee mug, soft natural daylight, editorial lifestyle photography, no people, photorealistic' },
  { slug: 'detail', size: '1024x1024', prompt: 'Extreme close-up of a soft ribbed knit fabric in warm clay with natural light and shallow depth of field, editorial lifestyle photography, no people, photorealistic' },
  { slug: 'flatlay-outfit', size: '1024x1536', prompt: 'Overhead flat lay of a considered comfort outfit on an oat-linen bedspread: a sage wrap cardigan, clay joggers, and plush home slippers, precisely composed, soft natural window light, editorial lifestyle photography, no people, no text, no logos, no labels or tags of any kind, photorealistic' },
]

async function main() {
  console.log(`\nAARAM asset generation (OpenAI gpt-image-2) — ${PRODUCTS.length} products + ${CAMPAIGN.length} campaign images\n`)

  for (const p of PRODUCTS) {
    const dest = resolve(ROOT, 'public/aaram/products', `${p.slug}.jpg`)
    console.log(`generating product: ${p.slug}...`)
    try {
      await generateAndSave(p.prompt, '1024x1536', dest)
    } catch (e) {
      console.error(`  FAILED ${p.slug}:`, e.message)
    }
  }

  for (const c of CAMPAIGN) {
    const dest = resolve(ROOT, 'public/aaram/campaign', `${c.slug}.jpg`)
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
