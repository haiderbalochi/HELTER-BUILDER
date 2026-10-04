/**
 * One-off asset pipeline.
 *   npm run optimize:images
 *
 * Takes the supplied project screenshots (1st.png … 4rth.png) and emits
 * responsive WebP derivatives into `public/projects/` so the SELECTED WORK
 * section never ships a 1.6 MB PNG to a phone.
 */
import { mkdir, readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

/** Original screenshot -> output slug */
const SOURCES = [
  { file: '1st.png', slug: 'tarkplace' },
  { file: '2nd.png', slug: 'leox' },
  { file: '3rd.png', slug: 'aut0max' },
  { file: '4rth.png', slug: 'mahrooj' },
]

const WIDTHS = [960, 1600]

async function main() {
  const outDir = path.join(root, 'public', 'projects')
  await mkdir(outDir, { recursive: true })

  const available = new Set(await readdir(root))

  for (const { file, slug } of SOURCES) {
    if (!available.has(file)) {
      console.warn(`! missing source screenshot: ${file} — skipped`)
      continue
    }
    const input = path.join(root, file)
    const meta = await sharp(input).metadata()
    for (const width of WIDTHS) {
      const w = Math.min(width, meta.width ?? width)
      const out = path.join(outDir, `${slug}-${w}.webp`)
      await sharp(input)
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: 82, effort: 5, smartSubsample: true })
        .toFile(out)
      console.log(`✓ ${path.relative(root, out)}`)
    }
  }

  console.log('\nDone.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
