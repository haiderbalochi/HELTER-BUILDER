import { motion } from 'framer-motion'
import { RevealText } from './RevealText'
import { fadeUp, VIEWPORT_ONCE } from '@/lib/motion'
import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  index: string
  eyebrow: string
  title: string
  /** Optional supporting paragraph rendered under the title. */
  lede?: string
  align?: 'left' | 'split'
  className?: string
  /**
   * Signature move: the final word drops out of the uppercase grotesque and
   * is set in Instrument Serif italic. Reads as art direction rather than a
   * colour swap, and keeps the lime accent rationed.
   */
  accentLastWord?: boolean
}

function paintTitle(title: string, accent: boolean) {
  if (!accent) return title
  const parts = title.trim().split(/\s+/)
  const last = parts.pop()
  return { head: parts.join(' '), accent: last }
}

export function SectionHeading({
  index,
  eyebrow,
  title,
  lede,
  align = 'split',
  className,
  accentLastWord = false,
}: SectionHeadingProps) {
  const painted = paintTitle(title, accentLastWord)

  return (
    <motion.header
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_ONCE}
      className={cn(
        'relative',
        align === 'split' && 'grid gap-6 lg:grid-cols-12 lg:gap-10',
        className,
      )}
    >
      <div
        className={cn(
          'flex items-baseline gap-4 lg:sticky lg:top-32 lg:self-start',
          align === 'split' && 'lg:col-span-3',
        )}
      >
        <span className="label tabular text-accent/80">({index})</span>
        <span className="eyebrow">{eyebrow}</span>
      </div>

      <div className={cn(align === 'split' && 'lg:col-span-9')}>
        <h2 className="display-head text-[clamp(2.5rem,8.2vw,7.25rem)] text-bone">
          {typeof painted === 'object' ? (
            <>
              {painted.head && <RevealText text={painted.head} className="mr-[0.2em]" />}
              <RevealText text={painted.accent ?? ''} className="serif-accent" delay={0.14} />
            </>
          ) : (
            <RevealText text={title} />
          )}
        </h2>

        {lede && (
          <motion.p
            variants={fadeUp}
            className="mt-7 max-w-[54ch] text-[15.5px] leading-[1.65] text-bone-mute md:text-[17px] lg:ml-auto lg:max-w-[46ch]"
          >
            {lede}
          </motion.p>
        )}
      </div>
    </motion.header>
  )
}
