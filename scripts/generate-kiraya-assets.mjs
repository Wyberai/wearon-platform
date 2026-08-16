#!/usr/bin/env node
/**
 * KIRAYA — Flagship theme asset generation ("December")
 *
 * Generates product + campaign photography for the fictional showcase brand
 * "KIRAYA" using OpenAI's gpt-image-2, saved to public/kiraya/. Rich
 * jewel-tone rental-boutique styling — mirror/dressing-room ambiance, soft
 * flattering light, a "try it for one perfect night" feeling. Calmer and
 * more considered than a wedding-shopper-joy mood — this is a rental
 * boutique, not a bridal showroom.
 *
 * Usage: node scripts/generate-kiraya-assets.mjs
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
// Shared style language — jewel-tone rental boutique, dressing-room ambiance
// ---------------------------------------------------------------------------
const STUDIO_FORM = 'shot on a headless mannequin against a deep plum velvet dressing-room backdrop with a softly blurred gold-framed mirror behind it, warm flattering low-key light, rich jewel-tone color grading, medium-format editorial fashion photography, photorealistic, no text, no logo, no visible brand marks, no readable labels or tags'
const STUDIO_FLAT = 'flat lay on a deep plum velvet surface, warm flattering low-key light from one side, rich jewel-tone color grading, medium-format editorial fashion photography, photorealistic, no text, no logo, no visible brand marks, no readable labels or tags'

const PRODUCTS = [
  { slug: 'royal-plum-silk-lehenga', prompt: `A deep plum raw-silk bridal lehenga with hand-embroidered antique gold zari work, ${STUDIO_FORM}` },
  { slug: 'antique-gold-zari-lehenga', prompt: `An antique gold bridal-weight lehenga with dense zari and gota patti embroidery, ${STUDIO_FORM}` },
  { slug: 'emerald-mirror-work-lehenga', prompt: `An emerald green lehenga with hand-set mirror work embroidery scattered throughout, ${STUDIO_FORM}` },
  { slug: 'blush-pastel-bridesmaid-lehenga', prompt: `A soft blush pink lehenga with delicate thread embroidery on net fabric, ${STUDIO_FORM}` },
  { slug: 'ivory-bandhgala-sherwani', prompt: `An ivory bandhgala sherwani with subtle self-thread paisley embroidery, mandarin collar, ${STUDIO_FORM}` },
  { slug: 'maroon-velvet-groom-sherwani', prompt: `A maroon velvet groom sherwani with gold zardozi embroidery on the collar and cuffs, ${STUDIO_FORM}` },
  { slug: 'powder-blue-indowestern-sherwani', prompt: `A powder blue slim-cut indo-western jacket sherwani, ${STUDIO_FORM}` },
  { slug: 'banarasi-silk-saree', prompt: `A wine red Banarasi silk saree with a woven gold zari border, elegantly draped on a mannequin, ${STUDIO_FORM}` },
  { slug: 'kanjivaram-temple-border-saree', prompt: `An emerald and gold Kanjivaram silk saree with a temple-motif border, draped on a mannequin, ${STUDIO_FORM}` },
  { slug: 'chiffon-sequin-party-saree', prompt: `A midnight blue lightweight chiffon saree with fine all-over sequin work, draped on a mannequin, ${STUDIO_FORM}` },
  { slug: 'organza-floral-saree', prompt: `An ivory and rose organza saree hand-painted with a floral motif, draped on a mannequin, ${STUDIO_FORM}` },
  { slug: 'midnight-sequin-gown', prompt: `A floor-length midnight blue sequin evening gown with a fitted bodice, ${STUDIO_FORM}` },
  { slug: 'ivory-trail-gown', prompt: `An ivory bridal-adjacent gown with a soft trail and hand-embroidered bodice, ${STUDIO_FORM}` },
  { slug: 'emerald-cape-gown', prompt: `An emerald green evening gown with a dramatic detachable cape sleeve, ${STUDIO_FORM}` },
  { slug: 'kundan-choker-set', prompt: `An antique gold kundan choker necklace with matching jhumka earrings, displayed on a velvet jewellery stand, ${STUDIO_FLAT}` },
  { slug: 'polki-chandbali-set', prompt: `Gold and white polki chandbali earrings with a matching maang tikka, displayed on a velvet jewellery stand, ${STUDIO_FLAT}` },
  { slug: 'antique-gold-temple-necklace-set', prompt: `An antique gold temple-motif layered necklace with matching drop earrings, displayed on a velvet jewellery stand, ${STUDIO_FLAT}` },
]

const CAMPAIGN = [
  { slug: 'hero', size: '1536x1024', prompt: 'Wide cinematic shot: a deep plum velvet dressing room with a large gold-framed mirror reflecting a single antique-gold embroidered lehenga hanging on a brass rail, warm low-key flattering light, rich jewel-tone color grading, airy still-life editorial photography, no people, photorealistic medium format film photography' },
  { slug: 'dressing-room', size: '1536x1024', prompt: 'A softly lit boutique dressing room corner: a velvet armchair, a gold-framed standing mirror, and a rack of jewel-toned occasion wear partially visible, warm ambient light, rich jewel-tone color grading, editorial photography, no people, photorealistic' },
  { slug: 'texture', size: '1536x1024', prompt: 'Extreme macro close-up of deep plum silk fabric with antique gold zari embroidery thread detail, warm low-key side light revealing texture, editorial fashion photography, no people, photorealistic' },
  { slug: 'still-life', size: '1024x1024', prompt: 'Overhead still life on deep plum velvet: a kundan jewellery set, a folded silk dupatta, and a pair of embellished juttis arranged with warm flattering light, editorial fashion photography, no people, photorealistic' },
  { slug: 'detail', size: '1024x1024', prompt: 'Extreme close-up of hand-set mirror work and gold zari embroidery on emerald silk fabric, warm low-key light, shallow depth of field, editorial fashion photography, no people, photorealistic' },
  { slug: 'flatlay-outfit', size: '1024x1536', prompt: 'Overhead flat lay on deep plum velvet: an antique gold embroidered lehenga choli, a kundan jewellery set, and matching juttis, precisely composed, warm flattering low-key light, rich jewel-tone color grading, editorial fashion photography, no people, no text, no logos, no labels or tags of any kind, photorealistic' },
]

async function main() {
  console.log(`\nKIRAYA asset generation (OpenAI gpt-image-2) — ${PRODUCTS.length} products + ${CAMPAIGN.length} campaign images\n`)

  let succeeded = 0
  let failed = 0
  let skipped = 0

  for (const p of PRODUCTS) {
    const dest = resolve(ROOT, 'public/kiraya/products', `${p.slug}.jpg`)
    console.log(`generating product: ${p.slug}...`)
    try {
      const result = await generateAndSave(p.prompt, '1024x1536', dest)
      if (result === 'saved') succeeded++
      else skipped++
    } catch (e) {
      console.error(`  FAILED ${p.slug}:`, e.message)
      failed++
    }
  }

  for (const c of CAMPAIGN) {
    const dest = resolve(ROOT, 'public/kiraya/campaign', `${c.slug}.jpg`)
    console.log(`generating campaign: ${c.slug}...`)
    try {
      const result = await generateAndSave(c.prompt, c.size, dest)
      if (result === 'saved') succeeded++
      else skipped++
    } catch (e) {
      console.error(`  FAILED ${c.slug}:`, e.message)
      failed++
    }
  }

  console.log(`\nDone. ${succeeded} saved, ${skipped} skipped (already existed), ${failed} failed.\n`)
}

main().catch(err => { console.error(err); process.exit(1) })
