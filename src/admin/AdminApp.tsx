import { Suspense, lazy, useState } from 'react'
import { AdminLogin } from './AdminLogin'
import { useAdminAuth } from './useAdminAuth'
import { Spinner } from '@/components/ui/Spinner'
import { isFirebaseConfigured } from '@/firebase/config'

const AdminDashboard = lazy(() =>
  import('./AdminDashboard').then((module) => ({ default: module.AdminDashboard })),
)

function BootScreen({ message }: { message: string }) {
  return (
    <div className="grid min-h-screen place-items-center bg-ink-950 px-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <Spinner size={26} className="text-accent" />
        <p className="label text-bone-mute">{message}</p>
      </div>
    </div>
  )
}

/**
 * Route: /hideadmin
 *
 * Deliberately absent from the public navbar and footer. Authentication is
 * Firebase Authentication; authorization is enforced by `firestore.rules`,
 * not by anything in this file.
 */
export default function AdminApp() {
  const { phase, user, busy, error, signIn, signOut, clearError } = useAdminAuth()
  const [signingOut, setSigningOut] = useState(false)

  if (!isFirebaseConfigured || phase === 'unconfigured') {
    return (
      <AdminLogin
        onSubmit={async () => false}
        busy={false}
        error={
          'Firebase is not configured for this build. Add VITE_FIREBASE_API_KEY to .env, restart the dev server and reload.'
        }
        onClearError={() => undefined}
      />
    )
  }

  if (phase === 'booting') {
    return <BootScreen message="Checking credentials…" />
  }

  if (phase === 'signed-out') {
    return <AdminLogin onSubmit={signIn} busy={busy} error={error} onClearError={clearError} />
  }

  if (phase === 'forbidden') {
    return (
      <div className="grid min-h-screen place-items-center bg-ink-950 px-6">
        <div className="w-full max-w-lg rounded-3xl border border-[#ff6b57]/40 bg-[#ff6b57]/[0.07] p-8">
          <p className="label mb-3 text-[#ff6b57]">Access denied</p>
          <h1 className="display text-3xl text-bone">Not an admin account</h1>
          <p className="mt-4 text-[14.5px] leading-relaxed text-bone-mute">
            <span className="text-bone">{user?.email}</span> signed in successfully, but this
            account does not hold the <code className="text-accent">admin</code> custom claim and
            is not the UID recorded in <code className="text-accent">firestore.rules</code>.
          </p>
          <ol className="mt-5 list-decimal space-y-2 pl-5 text-[13.5px] leading-relaxed text-bone-mute">
            <li>
              Run <code className="text-accent">npm run admin:setup</code> with a service account
              key.
            </li>
            <li>
              Copy the printed UID into <code className="text-accent">VITE_ADMIN_UID</code>.
            </li>
            <li>
              Replace <code className="text-accent">REPLACE_WITH_ADMIN_UID</code> in{' '}
              <code className="text-accent">firestore.rules</code> and deploy the rules.
            </li>
          </ol>
          <button
            type="button"
            onClick={() => void signOut()}
            disabled={signingOut}
            className="mt-7 inline-flex h-11 items-center rounded-full border border-[var(--hairline-strong)] px-6 font-mono text-[11px] uppercase tracking-wider2 text-bone transition hover:border-accent/60 hover:text-accent disabled:opacity-50"
          >
            {signingOut ? 'Signing out…' : 'Sign out'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <Suspense fallback={<BootScreen message="Loading dashboard…" />}>
      <AdminDashboard
        email={user?.email ?? 'Signed in'}
        signingOut={signingOut}
        onSignOut={async () => {
          setSigningOut(true)
          try {
            await signOut()
          } finally {
            setSigningOut(false)
          }
        }}
      />
    </Suspense>
  )
}
