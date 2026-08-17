#!/usr/bin/env node
/**
 * Instastarz logo concepts — icon-mark only (no AI-rendered text, since
 * image models reliably botch small text). Generates a handful of
 * icon/symbol directions in the brand's ink (#111010) + accent (#A6134A),
 * leaning on "insta" + "star" + boutique/fashion cues. Pair with a real
 * HTML/CSS wordmark (already set in --font-marketing) for the full logo.
 *
 * Usage: node scripts/generate-logo-concepts.mjs
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
    output_format: 'png',
  })
  const item = res.data[0]
  if (item.b64_json) return Buffer.from(item.b64_json, 'base64')
  if (item.url) {
    const imgRes = await fetch(item.url)
    return Buffer.from(await imgRes.arrayBuffer())
  }
  throw new Error('No image data in response')
}

async function generateAndSave(prompt, destPath) {
  if (existsSync(destPath)) { console.log(`skip ${destPath} (exists)`); return }
  const buf = await generate(prompt, '1024x1024')
  mkdirSync(dirname(destPath), { recursive: true })
  writeFileSync(destPath, buf)
  console.log(`  saved ${destPath} (${(buf.length / 1024).toFixed(0)}kb)`)
}

const BASE = 'A minimal, modern vector-style logo ICON MARK (no text, no letters, no words anywhere in the image), for an Indian fashion/boutique e-commerce brand called Instastarz. Flat, geometric, single-color-friendly design on a plain solid white background, centered, generous padding, works small as an app icon. The mark must be filled almost entirely in near-black ink (#111010) — this is the site\'s dominant color, used for its logotype, headlines and buttons. Use the deep rose/maroon #A6134A ONLY as a tiny sparing accent detail (a single small dot, tip, or spark) covering well under 10% of the mark, never as the dominant fill. No gradients, no photorealism, no drop shadows, no mockup device frame — just the standalone icon on white.'

const CONCEPTS = [
  { name: 'monogram-i-stitch', prompt: `${BASE} Concept: a bold, geometric letterform "I" (for Instastarz) rendered as if it were a single continuous stitch of thread — a subtle running-stitch texture or a needle-and-thread flourish integrated into the letterform, evoking tailoring and fashion craft, not technology.` },
  { name: 'garment-tag', prompt: `${BASE} Concept: a minimal clothing tag / swing-tag silhouette (the small rectangular label with a rounded corner and a punched hole, like a real garment price tag), rendered as a clean flat icon — directly evokes fashion retail.` },
  { name: 'boutique-awning', prompt: `${BASE} Concept: an extremely minimal abstract storefront — a simple scalloped boutique awning/canopy shape over a doorway, reduced to 2-3 clean geometric shapes, evoking "a real store" rather than a generic tech icon.` },
  { name: 'fold-ribbon', prompt: `${BASE} Concept: a single ribbon or fabric strip folded into an abstract, elegant knot or loop (like a gift ribbon or a sari pleat), forming a self-contained mark — evokes fashion and boutique gifting, not technology.` },
]

for (const c of CONCEPTS) {
  console.log(`Generating: ${c.name}`)
  await generateAndSave(c.prompt, resolve(ROOT, `public/brand/logo-concept-${c.name}.png`))
}

console.log('Done.')
