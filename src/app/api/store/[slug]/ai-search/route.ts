import { NextResponse } from 'next/server'
import { searchProducts } from '@/lib/store-agent-tools'
import { getSellerIdForSlug, getSellerPlanForSlug } from '@/lib/agent-tracking'
import { createAdminClient } from '@/lib/supabase/server'
import { MCP_ELIGIBLE_PLANS, type Plan } from '@/lib/constants'

// GET /api/store/{slug}/ai-search — cheap eligibility probe so the buyer-facing
// search box can hide itself before ever rendering on a demo/free-tier store,
// instead of only discovering NOT_ELIGIBLE after a buyer submits a query.
// Never touches ai_reply quota or calls OpenAI, unlike POST below.
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const plan = await getSellerPlanForSlug(slug)
  return NextResponse.json({ eligible: !!plan && MCP_ELIGIBLE_PLANS.includes(plan as Plan) })
}

// POST /api/store/{slug}/ai-search — buyer-facing natural-language product
// search ("what should I wear for a wedding today?"). Same plan gate as
// AI shopping (MCP_ELIGIBLE_PLANS) since, unlike MCP (external AI apps
// query the catalog on their own compute), this route makes its own OpenAI
// call to parse the query — a real per-search cost, metered against the
// same ai_reply pool every other text-completion feature already uses.
export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { query } = await req.json() as { query?: string }
  if (!query || !query.trim()) {
    return NextResponse.json({ error: 'Missing query' }, { status: 400 })
  }

  const plan = await getSellerPlanForSlug(slug)
  if (!plan || !MCP_ELIGIBLE_PLANS.includes(plan as Plan)) {
    return NextResponse.json({ error: 'AI stylist search is not enabled for this store.', code: 'NOT_ELIGIBLE' }, { status: 402 })
  }

  const sellerId = await getSellerIdForSlug(slug)
  if (!sellerId) return NextResponse.json({ error: 'Store not found' }, { status: 404 })

  const admin = createAdminClient()
  const { data: withinQuota } = await admin.rpc('deduct_ai_reply', { p_seller_id: sellerId })
  if (!withinQuota) {
    return NextResponse.json({ error: 'This store has hit its AI reply limit for the month.', code: 'NO_AI_QUOTA' }, { status: 429 })
  }

  const openaiKey = process.env.OPENAI_API_KEY
  if (!openaiKey) {
    // No key configured — fall back to using the raw query as a keyword search.
    const results = await searchProducts(slug, { query })
    return NextResponse.json({ results })
  }

  const parsePrompt = `A shopper typed this into a fashion store's search box: "${query}"

Extract search parameters as JSON. Fields:
- "query": 1-3 keywords for garment type/style (e.g. "maxi dress"), or "" if none
- "occasion": one of beach, wedding, office, date, travel, winter, casual — or omit if none fits
- "max_price": a number in INR if the shopper mentioned a budget, else omit

Respond with ONLY valid JSON, no other text.`

  let parsedArgs: { query?: string; occasion?: string; max_price?: number } = { query }
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${openaiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: parsePrompt }],
        max_tokens: 150,
        temperature: 0.2,
        response_format: { type: 'json_object' },
      }),
    })
    if (res.ok) {
      const data = await res.json()
      parsedArgs = JSON.parse(data.choices[0].message.content)
    }
  } catch {
    // Fall back to the raw query on any parse/network failure
  }

  const results = await searchProducts(slug, {
    query: parsedArgs.query ?? '',
    occasion: parsedArgs.occasion,
    max_price: parsedArgs.max_price,
  })

  return NextResponse.json({ results, parsed: parsedArgs })
}
