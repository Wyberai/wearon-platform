#!/usr/bin/env node
/**
 * GALLI — Flagship theme asset generation ("November")
 *
 * Generates product + campaign photography for the fictional showcase brand
 * "GALLI" using OpenAI's gpt-image-2, saved to public/galli/. Bold, high-
 * contrast street photography — urban concrete/graffiti backdrops, harsh
 * directional light, confident poses, neon green / near-black / burnt-orange
 * palette — distinct from BLOOM's soft daylight botanicals and EMBER's
 * dramatic dark glow.
 *
 * Usage: node scripts/generate-galli-assets.mjs
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
// Shared style language — bold, high-contrast street photography
// ---------------------------------------------------------------------------
const STREET_MODEL = 'shot on a young Indian model against a raw urban concrete wall with faded graffiti, harsh directional sunlight creating hard shadows, confident street pose, high-contrast bold streetwear editorial photography, photorealistic, no text, no logo, no visible brand marks, no readable labels or tags'
const STREET_FLAT = 'flat lay on a raw concrete surface with faint spray-paint texture at the edges, harsh directional light creating hard shadows, high-contrast bold streetwear editorial photography, photorealistic, no text, no logo, no visible brand marks, no readable labels or tags'

const PRODUCTS = [
  { slug: 'blacktop-hoodie', prompt: `A jet black oversized fleece hoodie with a sleeve wordmark silhouette, dropped shoulder, ${STREET_MODEL}` },
  { slug: 'static-neon-hoodie', prompt: `A near-black oversized hoodie with neon green drawcords and trim, dropped shoulder, ${STREET_MODEL}` },
  { slug: 'rust-riot-hoodie', prompt: `A burnt-orange and black colorblock oversized hoodie, raglan sleeve, ${STREET_MODEL}` },
  { slug: 'ghost-logo-hoodie', prompt: `A jet black oversized hoodie with a subtle tonal puff-print chest logo, ${STREET_MODEL}` },
  { slug: 'galli-wordmark-tee', prompt: `A jet black oversized boxy t-shirt with a bold graphic wordmark across the chest, drop shoulder, ${STREET_MODEL}` },
  { slug: 'static-noise-tee', prompt: `A grey oversized boxy t-shirt with an all-over static/noise graphic print, ${STREET_MODEL}` },
  { slug: 'blank-canvas-tee', prompt: `A plain jet black heavyweight oversized boxy t-shirt with no print, ${STREET_MODEL}` },
  { slug: 'drop-zero-tee', prompt: `A jet black oversized boxy t-shirt with a bold graphic back print, shown from behind, ${STREET_MODEL}` },
  { slug: 'combat-cargo-pants', prompt: `Jet black six-pocket relaxed cargo trousers with a tapered leg, ${STREET_FLAT}` },
  { slug: 'utility-six-pocket-cargo', prompt: `Olive green six-pocket cargo trousers with adjustable ankle cuffs, ${STREET_FLAT}` },
  { slug: 'track-cargo-joggers', prompt: `Jet black tapered cargo joggers with ribbed ankle cuffs, ${STREET_MODEL}` },
  { slug: 'reflective-cargo-shorts', prompt: `Jet black cargo shorts with reflective piping detail, ${STREET_FLAT}` },
  { slug: 'volt-high-tops', prompt: `A neon green and black chunky high-top sneaker, single shoe, dramatic angle, ${STREET_FLAT}` },
  { slug: 'concrete-runner', prompt: `A grey and black chunky running sneaker, single shoe, dramatic angle, ${STREET_FLAT}` },
  { slug: 'blackout-slip-on', prompt: `An all-black slip-on sneaker with no laces, single shoe, dramatic angle, ${STREET_FLAT}` },
  { slug: 'corduroy-snap-cap', prompt: `A rust-orange corduroy six-panel snapback cap, dramatic angle, ${STREET_FLAT}` },
  { slug: 'neon-patch-cap', prompt: `A black cotton dad cap with a single neon green patch, dramatic angle, ${STREET_FLAT}` },
  { slug: 'bucket-hat-blackout', prompt: `An all-black cotton twill bucket hat, dramatic angle, ${STREET_FLAT}` },
]

const CAMPAIGN = [
  { slug: 'hero', size: '1536x1024', prompt: 'Wide high-contrast street photography: a young Indian model in an oversized black hoodie standing confidently against a graffiti-covered concrete wall, harsh late-afternoon directional sunlight creating hard shadows, neon green and burnt orange graffiti accents, energetic urban hypebeast editorial photography, no readable text, no logos, photorealistic' },
  { slug: 'alley-portrait', size: '1536x1024', prompt: 'A young Indian model in oversized streetwear walking through a narrow concrete alley (galli) with graffiti-tagged walls, harsh directional sunlight and hard shadows, high-contrast bold streetwear editorial photography, no readable text, no logos, photorealistic' },
  { slug: 'graffiti-texture', size: '1536x1024', prompt: 'Extreme close-up of a raw concrete wall with layered neon green and burnt orange spray-paint graffiti texture, harsh directional light, high-contrast editorial photography, no readable text or words, photorealistic' },
  { slug: 'crate-still-life', size: '1024x1024', prompt: 'Overhead still life on cracked concrete: a pair of neon green high-top sneakers, a black cap, and a folded black oversized hoodie arranged with hard directional shadows, high-contrast streetwear editorial photography, no people, no readable text, no logos, photorealistic' },
  { slug: 'detail', size: '1024x1024', prompt: 'Extreme close-up of oversized cotton fleece hoodie fabric texture in jet black with a neon green drawcord, harsh directional side light, high-contrast editorial photography, no people, no text, photorealistic' },
  { slug: 'lineup-flatlay', size: '1024x1536', prompt: 'Overhead flat lay on raw concrete of a complete streetwear fit: a black oversized hoodie, cargo pants, and neon green high-top sneakers, precisely composed, harsh directional light with hard shadows, high-contrast streetwear editorial photography, no people, no text, no logos, no labels or tags of any kind, photorealistic' },
]

async function main() {
  console.log(`\nGALLI asset generation (OpenAI gpt-image-2) — ${PRODUCTS.length} products + ${CAMPAIGN.length} campaign images\n`)

  let saved = 0, skipped = 0, failed = 0

  for (const p of PRODUCTS) {
    const dest = resolve(ROOT, 'public/galli/products', `${p.slug}.jpg`)
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
    const dest = resolve(ROOT, 'public/galli/campaign', `${c.slug}.jpg`)
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
