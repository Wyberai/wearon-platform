'use client'

import { useEffect, useRef, useState } from 'react'

// TAANA's signature AI mechanic. Instead of (or alongside) a standard
// description, the PDP shows a short AI-generated provenance story — 3-4
// sentences on the technique, the region, and what makes that particular
// weave distinctive — composed live from the product's technique/region
// tags via /api/taana/weavers-note (a small streaming route modeled on
// src/app/api/style-ai/route.ts: same OpenAI chat-completion + ReadableStream
// pattern, swapped to a heritage-textile system prompt instead of an
// outfit-picks one).
//
// The section must never be blank. `text` starts populated with a real,
// hand-written craft story built locally from the same tags (see
// buildFallbackNote below) — so it reads correctly on first paint, before
// any network round-trip — and is only replaced once live streamed content
// actually starts arriving. If OpenAI is unreachable, rate-limited, or the
// route 500s, the fallback simply stays on screen; nothing ever collapses
// to an empty panel or a spinner with no story behind it.

export interface WeaversNoteProduct {
  name: string
  category: string
  technique?: string
  region?: string
  fabric?: string
}

// Small hand-written knowledge base keyed by a recognizable substring of the
// technique name — used both as the instant fallback and as what ships if
// the AI call never resolves. Deliberately specific, not generic filler.
const TECHNIQUE_NOTES: Array<{ match: RegExp; note: (p: WeaversNoteProduct) => string }> = [
  { match: /banarasi/i, note: p => `Banarasi weaving is a Varanasi craft that predates the Mughal court patronage that later made it famous, with zari brocade laid in by hand one weft pick at a time on a pit loom. A single ${p.name.toLowerCase()} can take a master weaver and their assistant several weeks to finish, depending on how dense the brocade repeat runs. What sets it apart from a printed imitation is the way the metallic thread sits slightly proud of the silk ground — you can feel the pattern under your fingertips, not just see it. That tactile brocade, and the labor behind it, is what the region's weavers still stake their name on.` },
  { match: /kanjivaram/i, note: p => `Kanjivaram silk is woven in and around Kanchipuram using a technique called korvai, where the body and the border are woven separately, on the same loom, then interlocked thread by thread so the join never comes apart, even after decades of wear. The mulberry silk used is heavier and more tightly twisted than most other Indian silks, which is why a genuine Kanjivaram piece has real weight and structure rather than a soft drape. Zari from the same family of Kanchipuram craftsmen typically finishes the border and pallu. It's a technique built for pieces meant to be worn for a lifetime, then handed down.` },
  { match: /ikat|bandha/i, note: p => `Ikat is a resist-dye technique where the yarn — not the finished cloth — is tied and dyed in sections before it ever reaches the loom, so the weaver has to align warp and weft with real precision for the pattern to resolve correctly. In Odisha this local variant is called Bandha; a related tradition in Telangana's Pochampally is woven the same way with its own motif vocabulary. Because the pattern lives in the dyed yarn itself, both faces of the ${p.name.toLowerCase()} show the same design — a signature that machine printing can't fake. The slightly soft-edged, almost blurred motif line is the tell of genuine hand-tied ikat.` },
  { match: /chanderi/i, note: p => `Chanderi is woven on traditional pit looms in the town of the same name in Madhya Pradesh, using a fine blend of silk and cotton yarn that gives the fabric its signature sheer, glossy hand. Weavers there have kept the same booti (small motif) techniques for generations, worked in with a supplementary thread rather than printed on afterward. The result is a fabric light enough to wear through an Indian summer but with enough structure to hold a drape or a tailored cut. It's this rare in-between quality — sheer but not flimsy — that Chanderi is prized for.` },
  { match: /maheshwari/i, note: p => `Maheshwari weaving traces back to a fabric first designed for the royal court of Maheshwar on the banks of the Narmada, and its weavers still use the same reversible weave today, so there is technically no "wrong side" to the cloth. The distinctive checks and stripes are set up in the warp before weaving even begins, requiring the loom to be threaded with real precision. It's woven in a silk-cotton blend that keeps it light against the skin while still holding its structure through a full day's wear. Few handloom techniques manage both comfort and formality quite this well.` },
  { match: /jamdani/i, note: p => `Jamdani is widely considered one of the most technically demanding handloom techniques still practiced today — its motifs are inlaid directly into the weave using small bamboo sticks to place extra weft threads by hand, discontinuously, rather than running them the full width of the fabric. It's a technique fine enough that Mughal-era Jamdani was once reserved for royal courts, and Shantipur's weavers, where this piece comes from, still work it the same painstaking way. Because each motif is placed individually, no two Jamdani pieces are ever woven quite the same. That is, in the truest sense, a handmade original.` },
  { match: /bagh/i, note: p => `Bagh block printing is named for the small town in Madhya Pradesh where it's practiced, and specifically for the river that runs through it — its mineral-rich water is what fixes the natural indigo and alizarin (rust) dyes into the cloth. Each motif is carved into a wooden block by hand, then stamped onto the fabric one repeat at a time, requiring real precision to keep the pattern aligned across a full length of cloth. The deep, slightly uneven saturation you can see in the print is the signature of a hand-stamped repeat, not a machine-printed one. It's a technique tied as much to the specific waters of Bagh as to the hands doing the printing.` },
  { match: /kota/i, note: p => `Kota Doria is woven in and around Kaithoon, Rajasthan, in a technique that alternates cotton and silk yarn in the weave to create its signature khat — the small, square checks visible when you hold the fabric to the light. That alternating twist is what gives Kota Doria its characteristic sheer, airy hand, cool enough to wear through a Rajasthani summer. It's woven on a pit loom by families who have specialized in this one technique for generations. The transparency is the point: this is a fabric meant to be seen through, not just worn.` },
]

function genericFallback(p: WeaversNoteProduct): string {
  const technique = p.technique ?? 'this technique'
  const region = p.region ? ` from ${p.region}` : ''
  return `This ${p.category.toLowerCase().replace(/s$/, '')} is handwoven using ${technique}${region}, a technique passed down through generations of weavers rather than replicated by machine. Every length of cloth carries small, deliberate irregularities — a slightly uneven pick here, a hand-set motif there — that mark it as the work of a specific loom and a specific pair of hands. ${p.fabric ? `Woven in ${p.fabric.toLowerCase()}, ` : ''}it's built to be worn for years, not a single season. That's the quiet promise behind every TAANA piece: a name behind the thread.`
}

function buildFallbackNote(p: WeaversNoteProduct): string {
  if (p.technique) {
    const hit = TECHNIQUE_NOTES.find(t => t.match.test(p.technique!))
    if (hit) return hit.note(p)
  }
  return genericFallback(p)
}

export function TaanaWeaversNote({ product }: { product: WeaversNoteProduct }) {
  const [text, setText] = useState(() => buildFallbackNote(product))
  const [loading, setLoading] = useState(true)
  const [live, setLive] = useState(false)
  const requestKey = `${product.name}|${product.technique}|${product.region}`
  const lastKeyRef = useRef(requestKey)

  useEffect(() => {
    lastKeyRef.current = requestKey
    setText(buildFallbackNote(product))
    setLive(false)
    setLoading(true)
    let cancelled = false

    async function run() {
      try {
        const res = await fetch('/api/taana/weavers-note', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: product.name,
            category: product.category,
            technique: product.technique,
            region: product.region,
            fabric: product.fabric,
          }),
        })
        if (!res.ok || !res.body) throw new Error('weavers-note request failed')

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let acc = ''
        let first = true
        for (;;) {
          const { done, value } = await reader.read()
          if (done) break
          if (cancelled) return
          acc += decoder.decode(value, { stream: true })
          if (!acc.trim()) continue
          if (first) { setLive(true); first = false }
          setText(acc)
        }
      } catch {
        // Fallback story (already showing) simply stays on screen.
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    run()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestKey])

  return (
    <section className="rounded-2xl border p-6 md:p-8" style={{ borderColor: 'var(--ta-line)', background: 'var(--ta-card)' }}>
      <div className="flex items-center gap-2.5 mb-4">
        <span aria-hidden style={{ color: 'var(--ta-gold)', fontSize: 18 }}>✻</span>
        <p className="text-[11px] tracking-[0.22em] uppercase font-medium" style={{ color: 'var(--ta-gold)' }}>The Weaver&apos;s Note</p>
        {loading && !live && (
          <span className="text-[10px] tracking-wide" style={{ color: 'var(--ta-ink-dim)' }}>composing…</span>
        )}
      </div>
      {(product.technique || product.region) && (
        <p className="text-xs mb-4" style={{ color: 'var(--ta-ink-dim)' }}>
          {product.technique}{product.technique && product.region ? ' · ' : ''}{product.region}
        </p>
      )}
      <p className="text-sm leading-relaxed" style={{ color: 'var(--ta-ink-muted)', fontFamily: 'var(--ta-sans)' }}>
        {text}
      </p>
    </section>
  )
}
