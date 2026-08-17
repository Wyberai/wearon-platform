// Single source of truth for the Instastarz brand mark and core colors.
// BrandLogo.tsx (React) and icon.tsx (Satori/ImageResponse, which can't
// consume a React component) both read colors from here so the mark can't
// silently drift between the two renderers again.

export const BRAND = {
  name: 'Instastarz',
  ink: '#111010',
  accent: '#A6134A',
  gold: '#B8842E',
} as const

// The boutique-awning path data, 100x100 viewBox — shared by BrandLogo.tsx
// and any script/route that needs raw SVG markup instead of a component.
// The doorway is a plain solid arch (no handle dot — an earlier version
// had a small accent dot centered in the arch, which read badly at a
// glance; the accent color now lives in the sparkle beside the awning
// instead, which also nods to the "Instastarz" name).
export function brandMarkSvg(size = 100, ink: string = BRAND.ink, accent: string = BRAND.accent) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M 20 35 A 10 10 0 0 0 40 35 A 10 10 0 0 0 60 35 A 10 10 0 0 0 80 35 L 80 20 Q 80 15 75 15 L 25 15 Q 20 15 20 20 Z" fill="${ink}" />
  <rect x="22" y="48" width="14" height="27" rx="6" fill="${ink}" />
  <rect x="64" y="48" width="14" height="27" rx="6" fill="${ink}" />
  <path d="M 42 75 L 42 58 A 8 8 0 0 1 58 58 L 58 75 Z" fill="${ink}" />
  <path d="M 84 10 L 86.26 15.74 L 92 18 L 86.26 20.26 L 84 26 L 81.74 20.26 L 76 18 L 81.74 15.74 Z" fill="${accent}" />
</svg>`
}
