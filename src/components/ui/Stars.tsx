import { useState } from 'react'
import { Icon } from './Icon'
import { cn } from '@/lib/utils'

interface StarsProps {
  value: number
  onChange?: (value: number) => void
  size?: number
  className?: string
  id?: string
  name?: string
}

/** Accessible star rating — display-only unless `onChange` is supplied. */
export function Stars({ value, onChange, size = 16, className, id, name }: StarsProps) {
  const [hovered, setHovered] = useState(0)
  const interactive = typeof onChange === 'function'
  const shown = hovered || value

  if (!interactive) {
    return (
      <div className={cn('flex items-center gap-1', className)} aria-label={`Rated ${value} out of 5`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Icon
            key={n}
            name="star"
            size={size}
            className={n <= value ? 'text-accent' : 'text-bone-faint/40'}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      id={id}
      className={cn('flex items-center gap-1.5', className)}
      onMouseLeave={() => setHovered(0)}
      role="radiogroup"
      aria-label="Rating"
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <label key={n} className="group relative cursor-pointer">
          <input
            type="radio"
            name={name ?? 'rating'}
            value={n}
            checked={value === n}
            onChange={() => onChange?.(n)}
            className="sr-only"
            aria-label={`${n} star${n > 1 ? 's' : ''}`}
          />
          <Icon
            name="star"
            size={size + 4}
            onMouseEnter={() => setHovered(n)}
            className={cn(
              'transition-all duration-200',
              n <= shown ? 'text-accent scale-105' : 'text-bone-faint/40 group-hover:text-bone-mute',
            )}
          />
        </label>
      ))}
      <span className="ml-2 font-mono text-[11px] tabular text-bone-mute">
        {value ? `${value}.0` : '—'}
      </span>
    </div>
  )
}
