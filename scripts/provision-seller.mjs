#!/usr/bin/env node
/**
 * WearOn — Seller Provisioning Script
 *
 * Sets up a complete owned infrastructure stack for one seller:
 *   1. Creates a Supabase project in their name (ap-south-1 / Mumbai)
 *   2. Applies all 4 migrations
 *   3. Creates storage buckets
 *   4. Creates a Vercel project, sets all env vars, triggers deploy
 *   5. Registers the seller in the platform registry
 *
 * Usage:
 *   node scripts/provision-seller.mjs \
 *     --name "Priya's Boutique" \
 *     --email priya@gmail.com \
 *     --slug priyasboutique \
 *     --whatsapp +919876543210 \
 *     [--domain priyasboutique.com]
 *
 * Required env vars (add to your .env.local or shell):
 *   SUPABASE_ACCESS_TOKEN   — personal access token from supabase.com/account/tokens
 *   SUPABASE_ORG_ID         — organization slug from supabase.com/dashboard/org/_/settings
 *   VERCEL_TOKEN            — from vercel.com/account/tokens
 *   VERCEL_TEAM_ID          — optional, for team accounts
 *   GITHUB_REPO             — e.g. "Wyberai/wearon-platform"
 *   PLATFORM_SUPABASE_URL   — YOUR platform Supabase URL (for the registry)
 *   PLATFORM_SERVICE_KEY    — YOUR platform service role key
 *   RESEND_API_KEY          — your master Resend key (creates sub-key per seller)
 *   OPENAI_API_KEY          — shared OpenAI key
 *   META_APP_ID             — Meta app ID for Instagram
 *   META_APP_SECRET         — Meta app secret
 *   META_VERIFY_TOKEN       — Meta webhook verify token
 */

import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'
import https from 'https'
import { createClient } from '@supabase/supabase-js'

// ---------------------------------------------------------------------------
// Parse CLI args
// ---------------------------------------------------------------------------
function parseArgs() {
  const args = process.argv.slice(2)
  const out = {}
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      out[args[i].slice(2)] = args[i + 1]
      i++
    }
  }
  return out
}

const args = parseArgs()
const SELLER_NAME    = args.name
const SELLER_EMAIL   = args.email
const SELLER_SLUG    = args.slug
const SELLER_WA      = args.whatsapp ?? ''
const SELLER_DOMAIN  = args.domain ?? null

if (!SELLER_NAME || !SELLER_EMAIL || !SELLER_SLUG) {
  console.error('Usage: node scripts/provision-seller.mjs --name "..." --email "..." --slug "..."')
  process.exit(1)
}

// ---------------------------------------------------------------------------
// Load env
// ---------------------------------------------------------------------------
function env(key) {
  const val = process.env[key]
  if (!val) { console.error(`Missing env var: ${key}`); process.exit(1) }
  return val
}

const SUPABASE_ACCESS_TOKEN = env('SUPABASE_ACCESS_TOKEN')
const SUPABASE_ORG_ID       = env('SUPABASE_ORG_ID')
const VERCEL_TOKEN          = env('VERCEL_TOKEN')
const VERCEL_TEAM_ID        = process.env.VERCEL_TEAM_ID ?? null
const GITHUB_REPO           = env('GITHUB_REPO')
const PLATFORM_SUPABASE_URL = env('PLATFORM_SUPABASE_URL')
const PLATFORM_SERVICE_KEY  = env('PLATFORM_SERVICE_KEY')
const RESEND_MASTER_KEY     = env('RESEND_API_KEY')
const OPENAI_KEY            = env('OPENAI_API_KEY')
const META_APP_ID           = env('META_APP_ID')
const META_APP_SECRET       = env('META_APP_SECRET')
const META_VERIFY_TOKEN     = env('META_VERIFY_TOKEN')

const DB_PASSWORD = generatePassword()

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function generatePassword(len = 24) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#'
  return Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

async function api(method, url, body, token, extraHeaders = {}) {
  const res = await fetch(url, {
    method,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...extraHeaders,
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  let json
  try { json = JSON.parse(text) } catch { json = text }
  if (!res.ok) {
    throw new Error(`${method} ${url} → ${res.status}: ${text.slice(0, 300)}`)
  }
  return json
}

function sbApi(method, path, body) {
  return api(method, `https://api.supabase.com${path}`, body, SUPABASE_ACCESS_TOKEN)
}

function vercelApi(method, path, body) {
  const teamSuffix = VERCEL_TEAM_ID ? `?teamId=${VERCEL_TEAM_ID}` : ''
  return api(method, `https://api.vercel.com${path}${teamSuffix}`, body, VERCEL_TOKEN)
}

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

function log(emoji, msg) { console.log(`${emoji}  ${msg}`) }

// ---------------------------------------------------------------------------
// Load migration files
// ---------------------------------------------------------------------------
function loadMigrations() {
  const dir = resolve('supabase/migrations')
  return ['001_initial.sql', '002_api_access.sql', '003_growth_features.sql', '004_instagram_dm.sql']
    .filter(f => existsSync(resolve(dir, f)))
    .map(f => readFileSync(resolve(dir, f), 'utf8'))
}

// ---------------------------------------------------------------------------
// Main provisioning flow
// ---------------------------------------------------------------------------
async function main() {
  console.log(`\n🚀  WearOn Seller Provisioning`)
  console.log(`    Seller : ${SELLER_NAME}`)
  console.log(`    Email  : ${SELLER_EMAIL}`)
  console.log(`    Slug   : ${SELLER_SLUG}`)
  if (SELLER_DOMAIN) console.log(`    Domain : ${SELLER_DOMAIN}`)
  console.log()

  // -------------------------------------------------------------------------
  // Step 1: Create Supabase project
  // -------------------------------------------------------------------------
  log('🗄️ ', 'Creating Supabase project…')
  const projectName = SELLER_SLUG.replace(/[^a-z0-9-]/g, '-')
  const project = await sbApi('POST', '/v1/projects', {
    name: projectName,
    organization_id: SUPABASE_ORG_ID,
    db_pass: DB_PASSWORD,
    region: 'ap-south-1',
    plan: 'free',
  })
  const projectRef = project.id
  log('✅', `Project created: ${projectRef}`)

  // Wait for project to be healthy
  log('⏳', 'Waiting for project to become active (up to 5 min)…')
  for (let i = 0; i < 60; i++) {
    await sleep(5000)
    const status = await sbApi('GET', `/v1/projects/${projectRef}`)
    if (status.status === 'ACTIVE_HEALTHY') {
      log('✅', 'Project is active')
      break
    }
    if (i === 59) throw new Error('Project never became ACTIVE_HEALTHY')
    process.stdout.write('.')
  }

  // -------------------------------------------------------------------------
  // Step 2: Get API keys
  // -------------------------------------------------------------------------
  log('🔑', 'Fetching API keys…')
  const keys = await sbApi('GET', `/v1/projects/${projectRef}/api-keys`)
  const anonKey    = keys.find(k => k.name === 'anon')?.api_key
  const serviceKey = keys.find(k => k.name === 'service_role')?.api_key
  const projectUrl = `https://${projectRef}.supabase.co`
  log('✅', 'Keys fetched')

  // -------------------------------------------------------------------------
  // Step 3: Apply migrations
  // -------------------------------------------------------------------------
  log('📦', 'Applying database migrations…')
  const migrations = loadMigrations()
  for (let i = 0; i < migrations.length; i++) {
    await sbApi('POST', `/v1/projects/${projectRef}/database/query`, { query: migrations[i] })
    log('✅', `Migration ${i + 1}/${migrations.length} applied`)
  }

  // Storage buckets
  const storageSetupPath = resolve('supabase/storage-setup.sql')
  if (existsSync(storageSetupPath)) {
    await sbApi('POST', `/v1/projects/${projectRef}/database/query`, {
      query: readFileSync(storageSetupPath, 'utf8'),
    })
    log('✅', 'Storage buckets created')
  }

  // -------------------------------------------------------------------------
  // Step 4: Create Resend API key for seller
  // -------------------------------------------------------------------------
  log('📧', 'Creating Resend API key…')
  let resendKey = RESEND_MASTER_KEY // fallback: use master key
  try {
    const resendRes = await api('POST', 'https://api.resend.com/api-keys', {
      name: `wearon-${SELLER_SLUG}`,
      permission: 'sending_access',
    }, RESEND_MASTER_KEY)
    resendKey = resendRes.token ?? RESEND_MASTER_KEY
    log('✅', 'Resend key created')
  } catch (e) {
    log('⚠️ ', `Resend key creation failed (using master key): ${e.message}`)
  }

  // -------------------------------------------------------------------------
  // Step 5: Create Vercel project
  // -------------------------------------------------------------------------
  log('▲ ', 'Creating Vercel project…')
  const [ghOwner, ghRepo] = GITHUB_REPO.split('/')
  const vercelProject = await vercelApi('POST', '/v10/projects', {
    name: `wearon-${SELLER_SLUG}`,
    framework: 'nextjs',
    gitRepository: {
      type: 'github',
      repo: GITHUB_REPO,
    },
  })
  const vercelProjectId = vercelProject.id
  const vercelUrl = `https://wearon-${SELLER_SLUG}.vercel.app`
  log('✅', `Vercel project created: ${vercelProjectId}`)

  // -------------------------------------------------------------------------
  // Step 6: Set env vars on Vercel project
  // -------------------------------------------------------------------------
  log('⚙️ ', 'Setting environment variables…')
  const appUrl = SELLER_DOMAIN ? `https://${SELLER_DOMAIN}` : vercelUrl
  const envVars = [
    ['NEXT_PUBLIC_SUPABASE_URL', projectUrl],
    ['NEXT_PUBLIC_SUPABASE_ANON_KEY', anonKey],
    ['SUPABASE_SERVICE_ROLE_KEY', serviceKey],
    ['RESEND_API_KEY', resendKey],
    ['EMAIL_FROM', `noreply@${SELLER_DOMAIN ?? 'instastarz.in'}`],
    ['NEXT_PUBLIC_APP_URL', appUrl],
    ['NEXT_PUBLIC_SUPABASE_REDIRECT_URL', `${appUrl}/auth/callback`],
    ['OPENAI_API_KEY', OPENAI_KEY],
    ['META_APP_ID', META_APP_ID],
    ['META_APP_SECRET', META_APP_SECRET],
    ['META_VERIFY_TOKEN', META_VERIFY_TOKEN],
    ['PLATFORM_OWNER_EMAIL', SELLER_EMAIL],
  ]

  await vercelApi('POST', `/v10/projects/${vercelProjectId}/env`, {
    envVars: envVars.map(([key, value]) => ({
      key,
      value,
      type: 'encrypted',
      target: ['production', 'preview'],
    })),
  })
  log('✅', 'Environment variables set')

  // -------------------------------------------------------------------------
  // Step 7: Trigger initial deployment
  // -------------------------------------------------------------------------
  log('🚀', 'Triggering first deployment…')
  const deployment = await vercelApi('POST', '/v13/deployments', {
    name: `wearon-${SELLER_SLUG}`,
    project: vercelProjectId,
    gitSource: { type: 'github', repo: GITHUB_REPO, ref: 'master' },
  })
  log('✅', `Deployment triggered: ${deployment.id}`)

  // -------------------------------------------------------------------------
  // Step 8: Add custom domain to Vercel (if provided)
  // -------------------------------------------------------------------------
  if (SELLER_DOMAIN) {
    log('🌐', `Adding domain ${SELLER_DOMAIN}…`)
    try {
      await vercelApi('POST', `/v10/projects/${vercelProjectId}/domains`, { name: SELLER_DOMAIN })
      log('✅', 'Domain added')
    } catch (e) {
      log('⚠️ ', `Domain add failed (add manually in Vercel): ${e.message}`)
    }
  }

  // -------------------------------------------------------------------------
  // Step 9: Register in platform registry
  // -------------------------------------------------------------------------
  log('📋', 'Registering in platform registry…')
  const platformClient = createClient(PLATFORM_SUPABASE_URL, PLATFORM_SERVICE_KEY)
  await platformClient.from('seller_deployments').upsert({
    seller_name: SELLER_NAME,
    seller_email: SELLER_EMAIL,
    domain: SELLER_DOMAIN,
    supabase_project_ref: projectRef,
    supabase_project_url: projectUrl,
    supabase_anon_key: anonKey,
    vercel_project_id: vercelProjectId,
    vercel_project_url: appUrl,
    plan: 'free',
    status: 'active',
  }, { onConflict: 'seller_email' })
  log('✅', 'Registered in platform registry')

  // -------------------------------------------------------------------------
  // Done — print handover sheet
  // -------------------------------------------------------------------------
  console.log(`
╔══════════════════════════════════════════════════════════════════╗
║  ✅  WearOn setup complete for ${SELLER_NAME.padEnd(35)} ║
╠══════════════════════════════════════════════════════════════════╣
║  Store URL        : ${appUrl.padEnd(43)} ║
║  Admin Panel      : ${(appUrl + '/admin').padEnd(43)} ║
║  Supabase Dashboard : https://supabase.com/dashboard/project/${projectRef.slice(0, 8)}… ║
║  Vercel Project   : https://vercel.com/dashboard (${`wearon-${SELLER_SLUG}`.slice(0, 20)})  ║
╠══════════════════════════════════════════════════════════════════╣
║  DB password (store securely — only time shown)                  ║
║  ${DB_PASSWORD.padEnd(63)} ║
╠══════════════════════════════════════════════════════════════════╣
║  Next steps:                                                     ║
║  1. Share store URL + admin login link with seller               ║
║  2. Seller sets their password on first login                    ║
║  3. If custom domain: update DNS with Vercel CNAME shown above  ║
║  4. Seller connects Instagram from admin → Inbox                 ║
╚══════════════════════════════════════════════════════════════════╝
`)
}

main().catch(err => {
  console.error('\n❌  Provisioning failed:', err.message)
  process.exit(1)
})
