import { createAdminClient } from '@/lib/supabase/server'
import { US_DEMO_PRODUCTS, US_DEMO_CONFIG } from '@/lib/demo-products'

export interface AgentProduct {
  id: string
  name: string
  slug: string
  category: string | null
  description: string | null
  price: number
  original_price: number | null
  currency: string
  image_url: string
  sizes: string[]
  colors: string[]
  tags: string[]
  product_url: string
}

export interface StoreInfo {
  slug: string
  brand_name: string
  tagline: string | null
  currency: string
  categories: string[]
  instagram_handle: string | null
  whatsapp_number: string | null
  shipping_policy: string
  return_policy: string
}

export interface CheckoutResult {
  checkout_url: string
  order_id: string
  order_preview: {
    product: string
    size: string | null
    quantity: number
    total: string
    currency: string
  }
}

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://wearon.wyberai.com'

export interface RawProduct {
  id: string
  name: string
  slug: string
  category: string | null
  description: string | null
  price_inr: number
  original_price_inr: number | null
  garment_image_url: string
  sizes: string[]
  colors: string[]
  tags: string[]
  stock_by_variant?: Record<string, number>
}

function formatProduct(p: RawProduct, currency: string, storeSlug: string): AgentProduct {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    category: p.category,
    description: p.description,
    price: p.price_inr,
    original_price: p.original_price_inr,
    currency,
    image_url: p.garment_image_url,
    sizes: p.sizes ?? [],
    colors: p.colors ?? [],
    tags: p.tags ?? [],
    product_url: `${BASE_URL}/store/${storeSlug}/product/${p.id}`,
  }
}

export async function getStoreContext(slug: string) {
  if (slug === 'demo') {
    return {
      products: US_DEMO_PRODUCTS,
      config: US_DEMO_CONFIG,
      seller_id: 'demo',
      currency: 'USD',
    }
  }
  const admin = createAdminClient()
  const { data: tenant } = await admin
    .from('tenant_config')
    .select('seller_id, brand_name, tagline, currency, categories, instagram_handle, whatsapp_number')
    .eq('slug', slug)
    .single()
  if (!tenant) return null

  const { data: products } = await admin
    .from('products')
    .select('id, name, slug, description, category, price_inr, original_price_inr, garment_image_url, sizes, colors, tags, stock_by_variant')
    .eq('seller_id', tenant.seller_id)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  return { products: products ?? [], config: tenant, seller_id: tenant.seller_id, currency: tenant.currency ?? 'USD' }
}

// --- Tool: search_products ---
export async function searchProducts(
  storeSlug: string,
  args: { query: string; category?: string; max_price?: number; occasion?: string }
): Promise<AgentProduct[]> {
  const ctx = await getStoreContext(storeSlug)
  if (!ctx) return []

  const { query, category, max_price, occasion } = args
  const q = query.toLowerCase()
  const occ = occasion?.toLowerCase()

  const OCCASION_KEYWORDS: Record<string, string[]> = {
    beach: ['maxi','wrap','floral','linen','cami'],
    wedding: ['maxi','midi','satin','slip','wrap','blazer'],
    office: ['blazer','straight','shirt','trench'],
    date: ['mini','cami','satin','cowl','slip'],
    travel: ['linen','straight','barrel','trench','blazer'],
    winter: ['trench','blazer','puffer','beanie','wool'],
    casual: ['jeans','tank','tee','barrel','shirt'],
  }

  const occasionKeywords = occ
    ? Object.entries(OCCASION_KEYWORDS).find(([k]) => occ.includes(k))?.[1] ?? []
    : []

  return (ctx.products as RawProduct[])
    .filter(p => {
      const nameMatch = p.name.toLowerCase().includes(q) || (p.description?.toLowerCase().includes(q) ?? false)
      const tagMatch = p.tags?.some((t: string) => t.toLowerCase().includes(q)) ?? false
      const catMatch = p.category?.toLowerCase().includes(q) ?? false
      const textMatch = nameMatch || tagMatch || catMatch

      const occasionMatch = occasionKeywords.length === 0 || occasionKeywords.some(kw =>
        p.name.toLowerCase().includes(kw) || (p.description?.toLowerCase().includes(kw) ?? false)
      )

      const catFilter = !category || p.category?.toLowerCase() === category.toLowerCase()
      const priceFilter = !max_price || p.price_inr <= max_price

      return (textMatch || occasionMatch) && catFilter && priceFilter
    })
    .slice(0, 6)
    .map((p: RawProduct) => formatProduct(p, ctx.currency, storeSlug))
}

// --- Tool: get_product ---
export async function getProduct(storeSlug: string, productSlug: string): Promise<AgentProduct | null> {
  const ctx = await getStoreContext(storeSlug)
  if (!ctx) return null
  const p = (ctx.products as RawProduct[]).find(x => x.slug === productSlug || x.id === productSlug)
  return p ? formatProduct(p, ctx.currency, storeSlug) : null
}

// --- Tool: check_size_availability ---
export async function checkSizeAvailability(
  storeSlug: string,
  productSlug: string,
  size: string
): Promise<{ available: boolean; stock: number | null }> {
  const ctx = await getStoreContext(storeSlug)
  if (!ctx) return { available: false, stock: null }

  const p = (ctx.products as RawProduct[]).find(x => x.slug === productSlug || x.id === productSlug)
  if (!p) return { available: false, stock: null }

  if (!p.sizes || p.sizes.length === 0) {
    return { available: true, stock: null }
  }

  const sizeExists = p.sizes.some((s: string) => s.toLowerCase() === size.toLowerCase())
  const stockByVariant = (p.stock_by_variant ?? {}) as Record<string, number>
  const stock = stockByVariant[size] ?? null

  return {
    available: sizeExists && (stock === null || stock > 0),
    stock,
  }
}

// --- Tool: get_store_info ---
export async function getStoreInfo(storeSlug: string): Promise<StoreInfo | null> {
  if (storeSlug === 'demo') {
    return {
      slug: 'demo',
      brand_name: US_DEMO_CONFIG.brand_name,
      tagline: US_DEMO_CONFIG.tagline,
      currency: US_DEMO_CONFIG.currency,
      categories: US_DEMO_CONFIG.categories,
      instagram_handle: US_DEMO_CONFIG.instagram_handle,
      whatsapp_number: US_DEMO_CONFIG.whatsapp_number,
      shipping_policy: 'Free shipping on orders over $75. Standard delivery 5–7 business days.',
      return_policy: '30-day returns. Items must be unworn with tags attached.',
    }
  }
  const admin = createAdminClient()
  const { data } = await admin
    .from('tenant_config')
    .select('slug, brand_name, tagline, currency, categories, instagram_handle, whatsapp_number')
    .eq('slug', storeSlug)
    .single()
  if (!data) return null
  return {
    slug: data.slug,
    brand_name: data.brand_name,
    tagline: data.tagline,
    currency: data.currency ?? 'USD',
    categories: data.categories ?? [],
    instagram_handle: data.instagram_handle,
    whatsapp_number: data.whatsapp_number,
    shipping_policy: 'Contact the seller for shipping details.',
    return_policy: 'Contact the seller for return policy.',
  }
}

// --- Tool: create_checkout ---
// For the demo store this returns a placeholder URL since there's no real payment configured.
// For real stores it records a pending order and returns a checkout URL.
export async function createCheckout(
  storeSlug: string,
  args: {
    product_slug: string
    size?: string
    quantity: number
    buyer_email?: string
  }
): Promise<CheckoutResult | { error: string }> {
  const ctx = await getStoreContext(storeSlug)
  if (!ctx) return { error: 'Store not found' }

  const p = (ctx.products as RawProduct[]).find(x => x.slug === args.product_slug || x.id === args.product_slug)
  if (!p) return { error: 'Product not found' }

  const total = p.price_inr * args.quantity
  const currencySymbol = ctx.currency === 'USD' ? '$' : '₹'
  const orderId = crypto.randomUUID()

  if (storeSlug === 'demo') {
    return {
      checkout_url: `${BASE_URL}/store/demo/product/${p.id}`,
      order_id: orderId,
      order_preview: {
        product: p.name,
        size: args.size ?? null,
        quantity: args.quantity,
        total: `${currencySymbol}${total.toFixed(2)}`,
        currency: ctx.currency,
      },
    }
  }

  const admin = createAdminClient()
  const orderItem = {
    product_id: p.id,
    name: p.name,
    quantity: args.quantity,
    price_inr: p.price_inr,
    ...(args.size ? { size: args.size } : {}),
  }

  await admin.from('orders').insert({
    id: orderId,
    seller_id: ctx.seller_id,
    status: 'pending',
    items: [orderItem],
    total_inr: total,
    payment_method: 'agent',
    whatsapp_confirmed: false,
    source: 'mcp',
    buyer_notes: args.buyer_email ? JSON.stringify({ buyer_email: args.buyer_email }) : null,
  })

  return {
    checkout_url: `${BASE_URL}/store/${storeSlug}/checkout/${orderId}`,
    order_id: orderId,
    order_preview: {
      product: p.name,
      size: args.size ?? null,
      quantity: args.quantity,
      total: `${currencySymbol}${total.toFixed(2)}`,
      currency: ctx.currency,
    },
  }
}

// --- Tool: get_order_status ---
export async function getOrderStatus(
  storeSlug: string,
  orderId: string
): Promise<{ status: string; items: unknown[]; tracking_number: string | null } | { error: string }> {
  if (storeSlug === 'demo') return { error: 'Order tracking not available for the demo store.' }

  const admin = createAdminClient()
  const { data: tenant } = await admin.from('tenant_config').select('seller_id').eq('slug', storeSlug).single()
  if (!tenant) return { error: 'Store not found' }

  const { data: order } = await admin
    .from('orders')
    .select('id, status, items, buyer_notes')
    .eq('id', orderId)
    .eq('seller_id', tenant.seller_id)
    .single()

  if (!order) return { error: 'Order not found' }

  return {
    status: order.status,
    items: order.items,
    tracking_number: null,
  }
}
