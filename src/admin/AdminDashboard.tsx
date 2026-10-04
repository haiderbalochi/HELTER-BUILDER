import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { ConfirmDialog } from './ConfirmDialog'
import { ReviewEditor } from './ReviewEditor'
import { ReviewRow, type ReviewAction } from './ReviewRow'
import { StatsGrid } from './StatTile'
import { useAdminReviews } from './useAdminReviews'
import type { Review, ReviewDraft, ReviewStatus } from '@/firebase/types'
import { cn } from '@/lib/utils'

type Filter = 'all' | ReviewStatus
type Sort = 'newest' | 'oldest'

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'published', label: 'Published' },
  { value: 'hidden', label: 'Hidden' },
  { value: 'rejected', label: 'Rejected' },
]

interface AdminDashboardProps {
  email: string
  onSignOut: () => Promise<void>
  signingOut: boolean
}

export function AdminDashboard({ email, onSignOut, signingOut }: AdminDashboardProps) {
  const { reviews, stats, state, error, mutating, reload, setStatus, saveEdit, remove } =
    useAdminReviews()

  const [filter, setFilter] = useState<Filter>('all')
  const [sort, setSort] = useState<Sort>('newest')
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<Review | null>(null)
  const [confirming, setConfirming] = useState<Review | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const visible = useMemo(() => {
    const needle = search.trim().toLowerCase()
    return reviews
      .filter((review) => (filter === 'all' ? true : review.status === filter))
      .filter((review) => (needle ? review.name.toLowerCase().includes(needle) : true))
      .sort((a, b) => (sort === 'newest' ? b.createdAt - a.createdAt : a.createdAt - b.createdAt))
  }, [reviews, filter, search, sort])

  const runAction = async (review: Review, action: ReviewAction) => {
    setActionError(null)
    if (action.kind === 'edit') {
      setEditing(review)
      return
    }
    if (action.kind === 'delete') {
      setConfirming(review)
      return
    }
    const next: ReviewStatus =
      action.kind === 'approve' ? 'published' : action.kind === 'reject' ? 'rejected' : 'hidden'
    const ok = await setStatus(review.id, next)
    if (!ok) setActionError('That update was refused by Firestore. Check your admin claim.')
  }

  const handleDelete = async () => {
    if (!confirming) return
    const ok = await remove(confirming.id)
    if (ok) setConfirming(null)
    else setActionError('Could not delete that review.')
  }

  const handleSave = (patch: Partial<ReviewDraft>) =>
    editing ? saveEdit(editing.id, patch) : Promise.resolve(false)

  return (
    <div className="min-h-screen bg-ink-950">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 grid-lines opacity-30" />
      </div>

      <header className="relative border-b border-[var(--hairline)] bg-ink-900/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 md:px-8">
          <div className="flex items-center gap-3.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg border border-accent/40 bg-accent/10 font-display text-[13px] font-extrabold text-accent">
              HB
            </span>
            <div>
              <p className="display text-lg leading-none text-bone">HAIDER ADMIN</p>
              <p className="mt-1 font-mono text-[10px] text-bone-faint">
                Review moderation dashboard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden max-w-[16rem] truncate font-mono text-[11px] text-bone-mute sm:block">
              {email}
            </span>
            <a
              href="/"
              className="grid h-9 w-9 place-items-center rounded-full border border-[var(--hairline)] text-bone-mute transition hover:border-accent/50 hover:text-accent"
              aria-label="Back to portfolio"
              title="Back to portfolio"
            >
              <Icon name="external" size={15} />
            </a>
            <Button variant="ghost" size="md" onClick={() => void onSignOut()} disabled={signingOut}>
              {signingOut ? 'Signing out…' : 'Sign out'}
            </Button>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-7xl space-y-6 px-5 py-8 md:px-8 md:py-10">
        <StatsGrid stats={stats} />

        {(error || actionError) && (
          <div
            role="alert"
            className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#ff6b57]/40 bg-[#ff6b57]/10 px-5 py-4"
          >
            <p className="text-[13.5px] leading-relaxed text-[#ffb3a7]">{actionError ?? error}</p>
            <div className="flex gap-2">
              {actionError && (
                <Button variant="ghost" size="md" onClick={() => setActionError(null)}>
                  Dismiss
                </Button>
              )}
              <Button variant="ghost" size="md" onClick={() => void reload()}>
                Retry
              </Button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------ toolbar */}
        <div className="flex flex-col gap-4 rounded-2xl border border-[var(--hairline)] bg-white/[0.02] p-4 lg:flex-row lg:items-center lg:justify-between">
          <div
            className="no-scrollbar flex gap-2 overflow-x-auto"
            role="tablist"
            aria-label="Filter reviews by status"
          >
            {FILTERS.map((option) => {
              const count =
                option.value === 'all'
                  ? stats.total
                  : stats[option.value as ReviewStatus]
              const isActive = filter === option.value
              return (
                <button
                  key={option.value}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setFilter(option.value)}
                  className={cn(
                    'relative shrink-0 rounded-full border px-3.5 py-2 font-mono text-[10px] uppercase tracking-wider2 transition-colors duration-300',
                    isActive
                      ? 'border-accent/60 bg-accent text-ink'
                      : 'border-[var(--hairline)] text-bone-mute hover:border-[var(--hairline-strong)] hover:text-bone',
                  )}
                >
                  {option.label}
                  <span className={cn('ml-2 tabular', isActive ? 'text-ink/60' : 'text-bone-faint')}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 lg:w-56 lg:flex-none">
              <Icon
                name="search"
                size={14}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-bone-faint"
              />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search reviewer name…"
                aria-label="Search reviews by reviewer name"
                className="h-10 w-full rounded-full border border-[var(--hairline)] bg-transparent pl-9 pr-3 text-[13px] text-bone outline-none transition-colors placeholder:text-bone-faint focus:border-accent/60"
              />
            </div>

            <button
              type="button"
              onClick={() => setSort((current) => (current === 'newest' ? 'oldest' : 'newest'))}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-[var(--hairline)] px-4 font-mono text-[10px] uppercase tracking-wider2 text-bone-mute transition-colors hover:border-accent/50 hover:text-accent"
            >
              <Icon name="arrow-down" size={13} />
              {sort === 'newest' ? 'Newest first' : 'Oldest first'}
            </button>

            <button
              type="button"
              onClick={() => void reload()}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-[var(--hairline)] px-4 font-mono text-[10px] uppercase tracking-wider2 text-bone-mute transition-colors hover:border-accent/50 hover:text-accent"
            >
              <Icon name="spinner" size={13} className={state === 'loading' ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>

        {/* -------------------------------------------------------- list */}
        {state === 'loading' && (
          <div className="grid gap-3" aria-busy="true" aria-live="polite">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-40 animate-pulse rounded-2xl border border-[var(--hairline)] bg-white/[0.02]"
              />
            ))}
            <p className="sr-only">Loading reviews…</p>
          </div>
        )}

        {state === 'unconfigured' && (
          <div className="rounded-2xl border border-dashed border-[var(--hairline-strong)] p-8 text-center">
            <Icon name="lock" size={22} className="mx-auto text-bone-faint" />
            <h2 className="display mt-4 text-xl text-bone">Firebase not configured</h2>
            <p className="mx-auto mt-2 max-w-md text-[14px] leading-relaxed text-bone-mute">
              Add <code className="text-accent">VITE_FIREBASE_API_KEY</code> to <code>.env</code>,
              then restart and reload this page.
            </p>
          </div>
        )}

        {state === 'error' && (
          <div className="rounded-2xl border border-[#ff6b57]/40 bg-[#ff6b57]/[0.07] p-8 text-center">
            <Icon name="close" size={22} className="mx-auto text-[#ff6b57]" />
            <h2 className="display mt-4 text-xl text-bone">Could not load reviews</h2>
            <p className="mx-auto mt-2 max-w-md text-[14px] leading-relaxed text-bone-mute">
              {error}
            </p>
            <div className="mt-5 flex justify-center">
              <Button variant="ghost" size="md" icon="arrow-right" onClick={() => void reload()}>
                Try again
              </Button>
            </div>
          </div>
        )}

        {state === 'ready' && visible.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[var(--hairline-strong)] p-10 text-center">
            <Icon name="quote" size={22} className="mx-auto text-bone-faint" />
            <h2 className="display mt-4 text-xl text-bone">
              {reviews.length === 0 ? 'No reviews yet' : 'Nothing matches this view'}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-[14px] leading-relaxed text-bone-mute">
              {reviews.length === 0
                ? 'Submitted reviews will appear here as soon as visitors send them.'
                : 'Try a different status filter or clear the search field.'}
            </p>
            {reviews.length > 0 && (
              <div className="mt-5 flex justify-center">
                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => {
                    setFilter('all')
                    setSearch('')
                  }}
                >
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        )}

        {state === 'ready' && visible.length > 0 && (
          <div aria-live="polite">
            <div className="mb-3 flex items-center justify-between">
              <p className="label text-bone-faint">
                Showing {visible.length} of {reviews.length}
              </p>
              <p className="label text-bone-faint">
                {filter === 'all' ? 'All statuses' : `${filter} only`}
              </p>
            </div>

            <motion.div layout className="grid gap-3 xl:grid-cols-2">
              <AnimatePresence mode="popLayout" initial={false}>
                {visible.map((review) => (
                  <ReviewRow
                    key={review.id}
                    review={review}
                    busy={mutating === review.id}
                    onAction={(action) => void runAction(review, action)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </main>

      <ReviewEditor
        review={editing}
        busy={Boolean(mutating)}
        onSave={handleSave}
        onClose={() => setEditing(null)}
      />

      <ConfirmDialog
        open={Boolean(confirming)}
        title="Delete this review?"
        body={
          confirming
            ? `“${confirming.text.slice(0, 120)}${confirming.text.length > 120 ? '…' : ''}” — this permanently removes the review from Firestore and cannot be undone.`
            : ''
        }
        confirmLabel="Delete permanently"
        destructive
        busy={Boolean(mutating)}
        onConfirm={() => void handleDelete()}
        onCancel={() => setConfirming(null)}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="border-t border-[var(--hairline)] px-5 py-5 md:px-8"
      >
        <p className="mx-auto max-w-7xl font-mono text-[10.5px] leading-relaxed text-bone-faint">
          Writes are governed by <code className="text-bone-mute">firestore.rules</code> — only
          the authenticated admin claim can approve, edit or delete. Public visitors can create a
          review, but it always lands as <span className="text-[#E9C46A]">pending</span>.
        </p>
      </motion.div>
    </div>
  )
}
