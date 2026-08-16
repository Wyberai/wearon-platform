'use client'

import { useState } from 'react'
import { TryItOnImg } from './TryItOnShell'

// The signature mechanic: defaults to the seller's reel playing (muted,
// looped, autoplay) instead of a static photo whenever one exists, with an
// explicit Photo/Video toggle so a buyer can always drop back to the still
// image. Falls back to image-only, no toggle, when there's no video.
export function TryItOnVideoStage({ image, video, alt }: { image: string; video?: string | null; alt: string }) {
  const [mode, setMode] = useState<'video' | 'image'>(video ? 'video' : 'image')

  return (
    <div className="relative">
      <div className="relative aspect-[3/4] md:aspect-auto md:h-[calc(100vh-6rem)] md:sticky md:top-24 overflow-hidden rounded-xl" style={{ background: 'var(--ti-card)' }}>
        <TryItOnImg src={image} alt={alt} wrapperClassName="absolute inset-0" priority imgClassName={`w-full h-full object-cover transition-opacity duration-200 ${mode === 'video' && video ? 'opacity-0' : 'opacity-100'}`} />
        {video && (
          <video src={video} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover transition-opacity duration-200" style={{ opacity: mode === 'video' ? 1 : 0 }} />
        )}
        {video && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex rounded-full p-1" style={{ background: 'rgba(20,17,22,0.7)', backdropFilter: 'blur(8px)' }}>
            <button onClick={() => setMode('video')} className="px-4 py-1.5 rounded-full text-xs font-semibold transition-colors" style={mode === 'video' ? { background: 'var(--ti-accent)', color: 'var(--ti-accent-ink)' } : { color: 'var(--ti-ink)' }}>Video</button>
            <button onClick={() => setMode('image')} className="px-4 py-1.5 rounded-full text-xs font-semibold transition-colors" style={mode === 'image' ? { background: 'var(--ti-accent)', color: 'var(--ti-accent-ink)' } : { color: 'var(--ti-ink)' }}>Photo</button>
          </div>
        )}
      </div>
    </div>
  )
}
