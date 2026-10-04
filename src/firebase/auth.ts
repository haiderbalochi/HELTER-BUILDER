import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth'
import { getFirebase } from './config'

const ADMIN_UID = (import.meta.env.VITE_ADMIN_UID as string | undefined)?.trim() ?? ''

/**
 * Admin entitlement. The real security boundary lives in `firestore.rules`,
 * which checks the same `admin` custom claim (or the UID in `VITE_ADMIN_UID`)
 * — this helper is only used for UI gating and must never be treated as
 * authorization on its own.
 */
export async function resolveIsAdmin(user: User | null): Promise<boolean> {
  if (!user) return false
  if (ADMIN_UID && user.uid === ADMIN_UID) return true
  try {
    const token = await user.getIdTokenResult()
    return token.claims.admin === true
  } catch {
    return false
  }
}

export async function adminSignIn(email: string, password: string): Promise<User> {
  const fb = getFirebase()
  if (!fb) throw new Error('firebase-not-configured')
  const credential = await signInWithEmailAndPassword(fb.auth, email, password)
  return credential.user
}

export async function adminSignOut(): Promise<void> {
  const fb = getFirebase()
  if (!fb) return
  await signOut(fb.auth)
}

export function watchAuth(callback: (user: User | null) => void): () => void {
  const fb = getFirebase()
  if (!fb) {
    callback(null)
    return () => undefined
  }
  return onAuthStateChanged(fb.auth, callback)
}
