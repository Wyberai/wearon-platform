export interface SchemaProduct {
  id: string
  name: string
  description: string | null
  category: string | null
  price_inr: number
  original_price_inr: number | null
  garment_image_url: string
  slug: string
  sizes?: string[]
  colors?: string[]
  tags?: string[]
}

export function productToJsonLd(
  product: SchemaProduct,
  opts: { brandName: string; currency: string; baseUrl: string; storeSlug: string }
) {
  const { brandName, currency, baseUrl, storeSlug } = opts
  const inStock = true // extend with real stock when inventory UI lands
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    ...(product.description ? { description: product.description } : {}),
    image: product.garment_image_url,
    url: `${baseUrl}/store/${storeSlug}/product/${product.id}`,
    brand: { '@type': 'Brand', name: brandName },
    ...(product.category ? { category: product.category } : {}),
    offers: {
      '@type': 'Offer',
      price: product.price_inr.toFixed(2),
      priceCurrency: currency,
      availability: inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      url: `${baseUrl}/store/${storeSlug}/product/${product.id}`,
    },
  }
}

export function catalogToMerchantFeed(
  products: SchemaProduct[],
  opts: { brandName: string; currency: string; baseUrl: string; storeSlug: string }
) {
  return {
    version: '1.0',
    updated: new Date().toISOString(),
    store: opts.storeSlug,
    currency: opts.currency,
    items: products.map(p => ({
      id: p.id,
      title: p.name,
      description: p.description ?? '',
      link: `${opts.baseUrl}/store/${opts.storeSlug}/product/${p.id}`,
      image_link: p.garment_image_url,
      price: `${p.price_inr.toFixed(2)} ${opts.currency}`,
      sale_price: p.original_price_inr && p.original_price_inr > p.price_inr
        ? `${p.price_inr.toFixed(2)} ${opts.currency}`
        : undefined,
      brand: opts.brandName,
      condition: 'new',
      availability: 'in_stock',
      ...(p.category ? { google_product_category: p.category } : {}),
      ...(p.sizes?.length ? { sizes: p.sizes } : {}),
      ...(p.colors?.length ? { colors: p.colors } : {}),
    })),
  }
}
