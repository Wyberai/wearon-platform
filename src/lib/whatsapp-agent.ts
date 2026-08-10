// WhatsApp-specific piece of the social agent: send logic against Meta's
// WhatsApp Cloud API. Unlike Instagram (per-seller OAuth token), WhatsApp
// uses ONE shared WhatsApp Business Account owned by the platform — every
// seller's phone_number_id lives under it, authenticated with a single
// platform-level system-user token (WHATSAPP_ACCESS_TOKEN), not a per-seller
// token. Reply generation lives in the channel-agnostic src/lib/social-agent.ts.
import { buildSellerContext as buildSharedContext, classifyIntent, generateReply, isEscalation, shouldAutoReply } from '@/lib/social-agent'

export { classifyIntent, isEscalation, shouldAutoReply }

// buyerPhone is the WhatsApp sender's number itself — lets the agent look up
// this buyer's own order history (see src/lib/social-agent.ts).
export async function buildSellerContext(sellerId: string, buyerPhone: string) {
  return buildSharedContext(sellerId, 'whatsapp', buyerPhone)
}

export async function generateWhatsAppReply(
  message: string,
  ctx: Awaited<ReturnType<typeof buildSharedContext>>,
  conversationHistory: { role: 'user' | 'assistant'; content: string }[]
): Promise<string> {
  return generateReply(message, ctx, conversationHistory, 'whatsapp')
}

export async function sendWhatsAppMessage(phoneNumberId: string, toPhone: string, text: string): Promise<void> {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN
  if (!accessToken) throw new Error('WHATSAPP_ACCESS_TOKEN not set')

  const res = await fetch(`https://graph.facebook.com/v18.0/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: toPhone,
      type: 'text',
      text: { body: text },
    }),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(`WhatsApp send failed: ${JSON.stringify(err)}`)
  }
}
