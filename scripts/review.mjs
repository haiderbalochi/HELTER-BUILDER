import { mkdirSync } from 'node:fs'
import puppeteer from 'puppeteer-core'

const OUT = '/tmp/opencode/shots/slices'
const URL = 'http://localhost:4173/'
const HEIGHT = 900

mkdirSync(OUT, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: '/usr/bin/google-chrome',
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--hide-scrollbars'],
})
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: HEIGHT, deviceScaleFactor: 1 })
await page.goto(URL, { waitUntil: 'networkidle0' })
await new Promise((r) => setTimeout(r, 3500))
await page.evaluate(() => document.fonts.ready)

// settle: walk the page once so lazy content / whileInView fire
const total = await page.evaluate(async () => {
  const h = document.body.scrollHeight
  for (let y = 0; y < h; y += 700) {
    window.scrollTo(0, y)
    await new Promise((r) => setTimeout(r, 60))
  }
  window.scrollTo(0, 0)
  await new Promise((r) => setTimeout(r, 400))
  return document.body.scrollHeight
})

const marks = await page.evaluate(() => {
  const ids = ['about', 'expertise', 'stack', 'work', 'process', 'reviews', 'contact', 'cta']
  const out = {}
  for (const id of ids) {
    const el = document.getElementById(id)
    if (el) out[id] = Math.round(el.getBoundingClientRect().top + window.scrollY)
  }
  return out
})

console.log('height', total)
console.log('marks', JSON.stringify(marks))

const slices = Math.ceil(total / HEIGHT)
for (let i = 0; i < slices; i += 1) {
  const target = i * HEIGHT
  for (let attempt = 0; attempt < 6; attempt += 1) {
    await page.evaluate((y) => {
      window.scrollTo(0, y)
      document.documentElement.scrollTop = y
      document.body.scrollTop = y
    }, target)
    await new Promise((r) => setTimeout(r, 450))
    const got = await page.evaluate(() => Math.round(window.scrollY))
    if (Math.abs(got - target) < 4) break
  }
  const got = await page.evaluate(() => Math.round(window.scrollY))
  await page.screenshot({ path: `${OUT}/s${String(i).padStart(2, '0')}.png` })
  console.log(String(i).padStart(2, '0'), 'target', target, 'got', got)
}

await browser.close()
console.log('slices', slices)
