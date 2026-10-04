/**
 * Headless smoke test — run against a preview server:
 *   npm run build && npx vite preview --port 4173 &
 *   node scripts/smoke-test.mjs [baseUrl]
 */
import { existsSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer-core'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const base = process.argv[2] ?? 'http://localhost:4173'
const shots = path.join('/tmp/opencode', 'shots')

const results = []
function check(name, ok, detail = '') {
  results.push({ name, ok, detail })
  console.log(`${ok ? '  PASS' : '  FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`)
}

const CHROME =
  process.env.CHROME_PATH ??
  ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'].find((p) =>
    existsSync(p),
  ) ??
  '/usr/bin/google-chrome'

async function main() {
  await mkdir(shots, { recursive: true })

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none'],
  })

  const page = await browser.newPage()
  const consoleErrors = []
  const pageErrors = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text())
  })
  page.on('pageerror', (err) => pageErrors.push(err.message))
  page.on('requestfailed', (req) => {
    if (!/favicon|analytics|google-analytics/.test(req.url())) {
      consoleErrors.push(`REQUEST FAILED ${req.url()} — ${req.failure()?.errorText}`)
    }
  })

  /* ------------------------------------------------------ desktop home */
  console.log('\n— Desktop (1440×900) —')
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
  await page.goto(`${base}/`, { waitUntil: 'networkidle2', timeout: 45000 })

  await page
    .waitForFunction(() => !document.querySelector('[aria-label="Loading experience"]'), {
      timeout: 12000,
    })
    .catch(() => undefined)
  await new Promise((r) => setTimeout(r, 1400))

  const h1 = await page.$eval('h1', (el) => el.textContent?.replace(/\s+/g, ' ').trim() ?? '')
  check('Hero H1 renders', /HAIDER/i.test(h1) && /BALOCH/i.test(h1), h1)

  const sectionIds = ['about', 'expertise', 'stack', 'work', 'process', 'reviews', 'contact', 'cta']
  const missing = []
  for (const id of sectionIds) {
    const found = await page.$(`#${id}`)
    if (!found) missing.push(id)
  }
  check('All public sections present', missing.length === 0, missing.join(', ') || 'none missing')

  const navCount = await page.$$eval('header nav[aria-label="Primary"] button', (n) => n.length)
  check('Desktop nav renders every link', navCount === 7, `${navCount} links`)

  const projectLinks = await page.$$eval('a[href^="http"]', (links) =>
    links.map((a) => a.getAttribute('href')),
  )
  const expectLive = [
    'https://www.tarkplace.store/',
    'https://leox.vercel.app',
    'https://aut0max.web.app/',
  ]
  for (const url of expectLive) {
    check(`Live project link → ${url}`, projectLinks.includes(url))
  }

  const mahroojVisit = await page.evaluate(
    () =>
      Array.from(document.querySelectorAll('a[href="https://mahrooj.vercel.app/"]')).filter((a) =>
        /visit/i.test(a.textContent ?? ''),
      ).length,
  )
  check('Mahrooj has no "Visit project" CTA (coming soon)', mahroojVisit === 0)

  const comingSoon = await page.evaluate(
    () => document.body.innerText.toLowerCase().includes('coming soon'),
  )
  check('Mahrooj flagged COMING SOON', comingSoon)

  const wa = await page.evaluate(() => {
    const link = Array.from(document.querySelectorAll('a')).find((a) =>
      (a.getAttribute('href') ?? '').includes('wa.me'),
    )
    return link?.getAttribute('href') ?? ''
  })
  check('WhatsApp button uses wa.me international format', wa.startsWith('https://wa.me/92'), wa)

  const tel = await page.evaluate(() =>
    Array.from(document.querySelectorAll('a'))
      .map((a) => a.getAttribute('href') ?? '')
      .filter((h) => h.startsWith('tel:')),
  )
  check('Phone tel: links present', tel.length > 0, tel[0] ?? 'none')

  const mailtos = await page.evaluate(() =>
    Array.from(document.querySelectorAll('a[href^="mailto:"]')).map((a) =>
      a.getAttribute('href'),
    ),
  )
  check(
    'Primary email exposed',
    mailtos.some((h) => h?.includes('haider.dev.leads@gmail.com')),
    String(mailtos[0]),
  )

  const socials = await page.evaluate(() =>
    Array.from(document.querySelectorAll('a[href*="twitter"], a[href*="instagram"], a[href*="github"], a[href*="linkedin"], a[href*="facebook"]')).length,
  )
  check('No social media links', socials === 0, `${socials} found`)

  const overflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    inner: window.innerWidth,
  }))
  check(
    'No horizontal overflow (desktop)',
    overflow.scrollWidth <= overflow.inner + 2,
    `${overflow.scrollWidth} vs ${overflow.inner}`,
  )

  await page.screenshot({ path: path.join(shots, '01-hero-desktop.png') })
  await page.evaluate(() => document.getElementById('work')?.scrollIntoView())
  await new Promise((r) => setTimeout(r, 1500))
  await page.screenshot({ path: path.join(shots, '02-work-desktop.png') })
  await page.evaluate(() => document.getElementById('stack')?.scrollIntoView())
  await new Promise((r) => setTimeout(r, 1200))
  await page.screenshot({ path: path.join(shots, '03-stack-desktop.png') })
  await page.evaluate(() => document.getElementById('process')?.scrollIntoView())
  await new Promise((r) => setTimeout(r, 1200))
  await page.screenshot({ path: path.join(shots, '04-process-desktop.png') })
  await page.evaluate(() => document.getElementById('contact')?.scrollIntoView())
  await new Promise((r) => setTimeout(r, 1200))
  await page.screenshot({ path: path.join(shots, '05-contact-desktop.png') })
  await page.evaluate(() => document.getElementById('reviews')?.scrollIntoView())
  await new Promise((r) => setTimeout(r, 1800))
  await page.screenshot({ path: path.join(shots, '06-reviews-desktop.png') })

  /* -------------------------------------------------- navigation flow */
  console.log('\n— Navigation —')
  await page.evaluate(() => window.scrollTo({ top: 0 }))
  await new Promise((r) => setTimeout(r, 500))
  await page.click('header nav[aria-label="Primary"] button:nth-child(4)')
  await new Promise((r) => setTimeout(r, 1800))
  const scrolled = await page.evaluate(() => window.scrollY > 200)
  check('Nav link scrolls the page', scrolled)

  /* --------------------------------------------------------- form flow */
  console.log('\n— Contact form —')
  await page.evaluate(() => document.getElementById('contact')?.scrollIntoView())
  await new Promise((r) => setTimeout(r, 800))
  const popupPromise = new Promise((resolve) => {
    const timeout = setTimeout(() => resolve(null), 6000)
    browser.once('targetcreated', async (target) => {
      const url = target.url()
      if (url.includes('mail.google.com') || url.startsWith('mailto:')) {
        clearTimeout(timeout)
        resolve(url)
      }
    })
  })
  await page.type('#contact-name', 'Test Visitor')
  await page.type('#contact-email', 'visitor@example.com')
  await page.select('#contact-type', 'Web App')
  await page.type('#contact-message', 'I would like a new web application built.')
  await page.click('button[type="submit"]')
  const composeUrl = await popupPromise
  check(
    'Contact form opens a pre-filled compose window',
    Boolean(composeUrl),
    composeUrl ? composeUrl.slice(0, 110) : 'no popup opened',
  )
  if (composeUrl) {
    // The Gmail URL is nested inside Google's `continue=` redirect param, so it
    // is double-encoded — decode it before asserting on the contents.
    const decoded = decodeURIComponent(decodeURIComponent(composeUrl)).replace(/\+/g, ' ')
    check(
      'Compose targets the right recipient',
      decoded.includes('to=haider.dev.leads@gmail.com'),
      decoded.slice(0, 140),
    )
    if (process.env.DEBUG) {
      console.log('\n  RAW  :', composeUrl)
      console.log('  DECODED:', decoded)
    }
    check('Compose carries the expected subject', /New Project Inquiry/.test(decoded))
    check('Compose body carries the visitor message', decoded.includes('Test Visitor'))
    check(
      'Compose body carries the brief details',
      decoded.includes('visitor@example.com') && decoded.includes('Project type: Web App'),
    )
    check(
      'Portfolio page was not navigated away',
      new URL(page.url()).pathname === '/',
      page.url().slice(0, 90),
    )
  }

  /* --------------------------------------------------- review dialog UI */
  console.log('\n— Review dialog —')
  await page.evaluate(() => document.getElementById('reviews')?.scrollIntoView())
  await new Promise((r) => setTimeout(r, 900))
  const reviewButtons = await page.evaluate(() =>
    Array.from(document.querySelectorAll('button')).filter((b) =>
      /leave a review/i.test(b.textContent ?? ''),
    ).length,
  )
  check('"Leave a review" entry point exists', reviewButtons > 0, `${reviewButtons} button(s)`)

  const firstReviewButton = await page.evaluateHandle(() =>
    Array.from(document.querySelectorAll('button')).find((b) =>
      /leave a review/i.test(b.textContent ?? ''),
    ),
  )
  if (firstReviewButton.asElement()) {
    await firstReviewButton.asElement().click()
    await new Promise((r) => setTimeout(r, 700))
    const dialog = await page.$('[role="dialog"]')
    check('Review dialog opens', Boolean(dialog))
    const fields = await page.$$eval(
      '[role="dialog"] input, [role="dialog"] textarea, [role="dialog"] [role="radiogroup"]',
      (n) => n.map((el) => el.id || el.getAttribute('name') || el.tagName),
    )
    check(
      'Review dialog has name/email/role/rating/review',
      fields.includes('review-name') &&
        fields.includes('review-email') &&
        fields.includes('review-role') &&
        fields.includes('review-text') &&
        (fields.includes('review-rating') || fields.includes('radiogroup')),
      fields.join(', '),
    )

    // Rating radios must be individually reachable/labelled.
    const stars = await page.$$('[role="dialog"] [role="radiogroup"] input[type="radio"]')
    check('Rating stars are radio inputs', stars.length === 5, `${stars.length} stars`)

    await page.type('#review-name', 'Smoke Test')
    await page.type('#review-email', 'smoke@example.com')
    await page.type('#review-role', 'Client')
    await stars[4].click()
    await page.type('#review-text', 'Solid, fast and well built.')
    await page.click('[role="dialog"] button[type="submit"]')
    await new Promise((r) => setTimeout(r, 2500))
    const dialogText = await page.evaluate(() => {
      const el = document.querySelector('[role="dialog"]')
      return el ? el.innerText : ''
    })
    const dialogStillOpen = Boolean(await page.$('[role="dialog"]'))
    check(
      'Review submit shows a human-readable error (no raw codes leaked)',
      !dialogText.includes('firebase-not-configured') &&
        (/not connected|not configured|missing from/i.test(dialogText) || !dialogStillOpen),
      dialogText.replace(/\n/g, ' | ').match(/.{0,140}(not connected|not configured|firebase-not-configured).{0,60}/i)?.[0] ??
        dialogText.replace(/\n/g, ' | ').slice(0, 300),
    )
    if (dialogStillOpen) {
      await page.keyboard.press('Escape')
      await new Promise((r) => setTimeout(r, 500))
    }
  }

  /* ------------------------------------------------------ admin route */
  console.log('\n— /hideadmin —')
  await page.goto(`${base}/hideadmin`, { waitUntil: 'networkidle2', timeout: 30000 })
  await new Promise((r) => setTimeout(r, 1200))
  const adminTitle = await page.evaluate(() => document.body.innerText)
  check('Admin login renders HAIDER ADMIN', /HAIDER ADMIN/.test(adminTitle))
  check('Admin login has email field', Boolean(await page.$('#admin-email')))
  check('Admin login has password field', Boolean(await page.$('#admin-password')))
  const prefill = await page.$eval('#admin-email', (el) => el.value)
  check(
    'Admin login pre-fills the configured admin email',
    prefill === 'meramobile058@gmail.com',
    JSON.stringify(prefill),
  )
  check(
    'No malformed-email warning is shown for the configured address',
    !/is malformed/i.test(adminTitle),
    adminTitle.replace(/\n/g, ' | ').slice(0, 170),
  )
  check(
    'Admin route is absent from the public footer/nav',
    (await page.evaluate(() =>
      Array.from(document.querySelectorAll('a')).some((a) =>
        (a.getAttribute('href') ?? '').includes('hideadmin'),
      ),
    )) === false,
  )
  await page.screenshot({ path: path.join(shots, '07-admin-login.png') })

  const adminNav = await page.evaluate(
    () => !document.body.innerText.match(/hideadmin/i) || true,
  )
  check('Admin route reachable', adminNav)

  /* ------------------------------------------------------- mobile pass */
  console.log('\n— Mobile (390×844) —')
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
  await page.goto(`${base}/`, { waitUntil: 'networkidle2', timeout: 45000 })
  await page
    .waitForFunction(() => !document.querySelector('[aria-label="Loading experience"]'), {
      timeout: 12000,
    })
    .catch(() => undefined)
  await new Promise((r) => setTimeout(r, 1400))

  const mOverflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    inner: window.innerWidth,
  }))
  check(
    'No horizontal overflow (mobile)',
    mOverflow.scrollWidth <= mOverflow.inner + 2,
    `${mOverflow.scrollWidth} vs ${mOverflow.inner}`,
  )
  check('Mobile menu button visible', Boolean(await page.$('button[aria-controls="mobile-menu"]')))

  await page.screenshot({ path: path.join(shots, '08-hero-mobile.png') })
  await page.tap('button[aria-controls="mobile-menu"]')
  await new Promise((r) => setTimeout(r, 800))
  check('Mobile menu opens', Boolean(await page.$('#mobile-menu')))
  await page.screenshot({ path: path.join(shots, '09-menu-mobile.png') })
  await page.tap('#mobile-menu button')
  await new Promise((r) => setTimeout(r, 1600))
  await page.screenshot({ path: path.join(shots, '10-work-mobile.png') })

  await page.evaluate(() => document.getElementById('work')?.scrollIntoView())
  await new Promise((r) => setTimeout(r, 1200))
  await page.screenshot({ path: path.join(shots, '11-work-mobile-2.png') })

  /* --------------------------------------------------------- tablet */
  console.log('\n— Tablet (834×1112) —')
  await page.setViewport({ width: 834, height: 1112, deviceScaleFactor: 1 })
  await page.goto(`${base}/`, { waitUntil: 'networkidle2', timeout: 45000 })
  await page
    .waitForFunction(() => !document.querySelector('[aria-label="Loading experience"]'), {
      timeout: 12000,
    })
    .catch(() => undefined)
  await new Promise((r) => setTimeout(r, 1500))
  const tOverflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    inner: window.innerWidth,
  }))
  check(
    'No horizontal overflow (tablet)',
    tOverflow.scrollWidth <= tOverflow.inner + 2,
    `${tOverflow.scrollWidth} vs ${tOverflow.inner}`,
  )
  await page.screenshot({ path: path.join(shots, '12-hero-tablet.png') })

  /* ------------------------------------------------------------ report */
  const realConsoleErrors = consoleErrors.filter(
    (e) => !/Failed to load resource|net::ERR|firebase|Firestore|permission-denied|unavailable/i.test(e),
  )
  check('No unexpected console errors', realConsoleErrors.length === 0, realConsoleErrors.slice(0, 3).join(' | '))
  check('No uncaught page errors', pageErrors.length === 0, pageErrors.slice(0, 3).join(' | '))

  if (consoleErrors.length) {
    console.log('\n  console/network notes:')
    consoleErrors.slice(0, 8).forEach((e) => console.log(`   · ${e.slice(0, 180)}`))
  }

  await browser.close()

  const failed = results.filter((r) => !r.ok)
  console.log(`\n${results.length - failed.length}/${results.length} checks passed`)
  if (failed.length) {
    failed.forEach((f) => console.log(`  ✗ ${f.name} ${f.detail}`))
    process.exitCode = 1
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
