# Haider Baloch — Portfolio

Dark, cinematic single-page portfolio for **Haider Baloch — Web & App Developer, Lahore, Pakistan**.

React + TypeScript + Vite + Tailwind CSS + Framer Motion, with a Firebase-backed
reviews system and a hidden admin dashboard.

```
/           the public portfolio
/hideadmin  admin dashboard (Firebase email/password — never linked publicly)
```

---

## ⚠️ Owner confirmation required before launch

Three things were supplied incompletely or inconsistently in the brief. Nothing was
silently "fixed" — each one is preserved exactly as given and surfaced here.
(The fourth item, a malformed admin email, was confirmed by the owner and is now
set to `meramobile058@gmail.com`.)

| # | Issue | What was done | What you must do |
|---|-------|---------------|------------------|
| 1 | **Firebase Web API key was never supplied.** | `VITE_FIREBASE_API_KEY` is empty → `isFirebaseConfigured === false`. Reviews and admin login show a clear "not connected" state; the rest of the site is unaffected. | Paste the key from Firebase Console → Project settings → General → **Web API key**. |
| 2 | **Phone number mismatch.** The brief displayed `03257944372` but gave WhatsApp as `+9232579434372` (one digit too many). | Display keeps `03257944372`. The `tel:` and `wa.me` links use the derived, valid `+923257944372` so the buttons are not broken. | Confirm the real WhatsApp number and update `SITE.whatsappNumber` in `src/lib/site.ts`. |
| 3 | **No skills list was supplied** for the Technologies section, and nothing may be invented. | `src/lib/technologies.ts` lists only entries derived from verifiable evidence (this repo's own stack, the four live project sites, and capabilities those sites demonstrate). Every entry carries an `evidence` field. | Review the list, delete anything wrong, add anything missing — it is a single file. |

Also worth confirming:

- **Mahrooj** (`https://mahrooj.vercel.app`) returns **HTTP 404**, so its card reads
  *COMING SOON* with no "Visit project" button. Flip it to `live` in
  `src/lib/projects.ts` once the site is up.
- Project screenshots and copy in `src/lib/projects.ts` — check the wording matches
  what the owner wants said publicly.
- `VITE_ADMIN_UID` in `.env` is empty until you run `npm run admin:setup`.

---

## Getting started

```bash
npm install
cp .env.example .env      # then fill in the values below
npm run dev               # http://localhost:5173
```

### Environment (`.env`)

| Variable | Purpose |
|----------|---------|
| `VITE_FIREBASE_API_KEY` | **Required for reviews + admin.** The only genuinely secret-looking value that reaches the browser. |
| `VITE_FIREBASE_AUTH_DOMAIN` | `haider-baloch.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `haider-baloch` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `haider-baloch.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `34768683508` |
| `VITE_FIREBASE_APP_ID` | `1:34768683508:web:24ec0a250bde42cdb9b9a1` |
| `VITE_FIREBASE_MEASUREMENT_ID` | `G-3VSGFMDSNP` |
| `VITE_ADMIN_EMAIL` | Owner-confirmed admin account — pre-fills `/hideadmin`. |
| `VITE_ADMIN_UID` | Written by `npm run admin:setup`. |

Every value is read in exactly one place: `src/firebase/env.ts`. Nothing in the
codebase hard-codes config.

`.env` is git-ignored. `.env.example` is the committed template.

### Scripts

```bash
npm run dev            # dev server
npm run build          # tsc --noEmit && vite build  → dist/
npm run preview        # serve dist/ locally
npm run typecheck      # tsc --noEmit only
npm run optimize:images  # PNG → responsive WebP in public/projects/
npm run admin:setup    # create the admin user (server-side, needs .env)
npm run smoke          # headless browser test against a running preview
```

### Smoke test

```bash
npm run build
npx vite preview --port 4173 &
npm run smoke                 # 38 checks: nav, links, forms, admin, responsive
CHROME_PATH=/path/to/chrome npm run smoke   # override the browser binary
```

Covers desktop / tablet / mobile layouts, horizontal-overflow, the Gmail compose
flow, the review dialog, `/hideadmin` protection, and console/page errors.

---

## Firebase setup

### 1. Web API key

Firebase Console → **Project settings → General → Your apps → Web API key** →
paste into `VITE_FIREBASE_API_KEY`. Without it the site still builds and runs;
only reviews and admin sign-in are disabled.

### 2. Enable Email/Password auth

Firebase Console → **Authentication → Sign-in method → Email/Password → Enable**.

### 3. Create the admin account

```bash
npm run admin:setup
```

Server-side only (uses `firebase-admin`), so the password never appears in client
source. It prints a UID and writes it to `.env` as `VITE_ADMIN_UID`.

Override the generated password with an env var if needed:

```bash
ADMIN_PASSWORD='choose-a-strong-one' npm run admin:setup
```

The script validates `VITE_ADMIN_EMAIL` and **refuses to continue** if the address
is not a valid email, telling you exactly what is wrong.

> The number `123456` appears only in `scripts/setup-admin.mjs` as a *default*
> for local bootstrapping. It is never bundled into the client and never used by
> the site itself.

### 4. Deploy the security rules

```bash
npx firebase login
npx firebase deploy --only firestore:rules
```

Before deploying, open `firestore.rules` and replace:

```
REPLACE_WITH_ADMIN_UID
```

with the UID printed by `npm run admin:setup`. (The `request.auth.token.admin
== true` claim already grants access — the explicit UID is a belt-and-braces
fallback.)

**Rules summary**

| Collection | Public | Admin |
|------------|--------|-------|
| `reviews` | read **only** `status == "published"`; create allowed but forced to `pending` | read all, update status, delete |
| `admins`  | — | read own doc |

Nothing else is readable. Public visitors can never see pending, hidden or
rejected reviews.

---

## How the site works

### Layout

`src/pages/Home.tsx` composes the page:

```
PageLoader · CustomCursor · AmbientBackground · grain · vignette
ScrollProgress · Navbar · skip-link
main → Hero · About · Expertise · Technologies · SelectedWork
       WorkProcess · Reviews · Contact · FinalCTA
Footer
```

### Editing content — all in `src/lib/`

| File | Holds |
|------|-------|
| `site.ts` | Name, role, location, email, phone, WhatsApp, nav, rotating roles, hero stats, marquee bands |
| `projects.ts` | The four case studies, tags, outcomes, links, launch status |
| `services.ts` | Expertise cards |
| `technologies.ts` | Stack chips + per-entry `evidence` (⚠️ confirm) |
| `process.ts` | Work process steps |
| `contact.ts` | Project types, budget ranges, Gmail/mailto builders |

No component hard-codes copy.

### Contact

The contact form builds a **pre-filled Gmail compose URL** and opens it in a new
tab (`openComposeWindow`). If the popup is blocked it hands the same payload to
the OS mail client — it never navigates the portfolio away. Both paths carry
name, email, project type, budget and brief.

Also on the page: `wa.me` WhatsApp deep link and a `tel:` link.

### Reviews

1. Visitor opens **Leave a review** → modal → submits.
2. Firestore rules force `status: "pending"` server-side, regardless of what the
   client sends.
3. Public query reads `status == "published"` only (single-field filter, so **no
   composite index is required**); ordering is done client-side.
4. Admin approves/edits/hides/rejects on `/hideadmin`.
5. Statuses: `pending · published · hidden · rejected`.

Until the API key is present, submission shows a plain-language error instead of
a raw Firebase code.

### Admin route

`/hideadmin` is **not** in the nav or footer and is not sitemap-linked — it is
"hidden by obscurity" only. Its real protection is Firebase Auth plus the
`firestore.rules` admin gate.

`AdminApp` has four phases: `booting → signed-out | forbidden | ready`.
`forbidden` = signed in with an account that has no `admin` claim.

### Bundle

Firebase is **not** in the initial load. `dist/index.html` preloads only
`react`, `router`, `motion` and `scroll`; the SDK (~113 kB gzipped) is pulled in
by a dynamic import the first time reviews or the admin route is reached.

---

## Project structure

```
src/
  components/     ui · layout · cursor · hero · work · reviews
  sections/       Hero · About · Expertise · Technologies · SelectedWork
                  WorkProcess · Reviews · Contact · FinalCTA
  pages/          Home.tsx · Admin (route)
  admin/          login · dashboard · review editor · hooks
  firebase/       env.ts (no SDK) · config.ts (lazy SDK) · reviews · auth · types
  hooks/          scroll · media · count-up · clipboard · magnetic · lenis
  lib/            content + motion + utils  ← edit content here
scripts/          optimize-images · setup-admin · smoke-test
public/projects/  responsive WebP screenshots (960w / 1365w)
firestore.rules   security rules
```

### Images

Originals are the four PNGs at the repo root (`1st.png` … `4rth.png`). Generate
the responsive WebP set with:

```bash
npm run optimize:images
```

---

## Deploying

- **Vercel** — `vercel.json` present (SPA rewrites).
- **Netlify** — `public/_redirects` present.
- **Firebase Hosting** — `firebase.json` present.
- **Any static host** — ship `dist/`; the app is a client-rendered SPA and needs
  an `index.html` fallback for deep links (`/hideadmin`).

Set the same `VITE_*` variables in the host's environment before building.
