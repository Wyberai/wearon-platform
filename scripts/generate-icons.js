// Run: node scripts/generate-icons.js
// Requires: npm install sharp
const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const svgPath = path.join(__dirname, '..', 'public', 'icon.svg')
const svgBuffer = fs.readFileSync(svgPath)

async function generate() {
  await sharp(svgBuffer).resize(192, 192).png().toFile(
    path.join(__dirname, '..', 'public', 'icon-192.png')
  )
  console.log('Generated icon-192.png')

  await sharp(svgBuffer).resize(512, 512).png().toFile(
    path.join(__dirname, '..', 'public', 'icon-512.png')
  )
  console.log('Generated icon-512.png')
}

generate().catch(console.error)
