#!/usr/bin/env node
/**
 * THE GRID — Western/streetwear-casual flagship theme asset sourcing
 *
 * Downloads real, free, legally-usable stock photography from Unsplash for
 * the demo catalog's product shots + campaign hero, saved to public/thegrid/.
 *
 * IMPORTANT: Unsplash search-result pages surface SHORT base62 photo IDs in
 * their URLs, but the actual images.unsplash.com CDN convention (see
 * src/lib/demo-products.ts) requires the FULL-FORM photo ID
 * (`photo-{timestamp}-{hash}`). Every ID below was resolved to its full form
 * by inspecting the real <img> src on the photo's search-result/detail page
 * (not guessed from the short slug), and every photo was visually reviewed
 * before being locked in here — several initial picks were rejected for
 * wrong garment type, wrong color, visible third-party logos, or being the
 * wrong photo entirely.
 *
 * Usage: node scripts/download-thegrid-assets.mjs
 */

import { writeFileSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const OUT_ROOT = resolve(ROOT, 'public', 'thegrid')

const PORTRAIT = { w: 900, h: 1125 } // product shots
const LANDSCAPE = { w: 1600, h: 1000 } // campaign hero

function unsplashUrl(photoId, { w, h }) {
  return `https://images.unsplash.com/photo-${photoId}?w=${w}&h=${h}&fit=crop&q=80`
}

const ASSETS = [
  // Products (portrait, 900x1125)
  { dest: 'products/black-slip-midi-dress.jpg', photoId: '1618037208874-021263b58d69', size: PORTRAIT, desc: 'woman in black satin slip midi dress' },
  { dest: 'products/yellow-sundress.jpg', photoId: '1583960485234-946d639630fd', size: PORTRAIT, desc: 'woman in bright yellow cotton sundress' },
  { dest: 'products/white-poplin-shirt.jpg', photoId: '1617019114583-affb34d1b3cd', size: PORTRAIT, desc: 'woman in crisp white button-down poplin shirt' },
  { dest: 'products/ribbed-tank-top.jpg', photoId: '1593097046819-76c985a94853', size: PORTRAIT, desc: 'woman in fitted cream ribbed tank top' },
  { dest: 'products/high-rise-mom-jeans.jpg', photoId: '1598554747436-c9293d6a588f', size: PORTRAIT, desc: 'woman in high-rise mom-fit blue jeans' },
  { dest: 'products/wide-leg-denim.jpg', photoId: '1692771395293-59b9fc36e3bf', size: PORTRAIT, desc: 'woman in light-wash wide-leg jeans' },
  { dest: 'products/oversized-denim-jacket.jpg', photoId: '1602370086926-8f86d11fdb18', size: PORTRAIT, desc: 'woman in oversized blue denim jacket' },
  { dest: 'products/cropped-bomber-jacket.jpg', photoId: '1584124659340-c1ec6bdddbb2', size: PORTRAIT, desc: 'woman in cropped olive-green bomber jacket' },
  { dest: 'products/gold-layered-necklace.jpg', photoId: '1635767798638-3e25273a8236', size: PORTRAIT, desc: 'close-up flat-lay of layered gold-toned necklaces' },
  { dest: 'products/oversized-sunglasses.jpg', photoId: '1716443705704-b1065d7b44d3', size: PORTRAIT, desc: 'person wearing large tortoiseshell oversized sunglasses' },
  // Campaign hero (landscape, 1600x1000)
  { dest: 'campaign/hero.jpg', photoId: '1599255145209-b058b2f781c8', size: LANDSCAPE, desc: 'stylish woman in modern Western casual streetwear, editorial/lifestyle mood shot' },
]

async function downloadAsset({ dest, photoId, size, desc }) {
  const url = unsplashUrl(photoId, size)
  const destPath = resolve(OUT_ROOT, dest)
  mkdirSync(dirname(destPath), { recursive: true })

  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`FAILED ${dest} (${desc}) <- ${url} : HTTP ${res.status}`)
  }
  const buf = Buffer.from(await res.arrayBuffer())
  writeFileSync(destPath, buf)
  console.log(`OK  ${dest}  (${buf.length.toLocaleString()} bytes)  — ${desc}`)
}

for (const asset of ASSETS) {
  await downloadAsset(asset)
}

console.log('\nAll THE GRID assets downloaded to public/thegrid/.')
