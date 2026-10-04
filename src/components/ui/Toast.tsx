import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Icon } from './Icon'
import { EASE_OUT_EXPO } from '@/lib/motion'
import { cn } from '@/lib/utils'

type Tone = 'success' | 'error' | 'info'

interface Toast {
  id: number
  message: string
  tone: Tone
}

interface ToastApi {
  push: (message: string, tone?: Tone) => void
}

const ToastContext = createContext<ToastApi | null>(null)

const TONE_STYLE: Record<Tone, { dot: string; border: string; icon: 'check' | 'close' | 'plus' }> = {
  success: { dot: 'bg-accent', border: 'border-accent/40', icon: 'check' },
  error: { dot: 'bg-[#ff6b57]', border: 'border-[#ff6b57]/45', icon: 'close' },
  info: { dot: 'bg-bone', border: 'border-[var(--hairline-strong)]', icon: 'plus' },
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Toast[]>([])
  const counter = useRef(0)

  const push = useCallback((message: string, tone: Tone = 'info') => {
    counter.current += 1
    const id = counter.current
    setItems((prev) => [...prev.slice(-2), { id, message, tone }])
    window.setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 3800)
  }, [])

  const api = useMemo(() => ({ push }), [push])

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-4 bottom-4 z-[90] flex flex-col items-center gap-2 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:items-end"
        role="status"
        aria-live="polite"
      >
        <AnimatePresence initial={false}>
          {items.map((toast) => {
            const tone = TONE_STYLE[toast.tone]
            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, y: 18, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
                className={cn(
                  'pointer-events-auto flex max-w-sm items-center gap-3 rounded-full border bg-ink-880/95 px-4 py-3',
                  'shadow-[0_18px_44px_-18px_rgba(0,0,0,0.9)] backdrop-blur-xl',
                  tone.border,
                )}
              >
                <span className={cn('h-1.5 w-1.5 shrink-0 rounded-full', tone.dot)} />
                <span className="text-[13px] leading-snug text-bone">{toast.message}</span>
                <Icon name={tone.icon} size={13} className="shrink-0 text-bone-faint" />
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
  return ctx
}

/** Escape-to-close, focus restoration and scroll lock for modal surfaces. */
export function useModalBehaviour(open: boolean, onClose: () => void) {
  const opener = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return
    opener.current = document.activeElement as HTMLElement | null

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
      opener.current?.focus?.()
    }
  }, [open, onClose])
}
