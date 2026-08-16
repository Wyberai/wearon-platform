/**
 * Per-store OpenAPI 3.1 spec for ChatGPT Custom GPT Actions.
 * URL: GET /api/store/{slug}/openapi.json
 *
 * ChatGPT Custom GPT users can add this URL as an "Action" to enable
 * shopping from this boutique directly inside ChatGPT conversations.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSellerIdForSlug, logAgentEndpointHit } from '@/lib/agent-tracking'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://instastarz.in'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  getSellerIdForSlug(slug).then(sellerId => {
    if (sellerId) void logAgentEndpointHit(sellerId, 'openapi', req.headers.get('user-agent'))
  }).catch(() => {})

  const spec = {
    openapi: '3.1.0',
    info: {
      title: `WearOn — ${slug} Store API`,
      description: `Shop the ${slug} boutique. Browse products, check availability, and create checkouts.`,
      version: '1.0.0',
    },
    servers: [{ url: `${BASE_URL}/api/store/${slug}` }],
    paths: {
      '/products': {
        get: {
          operationId: 'searchProducts',
          summary: 'Search the store catalog',
          description: 'Search products by text query. Supports category and price filters.',
          parameters: [
            { name: 'q', in: 'query', required: true, schema: { type: 'string' }, description: 'Search term' },
            { name: 'category', in: 'query', schema: { type: 'string' }, description: 'Filter by category' },
            { name: 'max_price', in: 'query', schema: { type: 'number' }, description: 'Maximum price' },
          ],
          responses: {
            '200': {
              description: 'List of matching products',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      products: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Product' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      [`/mcp`]: {
        post: {
          operationId: 'callTool',
          summary: 'Call a shopping tool (MCP)',
          description: 'Execute a shopping tool via JSON-RPC 2.0. Tools: search_products, get_product, check_size_availability, get_store_info, create_checkout, get_order_status.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    jsonrpc: { type: 'string', enum: ['2.0'] },
                    id: { type: 'string' },
                    method: { type: 'string', enum: ['tools/list', 'tools/call', 'initialize'] },
                    params: { type: 'object' },
                  },
                  required: ['jsonrpc', 'method'],
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'JSON-RPC response',
              content: { 'application/json': { schema: { type: 'object' } } },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        Product: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            slug: { type: 'string' },
            category: { type: 'string', nullable: true },
            description: { type: 'string', nullable: true },
            price: { type: 'number' },
            currency: { type: 'string' },
            image_url: { type: 'string' },
            sizes: { type: 'array', items: { type: 'string' } },
            colors: { type: 'array', items: { type: 'string' } },
            product_url: { type: 'string' },
          },
        },
      },
    },
  }

  return NextResponse.json(spec, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  })
}
