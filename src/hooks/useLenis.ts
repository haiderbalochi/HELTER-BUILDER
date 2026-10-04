import { useEffect } from 'react'
import Lenis from 'lenis'
import { prefersReducedMotion } from '@/lib/utils'

let instance: Lenis | null = null

export function getSmoothScroll(): Lenis | null {
  return instance
}

/**
 * Site-wide smooth scrolling. Disabled entirely when the visitor prefers
 * reduced motion, and skipped on coarse pointers so native momentum stays.
 */
export function useSmoothScroll(enabled = true) {
  useEffect(() => {
    if (!enabled) return
    if (prefersReducedMotion()) return
    if (window.matchMedia('(pointer: coarse)').matches) return
    if (instance) return

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
      wheelMultiplier: 1,
    })
    instance = lenis

    let frame = 0
    const raf = (time: number) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
      instance = null
    }
  }, [enabled])
}

/** Scrolls to a page section, falling back to native behaviour. */
export function scrollToId(id: string, offset = -72) {
  const el = document.getElementById(id)
  if (!el) return
  if (instance) {
    instance.scrollTo(el, { offset, duration: 1.15 })
    return
  }
  const top = el.getBoundingClientRect().top + window.scrollY + offset
  window.scrollTo({ top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
}
