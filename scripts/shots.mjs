import { mkdirSync } from 'node:fs'
import puppeteer from 'puppeteer-core'

const OUT = '/tmp/opencode/shots'
const URL = 'http://localhost:4173/'
const SECTIONS = ['top', 'about', 'expertise', 'stack', 'work', 'process', 'reviews', 'contact', 'cta']

mkdirSync(OUT, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: '/usr/bin/google-chrome',
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--hide-scrollbars'],
})

async function shots(width, height, tag, sections) {
  const page = await browser.newPage()
  await page.setViewport({ width, height, deviceScaleFactor: 1 })
  await page.goto(URL, { waitUntil: 'networkidle0' })
  await new Promise((r) => setTimeout(r, 3200))
  await page.evaluate(() => document.fonts.ready)

  if (!sections) {
    await page.screenshot({ path: `${OUT}/${tag}-hero.png` })
  }

  for (const id of SECTIONS) {
    const ok = await page.evaluate((target) => {
      const el = document.getElementById(target)
      if (!el) return false
      window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY)
      return true
    }, id)
    if (!ok) continue
    await new Promise((r) => setTimeout(r, 1400))
    await page.screenshot({ path: `${OUT}/${tag}-${id}.png` })
  }

  await page.close()
}

await shots(1440, 900, 'desk')
await shots(390, 844, 'mob', ['top', 'work'])

await browser.close()
console.log('done')
