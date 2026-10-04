import { Fragment } from 'react'
import { motion, type Variants } from 'framer-motion'
import { EASE_OUT_QUINT } from '@/lib/motion'
import { cn } from '@/lib/utils'

interface RevealTextProps {
  text: string
  className?: string
  /** Delay before the first word, in seconds. */
  delay?: number
  /** Seconds between each word. */
  stagger?: number
  /** Percent of the line the word starts below, clipped by the wrapper. */
  offset?: string
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'p'
  once?: boolean
}

/**
 * Words rise out of a clipped baseline. The wrapper keeps `overflow:hidden`
 * with a little vertical padding so ascenders/descenders are never cut off.
 */
export function RevealText({
  text,
  className,
  delay = 0,
  stagger = 0.045,
  offset = '112%',
  as: Tag = 'span',
  once = true,
}: RevealTextProps) {
  const words = text.split(' ')

  const container: Variants = {
    hidden: {},
    visible: { transition: { delayChildren: delay, staggerChildren: stagger } },
  }

  const child: Variants = {
    hidden: { y: offset },
    visible: { y: '0%', transition: { duration: 0.95, ease: EASE_OUT_QUINT } },
  }

  return (
    <Tag className={cn('relative inline-block', className)}>
      {/* Real text for assistive tech — the animated copy is aria-hidden. */}
      <span className="sr-only">{text}</span>
      <motion.span
        aria-hidden="true"
        className="inline"
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once, amount: 0.4 }}
      >
        {words.map((word, i) => (
          <Fragment key={`${word}-${i}`}>
            <span className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em]">
              <motion.span className="inline-block will-change-transform" variants={child}>
                {word}
              </motion.span>
            </span>
            {/*
              The gap must live OUTSIDE the clipped box: a trailing space
              inside an `overflow:hidden` inline-block gets trimmed, which
              collapses "I Build" into "IBUILD".
            */}
            {i < words.length - 1 ? ' ' : null}
          </Fragment>
        ))}
      </motion.span>
    </Tag>
  )
}
