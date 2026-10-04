#!/usr/bin/env node
/**
 * One-time admin bootstrap — runs on the OWNER'S machine only.
 *   npm run admin:setup
 *
 * Requires a Firebase service account (never shipped to the browser):
 *   export GOOGLE_APPLICATION_CREDENTIALS=/abs/path/serviceAccount.json
 *
 * What it does:
 *   1. creates (or re-uses) the admin user in Firebase Authentication
 *   2. grants the `admin: true` custom claim  ← what firestore.rules checks
 *   3. writes the `admins/{uid}` marker document
 *   4. prints the UID so you can paste it into `.env` and `firestore.rules`
 *
 * ⚠️  No password is ever written into client-side JavaScript. Credentials are
 *     read from your shell / .env at run time only.
 */
import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

async function readDotEnv() {
  const file = path.join(root, '.env')
  if (!existsSync(file)) return {}
  const raw = await readFile(file, 'utf8')
  const out = {}
  for (const line of raw.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    out[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim()
  }
  return out
}

const email =
  process.env.ADMIN_EMAIL ||
  (await readDotEnv()).VITE_ADMIN_EMAIL ||
  'meramobile058@gmail.com'

const password = process.env.ADMIN_PASSWORD || '123456'

if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  console.error(
    `\n✖ The admin email "${email}" is not a valid email address.\n` +
      `  It was supplied with a "!" instead of "@".\n` +
      `  Pass the corrected address explicitly:\n\n` +
      `    ADMIN_EMAIL=you@gmail.com npm run admin:setup\n\n` +
      `  Nothing has been changed automatically.\n`,
  )
  process.exit(1)
}

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error(
    '\n✖ GOOGLE_APPLICATION_CREDENTIALS is not set.\n' +
      '  Download a service account key from\n' +
      '  Firebase Console → Project settings → Service accounts → Generate new private key\n' +
      '  then run:\n\n' +
      '    GOOGLE_APPLICATION_CREDENTIALS=/abs/path/key.json npm run admin:setup\n',
  )
  process.exit(1)
}

let admin
try {
  admin = await import('firebase-admin/admin')
} catch {
  console.error('\n✖ firebase-admin is not installed. Run: npm i -D firebase-admin\n')
  process.exit(1)
}

admin.initializeApp()

const auth = admin.auth()
const db = admin.firestore()

let user
try {
  user = await auth.getUserByEmail(email)
  console.log(`• Re-using existing user ${user.uid}`)
} catch (error) {
  if (error?.code !== 'auth/user-not-found') {
    console.error('✖ Could not look up user:', error?.message ?? error)
    process.exit(1)
  }
  user = await auth.createUser({ email, password, displayName: 'Haider Baloch — Admin' })
  console.log(`✓ Created admin user ${user.uid}`)
  console.log('  Initial password set. Change it after the first sign-in.')
}

await auth.setCustomUserClaims(user.uid, { admin: true })
console.log('✓ Granted custom claim  admin: true')

await db.collection('admins').doc(user.uid).set(
  {
    email,
    role: 'owner',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  { merge: true },
)
console.log('✓ Wrote admins/' + user.uid)

// Refresh the token so the claim is active immediately for this user.
try {
  await auth.revokeRefreshTokens(user.uid)
} catch {
  /* harmless */
}

console.log(`
──────────────────────────────────────────────────────────────
  NEXT STEPS (both are required)

  1. .env
       VITE_ADMIN_EMAIL=${email}
       VITE_ADMIN_UID=${user.uid}

  2. firestore.rules — replace REPLACE_WITH_ADMIN_UID with:
       ${user.uid}

  3. Deploy the rules
       npx firebase deploy --only firestore:rules

  4. ⚠  The email above must be corrected first if it still
         contains "!" instead of "@".
──────────────────────────────────────────────────────────────
`)

process.exit(0)
