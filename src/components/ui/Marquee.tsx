import { usePrefersReducedMotion } from '@/hooks'
import { cn } from '@/lib/utils'

interface MarqueeProps {
  items: readonly string[]
  reverse?: boolean
  fast?: boolean
  className?: string
  /** Rendered between entries — defaults to a small accent diamond. */
  separator?: React.ReactNode
  /** Screen-reader text for the moving band. */
  label?: string
}

function DefaultSeparator() {
  return (
    <span aria-hidden="true" className="mx-6 inline-block h-1.5 w-1.5 rotate-45 bg-accent/70" />
  )
}

export function Marquee({
  items,
  reverse = false,
  fast = false,
  className,
  separator,
  label,
}: MarqueeProps) {
  const reduce = usePrefersReducedMotion()
  const Sep = separator ?? <DefaultSeparator />

  const track = (key: number) => (
    <div key={key} className="flex shrink-0 items-center" aria-hidden={key === 1}>
      {items.map((item) => (
        <span key={`${key}-${item}`} className="flex shrink-0 items-center">
          <span className="whitespace-nowrap">{item}</span>
          {Sep}
        </span>
      ))}
    </div>
  )

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      role="marquee"
      aria-label={label}
    >
      <div
        className={cn(
          'flex w-max items-center',
          !reduce &&
            (reverse
              ? fast
                ? 'animate-marquee-rev'
                : 'animate-marquee-rev'
              : fast
                ? 'animate-marquee-fast'
                : 'animate-marquee'),
        )}
      >
        {track(0)}
        {track(1)}
      </div>
      {reduce && <span className="sr-only">{items.join(' · ')}</span>}
    </div>
  )
}
