# Instastarz brand kit — canonical source

**Colors, and the mark's path data, live in one place: `src/lib/brand.ts` (`BRAND.ink`, `BRAND.accent`, `BRAND.gold`, `brandMarkSvg()`).**
Every consumer below reads from it — don't hand-pick colors or redraw the mark elsewhere.

## Consumers of the mark
- `src/components/BrandLogo.tsx` — React component, used in the site header/nav.
- `src/app/icon.tsx` — Next.js dynamic favicon (Satori can't consume a React component, so the shape is duplicated here, but colors import `BRAND`).
- `public/icon.svg`, `public/icon-192.png`, `public/icon-512.png` — OG/social-share image, JSON-LD `logo`, PWA manifest icons. Regenerate PNGs from `icon.svg` with sharp after any mark change:
  ```
  node -e "const s=require('sharp');const fs=require('fs');s(fs.readFileSync('public/icon.svg')).resize(512,512).png().toFile('public/icon-512.png')"
  ```
- `public/brand/social/profile-master.svg` / `profile-1024.png` — source for Facebook/Instagram profile photos (square, generous padding since platforms circle-crop it).

## Design note
The doorway is a **plain arch, no handle dot** — an earlier version had a small accent-colored dot centered in the arch that read badly at small sizes. The accent color now lives in a small sparkle beside the awning instead (also a nod to "Instastarz").

## Archived / not in use
`logo-concept-*.png` in this folder are early AI-generated explorations, superseded by the hand-authored mark above. Kept for reference only — do not pull from them for new assets.
