import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { usePrefersReducedMotion } from '@/hooks'
import { EASE_OUT_EXPO, EASE_OUT_QUINT } from '@/lib/motion'

const WORD = 'HAIDER BALOCH'.split('')

/**
 * Cinematic boot sequence: a mono ticker counts up while the name assembles
 * letter by letter, then the whole plate wipes upward to expose the hero.
 */
export function PageLoader({ onDone }: { onDone?: () => void }) {
  const reduce = usePrefersReducedMotion()
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const duration = reduce ? 320 : 1750
    const start = performance.now()
    let frame = 0

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      // ease-out-quart with a small hold near the end so it feels deliberate
      const eased = t < 0.85 ? 1 - Math.pow(1 - t / 0.85, 3) * 1 : 1
      setProgress(Math.round(Math.min(eased, 1) * 100))
      if (t < 1) {
        frame = requestAnimationFrame(tick)
      } else {
        setProgress(100)
        window.setTimeout(() => {
          setDone(true)
          onDone?.()
        }, reduce ? 60 : 260)
      }
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [reduce, onDone])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[100] flex flex-col justify-between bg-ink-950 px-6 py-6 md:px-12 md:py-10"
          initial={{ y: 0 }}
          exit={{ y: '-101%' }}
          transition={{ duration: reduce ? 0.2 : 1.05, ease: EASE_OUT_EXPO }}
        >
          <div className="flex items-center justify-between">
            <span className="label text-bone-faint">Portfolio — 2026</span>
            <span className="label tabular text-accent">
              {String(progress).padStart(3, '0')}%
            </span>
          </div>

          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            {WORD.map((char, i) => (
              <motion.span
                key={i}
                aria-hidden="true"
                className="display-x inline-block text-[clamp(2rem,9vw,7rem)] text-bone"
                initial={{ opacity: 0, y: '40%', filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: '0%', filter: 'blur(0px)' }}
                transition={{
                  duration: 0.8,
                  ease: EASE_OUT_QUINT,
                  delay: reduce ? 0 : 0.12 + i * 0.038,
                }}
              >
                {char === ' ' ? ' ' : char}
              </motion.span>
            ))}
          </div>

          <div className="space-y-3">
            <div className="h-px w-full bg-[var(--hairline)]">
              <motion.div
                className="h-px bg-accent"
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.25, ease: 'linear' }}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="label text-bone-faint">Loading experience</span>
              <span className="label text-bone-faint">Lahore · PK</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
