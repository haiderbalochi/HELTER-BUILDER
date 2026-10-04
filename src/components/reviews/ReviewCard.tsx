import { motion } from 'framer-motion'
import { Icon } from '@/components/ui/Icon'
import { Stars } from '@/components/ui/Stars'
import type { Review } from '@/firebase/types'
import { formatDate } from '@/lib/utils'

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export function ReviewCard({ review, index = 0 }: { review: Review; index?: number }) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, delay: Math.min(index * 0.07, 0.35), ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex h-full flex-col justify-between gap-6 border-t border-[var(--hairline-strong)] pt-6 transition-colors duration-500"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-4 -top-6 text-[7rem] leading-none text-bone-faint/[0.07] transition-colors duration-500 group-hover:text-accent/[0.14]"
      >
        &rdquo;
      </span>

      <div className="relative">
        <div className="mb-4 flex items-center justify-between gap-4">
          <Stars value={review.rating} size={13} />
          <span className="label tabular text-bone-faint">{formatDate(review.createdAt)}</span>
        </div>

        <blockquote className="text-[15.5px] leading-[1.7] text-bone-soft">
          {review.text}
        </blockquote>
      </div>

      <figcaption className="relative flex items-center gap-3.5 border-t border-[var(--hairline)] pt-5">
        <span className="grid h-9 w-9 shrink-0 place-items-center border border-accent/40 font-mono text-[11px] text-accent">
          {initials(review.name) || '—'}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm text-bone">{review.name}</span>
          <span className="block truncate font-mono text-[10.5px] uppercase tracking-wider2 text-bone-faint">
            {review.role || 'Client'}
          </span>
        </span>
        <Icon
          name="quote"
          size={20}
          className="ml-auto shrink-0 text-bone-faint/40 transition-colors duration-500 group-hover:text-accent/70"
        />
      </figcaption>
    </motion.figure>
  )
}

export function ReviewSkeleton() {
  return (
    <div className="flex h-full flex-col justify-between gap-6 border-t border-[var(--hairline-strong)] pt-6">
      <div className="space-y-4">
        <div className="h-3 w-24 animate-pulse bg-bone/10" />
        <div className="space-y-2">
          <div className="h-3 w-full animate-pulse bg-bone/[0.07]" />
          <div className="h-3 w-11/12 animate-pulse bg-bone/[0.07]" />
          <div className="h-3 w-4/5 animate-pulse bg-bone/[0.07]" />
        </div>
      </div>
      <div className="flex items-center gap-3 border-t border-[var(--hairline)] pt-5">
        <div className="h-9 w-9 animate-pulse bg-bone/10" />
        <div className="space-y-2">
          <div className="h-3 w-28 animate-pulse rounded bg-bone/[0.07]" />
          <div className="h-2.5 w-20 animate-pulse rounded bg-bone/[0.05]" />
        </div>
      </div>
    </div>
  )
}
