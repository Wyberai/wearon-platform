#!/usr/bin/env node
/**
 * EMBER — Flagship theme asset generation ("February")
 *
 * Generates product + campaign photography for the fictional showcase brand
 * "EMBER" using OpenAI's gpt-image-2, and saves everything locally to
 * public/ember/ so the storefront has zero runtime dependency on external
 * generation infra. Dark, saturated, dramatic-lighting aesthetic — the
 * deliberate visual opposite of AUGUST's warm neutral studio look.
 *
 * Usage: node scripts/generate-ember-assets.mjs
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
// Shared style language — dramatic dark studio, saturated color as the hero
// ---------------------------------------------------------------------------
const STUDIO_FORM = 'shot on a headless dress form against a deep charcoal-black studio backdrop, single dramatic warm rim light from one side creating a glow edge, rich shadow, high contrast, medium-format editorial fashion photography, saturated color, photorealistic, no text, no logo, no visible brand marks, no readable labels or tags'
const STUDIO_FLAT = 'flat lay on a matte black surface, single dramatic side light creating a glow highlight along the fabric edge, deep shadow, high contrast, medium-format editorial fashion photography, saturated color, photorealistic, no text, no logo, no visible brand marks, no readable labels or tags'

const PRODUCTS = [
  { slug: 'flame-cardigan', prompt: `A burnt orange chunky mohair-blend cardigan, oversized, horn buttons, ${STUDIO_FORM}` },
  { slug: 'cobalt-turtleneck', prompt: `A cobalt blue fine-ribbed merino turtleneck sweater, fitted, ${STUDIO_FORM}` },
  { slug: 'fuchsia-crew', prompt: `A fuchsia brushed wool crewneck sweater, relaxed fit, ${STUDIO_FORM}` },
  { slug: 'ember-vest', prompt: `A rust-colored cable-knit sweater vest, V-neck, ${STUDIO_FORM}` },
  { slug: 'velvet-track-pant', prompt: `Deep plum crushed velvet jogger pants, tapered leg, elastic drawstring waist, ${STUDIO_FLAT}` },
  { slug: 'cloud-robe', prompt: `A chartreuse plush fleece robe with shawl collar, self-tie belt, ${STUDIO_FORM}` },
  { slug: 'silk-cami-set', prompt: `A cherry red silk cami top with matching shorts, lace trim, ${STUDIO_FLAT}` },
  { slug: 'terry-hoodie', prompt: `A cobalt blue heavyweight cotton terry hoodie, kangaroo pocket, ${STUDIO_FORM}` },
  { slug: 'slip-dress', prompt: `A magenta bias-cut silk satin slip dress, adjustable straps, side slit, ${STUDIO_FORM}` },
  { slug: 'sculpt-blazer-dress', prompt: `An emerald green fitted wool blazer dress, peak lapel, single button, ${STUDIO_FORM}` },
  { slug: 'halter-jumpsuit', prompt: `A crimson wide-leg halter jumpsuit, open back, palazzo leg, ${STUDIO_FORM}` },
  { slug: 'sequin-mini', prompt: `A gold hand-sequined mini dress, fully sequined, fitted, ${STUDIO_FORM}` },
  { slug: 'puffer-cape', prompt: `A tangerine oversized quilted puffer cape with arm slits, snap closure, ${STUDIO_FORM}` },
  { slug: 'shearling-bomber', prompt: `A rust suede cropped shearling bomber jacket, ribbed collar and cuffs, ${STUDIO_FORM}` },
  { slug: 'colorblock-trench', prompt: `A color-blocked trench coat in cobalt blue and fuchsia panels, belted waist, ${STUDIO_FORM}` },
  { slug: 'chain-belt', prompt: `A chunky gold chain belt, brass-plated, coiled, ${STUDIO_FLAT}` },
  { slug: 'beret', prompt: `A cherry red wool felt beret, ${STUDIO_FLAT}` },
  { slug: 'statement-hoop', prompt: `An oversized gold-plated hoop earring, hinged, standing upright on a small black plinth, dramatic warm rim light, deep charcoal-black backdrop, saturated color, medium-format editorial fashion photography, photorealistic, no text, no logo` },
]

const CAMPAIGN = [
  { slug: 'hero', size: '1536x1024', prompt: 'Wide dramatic studio shot: a magenta silk slip dress and a cobalt blue cardigan draped over two dark sculptural forms against a near-black backdrop, bold saturated colored gel lighting from the sides creating a glow, dust and haze in the air catching the light, cinematic high-fashion still life, no people, photorealistic medium format photography' },
  { slug: 'color-study', size: '1536x1024', prompt: 'Abstract close-up color study: overlapping folds of fuchsia silk, cobalt wool and burnt orange mohair fabric, dramatic side lighting creating rich saturated color and deep shadow, editorial fashion photography, no people, photorealistic' },
  { slug: 'texture', size: '1536x1024', prompt: 'Extreme macro close-up of chunky mohair knit texture in burnt orange, dramatic raking light revealing fiber detail against near-black background, editorial fashion photography, no people, photorealistic' },
  { slug: 'still-life', size: '1024x1024', prompt: 'Overhead still life on a black surface: a coiled gold chain belt, a cherry red beret, and gold hoop earrings arranged with dramatic warm spotlighting and deep shadow, editorial fashion photography, no people, photorealistic' },
  { slug: 'detail', size: '1024x1024', prompt: 'Extreme close-up of hand-sequined gold fabric catching dramatic warm light against a dark background, shallow depth of field, editorial fashion photography, no people, photorealistic' },
  { slug: 'flatlay-outfit', size: '1024x1536', prompt: 'Overhead flat lay of a bold outfit arrangement on a matte black surface: a cobalt turtleneck, deep plum velvet track pants, and a coiled gold chain belt, precisely composed, dramatic warm side lighting creating rich saturated color and glow highlights, editorial fashion photography, no people, no text, no logos, no labels or tags of any kind, photorealistic' },
]

async function main() {
  console.log(`\nEMBER asset generation (OpenAI gpt-image-2) — ${PRODUCTS.length} products + ${CAMPAIGN.length} campaign images\n`)

  for (const p of PRODUCTS) {
    const dest = resolve(ROOT, 'public/ember/products', `${p.slug}.jpg`)
    console.log(`generating product: ${p.slug}...`)
    try {
      await generateAndSave(p.prompt, '1024x1536', dest)
    } catch (e) {
      console.error(`  FAILED ${p.slug}:`, e.message)
    }
  }

  for (const c of CAMPAIGN) {
    const dest = resolve(ROOT, 'public/ember/campaign', `${c.slug}.jpg`)
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
