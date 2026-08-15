#!/usr/bin/env node
/**
 * AUGUST — Flagship theme asset generation
 *
 * Generates product + campaign photography for the fictional showcase brand
 * "AUGUST" using OpenAI's gpt-image-1, and saves everything locally to
 * public/august/ so the storefront has zero runtime dependency on external
 * generation infra. Run once; re-run individual items by deleting the file
 * and re-running (existing files are skipped, not overwritten).
 *
 * Usage: node scripts/generate-august-assets.mjs
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
// Shared style language — quiet-luxury studio still life, no faces/models
// ---------------------------------------------------------------------------
const STUDIO_FORM = 'shot on a headless linen-wrapped dress form against a warm plaster-textured bone-colored backdrop, soft directional daylight from camera-left, gentle natural shadow, shallow depth of field, medium-format editorial product photography, quiet luxury aesthetic, photorealistic, no text, no logo, no visible brand marks'
const STUDIO_FLAT = 'precisely folded flat lay on a warm bone linen surface, soft overhead daylight, minimal natural shadow, medium-format editorial product photography, quiet luxury aesthetic, photorealistic, no text, no logo, no visible brand marks'

const PRODUCTS = [
  { slug: 'overcoat', prompt: `A camel wool-cashmere overcoat, notch lapel, single-breasted, ${STUDIO_FORM}` },
  { slug: 'field-jacket', prompt: `An olive waxed-cotton field jacket with four flap pockets, ${STUDIO_FORM}` },
  { slug: 'trench', prompt: `A stone-colored cotton-linen trench coat, belted, storm flap, ${STUDIO_FORM}` },
  { slug: 'shearling-vest', prompt: `An ecru shearling-lined suede vest, ${STUDIO_FORM}` },
  { slug: 'tailored-blazer', prompt: `An ink navy wool crepe tailored blazer, soft shoulder, horn buttons, ${STUDIO_FORM}` },
  { slug: 'wide-leg-trouser', prompt: `Graphite grey wool wide-leg trousers with a clean crease, ${STUDIO_FLAT}` },
  { slug: 'pleated-trouser', prompt: `Sand-colored tropical wool pleated trousers, ${STUDIO_FLAT}` },
  { slug: 'waistcoat', prompt: `A taupe micro-check wool waistcoat, ${STUDIO_FORM}` },
  { slug: 'merino-crew', prompt: `An oat-colored fine merino wool crewneck sweater, ${STUDIO_FORM}` },
  { slug: 'cable-cardigan', prompt: `An ivory chunky aran cable-knit cardigan with horn buttons, ${STUDIO_FORM}` },
  { slug: 'turtleneck', prompt: `A black silk-merino fine-knit turtleneck sweater, ${STUDIO_FORM}` },
  { slug: 'half-zip', prompt: `A clay-colored brushed wool half-zip sweater, ${STUDIO_FORM}` },
  { slug: 'oxford-shirt', prompt: `A crisp white cotton oxford button-down shirt, ${STUDIO_FORM}` },
  { slug: 'band-collar-shirt', prompt: `A sage green washed cotton band-collar shirt, ${STUDIO_FORM}` },
  { slug: 'straight-trouser', prompt: `Khaki cotton twill straight-leg trousers, ${STUDIO_FLAT}` },
  { slug: 'long-sleeve-tee', prompt: `A bone-colored heavyweight cotton long-sleeve t-shirt, ${STUDIO_FORM}` },
  { slug: 'leather-belt', prompt: `A cognac full-grain leather belt with a brushed brass buckle, neatly coiled, ${STUDIO_FLAT}` },
  { slug: 'structured-tote', prompt: `A black structured leather tote bag with top handles, standing upright on a low plinth, warm plaster-textured backdrop, soft directional daylight, medium-format editorial product photography, quiet luxury aesthetic, photorealistic, no text, no logo` },
]

const CAMPAIGN = [
  { slug: 'hero', size: '1536x1024', prompt: 'Wide interior shot of a minimal atelier space, warm morning light streaming through sheer linen curtains, a single camel overcoat draped over a plain wooden chair, soft dust motes visible in the light beam, quiet luxury cinematic still life, no people, photorealistic medium format film photography' },
  { slug: 'fabric-macro', size: '1536x1024', prompt: 'Extreme macro close-up of a wool-cashmere herringbone weave texture, raking side light revealing fiber detail, quiet luxury editorial photography, no people, photorealistic' },
  { slug: 'still-life', size: '1024x1024', prompt: 'Overhead still life: a neatly folded stack of ivory and oat knitwear beside a coiled cognac leather belt, on a warm stone surface, soft natural light, quiet luxury editorial photography, no people, photorealistic' },
  { slug: 'architecture', size: '1536x1024', prompt: 'Minimalist architectural interior corridor in warm oak and pale concrete, a single shaft of afternoon light crossing the floor, empty, serene, quiet luxury editorial photography, no people, photorealistic' },
  { slug: 'detail', size: '1024x1024', prompt: 'Extreme close-up of a horn button and hand-finished stitching on a navy wool blazer lapel, soft studio light, quiet luxury editorial photography, no people, photorealistic' },
  { slug: 'flatlay-outfit', size: '1024x1536', prompt: 'Overhead flat lay of a considered outfit arrangement: pleated trousers, a plain oxford shirt with a completely blank unlabeled collar (no neck tag, no brand tag, no woven label of any kind), a folded tailored blazer, and a coiled leather belt, precisely composed on warm bone linen, soft daylight, quiet luxury editorial photography, no people, no text anywhere in the image, no logos, no readable words, no labels or tags of any kind, photorealistic' },
]

async function main() {
  console.log(`\nAUGUST asset generation (OpenAI gpt-image-2) — ${PRODUCTS.length} products + ${CAMPAIGN.length} campaign images\n`)

  for (const p of PRODUCTS) {
    const dest = resolve(ROOT, 'public/august/products', `${p.slug}.jpg`)
    console.log(`generating product: ${p.slug}...`)
    try {
      await generateAndSave(p.prompt, '1024x1536', dest)
    } catch (e) {
      console.error(`  FAILED ${p.slug}:`, e.message)
    }
  }

  for (const c of CAMPAIGN) {
    const dest = resolve(ROOT, 'public/august/campaign', `${c.slug}.jpg`)
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
