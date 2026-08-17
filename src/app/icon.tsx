import { ImageResponse } from 'next/og'
import { BRAND } from '@/lib/brand'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

// Same boutique-awning path as BrandLogo.tsx, shape duplicated here (not
// imported) since this route needs raw SVG markup for ImageResponse's
// Satori renderer, which can't consume a React component that returns a
// plain <svg> — but colors come from lib/brand.ts so they can't drift.
export default function Icon() {
  return new ImageResponse(
    (
      <svg width={32} height={32} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M 20 35 A 10 10 0 0 0 40 35 A 10 10 0 0 0 60 35 A 10 10 0 0 0 80 35 L 80 20 Q 80 15 75 15 L 25 15 Q 20 15 20 20 Z"
          fill={BRAND.ink}
        />
        <rect x="22" y="48" width="14" height="27" rx="6" fill={BRAND.ink} />
        <rect x="64" y="48" width="14" height="27" rx="6" fill={BRAND.ink} />
        <path d="M 42 75 L 42 58 A 8 8 0 0 1 58 58 L 58 75 Z" fill={BRAND.ink} />
        <path d="M 84 10 L 86.26 15.74 L 92 18 L 86.26 20.26 L 84 26 L 81.74 20.26 L 76 18 L 81.74 15.74 Z" fill={BRAND.accent} />
      </svg>
    ),
    { ...size }
  )
}
