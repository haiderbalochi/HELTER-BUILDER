import type { Variants, Transition } from 'framer-motion'

/** Shared easing — a long, luxurious deceleration used across the site. */
export const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1]
export const EASE_OUT_QUINT: [number, number, number, number] = [0.22, 1, 0.36, 1]

export const SPRING_SOFT: Transition = {
  type: 'spring',
  stiffness: 120,
  damping: 22,
  mass: 0.9,
}

export const TWEEN: Transition = { duration: 0.8, ease: EASE_OUT_EXPO }

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: EASE_OUT_EXPO },
  },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.9, ease: EASE_OUT_EXPO } },
}

export const stagger = (delay = 0.08, staggerChildren = 0.09): Variants => ({
  hidden: {},
  visible: { transition: { delayChildren: delay, staggerChildren } },
})

/** Words rise out of a clipped baseline — used on every section heading. */
export const revealWords: Variants = {
  hidden: { y: '110%' },
  visible: (i: number = 0) => ({
    y: '0%',
    transition: { duration: 0.95, ease: EASE_OUT_QUINT, delay: i * 0.045 },
  }),
}

export const clipReveal: Variants = {
  hidden: { clipPath: 'inset(0 0 100% 0)', opacity: 0 },
  visible: {
    clipPath: 'inset(0 0 0% 0)',
    opacity: 1,
    transition: { duration: 1.05, ease: EASE_OUT_EXPO },
  },
}

export const scaleReveal: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.9, ease: EASE_OUT_EXPO },
  },
}

export const VIEWPORT_ONCE = { once: true, amount: 0.25 } as const
export const VIEWPORT_EARLY = { once: true, amount: 0.15 } as const
