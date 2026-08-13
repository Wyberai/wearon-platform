import { createClient, createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { buildBrandPersona } from '@/lib/brand-voice'
import type { BrandVoice } from '@/lib/types'

// GET /api/admin/collections?slug=xxx — list seller's collections
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()
  const { data: collections } = await admin
    .from('store_collections')
    .select('*')
    .eq('seller_id', user.id)
    .order('created_at', { ascending: false })

  return NextResponse.json({ collections: collections ?? [] })
}

// POST /api/admin/collections — AI-generate a collection
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { slug, prompt } = body as { slug: string; prompt: string }

  const admin = createAdminClient()

  const [configRes, productsRes] = await Promise.all([
    admin.from('tenant_config').select('brand_name, brand_voice').eq('slug', slug).eq('seller_id', user.id).single(),
    admin.from('products').select('id, name, description, price_inr, category, sizes, colors, tags, garment_image_url').eq('seller_id', user.id).eq('is_active', true).limit(80),
  ])

  if (!configRes.data) return NextResponse.json({ error: 'Store not found' }, { status: 404 })

  const products = productsRes.data ?? []
  const brandVoice = configRes.data.brand_voice as BrandVoice | null
  const brandName = configRes.data.brand_name ?? 'Our Boutique'
  const persona = buildBrandPersona(brandVoice, brandName)

  const openaiKey = process.env.OPENAI_API_KEY
  if (!openaiKey) {
    // Demo fallback
    const demo = products.slice(0, 4)
    const demoCollection = {
      seller_id: user.id,
      title: `${prompt} Edit`,
      description: `A curated selection for ${prompt.toLowerCase()} — handpicked for you.`,
      product_ids: demo.map(p => p.id),
      occasion_tags: [prompt.toLowerCase()],
      editorial_copy: {
        intro: `Introducing our ${prompt} Edit — effortless pieces that carry the moment.`,
        product_captions: Object.fromEntries(demo.map(p => [p.id, `A perfect choice for ${prompt.toLowerCase()}.`])),
      },
    }
    const { data: inserted, error } = await admin.from('store_collections').insert(demoCollection).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ collection: inserted })
  }

  const catalogText = products.map(p =>
    `ID:${p.id} | ${p.name}${p.category ? ` (${p.category})` : ''} | $${p.price_inr}` +
    (p.tags?.length ? ` | tags: ${(p.tags as string[]).join(', ')}` : '') +
    (p.description ? ` | ${p.description.slice(0, 60)}` : '')
  ).join('\n')

  const systemPrompt = `${persona}

You are curating a themed fashion collection for "${brandName}". The buyer has asked: "${prompt}".

From the catalog below, select 4–8 products that best fit this theme. For each selected product, write one short editorial caption (15–20 words, brand-voice-aligned). Also write a 2–3 sentence intro for the collection.

Catalog:
${catalogText}

Respond with ONLY valid JSON:
{
  "title": "...",
  "description": "...",
  "intro": "...",
  "selected": [
    { "id": "product-uuid", "caption": "..." }
  ],
  "occasion_tags": ["...", "..."]
}`

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${openaiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: systemPrompt }],
      max_tokens: 600,
      temperature: 0.7,
      response_format: { type: 'json_object' },
    }),
  })

  if (!res.ok) return NextResponse.json({ error: 'AI generation failed' }, { status: 500 })
  const aiData = await res.json()
  let parsed: { title: string; description: string; intro: string; selected: { id: string; caption: string }[]; occasion_tags: string[] }

  try {
    parsed = JSON.parse(aiData.choices[0].message.content)
  } catch {
    return NextResponse.json({ error: 'AI returned invalid JSON' }, { status: 500 })
  }

  const validProductIds = new Set(products.map(p => p.id))
  const selectedIds = parsed.selected.filter(s => validProductIds.has(s.id)).map(s => s.id)
  const captions = Object.fromEntries(parsed.selected.filter(s => validProductIds.has(s.id)).map(s => [s.id, s.caption]))

  const newCollection = {
    seller_id: user.id,
    title: parsed.title,
    description: parsed.description,
    product_ids: selectedIds,
    occasion_tags: parsed.occasion_tags ?? [],
    editorial_copy: { intro: parsed.intro, product_captions: captions },
  }

  const { data: inserted, error } = await admin.from('store_collections').insert(newCollection).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ collection: inserted })
}

// PATCH /api/admin/collections — toggle featured / update title
export async function PATCH(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id, is_featured, title } = await request.json()
  const updates: Record<string, unknown> = {}
  if (typeof is_featured === 'boolean') updates.is_featured = is_featured
  if (title) updates.title = title

  const admin = createAdminClient()
  const { error } = await admin.from('store_collections').update(updates).eq('id', id).eq('seller_id', user.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

// DELETE /api/admin/collections?id=xxx
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()
  const { error } = await admin.from('store_collections').delete().eq('id', id!).eq('seller_id', user.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
