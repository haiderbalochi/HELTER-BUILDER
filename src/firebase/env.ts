/**
 * Environment-only Firebase configuration.
 *
 * Deliberately free of any `firebase/*` import so the public site can read
 * `isFirebaseConfigured` (and map error messages) without pulling the ~110 kB
 * gzipped SDK into the initial page load. The SDK itself is loaded on demand
 * through `firebase/config.ts`.
 *
 * Every value is read from an environment variable first (`.env.example`).
 * The non-secret project identifiers are duplicated as fallbacks purely so the
 * site still boots if the owner only supplies `VITE_FIREBASE_API_KEY`.
 * Nothing is hardcoded across components — this file is the single source.
 */
const env = import.meta.env

export const firebaseConfig = {
  apiKey: (env.VITE_FIREBASE_API_KEY as string | undefined) ?? '',
  authDomain:
    (env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined) ?? 'haider-baloch.firebaseapp.com',
  projectId: (env.VITE_FIREBASE_PROJECT_ID as string | undefined) ?? 'haider-baloch',
  storageBucket:
    (env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined) ?? 'haider-baloch.firebasestorage.app',
  messagingSenderId:
    (env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined) ?? '34768683508',
  appId:
    (env.VITE_FIREBASE_APP_ID as string | undefined) ??
    '1:34768683508:web:24ec0a250bde42cdb9b9a1',
  measurementId: (env.VITE_FIREBASE_MEASUREMENT_ID as string | undefined) ?? 'G-3VSGFMDSNP',
}

/**
 * ⚠️ The Firebase Web API key was never supplied with the brief, so this is
 * false until the owner adds `VITE_FIREBASE_API_KEY` to `.env`.
 * The public site degrades gracefully; reviews + admin report a clear state.
 */
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId,
)

export const COLLECTION_REVIEWS = 'reviews'
export const COLLECTION_ADMINS = 'admins'

/** Human-readable copy for Firebase error codes. */
export function describeFirebaseError(error: unknown): string {
  const code =
    typeof error === 'object' && error !== null && 'code' in error
      ? String((error as { code: unknown }).code)
      : ''
  const message = error instanceof Error ? error.message : ''
  // `getFirebase()`/`reviews` throw plain `Error`s, so the "code" often lives
  // on the message. Resolve one key so both shapes hit the map below.
  const key = code || message

  const map: Record<string, string> = {
    'firebase-not-configured':
      'Reviews are not connected yet — the Firebase Web API key is missing from the project configuration.',
    'auth/invalid-api-key':
      'Firebase is not configured yet — add VITE_FIREBASE_API_KEY to your .env file.',
    'auth/configuration-not-found':
      'Email/password sign-in is disabled for this Firebase project. Enable it under Authentication → Sign-in method.',
    'auth/invalid-credential': 'That email and password combination was not recognised.',
    'auth/wrong-password': 'That password is not correct.',
    'auth/user-not-found': 'No admin account exists with that email yet.',
    'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
    'auth/network-request-failed': 'Could not reach Firebase. Check your connection.',
    'permission-denied':
      'You do not have permission for this action. The admin claim may not be granted yet — see README § Admin setup.',
    unavailable: 'The review service is temporarily unreachable. Please try again shortly.',
    'failed-precondition':
      'Firestore requires an index for this query. Follow the link in the error console to create it.',
  }

  if (map[key]) return map[key]
  if (map[code]) return map[code]

  // Only surface free-text messages. Anything that looks like a machine code
  // (lowercase tokens joined by `-`/`/`) is swallowed rather than shown raw.
  if (message && !/^[a-z0-9]+([\-/][a-z0-9]+)+$/.test(message)) return message
  return 'Something went wrong. Please try again.'
}
