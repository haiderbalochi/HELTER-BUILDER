import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { useMagnetic } from '@/hooks'
import { Icon, type IconName } from './Icon'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'ghost' | 'quiet'

interface BaseProps {
  variant?: Variant
  size?: 'md' | 'lg'
  icon?: IconName
  iconPosition?: 'left' | 'right'
  children: ReactNode
  className?: string
  magnetic?: boolean
}

export interface ButtonProps
  extends BaseProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  href?: undefined
}

export interface LinkButtonProps extends BaseProps {
  href: string
  target?: string
  rel?: string
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void
  'aria-label'?: string
}

const SIZES = {
  md: 'h-11 px-5 text-[10.5px]',
  lg: 'h-[3.25rem] px-7 text-[11px] md:h-14 md:px-9',
}

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-accent text-ink hover:bg-accent-bright',
  ghost: 'border border-[var(--hairline-strong)] text-bone hover:border-accent/60 hover:text-accent',
  quiet: 'text-bone-mute hover:text-accent',
}

function inner(variant: Variant, size: 'md' | 'lg', icon: IconName | undefined, iconPosition: 'left' | 'right', children: ReactNode, rest?: { 'aria-hidden'?: boolean }) {
  return (
    <>
      {icon && iconPosition === 'left' && <Icon name={icon} size={size === 'lg' ? 17 : 15} {...rest} />}
      <span className="relative inline-block overflow-hidden">
        <span className="block transition-transform duration-500 ease-out-expo group-hover:-translate-y-[120%]">
          {children}
        </span>
        <span
          aria-hidden="true"
          className="absolute inset-0 block translate-y-[120%] transition-transform duration-500 ease-out-expo group-hover:translate-y-0"
        >
          {children}
        </span>
      </span>
      {icon && iconPosition === 'right' && (
        <Icon
          name={icon}
          size={size === 'lg' ? 17 : 15}
          className="transition-transform duration-500 ease-out-expo group-hover:translate-x-1"
        />
      )}
      {variant === 'primary' && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 origin-left scale-x-0 bg-white/30 transition-transform duration-700 ease-out-expo group-hover:scale-x-100"
        />
      )}
    </>
  )
}

/** Pill button with a magnetic wrapper and a two-layer label swap. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'ghost',
    size = 'md',
    icon,
    iconPosition = 'right',
    children,
    className,
    magnetic = true,
    type = 'button',
    ...rest
  },
  forwardedRef,
) {
  const magneticRef = useMagnetic<HTMLSpanElement>(magnetic ? 0.28 : 0)

  return (
    <span ref={magneticRef} className="inline-flex">
      <button
        ref={forwardedRef}
        type={type}
        className={cn(
          'group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-none',
          'font-mono uppercase tracking-wider2 select-none',
          'transition-[color,border-color,background-color] duration-300',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent',
          SIZES[size],
          VARIANTS[variant],
          className,
        )}
        {...rest}
      >
        {inner(variant, size, icon, iconPosition, children)}
      </button>
    </span>
  )
})

/** Anchor version — same visual language, used for CTAs and project links. */
export function ButtonLink({
  href,
  target,
  rel,
  variant = 'ghost',
  size = 'md',
  icon,
  iconPosition = 'right',
  children,
  className,
  magnetic = true,
  onClick,
  ...rest
}: LinkButtonProps) {
  const magneticRef = useMagnetic<HTMLSpanElement>(magnetic ? 0.28 : 0)
  const isExternal = href.startsWith('http')

  return (
    <span ref={magneticRef} className="inline-flex">
      <a
        href={href}
        target={target ?? (isExternal ? '_blank' : undefined)}
        rel={rel ?? (isExternal ? 'noopener noreferrer' : undefined)}
        onClick={onClick}
        className={cn(
          'group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-none',
          'font-mono uppercase tracking-wider2 select-none',
          'transition-[color,border-color,background-color] duration-300',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent',
          SIZES[size],
          VARIANTS[variant],
          className,
        )}
        {...rest}
      >
        {inner(variant, size, icon, iconPosition, children)}
      </a>
    </span>
  )
}
