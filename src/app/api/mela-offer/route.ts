import { NextRequest } from 'next/server'
import OpenAI from 'openai'

// MELA's signature "Make an Offer" mechanic — a stall-owner haggling voice,
// modeled directly on src/app/api/style-ai/route.ts's pattern (same demo
// fallback when no OPENAI_API_KEY, same streamed-plain-text response shape).
// This route is deliberately a *phrasing generator only* — it never decides
// whether to accept, counter, or decline. That decision (and the hidden
// floor price, ~75-80% of listed price) is computed client-side in
// MelaOfferBox.tsx before this route is ever called, so a bad model response
// can never accidentally sell below floor or invent a different number —
// the route just puts the stall-owner's voice on a decision already made.

type Decision = 'accept' | 'counter' | 'decline-soft' | 'decline-final'

interface OfferRequestBody {
  productName: string
  category?: string
  listedPrice: number
  buyerOffer: number
  decision: Decision
  price: number // the resolved number for this decision: accepted price / counter price / final floor price
  round: 1 | 2
}

function demoLine(body: OfferRequestBody): string {
  const { productName, buyerOffer, decision, price } = body
  switch (decision) {
    case 'accept':
      return `Arre, deal! ₹${price.toLocaleString('en-IN')} for the ${productName} — you drive a hard bargain. Pack it up!`
    case 'counter':
      return `₹${buyerOffer.toLocaleString('en-IN')}? Bhai, cost price hi nikal jayega. Chalo, ₹${price.toLocaleString('en-IN')} final — sabse accha rate, aur kahin nahi milega.`
    case 'decline-soft':
      return `Itna kam mein toh mera thela hi band ho jayega! Best I can do on the ${productName} is ₹${price.toLocaleString('en-IN')} — quality dekho, ekdum sahi rate hai.`
    case 'decline-final':
    default:
      return `Okay okay, akhri baat — ₹${price.toLocaleString('en-IN')} se ek rupaya kam nahi. Le lo, warna agla customer le jayega.`
  }
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Partial<OfferRequestBody>
  const { productName, category, listedPrice, buyerOffer, decision, price, round } = body

  if (!productName || typeof listedPrice !== 'number' || typeof buyerOffer !== 'number' || !decision || typeof price !== 'number') {
    return new Response('Missing or invalid fields', { status: 400 })
  }

  const safeBody: OfferRequestBody = { productName, category, listedPrice, buyerOffer, decision, price, round: round === 2 ? 2 : 1 }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    const text = demoLine(safeBody)
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        for (const char of text) controller.enqueue(encoder.encode(char))
        controller.close()
      },
    })
    return new Response(stream, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-cache' } })
  }

  const client = new OpenAI({ apiKey })

  const persona = `You are a warm, theatrical, street-smart stall-owner at MELA, a loud budget-fashion bazaar in India (Sarojini Nagar / Colaba street-market energy). A customer is haggling with you over the price of one item. You have ALREADY decided the outcome of this round — your only job is to say it out loud, in character.

Voice: confident, playful, a little dramatic, sprinkle in light Hinglish flavour words naturally (arre, bhai/didi, bhaiya, ekdum, sahi rate, last price, pakka) without overdoing it — this is a bazaar, not a caricature. Keep it to 1-2 short punchy sentences. Never mention being an AI, a system, a "floor price", or anything meta about how the decision was made — you're just a person at a stall reacting to an offer.

Rules you must follow exactly:
- Use ONLY the exact rupee amount given to you below as the resolved price — never invent a different number.
- If the decision is "accept": celebrate the deal, confirm the exact resolved price.
- If the decision is "counter": react like the offer is a bit low, propose the exact resolved price as your counter, invite them to meet you there.
- If the decision is "decline-soft": explain kindly that you can't go that low (cite quality/cost lightly), but still state the exact resolved price as what you CAN do.
- If the decision is "decline-final": this is the last word — firm but friendly, state the exact resolved price as final, no more room to move.`

  const userMsg = `Item: ${safeBody.productName}${safeBody.category ? ` (${safeBody.category})` : ''}
Listed price: ₹${safeBody.listedPrice}
Customer's offer this round: ₹${safeBody.buyerOffer}
Round: ${safeBody.round} of 2
Decision already made: ${safeBody.decision}
Resolved price to state: ₹${safeBody.price}

Respond in character, 1-2 sentences, using the resolved price exactly.`

  try {
    const openaiStream = await client.chat.completions.create({
      model: 'gpt-4o',
      stream: true,
      max_tokens: 120,
      messages: [
        { role: 'system', content: persona },
        { role: 'user', content: userMsg },
      ],
    })

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of openaiStream) {
            const text = chunk.choices[0]?.delta?.content ?? ''
            if (text) controller.enqueue(encoder.encode(text))
          }
        } catch {
          controller.enqueue(encoder.encode(demoLine(safeBody)))
        }
        controller.close()
      },
    })

    return new Response(stream, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-cache' } })
  } catch {
    const text = demoLine(safeBody)
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        for (const char of text) controller.enqueue(encoder.encode(char))
        controller.close()
      },
    })
    return new Response(stream, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-cache' } })
  }
}
