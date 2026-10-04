import { motion } from 'framer-motion'
import { Icon, type IconName } from '@/components/ui/Icon'
import { Stars } from '@/components/ui/Stars'
import { STATUS_LABEL, type Review, type ReviewStatus } from '@/firebase/types'
import { cn, formatDate } from '@/lib/utils'

export type ReviewAction =
  | { kind: 'approve' }
  | { kind: 'reject' }
  | { kind: 'hide' }
  | { kind: 'edit' }
  | { kind: 'delete' }

export function availableActions(status: ReviewStatus): ReviewAction[] {
  const actions: ReviewAction[] = []
  if (status !== 'published') actions.push({ kind: 'approve' })
  if (status !== 'rejected') actions.push({ kind: 'reject' })
  if (status === 'published') actions.push({ kind: 'hide' })
  actions.push({ kind: 'edit' }, { kind: 'delete' })
  return actions
}

const ACTION_META: Record<
  ReviewAction['kind'],
  { label: string; icon: IconName; tone: string; destructive?: boolean }
> = {
  approve: { label: 'Approve', icon: 'check', tone: 'hover:border-accent/60 hover:text-accent' },
  reject: { label: 'Reject', icon: 'close', tone: 'hover:border-[#ff6b57]/60 hover:text-[#ff6b57]' },
  hide: { label: 'Hide', icon: 'eye-off', tone: 'hover:border-[#E9C46A]/60 hover:text-[#E9C46A]' },
  edit: { label: 'Edit', icon: 'edit', tone: 'hover:border-bone/50 hover:text-bone' },
  delete: {
    label: 'Delete',
    icon: 'trash',
    tone: 'hover:border-[#ff6b57]/60 hover:text-[#ff6b57]',
    destructive: true,
  },
}

const STATUS_STYLE: Record<ReviewStatus, string> = {
  pending: 'border-[#E9C46A]/45 text-[#E9C46A] bg-[#E9C46A]/10',
  published: 'border-accent/45 text-accent bg-accent/10',
  hidden: 'border-bone/25 text-bone-mute bg-white/[0.04]',
  rejected: 'border-[#ff6b57]/40 text-[#ff6b57] bg-[#ff6b57]/10',
}

interface ReviewRowProps {
  review: Review
  busy?: boolean
  onAction: (action: ReviewAction) => void
}

export function ReviewRow({ review, busy, onAction }: ReviewRowProps) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'rounded-2xl border border-[var(--hairline)] bg-white/[0.02] p-5 transition-opacity duration-300',
        busy && 'opacity-55',
      )}
      aria-busy={busy ? 'true' : undefined}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3.5">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-accent/30 bg-accent/10 font-mono text-[12px] text-accent">
            {(review.name || '?')
              .split(/\s+/)
              .slice(0, 2)
              .map((part) => part[0]?.toUpperCase() ?? '')
              .join('')}
          </span>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h3 className="truncate text-sm text-bone">{review.name}</h3>
              <Stars value={review.rating} size={12} />
            </div>
            <p className="mt-1 truncate font-mono text-[10.5px] text-bone-faint">
              {review.email}
              {review.role && <span className="text-bone-faint"> · {review.role}</span>}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={cn(
              'rounded-full border px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-wider2',
              STATUS_STYLE[review.status],
            )}
          >
            {STATUS_LABEL[review.status]}
          </span>
          <span className="hidden font-mono text-[10.5px] tabular text-bone-faint sm:block">
            {formatDate(review.createdAt)}
          </span>
        </div>
      </div>

      <blockquote className="mt-4 border-l border-[var(--hairline-strong)] pl-4 text-[14px] leading-relaxed text-bone-soft">
        {review.text}
      </blockquote>

      <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-[var(--hairline)] pt-4">
        <span className="label mr-auto text-bone-faint sm:hidden">
          {formatDate(review.createdAt)}
        </span>
        <span className="label mr-auto hidden text-bone-faint sm:inline">Actions</span>

        {availableActions(review.status).map((action) => {
          const meta = ACTION_META[action.kind]
          return (
            <button
              key={action.kind}
              type="button"
              disabled={busy}
              onClick={() => onAction(action)}
              className={cn(
                'inline-flex h-8 items-center gap-1.5 rounded-full border border-[var(--hairline)] px-3',
                'font-mono text-[10px] uppercase tracking-wider2 text-bone-mute',
                'transition-colors duration-300 disabled:pointer-events-none disabled:opacity-40',
                meta.tone,
              )}
            >
              <Icon name={meta.icon} size={12} />
              <span className="hidden sm:inline">{meta.label}</span>
            </button>
          )
        })}
      </div>
    </motion.article>
  )
}
