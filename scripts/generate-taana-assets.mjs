#!/usr/bin/env node
/**
 * TAANA — Flagship theme asset generation ("May")
 *
 * Generates product + campaign photography for the fictional showcase brand
 * "TAANA" using OpenAI's gpt-image-2, saved to public/taana/. Warm
 * artisan-workshop / loom-studio photography — natural fiber textures,
 * close-up weave macro detail, wooden loom props, soft directional light.
 * Editorial and slow, deliberately the opposite of a bazaar's chaos or a
 * mood-board's brightness — deep indigo, rust, antique gold, ivory.
 *
 * Usage: node scripts/generate-taana-assets.mjs
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
// Shared style language — warm artisan-workshop / loom-studio, soft
// directional light, editorial and slow.
// ---------------------------------------------------------------------------
const STUDIO_FORM = 'shot on a headless dress form in a warm artisan handloom workshop, wooden pit loom visible softly out of focus in the background, natural fiber textures, soft warm directional window light, deep indigo and antique gold undertones, quiet and considered, medium-format editorial fashion photography, photorealistic, no text, no logo, no visible brand marks, no readable labels or tags'
const STUDIO_FLAT = 'flat lay on a rustic handwoven wooden surface beside natural fiber threads and a wooden shuttle, soft warm directional light, deep indigo and antique gold undertones, quiet and considered, medium-format editorial fashion photography, photorealistic, no text, no logo, no visible brand marks, no readable labels or tags'

const PRODUCTS = [
  { slug: 'banarasi-silk-saree-indigo', prompt: `A deep indigo Banarasi silk saree with intricate gold zari brocade throughout, draped, ${STUDIO_FORM}` },
  { slug: 'kanjivaram-silk-saree-gold', prompt: `An antique gold Kanjivaram silk saree with a wide temple-motif zari border, draped, ${STUDIO_FORM}` },
  { slug: 'sambalpuri-ikat-saree-rust', prompt: `A rust Sambalpuri double ikat cotton saree with traditional geometric motifs, draped, ${STUDIO_FORM}` },
  { slug: 'jamdani-cotton-saree-ivory', prompt: `An ivory Jamdani cotton saree with fine hand-inlaid floral motifs, sheer and lightweight, draped, ${STUDIO_FORM}` },
  { slug: 'chanderi-silk-cotton-saree-rose', prompt: `A dusty rose Chanderi silk-cotton saree with a sheer glossy hand and silver zari butis, draped, ${STUDIO_FORM}` },
  { slug: 'maheshwari-kurta-set-indigo', prompt: `An indigo Maheshwari weave kurta and palazzo set with signature checks, on a dress form, ${STUDIO_FORM}` },
  { slug: 'pochampally-ikat-kurta-set-rust', prompt: `A rust and ivory Pochampally ikat cotton kurta set with geometric diamond motifs, on a dress form, ${STUDIO_FORM}` },
  { slug: 'chanderi-kurta-set-gold', prompt: `An antique gold sheer Chanderi silk-cotton kurta set, on a dress form, ${STUDIO_FORM}` },
  { slug: 'bagh-block-print-kurta-set-indigo', prompt: `An indigo and rust hand block-printed Bagh cotton kurta set with natural dye motifs, on a dress form, ${STUDIO_FORM}` },
  { slug: 'banarasi-silk-stole-rust', prompt: `A rust Banarasi tissue silk stole with fine zari shimmer, draped over a wooden loom beam, ${STUDIO_FLAT}` },
  { slug: 'kota-doria-dupatta-ivory', prompt: `A sheer ivory Kota Doria cotton-silk dupatta with fine checked weave, draped, ${STUDIO_FLAT}` },
  { slug: 'bagh-block-print-dupatta-indigo', prompt: `An indigo hand block-printed Bagh cotton dupatta with dense paisley motifs, folded, ${STUDIO_FLAT}` },
  { slug: 'jamdani-nehru-jacket-indigo', prompt: `An indigo Jamdani cotton Nehru jacket with fine hand-inlaid motifs, structured tailoring, on a dress form, ${STUDIO_FORM}` },
  { slug: 'pochampally-ikat-nehru-jacket-rust', prompt: `A rust Pochampally ikat cotton Nehru jacket, slim structured cut, on a dress form, ${STUDIO_FORM}` },
  { slug: 'chanderi-nehru-jacket-gold', prompt: `An antique gold Chanderi silk-cotton Nehru jacket with soft sheen, structured tailoring, on a dress form, ${STUDIO_FORM}` },
  { slug: 'sambalpuri-ikat-cushion-set-rust', prompt: `Two rust Sambalpuri ikat cotton cushion covers with temple-motif borders, stacked on a wooden loom bench, ${STUDIO_FLAT}` },
  { slug: 'jamdani-table-runner-ivory', prompt: `An ivory Jamdani cotton table runner with hand-inlaid floral motifs and fringed edges, laid across a wooden table, ${STUDIO_FLAT}` },
  { slug: 'kanjivaram-silk-throw-gold', prompt: `An antique gold Kanjivaram silk throw with a korvai-woven zari border, draped over a wooden bench, ${STUDIO_FLAT}` },
]

const CAMPAIGN = [
  { slug: 'hero', size: '1536x1024', prompt: 'Wide cinematic shot of a traditional Indian wooden handloom in a sunlit artisan workshop, warp threads in deep indigo strung taut across the loom, soft warm directional light through a window, dust motes visible in the light, no people, quiet and considered editorial still life, photorealistic medium format film photography' },
  { slug: 'loom-studio', size: '1536x1024', prompt: 'A wooden pit loom workshop interior with hanging skeins of indigo, rust, and antique gold dyed thread, natural fiber textures, warm soft directional light, no people, editorial fashion photography, photorealistic' },
  { slug: 'weave-macro', size: '1536x1024', prompt: 'Extreme macro close-up of handwoven silk brocade fabric texture in deep indigo and antique gold zari thread, soft raking light revealing the weave structure, editorial fashion photography, no people, photorealistic' },
  { slug: 'artisan-hands', size: '1536x1024', prompt: 'Close-up of a weaver\'s hands working a wooden shuttle through taut warp threads on a traditional handloom, natural fiber textures, warm directional light, respectful documentary-editorial style, no visible face, photorealistic' },
  { slug: 'indigo-vat', size: '1024x1024', prompt: 'Overhead still life of hanks of hand-dyed indigo and rust cotton thread drying on a wooden rack in soft natural light, editorial fashion photography, no people, photorealistic' },
  { slug: 'still-life', size: '1024x1024', prompt: 'Overhead still life on a rustic wooden surface: a folded Banarasi silk saree, a wooden weaving shuttle, and loose skeins of gold zari thread, soft warm directional light, editorial fashion photography, no people, no text, no logos, photorealistic' },
]

async function main() {
  console.log(`\nTAANA asset generation (OpenAI gpt-image-2) — ${PRODUCTS.length} products + ${CAMPAIGN.length} campaign images\n`)

  for (const p of PRODUCTS) {
    const dest = resolve(ROOT, 'public/taana/products', `${p.slug}.jpg`)
    console.log(`generating product: ${p.slug}...`)
    try {
      await generateAndSave(p.prompt, '1024x1536', dest)
    } catch (e) {
      console.error(`  FAILED ${p.slug}:`, e.message)
    }
  }

  for (const c of CAMPAIGN) {
    const dest = resolve(ROOT, 'public/taana/campaign', `${c.slug}.jpg`)
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
