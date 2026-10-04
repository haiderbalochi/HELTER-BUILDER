import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '@/hooks'
import { seededRandom } from '@/lib/utils'

interface Mote {
  x: number
  y: number
  z: number
  vx: number
  vy: number
}

/**
 * Atmospheric dust for the hero — deliberately *not* the connect-the-dots
 * lattice every developer portfolio ships with.
 *
 * Three depth bands drift at different speeds; the pointer nudges each band by
 * a different amount so the field reads as volume rather than a flat overlay.
 * A handful of motes get a faint warm core so the field feels lit, not drawn.
 */
export function HeroCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduce = usePrefersReducedMotion()

  useEffect(() => {
    if (reduce) return
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return

    let width = 0
    let height = 0
    let frame = 0
    let running = true
    const dpr = Math.min(window.devicePixelRatio || 1, 1.6)

    const pointer = { x: 0, y: 0, tx: 0, ty: 0, active: false }
    let motes: Mote[] = []

    const build = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      context.setTransform(dpr, 0, 0, dpr, 0, 0)

      const random = seededRandom(Math.round(width * 0.5 + height))
      const count = width < 640 ? 54 : width < 1100 ? 88 : 128

      motes = Array.from({ length: count }, () => {
        const z = 0.25 + random() * 0.75 // 0 = far, 1 = near
        return {
          x: random() * width,
          y: random() * height,
          z,
          vx: (random() - 0.5) * (0.05 + z * 0.16),
          vy: -0.02 - random() * (0.05 + z * 0.14),
        }
      })
    }

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      pointer.tx = event.clientX - rect.left
      pointer.ty = event.clientY - rect.top
      pointer.active = true
    }
    const onPointerLeave = () => {
      pointer.active = false
    }

    const draw = () => {
      if (!running) return
      context.clearRect(0, 0, width, height)

      pointer.x += (pointer.tx - pointer.x) * 0.04
      pointer.y += (pointer.ty - pointer.y) * 0.04

      const parX = pointer.active ? pointer.x - width / 2 : 0
      const parY = pointer.active ? pointer.y - height / 2 : 0

      for (let i = 0; i < motes.length; i += 1) {
        const mote = motes[i]
        mote.x += mote.vx
        mote.y += mote.vy

        if (mote.y < -20) {
          mote.y = height + 20
          mote.x = Math.random() * width
        }
        if (mote.x < -20) mote.x = width + 20
        if (mote.x > width + 20) mote.x = -20

        // nearer motes respond more to the pointer → cheap volume
        const depth = mote.z * mote.z
        const x = mote.x + parX * depth * 0.035
        const y = mote.y + parY * depth * 0.035

        const radius = 0.35 + mote.z * 1.5
        const alpha = 0.06 + depth * 0.34

        context.beginPath()
        context.arc(x, y, radius, 0, Math.PI * 2)
        context.fillStyle = `rgba(240, 238, 231, ${alpha.toFixed(3)})`
        context.fill()

        // a small fraction carry a soft halo so the field reads as lit
        if (i % 11 === 0) {
          const halo = context.createRadialGradient(x, y, 0, x, y, radius * 7)
          halo.addColorStop(0, `rgba(240, 238, 231, ${(alpha * 0.4).toFixed(3)})`)
          halo.addColorStop(1, 'rgba(240, 238, 231, 0)')
          context.fillStyle = halo
          context.beginPath()
          context.arc(x, y, radius * 7, 0, Math.PI * 2)
          context.fill()
        }
      }

      frame = requestAnimationFrame(draw)
    }

    build()
    frame = requestAnimationFrame(draw)

    const onResize = () => {
      cancelAnimationFrame(frame)
      build()
      frame = requestAnimationFrame(draw)
    }
    const onVisibility = () => {
      running = document.visibilityState === 'visible'
      if (running) {
        cancelAnimationFrame(frame)
        frame = requestAnimationFrame(draw)
      }
    }

    window.addEventListener('resize', onResize)
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    canvas.addEventListener('pointerleave', onPointerLeave)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      running = false
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerleave', onPointerLeave)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [reduce])

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />
}
