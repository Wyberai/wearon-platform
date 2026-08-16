#!/usr/bin/env node
/**
 * SAAJ — Flagship theme asset generation ("June")
 *
 * Generates product + campaign photography for the fictional showcase brand
 * "SAAJ" using OpenAI's gpt-image-2, saved to public/saaj/. Festive jewel
 * tones — magenta, antique gold, emerald, ivory — golden-hour warmth, fabric
 * caught mid-motion, joyful wedding-guest energy. Distinct from BLOOM's soft
 * botanical daylight and AUGUST's controlled warm studio.
 *
 * Usage: node scripts/generate-saaj-assets.mjs
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
// Shared style language — festive jewel-tone golden-hour, fabric mid-motion
// ---------------------------------------------------------------------------
const STUDIO_FORM = 'shot on a headless dress form against a warm golden-hour backdrop with soft bokeh marigold and diya lights, rich jewel-tone lighting, festive Indian wedding editorial fashion photography, photorealistic, no text, no logo, no visible brand marks, no readable labels or tags'
const STUDIO_FLAT = 'flat lay on a deep emerald velvet surface scattered with small marigold petals, warm golden-hour side light, festive Indian wedding editorial fashion photography, photorealistic, no text, no logo, no visible brand marks, no readable labels or tags'

const PRODUCTS = [
  { slug: 'marigold-mehendi-lehenga', prompt: `A mustard-yellow georgette lehenga with hand-block floral print and a tasselled dupatta caught mid-motion, ${STUDIO_FORM}` },
  { slug: 'rani-pink-sangeet-lehenga', prompt: `A rani-pink mirror-work georgette lehenga with a gota-trimmed hem, dupatta caught mid-twirl, ${STUDIO_FORM}` },
  { slug: 'emerald-reception-lehenga', prompt: `A deep emerald fully-sequinned net lehenga over a satin base with a scalloped hem, ${STUDIO_FORM}` },
  { slug: 'bridal-magenta-lehenga', prompt: `A magenta bridal lehenga with hand zardozi and dabka embroidery across the bodice and hem, dupatta draped elegantly, ${STUDIO_FORM}` },
  { slug: 'banarasi-silk-wedding-saree', prompt: `A red-and-gold Banarasi silk saree with a woven zari border and pallu, draped on a form, ${STUDIO_FORM}` },
  { slug: 'ivory-chiffon-reception-saree', prompt: `An ivory chiffon saree scattered with sequins and a satin-edged border, draped on a form, ${STUDIO_FORM}` },
  { slug: 'haldi-yellow-organza-saree', prompt: `A bright yellow floral-printed organza saree with a piped border, draped on a form, ${STUDIO_FORM}` },
  { slug: 'sangeet-sequin-saree', prompt: `A teal-to-emerald ombre sequinned georgette saree, draped on a form, dupatta in motion, ${STUDIO_FORM}` },
  { slug: 'ivory-wedding-sherwani', prompt: `An ivory silk sherwani with gold zari thread embroidery down the placket, matching churidar, worn on a form, ${STUDIO_FORM}` },
  { slug: 'emerald-bandhgala-sherwani', prompt: `A deep emerald velvet bandhgala jacket with a structured collar and hand-finished buttons, worn on a form, ${STUDIO_FORM}` },
  { slug: 'mustard-haldi-kurta-set', prompt: `A mustard cotton kurta-pyjama set, straight cut, worn on a form, ${STUDIO_FORM}` },
  { slug: 'mehendi-print-kurta', prompt: `A pastel hand-block-printed kurta with a mandarin collar over matching pants, worn on a form, ${STUDIO_FORM}` },
  { slug: 'sangeet-nehru-jacket-set', prompt: `A magenta brocade Nehru jacket over an ivory kurta and churidar, worn on a form, ${STUDIO_FORM}` },
  { slug: 'kundan-bridal-choker-set', prompt: `A gold-toned kundan and pearl bridal choker set with matching jhumka earrings and a maang tikka, arranged elegantly, ${STUDIO_FLAT}` },
  { slug: 'temple-jhumka-earrings', prompt: `Gold-toned antique temple jhumka earrings with fine pearl drops, single pair, ${STUDIO_FLAT}` },
  { slug: 'grooms-kalgi-mala-set', prompt: `A gold-plated turban kalgi brooch beside a triple-layer pearl-and-gold groom's mala, arranged elegantly, ${STUDIO_FLAT}` },
  { slug: 'embroidered-mojari', prompt: `A pair of ivory and gold hand-embroidered zari-thread men's mojari shoes, ${STUDIO_FLAT}` },
  { slug: 'embellished-block-heels', prompt: `A pair of magenta satin block heels with a hand-embellished strap, ${STUDIO_FLAT}` },
]

const CAMPAIGN = [
  { slug: 'hero', size: '1536x1024', prompt: 'Wide golden-hour shot: a bride and her friends in festive jewel-toned lehengas laughing together at an outdoor mehendi function, marigold garlands and string lights in the background, dupattas caught mid-motion in the breeze, joyful candid energy, editorial wedding photography, photorealistic, no visible faces in sharp focus, no text, no logos' },
  { slug: 'motion-study', size: '1536x1024', prompt: 'Close-up of a magenta and gold dupatta caught mid-twirl in golden-hour light, fabric flowing with motion blur at the edges, marigold petals scattered in the air, festive Indian wedding editorial photography, no people, no text, no logos, photorealistic' },
  { slug: 'texture', size: '1536x1024', prompt: 'Extreme macro close-up of zari and gota embroidery thread work on rich emerald silk fabric, warm golden side light revealing metallic thread detail, festive editorial fashion photography, no people, no text, no logos, photorealistic' },
  { slug: 'still-life', size: '1024x1024', prompt: 'Overhead still life on deep emerald velvet: a kundan choker set, a pair of embroidered mojari, and marigold petals arranged with warm golden-hour light, festive Indian wedding editorial photography, no people, no text, no logos, photorealistic' },
  { slug: 'detail', size: '1024x1024', prompt: 'Extreme close-up of hand zardozi and dabka embroidery on magenta bridal fabric, warm golden light, shallow depth of field, festive editorial fashion photography, no people, no text, no logos, photorealistic' },
  { slug: 'flatlay-outfit', size: '1024x1536', prompt: 'Overhead flat lay on deep emerald velvet of a complete wedding-function outfit: a rani-pink mirror-work lehenga, a kundan jewellery set, and embellished heels, precisely composed with scattered marigold petals, warm golden-hour light, festive editorial fashion photography, no people, no text, no logos, no labels or tags of any kind, photorealistic' },
]

async function main() {
  console.log(`\nSAAJ asset generation (OpenAI gpt-image-2) — ${PRODUCTS.length} products + ${CAMPAIGN.length} campaign images\n`)

  for (const p of PRODUCTS) {
    const dest = resolve(ROOT, 'public/saaj/products', `${p.slug}.jpg`)
    console.log(`generating product: ${p.slug}...`)
    try {
      await generateAndSave(p.prompt, '1024x1536', dest)
    } catch (e) {
      console.error(`  FAILED ${p.slug}:`, e.message)
    }
  }

  for (const c of CAMPAIGN) {
    const dest = resolve(ROOT, 'public/saaj/campaign', `${c.slug}.jpg`)
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
