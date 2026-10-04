import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore'
import { COLLECTION_REVIEWS, getFirebase } from './config'
import { toMillis, type Review, type ReviewDraft, type ReviewStatus } from './types'

function mapReview(snapshot: QueryDocumentSnapshot<DocumentData>): Review {
  const data = snapshot.data()
  return {
    id: snapshot.id,
    name: String(data.name ?? ''),
    email: String(data.email ?? ''),
    role: String(data.role ?? ''),
    rating: Math.min(5, Math.max(1, Number(data.rating ?? 5))),
    text: String(data.text ?? ''),
    status: (data.status as ReviewStatus) ?? 'pending',
    createdAt: toMillis(data.createdAt),
  }
}

/* ------------------------------------------------------------------ */
/*  Public                                                             */
/* ------------------------------------------------------------------ */

/**
 * Public query. Filters on `status` only so Firestore needs no composite
 * index; sorting happens client-side (the dataset is small by design).
 * Firestore rules independently guarantee no non-published doc can leak.
 */
export async function fetchPublishedReviews(max = 40): Promise<Review[]> {
  const fb = getFirebase()
  if (!fb) throw new Error('firebase-not-configured')

  const q = query(
    collection(fb.db, COLLECTION_REVIEWS),
    where('status', '==' , 'published'),
    limit(max),
  )
  const snapshot = await getDocs(q)
  return snapshot.docs
    .map(mapReview)
    .filter((review) => review.text && review.name)
    .sort((a, b) => b.createdAt - a.createdAt)
}

/**
 * Submits a review in the `pending` state. Publication is only ever possible
 * through the authenticated admin dashboard — never from the public form.
 */
export async function submitReview(draft: ReviewDraft): Promise<void> {
  const fb = getFirebase()
  if (!fb) throw new Error('firebase-not-configured')

  await addDoc(collection(fb.db, COLLECTION_REVIEWS), {
    name: draft.name.trim(),
    email: draft.email.trim(),
    role: draft.role.trim(),
    rating: draft.rating,
    text: draft.text.trim(),
    status: 'pending',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

/* ------------------------------------------------------------------ */
/*  Admin                                                              */
/* ------------------------------------------------------------------ */

export async function fetchAllReviews(): Promise<Review[]> {
  const fb = getFirebase()
  if (!fb) throw new Error('firebase-not-configured')

  const q = query(collection(fb.db, COLLECTION_REVIEWS), orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(mapReview)
}

export async function setReviewStatus(id: string, status: ReviewStatus): Promise<void> {
  const fb = getFirebase()
  if (!fb) throw new Error('firebase-not-configured')
  await updateDoc(doc(fb.db, COLLECTION_REVIEWS, id), {
    status,
    updatedAt: serverTimestamp(),
  })
}

export async function updateReview(id: string, patch: Partial<ReviewDraft>): Promise<void> {
  const fb = getFirebase()
  if (!fb) throw new Error('firebase-not-configured')
  await updateDoc(doc(fb.db, COLLECTION_REVIEWS, id), {
    ...(patch.name !== undefined && { name: patch.name.trim() }),
    ...(patch.email !== undefined && { email: patch.email.trim() }),
    ...(patch.role !== undefined && { role: patch.role.trim() }),
    ...(patch.rating !== undefined && { rating: patch.rating }),
    ...(patch.text !== undefined && { text: patch.text.trim() }),
    updatedAt: serverTimestamp(),
  })
}

export async function removeReview(id: string): Promise<void> {
  const fb = getFirebase()
  if (!fb) throw new Error('firebase-not-configured')
  await deleteDoc(doc(fb.db, COLLECTION_REVIEWS, id))
}
