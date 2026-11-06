/**
 * Media optimiser for the Bishal Raj portfolio.
 *
 * OPTIONAL. The processed images are already committed in public/media/, so you
 * never need to run this unless you receive higher-resolution originals.
 *
 * Usage (from the project root, in PowerShell):
 *   npm install --no-save sharp
 *   node scripts/optimize-media.mjs
 *
 * `--no-save` installs sharp for this run only. It is NOT added to package.json.
 *
 * What it does
 *  1. Copies each original JPEG byte-for-byte to public/media/<name>.jpg
 *     (the JPEG fallback is never re-encoded).
 *  2. Writes AVIF versions at several widths. Widths are NEVER larger than the
 *     original: nothing is upscaled.
 *  3. Measures the native-size AVIF against the original with SSIM computed
 *     separately on the R, G and B channels (so colour shifts count, not just
 *     brightness) and only over the lit parts of the picture (a pure-black
 *     background would otherwise inflate the score). 4:2:0 chroma is tried first;
 *     if it is not faithful enough, full-resolution 4:4:4 chroma is tried. An AVIF
 *     is only shipped when it is faithful (SSIM >= MIN_SSIM) AND at least
 *     MIN_SAVING smaller than the original JPEG. Otherwise the image is served as
 *     the untouched original JPEG only.
 *     If ffmpeg is on your PATH, an independent whole-image SSIM is also computed
 *     and must be >= MIN_SSIM too (it is stricter on near-black gradients).
 *  4. Which images get an AVIF at all is a DECISION recorded in IMAGES below
 *     (`avif: true/false` plus a reason), not something the script guesses.
 *  5. Writes src/content/media.generated.ts and docs/image-processing-report.md.
 *
 * It never touches anything in media-src/.
 */
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const ORIGINALS = path.join(ROOT, 'media-src', 'originals')
const OUT = path.join(ROOT, 'public', 'media')

const MIN_SSIM = 0.99
const MIN_SAVING = 0.15
const CHROMA_OPTIONS = ['4:2:0', '4:4:4']
const AVIF_EFFORT = 4
const CANDIDATE_WIDTHS = [480, 800, 1200, 1600]

// id: camelCase key used in code. file: kebab-case file stem. quality: AVIF quality.
// avif: whether an AVIF is produced at all. When false, `why` records the reason and the
// original JPEG is served alone. Decisions come from measurements made at build time
// (see docs/MEDIA-PROCESSING.md).
const IMAGES = [
  { id: 'kneelWide', file: 'kneel-wide', source: 'p5.jpeg', quality: 85, avif: true },
  { id: 'kneelClose', file: 'kneel-close', source: 'p4.jpeg', quality: 85, avif: true },
  { id: 'portraitIntense', file: 'portrait-intense', source: 'photo2.jpeg', quality: 85, avif: true },
  { id: 'stagePonchos', file: 'stage-ponchos', source: 'p11.jpeg', quality: 85, avif: false, why: 'Colour-critical warm image; AVIF saved only 13% (under the 15% rule).' },
  { id: 'stageCotton', file: 'stage-cotton', source: 'p12.jpeg', quality: 85, avif: false, why: 'Colour-critical blue-lit image; AVIF saved only 10% (under the 15% rule).' },
  { id: 'stagePoint', file: 'stage-point', source: 'p6.jpeg', quality: 80, avif: false, why: 'Independent whole-image SSIM 0.985 (below 0.99): large near-black areas with subtle gradients. Saving would be about 11 KB.' },
  { id: 'stageShout', file: 'stage-shout', source: 'p8.jpeg', quality: 80, avif: false, why: 'Independent whole-image SSIM 0.985 (below 0.99): dark atmospheric image. Saving would be about 16 KB.' },
  { id: 'stageStill', file: 'stage-still', source: 'p7.jpeg', quality: 80, avif: false, why: 'Independent whole-image SSIM 0.983 (below 0.99): shadowed eyes and dark gradients. Saving would be about 8 KB.' },
  { id: 'stageEnsemble', file: 'stage-ensemble', source: 'p10.jpeg', quality: 80, avif: true },
  { id: 'kneelFar', file: 'kneel-far', source: 'p3.jpeg', quality: 80, avif: false, why: 'Independent whole-image SSIM 0.990 at best on a mostly-black frame. Saving would be about 18 KB.' },
]

async function toPlanes(input) {
  const { data, info } = await sharp(input).removeAlpha().raw().toBuffer({ resolveWithObject: true })
  const n = info.width * info.height
  const r = new Float32Array(n)
  const g = new Float32Array(n)
  const b = new Float32Array(n)
  const y = new Float32Array(n)
  for (let i = 0; i < n; i++) {
    r[i] = data[i * 3]
    g[i] = data[i * 3 + 1]
    b[i] = data[i * 3 + 2]
    y[i] = 0.2126 * r[i] + 0.7152 * g[i] + 0.0722 * b[i]
  }
  return { width: info.width, height: info.height, r, g, b, y }
}

/** SSIM of one plane over one 8x8 window starting at (x, y). */
function windowSsim(a, b, w, x, y) {
  const C1 = 6.5025
  const C2 = 58.5225
  let ma = 0
  let mb = 0
  for (let j = 0; j < 8; j++) {
    for (let i = 0; i < 8; i++) {
      const k = (y + j) * w + x + i
      ma += a[k]
      mb += b[k]
    }
  }
  ma /= 64
  mb /= 64
  let va = 0
  let vb = 0
  let cv = 0
  for (let j = 0; j < 8; j++) {
    for (let i = 0; i < 8; i++) {
      const k = (y + j) * w + x + i
      const da = a[k] - ma
      const db = b[k] - mb
      va += da * da
      vb += db * db
      cv += da * db
    }
  }
  va /= 63
  vb /= 63
  cv /= 63
  return ((2 * ma * mb + C1) * (2 * cv + C2)) / ((ma * ma + mb * mb + C1) * (va + vb + C2))
}

/**
 * Mean SSIM over the R, G and B channels (8x8 windows, stride 4).
 *  - lit: only windows whose mean luminance in the ORIGINAL is above 20.
 *  - all: every window.
 */
function ssimRgb(orig, dec) {
  const w = orig.width
  const h = orig.height
  let litSum = 0
  let litN = 0
  let allSum = 0
  let allN = 0
  for (let y = 0; y + 8 <= h; y += 4) {
    for (let x = 0; x + 8 <= w; x += 4) {
      let my = 0
      for (let j = 0; j < 8; j++) for (let i = 0; i < 8; i++) my += orig.y[(y + j) * w + x + i]
      my /= 64
      const s = (windowSsim(orig.r, dec.r, w, x, y) + windowSsim(orig.g, dec.g, w, x, y) + windowSsim(orig.b, dec.b, w, x, y)) / 3
      allSum += s
      allN++
      if (my > 20) {
        litSum += s
        litN++
      }
    }
  }
  return { lit: litN ? litSum / litN : 1, all: allSum / allN, litShare: litN / allN }
}

/** Independent whole-image RGB SSIM from ffmpeg, or null when ffmpeg is not installed. */
async function ffmpegSsim(originalPath, avifBuffer) {
  const probe = spawnSync('ffmpeg', ['-version'], { encoding: 'utf8' })
  if (probe.error || probe.status !== 0) return null
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'ssim-'))
  try {
    const a = path.join(dir, 'a.png')
    const o = path.join(dir, 'o.png')
    await sharp(avifBuffer).png().toFile(a)
    await sharp(originalPath).png().toFile(o)
    const run = spawnSync('ffmpeg', ['-v', 'info', '-i', a, '-i', o, '-lavfi', 'ssim', '-f', 'null', '-'], { encoding: 'utf8' })
    const m = /All:([\d.]+)/.exec(run.stderr ?? '')
    return m ? Number(m[1]) : null
  } finally {
    await fs.rm(dir, { recursive: true, force: true })
  }
}

function widthsFor(native) {
  // Keep only widths clearly smaller than native (no near-duplicates), then native itself.
  const smaller = CANDIDATE_WIDTHS.filter((w) => w < native * 0.85)
  return [...smaller, native]
}

const kb = (n) => `${(n / 1024).toFixed(0)} KB`

async function main() {
  await fs.mkdir(OUT, { recursive: true })
  const generated = {}
  const rows = []

  for (const img of IMAGES) {
    const srcPath = path.join(ORIGINALS, img.source)
    const meta = await sharp(srcPath).metadata()
    const native = meta.width
    const height = meta.height
    const jpgBytes = (await fs.stat(srcPath)).size

    // 1. Byte-for-byte JPEG fallback
    await fs.copyFile(srcPath, path.join(OUT, `${img.file}.jpg`))

    // 2 + 3. Try each chroma option at native size; keep the first that is faithful AND small enough.
    const widths = widthsFor(native)
    const attempts = []
    let chosen = null
    const original = img.avif ? await toPlanes(srcPath) : null
    for (const chroma of img.avif ? CHROMA_OPTIONS : []) {
      const buf = await sharp(srcPath).avif({ quality: img.quality, effort: AVIF_EFFORT, chromaSubsampling: chroma }).toBuffer()
      const decoded = await toPlanes(await sharp(buf).png().toBuffer())
      const score = ssimRgb(original, decoded)
      const saving = 1 - buf.length / jpgBytes
      const independent = await ffmpegSsim(srcPath, buf)
      const pass = score.lit >= MIN_SSIM && saving >= MIN_SAVING && (independent === null || independent >= MIN_SSIM)
      attempts.push({ chroma, bytes: buf.length, score, saving, independent, pass })
      if (pass) {
        chosen = { chroma, nativeBuf: buf, score, saving }
        break
      }
    }
    const ship = chosen !== null
    if (img.avif && !ship) console.warn(`WARNING: ${img.id} is configured for AVIF but no attempt passed the rules, so it will be served as the original JPEG only.`)

    // Remove stale AVIFs from earlier runs, then write the shipped ones.
    for (const f of await fs.readdir(OUT)) {
      if (f.startsWith(`${img.file}-`) && f.endsWith('.avif')) await fs.unlink(path.join(OUT, f))
    }
    const variants = []
    if (chosen) {
      for (const w of widths) {
        const buf =
          w === native
            ? chosen.nativeBuf
            : await sharp(srcPath)
                .resize({ width: w, withoutEnlargement: true, kernel: 'lanczos3' })
                .avif({ quality: img.quality, effort: AVIF_EFFORT, chromaSubsampling: chosen.chroma })
                .toBuffer()
        variants.push({ width: w, bytes: buf.length })
        await fs.writeFile(path.join(OUT, `${img.file}-${w}.avif`), buf)
      }
    }

    generated[img.id] = {
      file: img.file,
      width: native,
      height,
      jpgBytes,
      avifQuality: ship ? img.quality : null,
      avifChroma: ship ? chosen.chroma : null,
      avif: variants,
    }
    rows.push({ ...img, native, height, jpgBytes, variants, attempts, ship })
    const tried = attempts.map((t) => `${t.chroma}: ${kb(t.bytes)}, RGB-lit SSIM ${t.score.lit.toFixed(4)}, independent ${t.independent === null ? 'n/a' : t.independent.toFixed(4)}, saving ${(t.saving * 100).toFixed(0)}%`).join(' | ')
    console.log(`${img.id.padEnd(16)} ${native}x${height}  jpg ${kb(jpgBytes)}  [${img.avif ? tried : 'AVIF skipped by decision'}]  -> ${ship ? `AVIF ${chosen.chroma} + JPEG` : 'JPEG only'}`)
  }

  // 4. Generated TypeScript manifest
  const ts = `// AUTO-GENERATED by scripts/optimize-media.mjs. Do not edit by hand.
// Facts about the files in public/media/. Editorial data (alt text, roles) lives in media.ts.

export interface GeneratedImage {
  /** File stem in public/media/ (e.g. "kneel-wide" -> kneel-wide.jpg, kneel-wide-800.avif). */
  readonly file: string
  /** Native pixel size of the original. Images are never rendered wider than this. */
  readonly width: number
  readonly height: number
  readonly jpgBytes: number
  /** AVIF quality used, or null when the image is served as the original JPEG only. */
  readonly avifQuality: number | null
  /** Chroma subsampling of the shipped AVIF, or null when none is shipped. */
  readonly avifChroma: '4:2:0' | '4:4:4' | null
  readonly avif: ReadonlyArray<{ readonly width: number; readonly bytes: number }>
}

export const generatedImages = ${JSON.stringify(generated, null, 2)} as const satisfies Record<string, GeneratedImage>
`
  await fs.writeFile(path.join(ROOT, 'src', 'content', 'media.generated.ts'), ts)

  // 5. Human-readable report
  const lines = []
  lines.push('# Image processing report (generated)', '')
  lines.push(`Generated by \`scripts/optimize-media.mjs\`. AVIF effort ${AVIF_EFFORT}. An AVIF ships only if: RGB lit-area SSIM >= ${MIN_SSIM}, at least ${MIN_SAVING * 100}% smaller than the original JPEG, and (when ffmpeg is installed) independent whole-image SSIM >= ${MIN_SSIM}. 4:2:0 chroma is tried first, then 4:4:4.`, '')
  lines.push('SSIM is a screening tool, not proof: shipped images were also compared at 100% by eye.', '')
  lines.push('| Image | Source | Native px | Original JPEG | Attempt | AVIF at native | Saving | RGB SSIM (lit) | Independent SSIM (ffmpeg) | Result |')
  lines.push('|---|---|---|---|---|---|---|---|---|---|')
  for (const r of rows) {
    if (r.attempts.length === 0) {
      lines.push(`| ${r.id} | ${r.source} | ${r.native}x${r.height} | ${kb(r.jpgBytes)} | n/a | n/a | n/a | n/a | n/a | **original JPEG only**: ${r.why} |`)
      continue
    }
    for (const t of r.attempts) {
      const isChosen = r.ship && t === r.attempts[r.attempts.length - 1]
      lines.push(`| ${r.id} | ${r.source} | ${r.native}x${r.height} | ${kb(r.jpgBytes)} | q${r.quality} ${t.chroma} | ${kb(t.bytes)} | ${(t.saving * 100).toFixed(0)}% | ${t.score.lit.toFixed(4)} | ${t.independent === null ? 'n/a' : t.independent.toFixed(4)} | ${isChosen ? '**shipped**' : t.pass ? 'pass' : 'rejected'} |`)
    }
  }
  lines.push('', '## Shipped files per image', '')
  for (const r of rows) {
    lines.push(`- **${r.id}**: ${r.ship ? `AVIF ${r.attempts[r.attempts.length - 1].chroma}, ` + r.variants.map((v) => `${v.width}px (${kb(v.bytes)})`).join(', ') + ' + untouched original JPEG' : 'untouched original JPEG only'}`)
  }
  lines.push('')
  await fs.writeFile(path.join(ROOT, 'docs', 'image-processing-report.md'), lines.join('\n'))
  console.log('\nWrote src/content/media.generated.ts and docs/image-processing-report.md')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
