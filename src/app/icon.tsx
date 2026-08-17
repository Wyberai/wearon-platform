import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

// Generated from the same hand-authored sparkle path as SparkleLogo.tsx —
// duplicated here (not imported) since this route needs the raw SVG
// markup for ImageResponse's Satori renderer, which can't consume a React
// component that returns a plain <svg>.
export default function Icon() {
  return new ImageResponse(
    (
      <svg width={32} height={32} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M50 4 C 53 30 58 42 50 50 C 58 58 63 68 96 50 C 63 58 58 63 50 96 C 58 63 53 58 50 50 C 42 58 37 63 4 50 C 37 42 42 30 50 4 Z"
          fill="#111010"
        />
        <path
          d="M67 33 C 68.5 40 71 42.5 78 44 C 71 45.5 68.5 48 67 55 C 65.5 48 63 45.5 56 44 C 63 42.5 65.5 40 67 33 Z"
          fill="#A6134A"
        />
      </svg>
    ),
    { ...size }
  )
}
