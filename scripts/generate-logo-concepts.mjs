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

const BASE = 'A minimal, modern vector-style logo ICON MARK (no text, no letters, no words anywhere in the image), for an Indian fashion/boutique e-commerce brand called Instastarz. Flat, geometric, single-color-friendly design on a plain solid white background, centered, generous padding, works small as an app icon. Primary color #A6134A (deep rose/maroon), secondary #111010 (near-black) if a second tone is needed. No gradients, no photorealism, no drop shadows, no mockup device frame — just the standalone icon on white.'

const CONCEPTS = [
  { name: 'star-thread', prompt: `${BASE} Concept: a single four-pointed sparkle/star shape formed from one continuous looping thread or ribbon, evoking both "star" and stitching/fabric.` },
  { name: 'star-camera', prompt: `${BASE} Concept: a four-pointed star shape cleverly integrated into a minimal camera-aperture/shutter ring, evoking Instagram photography and "star" at once, in a single cohesive flat icon.` },
  { name: 'hanger-star', prompt: `${BASE} Concept: a clothes hanger silhouette where the hook curves into a small four-pointed star or sparkle at the top, boutique-meets-star.` },
  { name: 'story-ring-star', prompt: `${BASE} Concept: a circular "story ring" (like a social media profile ring) broken at one point into a small star/sparkle burst, suggesting a boutique's story breaking out into the world.` },
]

for (const c of CONCEPTS) {
  console.log(`Generating: ${c.name}`)
  await generateAndSave(c.prompt, resolve(ROOT, `public/brand/logo-concept-${c.name}.png`))
}

console.log('Done.')
