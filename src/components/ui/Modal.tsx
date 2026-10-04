import { useEffect, useRef, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Icon } from './Icon'
import { useModalBehaviour } from './Toast'
import { EASE_OUT_EXPO } from '@/lib/motion'
import { cn } from '@/lib/utils'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  eyebrow?: string
  children: ReactNode
  className?: string
  /** Rendered inside the header bar, right of the title. */
  headerExtra?: ReactNode
}

export function Modal({
  open,
  onClose,
  title,
  eyebrow,
  children,
  className,
  headerExtra,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  useModalBehaviour(open, onClose)

  useEffect(() => {
    if (!open) return
    const frame = requestAnimationFrame(() => {
      const focusable = panelRef.current?.querySelector<HTMLElement>(
        'input, textarea, select, button, [href], [tabindex]:not([tabindex="-1"])',
      )
      focusable?.focus()
    })
    return () => cancelAnimationFrame(frame)
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center">
          <motion.button
            type="button"
            aria-label="Close dialog"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-ink-950/80 backdrop-blur-md"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, y: 40, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.99 }}
            transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
            className={cn(
              'relative z-10 max-h-[92vh] w-full overflow-y-auto rounded-none border border-[var(--hairline-strong)]',
              'bg-ink-880/95 shadow-[0_40px_120px_-40px_rgba(0,0,0,1)] backdrop-blur-2xl sm:max-w-2xl sm:rounded-none',
              className,
            )}
          >
            <div className="sticky top-0 z-10 flex items-start justify-between gap-6 border-b border-[var(--hairline)] bg-ink-880/90 px-6 py-5 backdrop-blur-xl md:px-8">
              <div>
                {eyebrow && <p className="label mb-2 text-accent/80">{eyebrow}</p>}
                <h3 className="display text-2xl text-bone md:text-3xl">{title}</h3>
              </div>
              <div className="flex items-center gap-3">
                {headerExtra}
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="grid h-9 w-9 place-items-center border border-[var(--hairline)] text-bone-mute transition hover:border-accent/60 hover:text-accent"
                >
                  <Icon name="close" size={16} />
                </button>
              </div>
            </div>

            <div className="px-6 py-6 md:px-8 md:py-8">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
