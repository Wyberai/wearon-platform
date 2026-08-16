#!/usr/bin/env node
/**
 * Downloads real, free, legally-usable Unsplash stock photos for the
 * "Try It On" fashion demo catalog into public/tryiton/.
 *
 * Each entry's `id` is the FULL-FORM Unsplash CDN photo id
 * (photo-{timestamp}-{hash}), obtained by inspecting each photo's actual
 * rendered <img src> on unsplash.com (NOT the short base62 id shown in
 * search-result page URLs, which 404s against images.unsplash.com).
 *
 * Usage: node scripts/_download-tryiton-assets.mjs
 */

import { writeFileSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

const PRODUCTS = [
  { slug: 'black-satin-jumpsuit', id: '1667014353781-8fbb638b5bf6' },
  { slug: 'red-belted-jumpsuit', id: '1761850617243-0af6c4d2cb1c' },
  { slug: 'sequin-bodycon-dress', id: '1784174135311-a2b614b0937d' },
  { slug: 'emerald-cape-dress', id: '1756483510809-122c56fbb035' },
  { slug: 'indowestern-cowl-saree-gown', id: '1764265150786-bff69a483622' },
  { slug: 'dhoti-jumpsuit-fusion', id: '1756483510802-0acac24ab4e8' },
  { slug: 'strappy-block-heels', id: '1613912804931-c3512f360cd3' },
  { slug: 'embellished-flat-sandals', id: '1700611193533-e25b4f24d919' },
]

const CAMPAIGN = [
  { slug: 'hero', id: '1744726959661-f68275f35884' },
]

async function download(id, w, h, destPath) {
  const url = `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&q=80`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  const buf = Buffer.from(await res.arrayBuffer())
  mkdirSync(dirname(destPath), { recursive: true })
  writeFileSync(destPath, buf)
  console.log(`  saved ${destPath} (${(buf.length / 1024).toFixed(0)}kb)`)
}

async function main() {
  console.log(`\nTry It On asset download — ${PRODUCTS.length} products + ${CAMPAIGN.length} campaign hero\n`)

  for (const p of PRODUCTS) {
    const dest = resolve(ROOT, 'public/tryiton/products', `${p.slug}.jpg`)
    console.log(`downloading product: ${p.slug}...`)
    try {
      await download(p.id, 900, 1125, dest)
    } catch (e) {
      console.error(`  FAILED ${p.slug}:`, e.message)
    }
  }

  for (const c of CAMPAIGN) {
    const dest = resolve(ROOT, 'public/tryiton/campaign', `${c.slug}.jpg`)
    console.log(`downloading campaign: ${c.slug}...`)
    try {
      await download(c.id, 1600, 1000, dest)
    } catch (e) {
      console.error(`  FAILED ${c.slug}:`, e.message)
    }
  }

  console.log('\nDone.\n')
}

main().catch(err => { console.error(err); process.exit(1) })
