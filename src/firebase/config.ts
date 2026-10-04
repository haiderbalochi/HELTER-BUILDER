import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { firebaseConfig, isFirebaseConfigured } from './env'

export {
  firebaseConfig,
  isFirebaseConfigured,
  describeFirebaseError,
  COLLECTION_REVIEWS,
  COLLECTION_ADMINS,
} from './env'

interface FirebaseHandles {
  app: FirebaseApp
  auth: Auth
  db: Firestore
}

let handles: FirebaseHandles | null = null
let initError: Error | null = null

/** Lazily boots the SDK. Returns `null` until `VITE_FIREBASE_API_KEY` exists. */
export function getFirebase(): FirebaseHandles | null {
  if (!isFirebaseConfigured) return null
  if (handles) return handles
  try {
    const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
    handles = { app, auth: getAuth(app), db: getFirestore(app) }
    return handles
  } catch (error) {
    initError = error instanceof Error ? error : new Error(String(error))
    return null
  }
}

export function getFirebaseError(): Error | null {
  return initError
}
