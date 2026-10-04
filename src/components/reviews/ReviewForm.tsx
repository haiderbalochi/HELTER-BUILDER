import { useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { Spinner } from '@/components/ui/Spinner'
import { Stars } from '@/components/ui/Stars'
import { describeFirebaseError, isFirebaseConfigured } from '@/firebase/env'
import { validateReview, type ReviewDraft } from '@/firebase/types'
import { EASE_OUT_EXPO } from '@/lib/motion'
import { cn } from '@/lib/utils'

const EMPTY: ReviewDraft = { name: '', email: '', role: '', rating: 0, text: '' }

type Phase = 'idle' | 'submitting' | 'success' | 'error'

export function ReviewForm({ onSubmitted }: { onSubmitted?: () => void }) {
  const [draft, setDraft] = useState<ReviewDraft>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<keyof ReviewDraft, string>>>({})
  const [phase, setPhase] = useState<Phase>(() => (isFirebaseConfigured ? 'idle' : 'error'))
  const [failure, setFailure] = useState<string | null>(
    isFirebaseConfigured
      ? null
      : 'The review service is not configured yet — add VITE_FIREBASE_API_KEY to the project environment.',
  )

  const set = <K extends keyof ReviewDraft>(key: K, value: ReviewDraft[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev))
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setFailure(null)

    const found = validateReview(draft)
    if (Object.values(found).some(Boolean)) {
      setErrors(found)
      setPhase('error')
      setFailure('Please fix the highlighted fields before submitting.')
      return
    }

    setPhase('submitting')
    try {
      const { submitReview } = await import('@/firebase/reviews')
      await submitReview(draft)
      setPhase('success')
      setDraft(EMPTY)
      onSubmitted?.()
    } catch (error) {
      setPhase('error')
      setFailure(describeFirebaseError(error))
    }
  }

  if (phase === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
        className="flex flex-col items-start gap-5 rounded-2xl border border-accent/35 bg-accent/[0.06] p-7"
        role="status"
      >
        <span className="grid h-12 w-12 place-items-center rounded-full bg-accent text-ink">
          <Icon name="check" size={22} strokeWidth={2.2} />
        </span>
        <div>
          <h4 className="display text-2xl text-bone">Review received</h4>
          <p className="mt-3 max-w-prose2 text-[14.5px] leading-relaxed text-bone-mute">
            Thank you — your review has been saved and is awaiting approval. Only approved
            reviews appear on this page, so nothing is published automatically.
          </p>
        </div>
        <Button
          variant="ghost"
          size="md"
          onClick={() => {
            setPhase('idle')
            setFailure(null)
          }}
        >
          Write another
        </Button>
      </motion.div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          id="review-name"
          label="Name"
          required
          value={draft.name}
          error={errors.name}
          onChange={(value) => set('name', value)}
          placeholder="Your name"
          autoComplete="name"
        />
        <Field
          id="review-email"
          label="Email"
          type="email"
          required
          value={draft.email}
          error={errors.email}
          onChange={(value) => set('email', value)}
          placeholder="you@company.com"
          autoComplete="email"
          hint="Never displayed publicly"
        />
      </div>

      <Field
        id="review-role"
        label="Role / Company"
        value={draft.role}
        error={errors.role}
        onChange={(value) => set('role', value)}
        placeholder="Founder, Acme Inc. (optional)"
        hint="Optional"
      />

      <fieldset className="space-y-2 border-0 p-0">
        <legend className="label block text-bone-mute">
          Rating <span className="text-accent">*</span>
        </legend>
        <Stars
          value={draft.rating}
          onChange={(value) => set('rating', value)}
          size={20}
          name="review-rating"
        />
        {errors.rating && <p className="text-[12px] text-[#ff6b57]">{errors.rating}</p>}
      </fieldset>

      <div className="space-y-2">
        <label htmlFor="review-text" className="label block text-bone-mute">
          Review <span className="text-accent">*</span>
        </label>
        <textarea
          id="review-text"
          value={draft.text}
          onChange={(event) => set('text', event.target.value)}
          rows={5}
          maxLength={1200}
          placeholder="What was it like working with Haider?"
          aria-invalid={Boolean(errors.text)}
          className={cn('field resize-none', errors.text && 'field-error')}
        />
        <div className="flex items-center justify-between gap-4">
          <p className={cn('text-[12px]', errors.text ? 'text-[#ff6b57]' : 'text-bone-faint')}>
            {errors.text || 'Minimum 10 characters'}
          </p>
          <p className="font-mono text-[11px] tabular text-bone-faint">
            {draft.text.length}/1200
          </p>
        </div>
      </div>

      <AnimatePresence>
        {failure && phase === 'error' && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            role="alert"
            className="overflow-hidden rounded-lg border border-[#ff6b57]/40 bg-[#ff6b57]/10 px-4 py-3 text-[13px] leading-relaxed text-[#ffb3a7]"
          >
            {failure}
          </motion.p>
        )}
      </AnimatePresence>

      <div className="flex flex-wrap items-center gap-4 border-t border-[var(--hairline)] pt-6">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          icon={phase === 'submitting' ? undefined : 'send'}
          disabled={phase === 'submitting'}
        >
          {phase === 'submitting' ? (
            <span className="flex items-center gap-2.5">
              <Spinner size={14} /> Sending…
            </span>
          ) : (
            'Submit review'
          )}
        </Button>
        <p className="label max-w-xs text-bone-faint">
          Submissions are held for approval before they appear publicly.
        </p>
      </div>
    </form>
  )
}

interface FieldProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  type?: string
  placeholder?: string
  required?: boolean
  autoComplete?: string
  hint?: string
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  type = 'text',
  placeholder,
  required = false,
  autoComplete,
  hint,
}: FieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="label block text-bone-mute">
        {label} {required && <span className="text-accent">*</span>}
        {hint && <span className="ml-2 normal-case tracking-normal text-bone-faint">({hint})</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        className={cn('field', error && 'field-error')}
      />
      {error && <p className="text-[12px] text-[#ff6b57]">{error}</p>}
    </div>
  )
}
