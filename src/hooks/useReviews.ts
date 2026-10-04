import { useCallback, useEffect, useState } from 'react'
import { describeFirebaseError, isFirebaseConfigured } from '@/firebase/env'
import type { Review } from '@/firebase/types'

export type ReviewsStatus = 'loading' | 'ready' | 'error' | 'unconfigured'

interface UsePublishedReviews {
  reviews: Review[]
  status: ReviewsStatus
  error: string | null
  reload: () => Promise<void>
}

export function usePublishedReviews(): UsePublishedReviews {
  const [reviews, setReviews] = useState<Review[]>([])
  const [status, setStatus] = useState<ReviewsStatus>(() =>
    isFirebaseConfigured ? 'loading' : 'unconfigured',
  )
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    if (!isFirebaseConfigured) {
      setStatus('unconfigured')
      return
    }
    setStatus((current) => (current === 'ready' ? 'ready' : 'loading'))
    setError(null)
    try {
      // Dynamic so the Firebase SDK stays out of the initial page chunk.
      const { fetchPublishedReviews } = await import('@/firebase/reviews')
      const list = await fetchPublishedReviews()
      setReviews(list)
      setStatus('ready')
    } catch (err) {
      setError(describeFirebaseError(err))
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    void reload()
  }, [reload])

  return { reviews, status, error, reload }
}

export function averageRating(reviews: Review[]): number | null {
  if (!reviews.length) return null
  const total = reviews.reduce((sum, review) => sum + review.rating, 0)
  return Math.round((total / reviews.length) * 10) / 10
}
