import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Spinner } from '@/components/ui/Spinner'
import { Stars } from '@/components/ui/Stars'
import { validateReview, type Review, type ReviewDraft } from '@/firebase/types'
import { cn } from '@/lib/utils'

interface ReviewEditorProps {
  review: Review | null
  busy?: boolean
  onSave: (patch: Partial<ReviewDraft>) => Promise<boolean>
  onClose: () => void
}

type Errors = Partial<Record<keyof ReviewDraft, string>>

export function ReviewEditor({ review, busy, onSave, onClose }: ReviewEditorProps) {
  const [draft, setDraft] = useState<ReviewDraft>({
    name: '',
    email: '',
    role: '',
    rating: 5,
    text: '',
  })
  const [errors, setErrors] = useState<Errors>({})

  useEffect(() => {
    if (!review) return
    setDraft({
      name: review.name,
      email: review.email,
      role: review.role,
      rating: review.rating,
      text: review.text,
    })
    setErrors({})
  }, [review])

  const set = <K extends keyof ReviewDraft>(key: K, value: ReviewDraft[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev))
  }

  const handleSave = async () => {
    const found = validateReview(draft)
    setErrors(found)
    if (Object.values(found).some(Boolean)) return
    const ok = await onSave(draft)
    if (ok) onClose()
  }

  return (
    <Modal
      open={Boolean(review)}
      onClose={onClose}
      title="Edit review"
      eyebrow={review ? `From ${review.name}` : undefined}
      className="sm:max-w-2xl"
    >
      <div className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="edit-name" className="label block text-bone-mute">
              Name <span className="text-accent">*</span>
            </label>
            <input
              id="edit-name"
              value={draft.name}
              onChange={(event) => set('name', event.target.value)}
              className={cn('field', errors.name && 'field-error')}
            />
            {errors.name && <p className="text-[12px] text-[#ff6b57]">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="edit-email" className="label block text-bone-mute">
              Email <span className="text-accent">*</span>
            </label>
            <input
              id="edit-email"
              type="email"
              value={draft.email}
              onChange={(event) => set('email', event.target.value)}
              className={cn('field', errors.email && 'field-error')}
            />
            {errors.email && <p className="text-[12px] text-[#ff6b57]">{errors.email}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="edit-role" className="label block text-bone-mute">
            Role / Company
          </label>
          <input
            id="edit-role"
            value={draft.role}
            onChange={(event) => set('role', event.target.value)}
            className={cn('field', errors.role && 'field-error')}
          />
          {errors.role && <p className="text-[12px] text-[#ff6b57]">{errors.role}</p>}
        </div>

        <div className="space-y-2">
          <span className="label block text-bone-mute">Rating</span>
          <Stars value={draft.rating} onChange={(value) => set('rating', value)} size={20} />
          {errors.rating && <p className="text-[12px] text-[#ff6b57]">{errors.rating}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="edit-text" className="label block text-bone-mute">
            Review <span className="text-accent">*</span>
          </label>
          <textarea
            id="edit-text"
            rows={6}
            maxLength={1200}
            value={draft.text}
            onChange={(event) => set('text', event.target.value)}
            className={cn('field resize-none', errors.text && 'field-error')}
          />
          <div className="flex items-center justify-between">
            <p className={cn('text-[12px]', errors.text ? 'text-[#ff6b57]' : 'text-bone-faint')}>
              {errors.text || 'Minimum 10 characters'}
            </p>
            <p className="font-mono text-[11px] tabular text-bone-faint">{draft.text.length}/1200</p>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-[var(--hairline)] pt-6">
          <Button variant="ghost" size="md" onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => void handleSave()}
            disabled={busy}
            icon={busy ? undefined : 'check'}
          >
            {busy ? (
              <span className="flex items-center gap-2">
                <Spinner size={13} /> Saving…
              </span>
            ) : (
              'Save changes'
            )}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
