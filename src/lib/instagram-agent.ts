// Instagram-specific piece of the social agent: connection + send logic.
// Reply generation, escalation/auto-reply rules, and seller context all live
// in the channel-agnostic src/lib/social-agent.ts, shared with Messenger and
// WhatsApp — re-exported here so existing imports don't need to change.
import { buildSellerContext as buildSharedContext, generateReply, isEscalation, shouldAutoReply } from '@/lib/social-agent'

export { isEscalation, shouldAutoReply }

export async function buildSellerContext(sellerId: string) {
  return buildSharedContext(sellerId, 'instagram')
}

export async function generateDMReply(
  message: string,
  ctx: Awaited<ReturnType<typeof buildSharedContext>>,
  conversationHistory: { role: 'user' | 'assistant'; content: string }[]
): Promise<string> {
  return generateReply(message, ctx, conversationHistory, 'instagram')
}

export async function generateMessengerReply(
  message: string,
  ctx: Awaited<ReturnType<typeof buildSharedContext>>,
  conversationHistory: { role: 'user' | 'assistant'; content: string }[]
): Promise<string> {
  return generateReply(message, ctx, conversationHistory, 'messenger')
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

// Facebook Messenger rides the same connected Page (pages_messaging scope is
// already requested during the Instagram connect flow), but sends go through
// the Page ID, not the IG business account ID, and recipients are PSIDs.
export async function sendMessengerMessage(
  pageId: string,
  recipientPsid: string,
  text: string,
  pageAccessToken: string
): Promise<void> {
  const res = await fetch(
    `https://graph.facebook.com/v18.0/${pageId}/messages`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipient: { id: recipientPsid },
        message: { text },
        messaging_type: 'RESPONSE',
        access_token: pageAccessToken,
      }),
    }
  )

  if (!res.ok) {
    const err = await res.json()
    throw new Error(`Messenger send failed: ${JSON.stringify(err)}`)
  }
}
