import { NextRequest } from 'next/server'
import OpenAI from 'openai'

// Backs TAANA's "Weaver's Note" PDP mechanic (see
// src/components/taana/TaanaWeaversNote.tsx). Modeled directly on
// src/app/api/style-ai/route.ts's shape: no API key -> stream a graceful
// static demo string char-by-char; API key present -> stream a real OpenAI
// chat completion chunk-by-chunk. Swapped here for a heritage-textile
// system prompt instead of an outfit-picks one, since the mechanic is a
// short provenance/craft story generated from a product's technique and
// region tags, not a style recommendation.
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, category, technique, region, fabric } = body as {
    name?: string
    category?: string
    technique?: string
    region?: string
    fabric?: string
  }

  if (!name || typeof name !== 'string') {
    return new Response('Missing product name', { status: 400 })
  }

  const briefLines = [
    `Piece: ${name}`,
    category ? `Category: ${category}` : null,
    technique ? `Technique: ${technique}` : null,
    region ? `Region: ${region}` : null,
    fabric ? `Fabric: ${fabric}` : null,
  ].filter(Boolean).join('\n')

  const encoder = new TextEncoder()
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    const demoText = `Handwoven using ${technique ?? 'a traditional regional technique'}${region ? ` from ${region}` : ''}, this piece carries the small, deliberate irregularities of a specific loom and a specific pair of hands — the kind of detail no machine repeat can imitate. Weavers in this region have kept the technique largely unchanged for generations, passing it from one household to the next rather than writing it down. ${fabric ? `Woven in ${fabric}, ` : ''}it's built to be worn for years, not a single season. That's the promise behind every TAANA piece: a name behind the thread.`
    const stream = new ReadableStream({
      start(controller) {
        for (const char of demoText) controller.enqueue(encoder.encode(char))
        controller.close()
      },
    })
    return new Response(stream, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-cache' } })
  }

  const client = new OpenAI({ apiKey })
  const openaiStream = await client.chat.completions.create({
    model: 'gpt-4o',
    stream: true,
    max_tokens: 220,
    messages: [
      {
        role: 'system',
        content: `You are the in-house textile historian for TAANA, a quiet-luxury Indian heritage handloom label ("Every thread has a name."). Given a piece's weaving technique, region and fabric, write a short provenance/craft story about it.

Rules:
- Exactly 3-4 sentences, plain prose, no bullet points, no emoji, no markdown formatting, no headings.
- Cover: what the technique actually involves, the region or town it comes from, and one specific detail that makes it recognizably different from a machine-made or printed imitation.
- Tone: editorial, precise, unhurried — like a museum wall label written by someone who deeply respects the craft, not sales copy.
- Never invent a specific weaver's name or a specific date; keep facts general and plausible for the technique and region given.`,
      },
      { role: 'user', content: briefLines },
    ],
  })

  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of openaiStream) {
        const text = chunk.choices[0]?.delta?.content ?? ''
        if (text) controller.enqueue(encoder.encode(text))
      }
      controller.close()
    },
  })

  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-cache' },
  })
}
