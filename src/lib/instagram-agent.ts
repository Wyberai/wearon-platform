import { createAdminClient } from '@/lib/supabase/server'

interface Product {
  name: string
  description: string | null
  price_inr: number
  category: string | null
  sizes: string[] | null
  colors: string[] | null
  is_active: boolean
}

interface AgentConfig {
  mode: string
  brand_voice: string
  auto_keywords: string[]
  escalation_keywords: string[]
}

interface SellerContext {
  brandName: string
  whatsappNumber: string | null
  products: Product[]
  agentConfig: AgentConfig
}

export async function buildSellerContext(sellerId: string): Promise<SellerContext> {
  const admin = createAdminClient()

  const [configRes, productsRes, agentRes] = await Promise.all([
    admin.from('tenant_config').select('brand_name, whatsapp_number').eq('seller_id', sellerId).single(),
    admin.from('products').select('name, description, price_inr, category, sizes, colors, is_active').eq('seller_id', sellerId).eq('is_active', true).limit(50),
    admin.from('instagram_agent_config').select('*').eq('seller_id', sellerId).single(),
  ])

  const defaultConfig: AgentConfig = {
    mode: 'suggest',
    brand_voice: 'friendly, warm, and helpful',
    auto_keywords: ['price', 'cost', 'size', 'available', 'order', 'buy', 'cod', 'deliver'],
    escalation_keywords: ['refund', 'cancel', 'complaint', 'damaged'],
  }

  return {
    brandName: configRes.data?.brand_name ?? 'Our Boutique',
    whatsappNumber: configRes.data?.whatsapp_number ?? null,
    products: productsRes.data ?? [],
    agentConfig: agentRes.data ?? defaultConfig,
  }
}

export function shouldAutoReply(message: string, config: AgentConfig): boolean {
  if (config.mode === 'off') return false
  if (config.mode === 'auto') return true
  // suggest mode: auto-reply only if message matches known keywords
  const lower = message.toLowerCase()
  return config.auto_keywords.some(kw => lower.includes(kw))
}

export function isEscalation(message: string, config: AgentConfig): boolean {
  const lower = message.toLowerCase()
  return config.escalation_keywords.some(kw => lower.includes(kw))
}

export async function generateDMReply(
  message: string,
  ctx: SellerContext,
  conversationHistory: { role: 'user' | 'assistant'; content: string }[]
): Promise<string> {
  const openaiKey = process.env.OPENAI_API_KEY
  if (!openaiKey) throw new Error('OPENAI_API_KEY not set')

  const productCatalogue = ctx.products.length > 0
    ? ctx.products.map(p =>
        `- ${p.name}${p.category ? ` (${p.category})` : ''}: ₹${p.price_inr.toLocaleString('en-IN')}` +
        (p.sizes?.length ? `, sizes: ${p.sizes.join('/')}` : '') +
        (p.colors?.length ? `, colors: ${p.colors.join('/')}` : '') +
        (p.description ? ` — ${p.description.slice(0, 80)}` : '')
      ).join('\n')
    : 'No products listed yet.'

  const systemPrompt = `You are the Instagram DM assistant for "${ctx.brandName}", an Indian fashion boutique. Your job is to reply to customer messages in a ${ctx.agentConfig.brand_voice} tone.

CATALOGUE:
${productCatalogue}

RULES:
- Keep replies short (2-4 sentences max), conversational, and in the same language as the customer (Hindi/English mix is fine)
- For price queries: state the price clearly and add "DM us to order!" or similar CTA
- For ordering: direct them to WhatsApp${ctx.whatsappNumber ? ` at ${ctx.whatsappNumber}` : ''} for placing orders
- For size/availability: answer based on catalogue; if unsure, say "DM on WhatsApp for exact stock"
- Never promise delivery timelines you can't guarantee
- Use "ji" occasionally for warmth if customer uses Hindi
- Do NOT mention AI, bots, or automated replies
- Do NOT make up prices or products not in the catalogue`

  const messages = [
    { role: 'system' as const, content: systemPrompt },
    ...conversationHistory.slice(-6),
    { role: 'user' as const, content: message },
  ]

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 200,
      temperature: 0.7,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`OpenAI error: ${err}`)
  }

  const data = await res.json()
  return data.choices[0].message.content.trim()
}

export async function sendInstagramMessage(
  igBusinessAccountId: string,
  recipientIgsid: string,
  text: string,
  pageAccessToken: string
): Promise<void> {
  const res = await fetch(
    `https://graph.facebook.com/v18.0/${igBusinessAccountId}/messages`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipient: { id: recipientIgsid },
        message: { text },
        messaging_type: 'RESPONSE',
        access_token: pageAccessToken,
      }),
    }
  )

  if (!res.ok) {
    const err = await res.json()
    throw new Error(`Instagram send failed: ${JSON.stringify(err)}`)
  }
}
