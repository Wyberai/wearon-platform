import { createAdminClient } from '@/lib/supabase/server'

// Known AI-agent/crawler user-agent substrings — used to distinguish real
// agent traffic hitting openapi.json/feed.json from ordinary browser/health-check
// requests, which have no other signal to filter on (unlike /mcp, which is
// only ever called by an agent client to begin with).
const AGENT_UA_PATTERNS = [
  'ChatGPT-User', 'GPTBot', 'OAI-SearchBot',
  'PerplexityBot', 'Perplexity-User',
  'ClaudeBot', 'Claude-User', 'anthropic-ai',
  'Google-Extended',
]

export function detectAgentUA(userAgent: string | null): string | null {
  if (!userAgent) return null
  return AGENT_UA_PATTERNS.find(p => userAgent.includes(p)) ?? null
}

export async function getSellerIdForSlug(slug: string): Promise<string | null> {
  const admin = createAdminClient()
  const { data } = await admin.from('tenant_config').select('seller_id').eq('slug', slug).single()
  return data?.seller_id ?? null
}

export async function logAgentEndpointHit(sellerId: string, endpoint: 'openapi' | 'feed', userAgent: string | null) {
  const agent = detectAgentUA(userAgent)
  if (!agent) return
  const admin = createAdminClient()
  await admin.from('agent_endpoint_hits').insert({ seller_id: sellerId, endpoint, user_agent: agent }).then(() => {}, () => {})
}

export async function logAgentQuery(sellerId: string, tool: string, queryText: string | null, resultCount: number) {
  const admin = createAdminClient()
  await admin.from('agent_queries').insert({
    seller_id: sellerId,
    source: 'mcp',
    tool,
    query_text: queryText,
    result_count: resultCount,
  }).then(() => {}, () => {})
}
