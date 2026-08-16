/**
 * Per-store MCP (Model Context Protocol) Streamable HTTP server.
 * URL: GET|POST /api/store/{slug}/mcp
 *
 * Each Instastarz boutique gets its own MCP endpoint scoped to its catalog.
 * Claude users can connect this URL to shop directly inside Claude conversations.
 *
 * Protocol: MCP Streamable HTTP (synchronous POST, JSON-RPC 2.0)
 * Docs: https://spec.modelcontextprotocol.io/specification/2025-03-26/basic/transports/
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  searchProducts,
  getProduct,
  checkSizeAvailability,
  getStoreInfo,
  createCheckout,
  getOrderStatus,
} from '@/lib/store-agent-tools'
import { logAgentQuery, getSellerIdForSlug } from '@/lib/agent-tracking'

export const dynamic = 'force-dynamic'

const PROTOCOL_VERSION = '2024-11-05'

const TOOLS = [
  {
    name: 'search_products',
    description: 'Search this store\'s product catalog. Returns up to 6 matching products with prices and direct links.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search term (product name, material, style, or occasion)' },
        category: { type: 'string', description: 'Filter by category (e.g. Dresses, Denim, Tops, Outerwear, Accessories)' },
        max_price: { type: 'number', description: 'Maximum price in the store\'s currency' },
        occasion: { type: 'string', description: 'Occasion context (e.g. beach, wedding, office, date, travel, winter, casual)' },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_product',
    description: 'Get full details for a specific product including description, available sizes, colors, and price.',
    inputSchema: {
      type: 'object',
      properties: {
        product_slug: { type: 'string', description: 'Product slug or ID from search_products results' },
      },
      required: ['product_slug'],
    },
  },
  {
    name: 'check_size_availability',
    description: 'Check if a specific size is available for a product.',
    inputSchema: {
      type: 'object',
      properties: {
        product_slug: { type: 'string', description: 'Product slug or ID' },
        size: { type: 'string', description: 'Size to check (e.g. S, M, L, XL, 28, 30)' },
      },
      required: ['product_slug', 'size'],
    },
  },
  {
    name: 'get_store_info',
    description: 'Get general information about this store: brand name, categories, shipping policy, return policy, and contact details.',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'create_checkout',
    description: 'Create a checkout for a product. Returns a payment/checkout URL that the buyer can open to complete purchase.',
    inputSchema: {
      type: 'object',
      properties: {
        product_slug: { type: 'string', description: 'Product slug or ID to purchase' },
        size: { type: 'string', description: 'Selected size (required if the product has sizes)' },
        quantity: { type: 'number', description: 'Number of items (default 1)', default: 1 },
        buyer_email: { type: 'string', description: 'Buyer\'s email address for order confirmation (optional)' },
      },
      required: ['product_slug'],
    },
  },
  {
    name: 'get_order_status',
    description: 'Check the status of an existing order by order ID.',
    inputSchema: {
      type: 'object',
      properties: {
        order_id: { type: 'string', description: 'Order ID returned by create_checkout' },
      },
      required: ['order_id'],
    },
  },
]

function jsonRpcOk(id: string | number | null, result: unknown) {
  return NextResponse.json({ jsonrpc: '2.0', id, result }, {
    headers: { 'Content-Type': 'application/json' },
  })
}

function jsonRpcError(id: string | number | null, code: number, message: string) {
  return NextResponse.json({ jsonrpc: '2.0', id, error: { code, message } }, {
    headers: { 'Content-Type': 'application/json' },
  })
}

function toolText(content: unknown) {
  return { content: [{ type: 'text', text: JSON.stringify(content, null, 2) }] }
}

function toolError(message: string) {
  return { content: [{ type: 'text', text: message }], isError: true }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  let body: { jsonrpc: string; id?: string | number | null; method: string; params?: unknown }
  try {
    body = await req.json()
  } catch {
    return jsonRpcError(null, -32700, 'Parse error')
  }

  const { id = null, method, params: rpcParams } = body

  switch (method) {
    case 'initialize':
      return jsonRpcOk(id, {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: { tools: {} },
        serverInfo: {
          name: `wearon-${slug}`,
          version: '1.0',
        },
        instructions: `You are a shopping assistant for a Instastarz boutique store (slug: ${slug}). Use search_products to find items, get_product for details, and create_checkout when the user is ready to purchase. Always confirm size availability before creating a checkout.`,
      })

    case 'notifications/initialized':
      // Fire-and-forget from client — no response body needed
      return new NextResponse(null, { status: 204 })

    case 'tools/list':
      return jsonRpcOk(id, { tools: TOOLS })

    case 'tools/call': {
      const p = rpcParams as { name: string; arguments?: Record<string, unknown> }
      const args = p.arguments ?? {}

      // Fire-and-forget agent-traffic logging — every /mcp call is, by definition,
      // from an agent client, so no user-agent filtering is needed here (unlike
      // the static openapi.json/feed.json endpoints).
      const logQuery = (queryText: string | null, resultCount: number) => {
        getSellerIdForSlug(slug).then(sellerId => {
          if (sellerId) void logAgentQuery(sellerId, p.name, queryText, resultCount)
        }).catch(() => {})
      }

      try {
        switch (p.name) {
          case 'search_products': {
            const results = await searchProducts(slug, {
              query: (args.query as string) ?? '',
              category: args.category as string | undefined,
              max_price: args.max_price as number | undefined,
              occasion: args.occasion as string | undefined,
            })
            logQuery((args.query as string) ?? null, results.length)
            if (results.length === 0) {
              return jsonRpcOk(id, toolText({ message: 'No products found matching your search.', results: [] }))
            }
            return jsonRpcOk(id, toolText({ count: results.length, results }))
          }

          case 'get_product': {
            const product = await getProduct(slug, args.product_slug as string)
            logQuery(args.product_slug as string ?? null, product ? 1 : 0)
            if (!product) return jsonRpcOk(id, toolError('Product not found.'))
            return jsonRpcOk(id, toolText(product))
          }

          case 'check_size_availability': {
            const availability = await checkSizeAvailability(slug, args.product_slug as string, args.size as string)
            logQuery(args.product_slug as string ?? null, 1)
            return jsonRpcOk(id, toolText(availability))
          }

          case 'get_store_info': {
            const info = await getStoreInfo(slug)
            logQuery(null, info ? 1 : 0)
            if (!info) return jsonRpcOk(id, toolError('Store not found.'))
            return jsonRpcOk(id, toolText(info))
          }

          case 'create_checkout': {
            const result = await createCheckout(slug, {
              product_slug: args.product_slug as string,
              size: args.size as string | undefined,
              quantity: (args.quantity as number) ?? 1,
              buyer_email: args.buyer_email as string | undefined,
            })
            logQuery(args.product_slug as string ?? null, 'error' in result ? 0 : 1)
            if ('error' in result) return jsonRpcOk(id, toolError(result.error))
            return jsonRpcOk(id, toolText(result))
          }

          case 'get_order_status': {
            const status = await getOrderStatus(slug, args.order_id as string)
            logQuery(args.order_id as string ?? null, 'error' in status ? 0 : 1)
            if ('error' in status) return jsonRpcOk(id, toolError(status.error))
            return jsonRpcOk(id, toolText(status))
          }

          default:
            return jsonRpcError(id, -32601, `Unknown tool: ${p.name}`)
        }
      } catch (err) {
        console.error(`[mcp:${slug}] tool error:`, err)
        return jsonRpcError(id, -32603, 'Internal tool error')
      }
    }

    default:
      return jsonRpcError(id, -32601, `Method not found: ${method}`)
  }
}

// GET endpoint for MCP discovery — returns server info
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  return NextResponse.json({
    name: `Instastarz — ${slug}`,
    description: `AI shopping assistant for the ${slug} boutique. Browse products, check availability, and checkout.`,
    mcp_version: PROTOCOL_VERSION,
    endpoint: `/api/store/${slug}/mcp`,
    tools: TOOLS.map(t => ({ name: t.name, description: t.description })),
  })
}
