import { useCallback, useEffect, useMemo, useState } from 'react'
import { describeFirebaseError, isFirebaseConfigured } from '@/firebase/config'
import { fetchAllReviews, removeReview, setReviewStatus, updateReview } from '@/firebase/reviews'
import { EMPTY_STATS, type Review, type ReviewDraft, type ReviewStats, type ReviewStatus } from '@/firebase/types'

export type LoadState = 'loading' | 'ready' | 'error' | 'unconfigured'

interface AdminReviewsApi {
  reviews: Review[]
  stats: ReviewStats
  state: LoadState
  error: string | null
  mutating: string | null
  reload: () => Promise<void>
  setStatus: (id: string, status: ReviewStatus) => Promise<boolean>
  saveEdit: (id: string, patch: Partial<ReviewDraft>) => Promise<boolean>
  remove: (id: string) => Promise<boolean>
}

export function useAdminReviews(): AdminReviewsApi {
  const [reviews, setReviews] = useState<Review[]>([])
  const [state, setState] = useState<LoadState>(() =>
    isFirebaseConfigured ? 'loading' : 'unconfigured',
  )
  const [error, setError] = useState<string | null>(null)
  const [mutating, setMutating] = useState<string | null>(null)

  const reload = useCallback(async () => {
    if (!isFirebaseConfigured) {
      setState('unconfigured')
      return
    }
    setError(null)
    try {
      const list = await fetchAllReviews()
      setReviews(list)
      setState('ready')
    } catch (err) {
      setError(describeFirebaseError(err))
      setState('error')
    }
  }, [])

  useEffect(() => {
    void reload()
  }, [reload])

  const stats = useMemo<ReviewStats>(() => {
    const next: ReviewStats = { ...EMPTY_STATS, total: reviews.length }
    reviews.forEach((review) => {
      next[review.status] += 1
    })
    return next
  }, [reviews])

  const setStatus = useCallback(
    async (id: string, status: ReviewStatus) => {
      setMutating(id)
      setError(null)
      try {
        await setReviewStatus(id, status)
        setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
        return true
      } catch (err) {
        setError(describeFirebaseError(err))
        return false
      } finally {
        setMutating(null)
      }
    },
    [],
  )

  const saveEdit = useCallback(async (id: string, patch: Partial<ReviewDraft>) => {
    setMutating(id)
    setError(null)
    try {
      await updateReview(id, patch)
      setReviews((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                ...patch,
                name: patch.name?.trim() ?? r.name,
                email: patch.email?.trim() ?? r.email,
                role: patch.role?.trim() ?? r.role,
                text: patch.text?.trim() ?? r.text,
              }
            : r,
        ),
      )
      return true
    } catch (err) {
      setError(describeFirebaseError(err))
      return false
    } finally {
      setMutating(null)
    }
  }, [])

  const remove = useCallback(async (id: string) => {
    setMutating(id)
    setError(null)
    try {
      await removeReview(id)
      setReviews((prev) => prev.filter((r) => r.id !== id))
      return true
    } catch (err) {
      setError(describeFirebaseError(err))
      return false
    } finally {
      setMutating(null)
    }
  }, [])

  return { reviews, stats, state, error, mutating, reload, setStatus, saveEdit, remove }
}
