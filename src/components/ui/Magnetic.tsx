import type { ReactNode } from 'react'
import { useMagnetic } from '@/hooks'
import { usePrefersReducedMotion } from '@/hooks'
import { cn } from '@/lib/utils'

interface MagneticProps {
  children: ReactNode
  strength?: number
  className?: string
  as?: 'span' | 'div'
}

/** Wraps any content in a pointer-following pull. Disabled under reduced motion. */
export function Magnetic({ children, strength = 0.3, className, as = 'span' }: MagneticProps) {
  const ref = useMagnetic<HTMLElement>(strength)
  const Tag = as
  const reduce = usePrefersReducedMotion()

  return (
    <Tag
      ref={ref as never}
      className={cn('inline-flex', !reduce && 'will-change-transform', className)}
    >
      {children}
    </Tag>
  )
}
