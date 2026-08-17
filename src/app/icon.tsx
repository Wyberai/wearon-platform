import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

// Generated from the same hand-authored boutique-awning path as
// BrandLogo.tsx — duplicated here (not imported) since this route needs
// raw SVG markup for ImageResponse's Satori renderer, which can't consume
// a React component that returns a plain <svg>.
export default function Icon() {
  return new ImageResponse(
    (
      <svg width={32} height={32} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M 20 35 A 10 10 0 0 0 40 35 A 10 10 0 0 0 60 35 A 10 10 0 0 0 80 35 L 80 20 Q 80 15 75 15 L 25 15 Q 20 15 20 20 Z"
          fill="#111010"
        />
        <rect x="22" y="48" width="14" height="27" rx="6" fill="#111010" />
        <rect x="64" y="48" width="14" height="27" rx="6" fill="#111010" />
        <path d="M 42 75 L 42 58 A 8 8 0 0 1 58 58 L 58 75 Z" fill="#111010" />
        <circle cx="52" cy="66" r="3" fill="#A6134A" />
      </svg>
    ),
    { ...size }
  )
}
