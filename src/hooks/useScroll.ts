import { useEffect, useRef, useState } from 'react'

/** rAF-throttled window scroll offset. */
export function useScrollY() {
  const [y, setY] = useState(0)
  useEffect(() => {
    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => setY(window.scrollY))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])
  return y
}

export function useInViewOnce<T extends HTMLElement>(amount = 0.3) {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold: amount },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [amount])

  return { ref, inView }
}

/**
 * Which section id currently owns the reading line (35% down the viewport).
 *
 * Deliberately not an IntersectionObserver: tall sections never cross a useful
 * threshold, so the highlight lagged one section behind whenever the page got
 * longer. A single rAF-throttled scroll pass is both cheaper and correct.
 */
export function useActiveSection(ids: readonly string[]): string {
  const [active, setActive] = useState('')
  const key = ids.join('|')

  useEffect(() => {
    const list = key.split('|').filter(Boolean)
    if (list.length === 0) return
    if (typeof window === 'undefined') return

    let frame = 0
    const compute = () => {
      const line = window.scrollY + window.innerHeight * 0.35
      let best = ''
      for (const id of list) {
        const el = document.getElementById(id)
        if (!el) continue
        const top = el.getBoundingClientRect().top + window.scrollY
        if (top <= line) best = id
      }
      setActive(best)
    }

    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(compute)
    }

    compute()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [key])

  return active
}
