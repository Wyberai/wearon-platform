'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import type { ScrollStory } from '@/lib/scroll/catalog'
import { findProduct } from '@/lib/scroll/catalog'
import type { ThemeProduct } from '@/lib/flagship/types'

const STORY_DURATION_MS = 5000

// The stories bar — a horizontal row of circular new-drop/restock teasers.
// Tapping one opens a fullscreen story-viewer overlay with a "Shop this"
// CTA into that product's real PDP. Purely original chrome (gradient ring,
// generic progress segments) — no borrowed brand marks.
export function ScrollStoriesBar({ stories, products, slug }: { stories: ScrollStory[]; products: ThemeProduct[]; slug: string }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [seen, setSeen] = useState<Set<string>>(new Set())

  function openStory(i: number) {
    setActiveIndex(i)
    setSeen(prev => new Set(prev).add(stories[i].id))
  }

  function closeStory() {
    setActiveIndex(null)
  }

  function next() {
    setActiveIndex(i => {
      if (i === null) return null
      const nextI = i + 1
      if (nextI >= stories.length) { setActiveIndex(null); return null }
      setSeen(prev => new Set(prev).add(stories[nextI].id))
      return nextI
    })
  }

  function prev() {
    setActiveIndex(i => (i === null || i === 0) ? i : i - 1)
  }

  return (
    <>
      <div className="flex gap-4 overflow-x-auto px-4 py-4 border-b" style={{ borderColor: 'var(--sc-line)', scrollbarWidth: 'none' }}>
        {stories.map((story, i) => (
          <button key={story.id} onClick={() => openStory(i)} className="flex flex-col items-center gap-1.5 flex-shrink-0 w-16">
            <div className={seen.has(story.id) ? 'scroll-story-ring-seen' : 'scroll-story-ring'}>
              <div className="w-14 h-14 rounded-full overflow-hidden border-2" style={{ borderColor: 'var(--sc-bg)', background: 'var(--sc-card)' }}>
                <img
                  src={story.image}
                  alt={story.label}
                  className="w-full h-full object-cover"
                  onError={e => { e.currentTarget.style.display = 'none' }}
                />
              </div>
            </div>
            <span className="text-[10.5px] leading-tight text-center truncate w-full" style={{ color: 'var(--sc-ink-muted)' }}>{story.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {activeIndex !== null && (
          <StoryViewer
            stories={stories}
            index={activeIndex}
            product={findProduct(products, stories[activeIndex].productSlug)}
            slug={slug}
            onClose={closeStory}
            onNext={next}
            onPrev={prev}
          />
        )}
      </AnimatePresence>
    </>
  )
}

function StoryViewer({
  stories, index, product, slug, onClose, onNext, onPrev,
}: {
  stories: ScrollStory[]
  index: number
  product: ThemeProduct | undefined
  slug: string
  onClose: () => void
  onNext: () => void
  onPrev: () => void
}) {
  const story = stories[index]

  // Auto-advance, paused implicitly by unmount on close — a plain timer,
  // never gating the image itself from rendering (image is always visible
  // the instant this mounts; the timer only decides when to move on).
  useEffect(() => {
    const t = setTimeout(onNext, STORY_DURATION_MS)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: '#000' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <div className="relative w-full h-full sm:h-[92vh] sm:max-w-[420px] sm:rounded-2xl overflow-hidden" style={{ background: 'var(--sc-card)' }}>
        <div className="absolute top-2.5 left-2.5 right-2.5 z-20 flex gap-1.5">
          {stories.map((s, i) => (
            <div key={s.id} className="flex-1 h-[2.5px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.35)' }}>
              {i < index && <div className="w-full h-full" style={{ background: '#fff' }} />}
              {i === index && (
                <motion.div
                  className="h-full"
                  style={{ background: '#fff' }}
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: STORY_DURATION_MS / 1000, ease: 'linear' }}
                />
              )}
            </div>
          ))}
        </div>

        <div className="absolute top-6 left-3 right-3 z-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full overflow-hidden border" style={{ borderColor: 'rgba(255,255,255,0.6)' }}>
              <img src={story.image} alt="" className="w-full h-full object-cover" onError={e => { e.currentTarget.style.display = 'none' }} />
            </div>
            <span className="text-white text-[13px] font-semibold">{story.label}</span>
          </div>
          <button onClick={onClose} aria-label="Close story" className="text-white w-8 h-8 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M6 6l12 12M18 6L6 18"/></svg>
          </button>
        </div>

        <img
          src={story.image}
          alt={story.label}
          className="w-full h-full object-cover"
          onError={e => { e.currentTarget.style.opacity = '0' }}
        />

        {/* Tap zones for prev/next, sitting above the image */}
        <button aria-label="Previous story" onClick={onPrev} className="absolute left-0 top-0 bottom-0 w-1/3 z-10" />
        <button aria-label="Next story" onClick={onNext} className="absolute right-0 top-0 bottom-0 w-1/3 z-10" />

        {product && (
          <div className="absolute bottom-6 left-3 right-3 z-20">
            <Link
              href={`/store/${slug}/product/${product.slug}`}
              className="scroll-gradient flex items-center justify-center gap-2 w-full py-3 rounded-full text-sm font-bold shadow-lg"
              style={{ color: 'var(--sc-accent-ink)' }}
            >
              Shop this — {product.name}
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  )
}
