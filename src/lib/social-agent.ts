import { createAdminClient } from '@/lib/supabase/server'
import { sendPushToSeller } from '@/lib/push/fcm'

// Channel-agnostic core shared by Instagram DMs, Facebook Messenger, and
// WhatsApp — each channel keeps its own connection/send logic (different
// APIs, different auth), but reply generation and reply-mode logic is the
// same everywhere, so it lives here once instead of being copy-pasted.
export type Channel = 'instagram' | 'messenger' | 'whatsapp'

const CHANNEL_LABEL: Record<Channel, string> = {
  instagram: 'Instagram DM',
  messenger: 'Facebook Messenger message',
  whatsapp: 'WhatsApp message',
}

// Messenger rides the same connected Facebook Page as Instagram, so it
// reuses the Instagram agent config rather than needing its own row.
const AGENT_CONFIG_TABLE: Record<Channel, string> = {
  instagram: 'instagram_agent_config',
  messenger: 'instagram_agent_config',
  whatsapp: 'whatsapp_agent_config',
}

interface CatalogueProduct {
  name: string
  description: string | null
  price_inr: number
  category: string | null
  sizes: string[] | null
  colors: string[] | null
  is_active: boolean
}

export interface AgentConfig {
  mode: string
  brand_voice: string
  auto_keywords: string[]
  escalation_keywords: string[]
}

interface RecentOrder {
  status: string
  total_inr: number
  created_at: string
  items: Array<{ name: string; quantity: number }>
}

export interface SellerContext {
  sellerId: string
  brandName: string
  whatsappNumber: string | null
  faqPolicy: string | null
  products: CatalogueProduct[]
  agentConfig: AgentConfig
  recentOrders: RecentOrder[]
}

const DEFAULT_AGENT_CONFIG: AgentConfig = {
  mode: 'suggest',
  brand_voice: 'friendly, warm, and helpful',
  auto_keywords: ['price', 'cost', 'size', 'available', 'order', 'buy', 'cod', 'deliver'],
  escalation_keywords: ['refund', 'cancel', 'complaint', 'damaged'],
}

// buyerPhone lets the agent look up the buyer's own order history to answer
// "where's my order?" — only available on WhatsApp today, since that's the
// only channel where the buyer's phone number is the identifier itself.
// Instagram/Messenger senders aren't reliably linked to a phone number.
export async function buildSellerContext(sellerId: string, channel: Channel, buyerPhone?: string): Promise<SellerContext> {
  const admin = createAdminClient()
  const configTable = AGENT_CONFIG_TABLE[channel]

  const [configRes, productsRes, agentRes, ordersRes] = await Promise.all([
    admin.from('tenant_config').select('brand_name, whatsapp_number, faq_policy').eq('seller_id', sellerId).single(),
    admin.from('products').select('name, description, price_inr, category, sizes, colors, is_active').eq('seller_id', sellerId).eq('is_active', true).limit(50),
    admin.from(configTable).select('*').eq('seller_id', sellerId).single(),
    buyerPhone
      ? admin.from('orders').select('status, total_inr, created_at, items').eq('seller_id', sellerId).eq('buyer_phone', buyerPhone).order('created_at', { ascending: false }).limit(5)
      : Promise.resolve({ data: [] }),
  ])

  return {
    sellerId,
    brandName: configRes.data?.brand_name ?? 'Our Boutique',
    whatsappNumber: configRes.data?.whatsapp_number ?? null,
    faqPolicy: configRes.data?.faq_policy ?? null,
    products: productsRes.data ?? [],
    agentConfig: agentRes.data ?? DEFAULT_AGENT_CONFIG,
    recentOrders: ordersRes.data ?? [],
  }
}

// Cheap keyword-based intent tag for analytics — not an extra LLM call.
const SUPPORT_KEYWORDS = ['order status', 'where is my order', 'where\'s my order', 'track', 'tracking', 'delivery', 'delivered', 'return', 'exchange', 'refund', 'cancel', 'complaint', 'damaged', 'wrong item', 'late']

export function classifyIntent(message: string, config: AgentConfig): 'sales' | 'support' | 'other' {
  const lower = message.toLowerCase()
  if (SUPPORT_KEYWORDS.some(kw => lower.includes(kw))) return 'support'
  if (config.auto_keywords.some(kw => lower.includes(kw))) return 'sales'
  return 'other'
}

// Pushes a "new message" alert to the seller's native app — best-effort,
// looks up the tenant slug so the notification can deep-link into the inbox.
export async function notifySellerOfMessage(
  sellerId: string,
  fromName: string,
  preview: string,
  channel: Channel
): Promise<void> {
  const admin = createAdminClient()
  const { data: tenant } = await admin.from('tenant_config').select('slug').eq('seller_id', sellerId).single()
  if (!tenant) return

  const channelLabel = CHANNEL_LABEL[channel].replace(' DM', '').replace(' message', '')
  await sendPushToSeller(
    sellerId,
    `New ${channelLabel} message`,
    `${fromName}: ${preview.slice(0, 80)}`,
    { url: `/admin/${tenant.slug}/inbox` }
  )
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

export async function generateReply(
  message: string,
  ctx: SellerContext,
  conversationHistory: { role: 'user' | 'assistant'; content: string }[],
  channel: Channel
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

  const orderHistory = ctx.recentOrders.length > 0
    ? ctx.recentOrders.map(o =>
        `- Placed ${new Date(o.created_at).toLocaleDateString('en-IN')}, status: ${o.status}, ₹${o.total_inr}: ${o.items.map(i => `${i.name} x${i.quantity}`).join(', ')}`
      ).join('\n')
    : null

  const systemPrompt = `You are the ${CHANNEL_LABEL[channel]} assistant for "${ctx.brandName}", an Indian fashion boutique. Your job is to reply to customer messages in a ${ctx.agentConfig.brand_voice} tone — this includes both sales questions and support questions (order status, returns, delivery issues).

CATALOGUE:
${productCatalogue}
${ctx.faqPolicy ? `\nSTORE POLICY (returns, exchanges, shipping — answer support questions from this):\n${ctx.faqPolicy}\n` : ''}${orderHistory ? `\nTHIS CUSTOMER'S RECENT ORDERS (use this to answer "where's my order" style questions):\n${orderHistory}\n` : ''}
RULES:
- Keep replies short (2-4 sentences max), conversational, and in the same language as the customer (Hindi/English mix is fine)
- For price queries: state the price clearly and add a friendly call to action to order
- For ordering: direct them to WhatsApp${ctx.whatsappNumber ? ` at ${ctx.whatsappNumber}` : ''} for placing orders${channel === 'whatsapp' ? ' — since you are already talking to them on WhatsApp, just help them place the order directly in this chat' : ''}
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
