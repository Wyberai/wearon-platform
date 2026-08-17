/**
 * Preset model photos for seller AI model shots.
 * These are full-body shots in neutral fitted clothing — the try-on model replaces the garment.
 *
 * Store actual photos in Supabase: wearon-assets/presets/{key}.jpg
 * The NEXT_PUBLIC_SUPABASE_URL + /storage/v1/object/public/wearon-assets/presets/{key}.jpg
 */

export interface PresetModel {
  key: string
  label: string
  skinTone: 'fair' | 'medium' | 'wheatish' | 'deep'
  pose: 'standing' | 'walking' | 'posing'
  description: string
}

export const PRESET_MODELS: PresetModel[] = [
  { key: 'fair_standing',    label: 'Fair · Standing',   skinTone: 'fair',     pose: 'standing', description: 'Front-facing, arms relaxed' },
  { key: 'wheatish_standing', label: 'Wheatish · Standing', skinTone: 'wheatish', pose: 'standing', description: 'Classic Indian skin tone, upright' },
  { key: 'medium_standing',  label: 'Medium · Standing', skinTone: 'medium',   pose: 'standing', description: 'Neutral front pose' },
  { key: 'deep_standing',    label: 'Deep · Standing',   skinTone: 'deep',     pose: 'standing', description: 'Rich tone, confident stance' },
  { key: 'fair_posing',      label: 'Fair · Posing',     skinTone: 'fair',     pose: 'posing',   description: '3/4 turn, editorial feel' },
  { key: 'medium_posing',    label: 'Medium · Posing',   skinTone: 'medium',   pose: 'posing',   description: 'Dynamic editorial pose' },
]

export const CREDIT_COSTS = {
  modelShotImage: 5,
  modelShotVideo: 15,
  buyerTryonImage: 3,
  buyerTryonVideo: 10,
} as const

export function presetImageUrl(key: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  return `${base}/storage/v1/object/public/wearon-assets/presets/${key}.jpg`
}
