import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/server'
import type { Product, TenantConfig } from '@/lib/types'

export default async function StorePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const admin = createAdminClient()

  const [configResult, productsResult] = await Promise.all([
    admin.from('tenant_config').select('*').eq('slug', slug).single() as Promise<{ data: TenantConfig | null, error: unknown }>,
    admin.from('products').select('*, product_images(*)').eq('is_active', true).order('created_at', { ascending: false }),
  ])

  // Use demo data if no config (or slug is 'demo')
  const isDemoStore = slug === 'demo' || !configResult.data
  const config = configResult.data
  if (!config && slug !== 'demo') notFound()

  const products: Product[] = isDemoStore ? getDemoProducts() : (productsResult.data as Product[] ?? [])
  const categories: string[] = config?.categories ?? ['Kurtas', 'Sarees', 'Lehengas', 'Western', 'Accessories']

  return (
    <div className="max-w-md mx-auto px-4 pb-8">
      {/* Search bar */}
      <div className="py-4">
        <div className="bg-gray-100 rounded-xl px-4 py-2.5 flex items-center gap-2 text-gray-400 text-sm">
          <span>🔍</span>
          <span>Search products...</span>
        </div>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-4">
        <button style={{ backgroundColor: 'var(--primary)', color: 'white' }} className="px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0">
          All
        </button>
        {categories.map(cat => (
          <button key={cat} className="px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
            {cat}
          </button>
        ))}
      </div>

      {/* Products grid */}
      {products.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-4">👗</div>
          <p>No products yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {products.map(product => (
            <Link key={product.id} href={`/store/${slug}/try/${product.id}`} className="group">
              <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="aspect-square bg-gray-50 relative overflow-hidden">
                  <img
                    src={product.garment_image_url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.original_price_inr && product.original_price_inr > product.price_inr && (
                    <div style={{ backgroundColor: 'var(--primary)' }} className="absolute top-2 left-2 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                      {Math.round((1 - product.price_inr / product.original_price_inr) * 100)}% OFF
                    </div>
                  )}
                  <div style={{ backgroundColor: 'var(--primary)' }} className="absolute bottom-2 right-2 text-white text-xs font-medium px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    Try On →
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span style={{ color: 'var(--primary)' }} className="font-bold text-sm">₹{product.price_inr.toLocaleString('en-IN')}</span>
                    {product.original_price_inr && (
                      <span className="text-gray-400 text-xs line-through">₹{product.original_price_inr.toLocaleString('en-IN')}</span>
                    )}
                  </div>
                  {product.sizes && product.sizes.length > 0 && (
                    <p className="text-xs text-gray-400 mt-1">{product.sizes.slice(0, 3).join(' · ')}{product.sizes.length > 3 ? ' +more' : ''}</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function getDemoProducts(): Product[] {
  return [
    { id: 'p1', seller_id: 'demo', name: 'Floral Cotton Kurti', description: 'Light and breezy', category: 'Kurtas', price_inr: 899, original_price_inr: 1499, garment_image_url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&h=400&fit=crop', garment_preprocessed_url: null, slug: 'floral-kurti', is_active: true, sizes: ['S', 'M', 'L', 'XL'], colors: [], tags: [], created_at: '' },
    { id: 'p2', seller_id: 'demo', name: 'Embroidered Anarkali', description: 'For special occasions', category: 'Kurtas', price_inr: 2499, original_price_inr: 3999, garment_image_url: 'https://images.unsplash.com/photo-1617627143233-b27e68dda5df?w=400&h=400&fit=crop', garment_preprocessed_url: null, slug: 'anarkali', is_active: true, sizes: ['S', 'M', 'L'], colors: [], tags: [], created_at: '' },
    { id: 'p3', seller_id: 'demo', name: 'Silk Saree', description: 'Premium quality', category: 'Sarees', price_inr: 4999, original_price_inr: null, garment_image_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=400&fit=crop', garment_preprocessed_url: null, slug: 'silk-saree', is_active: true, sizes: ['Free Size'], colors: [], tags: [], created_at: '' },
    { id: 'p4', seller_id: 'demo', name: 'Casual Palazzo Set', description: 'Everyday comfort', category: 'Western', price_inr: 1299, original_price_inr: 1799, garment_image_url: 'https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=400&h=400&fit=crop', garment_preprocessed_url: null, slug: 'palazzo', is_active: true, sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: [], tags: [], created_at: '' },
  ]
}
