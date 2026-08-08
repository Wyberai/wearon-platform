// Run from the wearon-app directory after writing tenant.config.json
// node scripts/inject-tenant-config.js
const fs = require('fs')
const path = require('path')

const config = JSON.parse(fs.readFileSync('tenant.config.json', 'utf8'))
const appJsonPath = path.join(__dirname, '..', 'app.json')
const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'))

appJson.expo.name = config.brandName
appJson.expo.slug = `wearon-${config.slug}`
appJson.expo.android = appJson.expo.android ?? {}
appJson.expo.android.package = `in.wearon.${config.slug.replace(/-/g, '')}`

if (config.primaryColor) {
  appJson.expo.primaryColor = config.primaryColor
  appJson.expo.android.adaptiveIcon = appJson.expo.android.adaptiveIcon ?? {}
  appJson.expo.android.adaptiveIcon.backgroundColor = config.primaryColor
}

if (config.logoUrl) {
  appJson.expo.icon = config.logoUrl
  appJson.expo.android.adaptiveIcon.foregroundImage = config.logoUrl
}

fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2))
console.log(`Patched app.json: name="${config.brandName}", package="in.wearon.${config.slug.replace(/-/g, '')}"`)
