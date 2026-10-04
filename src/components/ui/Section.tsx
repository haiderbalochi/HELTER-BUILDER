import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionProps {
  id: string
  children: ReactNode
  className?: string
  /** Adds a hairline rule above the section. */
  ruled?: boolean
  /** Extra vertical rhythm: 'default' | 'tight' | 'loose' */
  rhythm?: 'default' | 'tight' | 'loose'
  /** Accessible label when the section has no visible heading. */
  'aria-label'?: string
}

/**
 * Rhythm is set in `vh` rather than a fixed rem scale so the page breathes
 * with the viewport — the single cheapest way to stop a layout reading like
 * a template.
 */
const RHYTHM = {
  tight: 'rhythm-tight',
  default: 'rhythm',
  loose: 'rhythm-loose',
}

export function Section({
  id,
  children,
  className,
  ruled = false,
  rhythm = 'default',
  'aria-label': ariaLabel,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className={cn('relative scroll-mt-24', RHYTHM[rhythm], ruled && 'hairline-t', className)}
    >
      {children}
    </section>
  )
}

export function Shell({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('shell', className)}>{children}</div>
}
