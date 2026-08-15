'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

// Content must NEVER depend on this animation to become visible — initial
// opacity stays at 1 always. Only a subtle translateY animates on scroll-into-
// view, so if IntersectionObserver/whileInView misbehaves in any browser
// context, the page still reads perfectly, just without the slide-up flourish.
export function Reveal({ children, delay = 0, y = 16, className }: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 1, y }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}
