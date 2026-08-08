// Creates 1×1 pink pixel PNG placeholders for PWA icons
// Run: node scripts/create-placeholder-icons.js
// Then run scripts/generate-icons.js (requires sharp) to create real icons
const fs = require('fs')
const path = require('path')

// Minimal valid 1x1 pink PNG
const PINK_PNG_B64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwADhQGAWjR9awAAAABJRU5ErkJggg=='

const buf = Buffer.from(PINK_PNG_B64, 'base64')
const publicDir = path.join(__dirname, '..', 'public')

fs.writeFileSync(path.join(publicDir, 'icon-192.png'), buf)
fs.writeFileSync(path.join(publicDir, 'icon-512.png'), buf)
console.log('Placeholder icons created. Run scripts/generate-icons.js for real icons.')
