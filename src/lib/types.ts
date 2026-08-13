export interface Profile {
  id: string
  email: string
  plan: 'free' | 'starter' | 'growth' | 'pro' | 'enterprise'
  try_ons_used: number
  try_ons_limit: number
  ai_replies_used: number
  ai_reply_limit: number
  referral_code: string
  whatsapp_number: string | null
  subscription_status: 'active' | 'inactive' | 'cancelled' | 'past_due'
  dodo_subscription_id: string | null
  created_at: string
}

export interface BrandVoice {
  tone: 'playful' | 'sophisticated' | 'bold' | 'minimal' | 'warm'
  aesthetic: string[]
  buyer_philosophy: string
  occasion_tags: string[]
}

export interface TenantConfig {
  seller_id: string
  slug: string
  brand_name: string
  tagline: string | null
  logo_url: string | null
  favicon_url: string | null
  primary_color: string
  secondary_color: string
  accent_color: string
  background_color: string
  font_family: 'poppins' | 'playfair' | 'inter' | 'nunito' | 'raleway' | 'fraunces' | 'bebas' | 'spacegrotesk' | 'cormorant'
  theme_id: string
  dark_mode_default: boolean
  currency: string
  payment_method: 'whatsapp_order' | 'razorpay' | 'dodo' | 'cod' | 'stripe'
  payment_config: Record<string, string>
  whatsapp_number: string | null
  instagram_handle: string | null
  try_on_enabled: boolean
  reviews_enabled: boolean
  wishlist_enabled: boolean
  categories: string[]
  size_guide_url: string | null
  banners: Array<{ image_url: string; link_url?: string; caption?: string }>
  custom_domain: string | null
  play_store_url: string | null
  brand_voice?: BrandVoice | null
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  seller_id: string
  name: string
  description: string | null
  category: string | null
  price_inr: number
  original_price_inr: number | null
  cost_price_inr?: number | null
  garment_image_url: string
  garment_preprocessed_url: string | null
  slug: string
  is_active: boolean
  sizes: string[]
  colors: string[]
  stock_by_variant?: Record<string, number>
  stock_count?: number | null
  tags: string[]
  created_at: string
  product_images?: ProductImage[]
}

export interface ProductImage {
  id: string
  product_id: string
  url: string
  position: number
  is_primary: boolean
}

export interface TryOnResult {
  id: string
  product_id: string
  seller_id: string
  result_image_url: string | null
  hd_result_url: string | null
  status: 'pending' | 'processing' | 'done' | 'failed'
  error_message: string | null
  whatsapp_clicked: boolean
  created_at: string
}

export interface Order {
  id: string
  seller_id: string
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  items: Array<{ product_id: string; name: string; size?: string; color?: string; quantity: number; price_inr: number; cost_price_inr?: number }>
  total_inr: number
  payment_method: string
  razorpay_order_id?: string | null
  razorpay_payment_id?: string | null
  whatsapp_confirmed: boolean
  buyer_name?: string | null
  buyer_phone?: string | null
  size_selected?: string | null
  delivery_address?: string | null
  buyer_notes: string | null
  created_at: string
}

export interface DailyAnalytics {
  date: string
  store_visits: number
  try_ons: number
  whatsapp_clicks: number
  orders_placed: number
  revenue_inr: number
}
