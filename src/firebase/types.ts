import type { Timestamp } from 'firebase/firestore'

export type ReviewStatus = 'pending' | 'published' | 'hidden' | 'rejected'

export interface Review {
  id: string
  name: string
  email: string
  role: string
  rating: number
  text: string
  status: ReviewStatus
  createdAt: number
}

export interface ReviewDraft {
  name: string
  email: string
  role: string
  rating: number
  text: string
}

export interface ReviewStats {
  total: number
  pending: number
  published: number
  hidden: number
  rejected: number
}

export const EMPTY_STATS: ReviewStats = {
  total: 0,
  pending: 0,
  published: 0,
  hidden: 0,
  rejected: 0,
}

export const STATUS_LABEL: Record<ReviewStatus, string> = {
  pending: 'Pending',
  published: 'Published',
  hidden: 'Hidden',
  rejected: 'Rejected',
}

/** Client-side validation shared by the public form and the admin editor. */
export function validateReview(draft: ReviewDraft): Partial<Record<keyof ReviewDraft, string>> {
  const errors: Partial<Record<keyof ReviewDraft, string>> = {}
  const name = draft.name.trim()
  const email = draft.email.trim()
  const text = draft.text.trim()

  if (name.length < 2) errors.name = 'Please enter your name.'
  else if (name.length > 80) errors.name = 'Name is too long.'

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.email = 'Please enter a valid email.'

  if (draft.role.trim().length > 80) errors.role = 'Role is too long.'

  if (!Number.isInteger(draft.rating) || draft.rating < 1 || draft.rating > 5) {
    errors.rating = 'Please choose a rating from 1 to 5.'
  }

  if (text.length < 10) errors.text = 'Please write at least 10 characters.'
  else if (text.length > 1200) errors.text = 'Please keep the review under 1200 characters.'

  return errors
}

export function toMillis(value: Timestamp | number | undefined): number {
  if (typeof value === 'number') return value
  if (value && typeof value.toMillis === 'function') return value.toMillis()
  return 0
}
