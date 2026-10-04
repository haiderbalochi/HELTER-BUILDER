import { useMemo, useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { Spinner } from '@/components/ui/Spinner'
import { isFirebaseConfigured } from '@/firebase/config'
import { EASE_OUT_EXPO } from '@/lib/motion'
import { cn } from '@/lib/utils'

const CONFIGURED_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL as string | undefined) ?? ''

/** True when the configured admin email cannot be a real address. */
export function isMalformedEmail(value: string): boolean {
  return value.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

interface AdminLoginProps {
  onSubmit: (email: string, password: string) => Promise<boolean>
  busy: boolean
  error: string | null
  onClearError: () => void
}

export function AdminLogin({ onSubmit, busy, error, onClearError }: AdminLoginProps) {
  const [email, setEmail] = useState(CONFIGURED_EMAIL)
  const [password, setPassword] = useState('')
  const [localError, setLocalError] = useState<{ email?: string; password?: string }>({})

  const malformed = useMemo(() => isMalformedEmail(CONFIGURED_EMAIL), [])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    onClearError()

    const next: typeof localError = {}
    if (!email.trim()) next.email = 'Email is required.'
    if (!password) next.password = 'Password is required.'
    setLocalError(next)
    if (Object.keys(next).length) return

    await onSubmit(email, password)
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-12">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 grid-lines opacity-40" />
        <div
          className="absolute left-1/2 top-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              'radial-gradient(closest-side, rgba(200,255,77,0.09), transparent 72%)',
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
        className="relative w-full max-w-md"
      >
        <div className="mb-8 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <span className="grid h-8 w-8 place-items-center rounded-lg border border-accent/40 bg-accent/10 font-display text-[12px] font-extrabold text-accent">
              HB
            </span>
            <span className="font-mono text-[11px] uppercase tracking-widest2 text-bone">
              Haider <span className="text-bone-faint">Admin</span>
            </span>
          </a>
          <a
            href="/"
            className="font-mono text-[10px] uppercase tracking-wider2 text-bone-faint transition-colors hover:text-accent"
          >
            Exit
          </a>
        </div>

        <div className="glass-strong rounded-3xl p-7 md:p-8">
          <p className="label mb-3 text-accent/80">Restricted area</p>
          <h1 className="display text-3xl text-bone md:text-4xl">HAIDER ADMIN</h1>
          <p className="mt-3 text-[14px] leading-relaxed text-bone-mute">
            Sign in with the owner account to review, approve and manage public feedback.
          </p>

          {!isFirebaseConfigured && (
            <p
              role="alert"
              className="mt-6 rounded-xl border border-[#E9C46A]/40 bg-[#E9C46A]/10 px-4 py-3 text-[13px] leading-relaxed text-[#E9C46A]"
            >
              Firebase is not configured for this build. Add{' '}
              <code>VITE_FIREBASE_API_KEY</code> to <code>.env</code> and restart the dev server.
            </p>
          )}

          {malformed && (
            <p
              role="alert"
              className="mt-6 rounded-xl border border-[#ff6b57]/40 bg-[#ff6b57]/10 px-4 py-3 text-[13px] leading-relaxed text-[#ffb3a7]"
            >
              <strong>Configuration warning:</strong> the configured admin email{' '}
              <code className="whitespace-break-spaces">{CONFIGURED_EMAIL}</code> is malformed
              (it contains <code>!</code> where <code>@</code> belongs) and cannot be used to
              sign in. Replace <code>VITE_ADMIN_EMAIL</code> in <code>.env</code> before
              deploying. It has deliberately not been altered for you.
            </p>
          )}

          <form onSubmit={handleSubmit} noValidate className="mt-7 space-y-5">
            <div className="space-y-2">
              <label htmlFor="admin-email" className="label block text-bone-mute">
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value)
                  setLocalError((prev) => ({ ...prev, email: undefined }))
                }}
                autoComplete="username"
                placeholder="you@gmail.com"
                aria-invalid={Boolean(localError.email)}
                className={cn('field', localError.email && 'field-error')}
              />
              {localError.email && (
                <p className="text-[12px] text-[#ff6b57]">{localError.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="admin-password" className="label block text-bone-mute">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value)
                  setLocalError((prev) => ({ ...prev, password: undefined }))
                }}
                autoComplete="current-password"
                placeholder="••••••"
                aria-invalid={Boolean(localError.password)}
                className={cn('field', localError.password && 'field-error')}
              />
              {localError.password && (
                <p className="text-[12px] text-[#ff6b57]">{localError.password}</p>
              )}
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-xl border border-[#ff6b57]/40 bg-[#ff6b57]/10 px-4 py-3 text-[13px] leading-relaxed text-[#ffb3a7]"
              >
                {error}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={busy}
              icon={busy ? undefined : 'lock'}
            >
              {busy ? (
                <span className="flex items-center gap-2.5">
                  <Spinner size={14} /> Verifying…
                </span>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>
        </div>

        <p className="mt-6 flex items-start gap-2 text-[12px] leading-relaxed text-bone-faint">
          <Icon name="lock" size={13} className="mt-0.5 shrink-0" />
          Authentication is handled by Firebase Authentication. No password is stored in this
          website&apos;s source code.
        </p>
      </motion.div>
    </div>
  )
}
