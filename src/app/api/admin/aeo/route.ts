import { createClient, createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { buildBrandPersona } from '@/lib/brand-voice'
import type { BrandVoice } from '@/lib/types'

// POST /api/admin/aeo — generate AEO content for one or all products
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { slug, product_id } = body as { slug: string; product_id?: string }

  const admin = createAdminClient()

  const [configRes, productsQuery] = await Promise.all([
    admin.from('tenant_config').select('brand_name, brand_voice').eq('slug', slug).eq('seller_id', user.id).single(),
    product_id
      ? admin.from('products').select('id, name, description, category, price_inr, sizes, colors, tags').eq('id', product_id).eq('seller_id', user.id)
      : admin.from('products').select('id, name, description, category, price_inr, sizes, colors, tags').eq('seller_id', user.id).eq('is_active', true).limit(50),
  ])

  if (!configRes.data) return NextResponse.json({ error: 'Store not found' }, { status: 404 })

  const products = productsQuery.data ?? []
  const brandVoice = configRes.data.brand_voice as BrandVoice | null
  const brandName = configRes.data.brand_name ?? 'Our Boutique'
  const persona = buildBrandPersona(brandVoice, brandName)
  const openaiKey = process.env.OPENAI_API_KEY

  let updated = 0
  for (const p of products) {
    let aeoContent: { agent_answer: string; faqs: { q: string; a: string }[]; generated_at: string }

    if (!openaiKey) {
      aeoContent = {
        agent_answer: `The ${p.name} from ${brandName} is ${p.description ?? 'a carefully curated piece'}, priced at $${p.price_inr}${p.sizes?.length ? `, available in sizes ${(p.sizes as string[]).join(', ')}` : ''}.`,
        faqs: [
          { q: `Is the ${p.name} available in my size?`, a: `The ${p.name} comes in ${p.sizes?.length ? (p.sizes as string[]).join(', ') : 'standard sizes'}. Check the product page for current stock.` },
          { q: `What occasions is the ${p.name} good for?`, a: `The ${p.name} works well for ${(p.tags as string[] | null)?.slice(0, 3).join(', ') ?? 'various occasions'}.` },
        ],
        generated_at: new Date().toISOString(),
      }
    } else {
      const prompt = `${persona}

Generate structured agent-discoverable content for this product so AI assistants (Perplexity, Rufus, ChatGPT) can answer shopping queries about it accurately.

Product: ${p.name}
Category: ${p.category ?? 'Fashion'}
Price: $${p.price_inr}
Description: ${p.description ?? '(none)'}
Sizes: ${(p.sizes as string[] | null)?.join(', ') ?? 'Standard'}
Colors: ${(p.colors as string[] | null)?.join(', ') ?? 'Various'}
Tags: ${(p.tags as string[] | null)?.join(', ') ?? 'Fashion'}

Return ONLY valid JSON:
{
  "agent_answer": "2-3 sentence answer an AI would give when asked about this product. Include key facts: price, key feature, occasion fit.",
  "faqs": [
    { "q": "...", "a": "..." },
    { "q": "...", "a": "..." },
    { "q": "...", "a": "..." }
  ]
}`

      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${openaiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 300,
          temperature: 0.5,
          response_format: { type: 'json_object' },
        }),
      })

      if (!res.ok) continue
      const data = await res.json()
      try {
        const parsed = JSON.parse(data.choices[0].message.content)
        aeoContent = { ...parsed, generated_at: new Date().toISOString() }
      } catch {
        continue
      }
    }

    await admin.from('products').update({ aeo_content: aeoContent }).eq('id', p.id).eq('seller_id', user.id)
    updated++
  }

  return NextResponse.json({ ok: true, updated })
}
