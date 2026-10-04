import { useEffect, useRef } from 'react'
import { isTouchDevice, prefersReducedMotion } from '@/lib/utils'

/**
 * Magnetic pull on hover. Writes straight to `style.transform` so React never
 * re-renders during pointer movement.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.32, radius = 1) {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (isTouchDevice() || prefersReducedMotion()) return

    el.style.transition = 'transform 700ms cubic-bezier(0.16, 1, 0.3, 1)'
    el.style.willChange = 'transform'

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const dx = (event.clientX - centerX) * strength * radius
      const dy = (event.clientY - centerY) * strength * radius
      el.style.transform = `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0)`
    }

    const reset = () => {
      el.style.transform = 'translate3d(0, 0, 0)'
    }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', reset)
    el.addEventListener('blur', reset as EventListener)

    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', reset)
      el.removeEventListener('blur', reset as EventListener)
      el.style.transform = ''
      el.style.transition = ''
      el.style.willChange = ''
    }
  }, [strength, radius])

  return ref
}
