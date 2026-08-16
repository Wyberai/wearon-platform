#!/usr/bin/env node
/**
 * DHAMAKA — Flagship theme asset generation ("August", theme #8 of 12)
 *
 * Generates product + campaign photography for the fictional showcase brand
 * "DHAMAKA" using OpenAI's gpt-image-2, saved to public/dhamaka/. Bold
 * graphic poster style — oversized price-tag/percentage-off badges treated
 * as literal design elements layered over the shot, harsh high-contrast
 * flash lighting, red/yellow "SALE" energy. Deliberately loud and
 * commercial — the opposite of BLOOM's soft editorial calm.
 *
 * Usage: node scripts/generate-dhamaka-assets.mjs
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
  if (existsSync(destPath)) { console.log(`skip ${destPath} (exists)`); return 'skipped' }
  const buf = await generate(prompt, size)
  mkdirSync(dirname(destPath), { recursive: true })
  writeFileSync(destPath, buf)
  console.log(`  saved ${destPath} (${(buf.length / 1024).toFixed(0)}kb)`)
  return 'saved'
}

// ---------------------------------------------------------------------------
// Shared style language — bold graphic sale-poster photography
// ---------------------------------------------------------------------------
const STUDIO_FORM = 'shot against a near-black studio backdrop under harsh high-contrast flash lighting, hard specular highlights, an oversized red and yellow discount price tag graphic layered over one corner of the shot like a sale poster sticker, loud commercial fast-fashion advertising photography, photorealistic, no readable text on the price tag, no logos, no brand marks'
const STUDIO_FLAT = 'flat lay on a near-black glossy surface under harsh high-contrast flash lighting, hard specular highlights and deep shadows, an oversized red and yellow discount price tag graphic layered over one corner like a sale poster sticker, loud commercial fast-fashion advertising photography, photorealistic, no readable text on the price tag, no logos, no brand marks'

const PRODUCTS = [
  { slug: 'graphic-oversized-tee', prompt: `A black oversized graphic print t-shirt, bold loud print, ${STUDIO_FORM}` },
  { slug: 'ribbed-crop-top', prompt: `A neon pink fitted ribbed crop top, ${STUDIO_FORM}` },
  { slug: 'boxy-printed-shirt', prompt: `A red and black all-over print boxy shirt, ${STUDIO_FORM}` },
  { slug: 'basic-tank-2pack', prompt: `Two fitted ribbed tank tops, one black one white, laid side by side, ${STUDIO_FLAT}` },
  { slug: 'bodycon-mini-dress', prompt: `A red stretch bodycon mini dress with a square neckline, ${STUDIO_FORM}` },
  { slug: 'floral-wrap-dress', prompt: `A red and black bold floral print flowy wrap dress, ${STUDIO_FORM}` },
  { slug: 'coord-set-dress', prompt: `A yellow and black two-piece co-ord set, cropped top and matching skirt, ${STUDIO_FORM}` },
  { slug: 'high-rise-jeans', prompt: `Mid-blue high-rise straight-leg denim jeans, ${STUDIO_FLAT}` },
  { slug: 'relaxed-joggers', prompt: `Grey melange relaxed-fit jogger sweatpants with tapered cuffs, ${STUDIO_FLAT}` },
  { slug: 'flowy-palazzo-pants', prompt: `Yellow bold-print flowy wide-leg palazzo pants, ${STUDIO_FLAT}` },
  { slug: 'denim-shorts', prompt: `Light-wash frayed-hem denim shorts, ${STUDIO_FLAT}` },
  { slug: 'chunky-sneakers', prompt: `A white and red chunky-sole street sneaker, single shoe, dramatic angle, ${STUDIO_FLAT}` },
  { slug: 'slide-sandals', prompt: `A pair of black cushioned slide sandals with a yellow adjustable strap, ${STUDIO_FLAT}` },
  { slug: 'canvas-sneakers', prompt: `A white low-top canvas lace-up sneaker, single shoe, ${STUDIO_FLAT}` },
  { slug: 'canvas-tote-bag', prompt: `An oversized natural canvas tote bag with a bold graphic print, standing upright, ${STUDIO_FLAT}` },
  { slug: 'oversized-sunglasses', prompt: `A pair of oversized black acetate statement sunglasses, ${STUDIO_FLAT}` },
  { slug: 'hair-clips-combo', prompt: `A set of six colorful claw hair clips fanned out, ${STUDIO_FLAT}` },
  { slug: 'statement-belt', prompt: `A wide black faux-leather statement belt with an oversized buckle, coiled, ${STUDIO_FLAT}` },
]

const CAMPAIGN = [
  { slug: 'hero', size: '1536x1024', prompt: 'Wide dramatic sale-poster photography: a wall of red and yellow oversized percentage-off discount tag graphics and price tags cascading down like confetti against a near-black background, harsh high-contrast flash lighting, hard shadows, loud commercial fast-fashion mega-sale advertising still life, no people, no readable text, photorealistic' },
  { slug: 'sale-wall', size: '1536x1024', prompt: 'A wall covered edge to edge in oversized red and yellow discount percentage tags and sale stickers at different rotations, harsh flash photography, high contrast, no readable text, no logos, photorealistic advertising still life, no people' },
  { slug: 'price-tag-stack', size: '1024x1024', prompt: 'Extreme close-up macro shot of a stack of oversized red and yellow cardboard price tags with torn string, harsh direct flash lighting, hard shadow, no readable text, no logos, photorealistic product photography, no people' },
  { slug: 'flash-detail', size: '1024x1024', prompt: 'Extreme close-up of a red fabric surface catching a hard camera flash reflection, dramatic high-contrast lighting, deep black shadow falloff, no text, no logos, photorealistic macro photography, no people' },
  { slug: 'haul-flatlay', size: '1024x1536', prompt: 'Overhead flat lay on a near-black glossy surface: an oversized graphic tee, denim shorts, chunky sneakers, and a canvas tote arranged with oversized red and yellow discount tag graphics scattered between them, harsh high-contrast flash lighting, loud commercial fast-fashion sale photography, no people, no readable text, no logos, photorealistic' },
  { slug: 'texture', size: '1536x1024', prompt: 'Extreme macro close-up of red and yellow crumpled foil-like sale-poster paper texture under harsh flash lighting, hard specular highlights, high contrast, no text, no logos, photorealistic, no people' },
]

async function main() {
  console.log(`\nDHAMAKA asset generation (OpenAI gpt-image-2) — ${PRODUCTS.length} products + ${CAMPAIGN.length} campaign images\n`)

  let saved = 0
  let skipped = 0
  let failed = 0

  for (const p of PRODUCTS) {
    const dest = resolve(ROOT, 'public/dhamaka/products', `${p.slug}.jpg`)
    console.log(`generating product: ${p.slug}...`)
    try {
      const result = await generateAndSave(p.prompt, '1024x1536', dest)
      if (result === 'saved') saved++
      else skipped++
    } catch (e) {
      console.error(`  FAILED ${p.slug}:`, e.message)
      failed++
    }
  }

  for (const c of CAMPAIGN) {
    const dest = resolve(ROOT, 'public/dhamaka/campaign', `${c.slug}.jpg`)
    console.log(`generating campaign: ${c.slug}...`)
    try {
      const result = await generateAndSave(c.prompt, c.size, dest)
      if (result === 'saved') saved++
      else skipped++
    } catch (e) {
      console.error(`  FAILED ${c.slug}:`, e.message)
      failed++
    }
  }

  console.log(`\nDone. ${saved} saved, ${skipped} skipped (already existed), ${failed} failed.\n`)
}

main().catch(err => { console.error(err); process.exit(1) })
