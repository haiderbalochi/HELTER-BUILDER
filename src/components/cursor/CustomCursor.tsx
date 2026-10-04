import { useEffect, useRef, useState } from 'react'
import { isTouchDevice, prefersReducedMotion } from '@/lib/utils'

/**
 * Two-part cursor: a precise dot that tracks instantly and a ring that eases
 * behind it. Interactive targets grow the ring; `[data-cursor-label]` targets
 * fill it with a word. Entirely absent on touch devices and under
 * `prefers-reduced-motion`.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [label, setLabel] = useState('')
  const [active, setActive] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (isTouchDevice() || prefersReducedMotion()) return

    const html = document.documentElement
    html.classList.add('has-custom-cursor')

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let ringX = mouseX
    let ringY = mouseY
    let targetScale = 1
    let scale = 1
    let frame = 0

    const onMove = (event: PointerEvent) => {
      mouseX = event.clientX
      mouseY = event.clientY
      if (!visible) {
        setVisible(true)
        ringX = mouseX
        ringY = mouseY
      }

      const target = event.target as HTMLElement | null
      if (!target || !target.closest) return

      const labelled = target.closest('[data-cursor-label]') as HTMLElement | null
      const interactive = target.closest('a, button, [role="button"], input, textarea, select, label')

      if (labelled) {
        setLabel(labelled.dataset.cursorLabel ?? '')
        targetScale = 3.1
        setActive(true)
      } else if (interactive) {
        setLabel('')
        targetScale = 2.1
        setActive(true)
      } else {
        setLabel('')
        targetScale = 1
        setActive(false)
      }
    }

    const onLeave = () => setVisible(false)
    const onEnter = () => setVisible(true)

    const raf = () => {
      ringX += (mouseX - ringX) * 0.16
      ringY += (mouseY - ringY) * 0.16
      scale += (targetScale - scale) * 0.14

      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${scale.toFixed(3)})`

      frame = requestAnimationFrame(raf)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    document.addEventListener('pointerenter', onEnter)
    frame = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('pointerenter', onEnter)
      html.classList.remove('has-custom-cursor')
    }
  }, [visible])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[95] hidden md:block">
      <div
        ref={dotRef}
        className={`absolute left-0 top-0 h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
          active ? 'bg-transparent' : 'bg-accent'
        }`}
        style={{ opacity: visible ? 1 : 0 }}
      />
      <div
        ref={ringRef}
        className={`absolute left-0 top-0 grid h-9 w-9 place-items-center rounded-full border transition-[border-color,background-color] duration-300 ${
          active ? 'border-accent bg-accent/10' : 'border-bone/35'
        }`}
        style={{ opacity: visible ? 1 : 0 }}
      >
        <span
          className={`font-mono text-[8px] uppercase tracking-widest2 transition-opacity duration-200 ${
            label ? 'text-accent opacity-100' : 'opacity-0'
          }`}
        >
          {label}
        </span>
      </div>
    </div>
  )
}
