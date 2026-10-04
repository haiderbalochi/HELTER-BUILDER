import { useCallback, useEffect, useState } from 'react'
import type { User } from 'firebase/auth'
import { adminSignIn, adminSignOut, resolveIsAdmin, watchAuth } from '@/firebase/auth'
import { describeFirebaseError, isFirebaseConfigured } from '@/firebase/config'

export type AdminPhase =
  | 'booting'
  | 'unconfigured'
  | 'signed-out'
  | 'forbidden'
  | 'ready'

interface AdminAuthState {
  phase: AdminPhase
  user: User | null
  busy: boolean
  error: string | null
  signIn: (email: string, password: string) => Promise<boolean>
  signOut: () => Promise<void>
  clearError: () => void
}

export function useAdminAuth(): AdminAuthState {
  const [phase, setPhase] = useState<AdminPhase>(() =>
    isFirebaseConfigured ? 'booting' : 'unconfigured',
  )
  const [user, setUser] = useState<User | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isFirebaseConfigured) return

    let cancelled = false

    const unsubscribe = watchAuth(async (nextUser) => {
      if (cancelled) return
      if (!nextUser) {
        setUser(null)
        setPhase('signed-out')
        return
      }
      const allowed = await resolveIsAdmin(nextUser)
      if (cancelled) return
      setUser(nextUser)
      setPhase(allowed ? 'ready' : 'forbidden')
    })

    return () => {
      cancelled = true
      unsubscribe()
    }
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    setBusy(true)
    setError(null)
    try {
      const signedIn = await adminSignIn(email.trim(), password)
      const allowed = await resolveIsAdmin(signedIn)
      setUser(signedIn)
      if (!allowed) {
        setPhase('forbidden')
        return false
      }
      setPhase('ready')
      return true
    } catch (err) {
      if (err instanceof Error && err.message === 'firebase-not-configured') {
        setPhase('unconfigured')
      } else {
        setError(describeFirebaseError(err))
      }
      return false
    } finally {
      setBusy(false)
    }
  }, [])

  const signOut = useCallback(async () => {
    setBusy(true)
    try {
      await adminSignOut()
      setUser(null)
      setError(null)
      setPhase('signed-out')
    } catch (err) {
      setError(describeFirebaseError(err))
    } finally {
      setBusy(false)
    }
  }, [])

  return { phase, user, busy, error, signIn, signOut, clearError: () => setError(null) }
}
