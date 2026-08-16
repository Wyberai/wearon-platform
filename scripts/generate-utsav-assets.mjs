#!/usr/bin/env node
/**
 * UTSAV — Flagship theme asset generation ("October")
 *
 * Generates product + campaign photography for the fictional showcase brand
 * "UTSAV" using OpenAI's gpt-image-2, saved to public/utsav/. Diya/gold-tone
 * festive styling, rangoli patterns, marigold garlands as props, warm
 * evening light — celebratory and generous, distinct from SAAJ's wedding
 * glamour or MELA's bazaar chaos.
 *
 * Usage: node scripts/generate-utsav-assets.mjs
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

let succeeded = 0
let failed = 0

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
  if (existsSync(destPath)) { console.log(`skip ${destPath} (exists)`); succeeded++; return }
  const buf = await generate(prompt, size)
  mkdirSync(dirname(destPath), { recursive: true })
  writeFileSync(destPath, buf)
  console.log(`  saved ${destPath} (${(buf.length / 1024).toFixed(0)}kb)`)
  succeeded++
}

// ---------------------------------------------------------------------------
// Shared style language — diya/gold-tone festive styling, warm evening light
// ---------------------------------------------------------------------------
const STUDIO_FORM = 'shot on a headless mannequin against a deep red backdrop with soft marigold garlands draped at the edges, warm golden diya-lit evening light, rich festive shadow, medium-format editorial fashion photography, photorealistic, no text, no logo, no visible brand marks, no readable labels or tags'
const STUDIO_FLAT = 'flat lay on a dark wood surface scattered with rose petals and a rangoli pattern sketched in gold and red powder nearby, warm golden diya-lit evening light, medium-format editorial photography, photorealistic, no text, no logo, no visible brand marks, no readable labels or tags'

const PRODUCTS = [
  { slug: 'diwali-deluxe-hamper', prompt: `A deep red and gold Diwali gift hamper box, open to show dry fruits, mithai, a small silk stole and a pair of brass diyas, ribbon detail, ${STUDIO_FLAT}` },
  { slug: 'family-gifting-box', prompt: `A marigold-orange festive gift box with compartments showing snacks, sweets and small tea-light candle holders, ${STUDIO_FLAT}` },
  { slug: 'corporate-diwali-gift-set', prompt: `An understated matte deep-red corporate Diwali gift box with premium mithai and dry fruits, gold foil accent, minimal elegant styling, ${STUDIO_FLAT}` },
  { slug: 'mini-festive-box', prompt: `A small compact kraft-and-gold Diwali gift box with sweets and a mini brass diya, ${STUDIO_FLAT}` },
  { slug: 'banarasi-silk-saree', prompt: `A deep red Banarasi silk saree with a woven gold zari border, draped elegantly, ${STUDIO_FORM}` },
  { slug: 'chanderi-cotton-saree', prompt: `A gold Chanderi cotton-silk saree with a sheer zari-shot border, lightweight drape, ${STUDIO_FORM}` },
  { slug: 'mens-silk-kurta-set', prompt: `A marigold-orange art silk kurta and churidar set with a subtle gold thread border and matching stole, ${STUDIO_FORM}` },
  { slug: 'womens-anarkali-kurta', prompt: `A flared red and gold Anarkali kurta with mirror-work embroidery, floor-grazing silhouette, ${STUDIO_FORM}` },
  { slug: 'kundan-choker-set', prompt: `A gold-toned Kundan choker necklace with matching jhumka earrings and a tikka, laid on dark velvet, ${STUDIO_FLAT}` },
  { slug: 'jhumka-earrings', prompt: `A pair of gold-plated jhumka earrings with tiny bells, close-up product shot, ${STUDIO_FLAT}` },
  { slug: 'temple-necklace-set', prompt: `An antique-gold temple-motif necklace and earring set with traditional pendants, laid on dark velvet, ${STUDIO_FLAT}` },
  { slug: 'brass-diya-set', prompt: `A set of twelve small hand-cast brass diyas arranged in a row, lit with warm flame light, dark background, ${STUDIO_FLAT}` },
  { slug: 'rangoli-stencil-candle-set', prompt: `A rangoli stencil kit with colourful powders and scented tea-light candles arranged around a partially completed rangoli pattern, ${STUDIO_FLAT}` },
  { slug: 'marigold-torans', prompt: `A set of marigold-orange artificial flower door-hanging torans, draped and photographed against a dark wood door frame, warm evening light, ${STUDIO_FLAT}` },
  { slug: 'premium-dryfruit-mithai-box', prompt: `A two-tier gold foil box of Kaju Katli, Soan Papdi and roasted almonds and cashews, open lid, ${STUDIO_FLAT}` },
  { slug: 'assorted-mithai-box', prompt: `A classic red gift box of assorted Indian mithai — Motichoor Ladoo, Kaju Katli and Barfi, open lid, ${STUDIO_FLAT}` },
  { slug: 'choco-diwali-fusion-hamper', prompt: `A gold box of chocolate-coated dry fruits and mithai fusion truffles, open lid, ${STUDIO_FLAT}` },
  { slug: 'nuts-namkeen-hamper', prompt: `A festive marigold-orange tin of spiced nuts, namkeen mix and roasted seeds, lid beside it, ${STUDIO_FLAT}` },
]

const CAMPAIGN = [
  { slug: 'hero', size: '1536x1024', prompt: 'Wide warm-toned shot: a deep red silk saree draped over a carved wooden chest, surrounded by lit brass diyas and marigold garlands, soft golden evening light, rich festive still life, no people, photorealistic medium format film photography' },
  { slug: 'diya-spread', size: '1536x1024', prompt: 'A wide spread of lit brass diyas on a dark wood floor forming a loose trail, warm golden glow, shallow depth of field, editorial festive photography, no people, photorealistic' },
  { slug: 'marigold-detail', size: '1536x1024', prompt: 'Close-up of fresh marigold flower garlands strung together, warm golden light, editorial festive photography, no people, photorealistic' },
  { slug: 'gift-table', size: '1024x1024', prompt: 'Overhead shot of a gifting table: wrapped gold and red gift boxes, a small rangoli pattern, marigold petals scattered, lit diyas at the edges, warm evening light, editorial photography, no people, photorealistic' },
  { slug: 'saree-drape', size: '1024x1024', prompt: 'Close-up of a deep red silk saree pallu with gold zari embroidery catching warm evening light, editorial fashion photography, no people, photorealistic' },
  { slug: 'rangoli', size: '1024x1536', prompt: 'A vibrant rangoli pattern in red, gold and marigold-orange powders on a stone floor at dusk, small diyas placed around its edge, overhead view, no people, no text, no logos, photorealistic' },
]

async function main() {
  console.log(`\nUTSAV asset generation (OpenAI gpt-image-2) — ${PRODUCTS.length} products + ${CAMPAIGN.length} campaign images\n`)

  for (const p of PRODUCTS) {
    const dest = resolve(ROOT, 'public/utsav/products', `${p.slug}.jpg`)
    console.log(`generating product: ${p.slug}...`)
    try {
      await generateAndSave(p.prompt, '1024x1536', dest)
    } catch (e) {
      failed++
      console.error(`  FAILED ${p.slug}:`, e.message)
    }
  }

  for (const c of CAMPAIGN) {
    const dest = resolve(ROOT, 'public/utsav/campaign', `${c.slug}.jpg`)
    console.log(`generating campaign: ${c.slug}...`)
    try {
      await generateAndSave(c.prompt, c.size, dest)
    } catch (e) {
      failed++
      console.error(`  FAILED ${c.slug}:`, e.message)
    }
  }

  console.log(`\nDone. ${succeeded} succeeded, ${failed} failed.\n`)
}

main().catch(err => { console.error(err); process.exit(1) })
