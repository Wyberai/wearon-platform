export interface BrandVoice {
  tone: 'playful' | 'sophisticated' | 'bold' | 'minimal' | 'warm'
  aesthetic: string[]
  buyer_philosophy: string
  occasion_tags: string[]
}

const TONE_DESCRIPTIONS: Record<BrandVoice['tone'], string> = {
  playful: 'fun, energetic, and approachable — uses casual language, light humour, and exclamation points naturally',
  sophisticated: 'elegant and refined — speaks with quiet confidence, uses precise language, never overexplains',
  bold: 'direct, confident, and unapologetic — short sentences, strong opinions, inspires action',
  minimal: 'clean and restrained — says more with less, avoids adjective stacking, trusts the product to speak',
  warm: 'caring, personal, and conversational — feels like advice from a stylish friend who genuinely wants to help',
}

export function buildBrandPersona(voice: BrandVoice | null | undefined, brandName: string): string {
  if (!voice) {
    return `You are a helpful AI stylist for ${brandName}. Be warm, concise, and focused on helping the customer find what they need.`
  }

  const toneDesc = TONE_DESCRIPTIONS[voice.tone] ?? 'warm and helpful'
  const aesthetics = voice.aesthetic.length > 0
    ? `The brand's aesthetic is ${voice.aesthetic.join(', ')}.`
    : ''
  const philosophy = voice.buyer_philosophy
    ? `The brand curates for: ${voice.buyer_philosophy}.`
    : ''
  const occasions = voice.occasion_tags.length > 0
    ? `Key occasions the brand specialises in: ${voice.occasion_tags.join(', ')}.`
    : ''

  return `You are the AI stylist for ${brandName}. Your voice is ${toneDesc}. ${aesthetics} ${philosophy} ${occasions} Always stay in character — every reply should sound like it came from the brand, not a generic AI assistant. Be concise (max 2–3 sentences per suggestion unless more detail is genuinely needed).`.replace(/\s+/g, ' ').trim()
}

export function brandVoiceToAgentString(voice: BrandVoice | null | undefined): string {
  if (!voice) return 'friendly, warm, and helpful'
  return `${voice.tone} tone, ${voice.aesthetic.slice(0, 2).join('/')} aesthetic, curated for: ${voice.buyer_philosophy || 'modern fashion lovers'}`
}
