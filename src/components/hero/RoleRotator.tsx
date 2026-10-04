import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { usePrefersReducedMotion } from '@/hooks'
import { ROLES } from '@/lib/site'
import { EASE_OUT_QUINT } from '@/lib/motion'

/**
 * Cycles through the discipline list with a masked vertical swap.
 * Reduced-motion visitors see the first role, static.
 */
export function RoleRotator({ interval = 2300 }: { interval?: number }) {
  const reduce = usePrefersReducedMotion()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (reduce) return
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % ROLES.length)
    }, interval)
    return () => window.clearInterval(timer)
  }, [interval, reduce])

  const current = ROLES[index]

  return (
    <div className="flex items-center gap-3">
      <span className="label shrink-0 text-bone-faint">as</span>
      <span
        className="relative block h-[1.55em] overflow-hidden font-mono text-[12px] uppercase tracking-wider2 text-accent sm:text-[13px]"
        aria-live="polite"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={current}
            className="block whitespace-nowrap"
            initial={reduce ? false : { y: '100%', opacity: 0, filter: 'blur(4px)' }}
            animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
            exit={reduce ? undefined : { y: '-100%', opacity: 0, filter: 'blur(4px)' }}
            transition={{ duration: 0.32, ease: EASE_OUT_QUINT }}
          >
            {current}
          </motion.span>
        </AnimatePresence>
      </span>
      <span
        aria-hidden="true"
        className="h-[1.1em] w-px shrink-0 bg-accent/70 animate-caret"
      />
    </div>
  )
}
