import { useEffect, useState, type CSSProperties, type SyntheticEvent } from 'react'
import { imageList, type ImageAsset } from '../content/media'
import { SITE } from '../content/site'
import { contrastRatio, contrastVerdict, hexToRgb, type Rgb } from '../lib/contrast'
import styles from './MediaReview.module.css'

/**
 * DEVELOPMENT-ONLY. Open http://localhost:5173/#media-review while `npm run dev` is running.
 * This module is loaded behind `import.meta.env.DEV` in App.tsx, so it is removed
 * from the production build.
 *
 * It exists so colours, type and every assigned photograph can be judged in a real
 * browser before any layout is built around them.
 */

type RenderSource = 'avif' | 'jpg'

const PAGE_BLACKS = [
  { hex: '#000000', label: '#000000 (true black)' },
  { hex: '#030303', label: '#030303 (current token)' },
  { hex: '#050505', label: '#050505 (original proposal)' },
  { hex: '#0a0908', label: '#0a0908 (warmer charcoal)' },
] as const

const SWATCHES = [
  { name: 'Stage', token: '--c-stage', use: 'Page background' },
  { name: 'Raised', token: '--c-raised', use: 'Menus, dialogs' },
  { name: 'Line', token: '--c-line', use: 'Hairlines' },
  { name: 'Bone', token: '--c-bone', use: 'Primary text' },
  { name: 'Ash', token: '--c-ash', use: 'Secondary text, captions' },
  { name: 'Bronze', token: '--c-bronze', use: 'Accent (sparingly)' },
  { name: 'Cobalt', token: '--c-cobalt', use: 'Focus rings, rare accents' },
] as const

interface Environment {
  width: number
  dpr: number
  reducedMotion: boolean
}

function readEnvironment(): Environment {
  return {
    width: window.innerWidth,
    dpr: window.devicePixelRatio,
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  }
}

function useEnvironment(): Environment {
  const [env, setEnv] = useState<Environment>(readEnvironment)
  useEffect(() => {
    const update = () => setEnv(readEnvironment())
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    window.addEventListener('resize', update)
    motion.addEventListener('change', update)
    return () => {
      window.removeEventListener('resize', update)
      motion.removeEventListener('change', update)
    }
  }, [])
  return env
}

/** Reads the colour tokens straight from tokens.css, so this page can never drift from the real values. */
function readSwatchTokens(): Record<string, string> {
  const style = getComputedStyle(document.documentElement)
  const values: Record<string, string> = {}
  for (const s of SWATCHES) values[s.token] = style.getPropertyValue(s.token).trim()
  return values
}

interface EdgeReport {
  top: Rgb
  bottom: Rgb
  left: Rgb
  right: Rgb
}

/** Mean colour of a 2% band along each edge of the decoded image. */
function sampleEdges(img: HTMLImageElement): EdgeReport | null {
  const nw = img.naturalWidth
  const nh = img.naturalHeight
  if (!nw || !nh) return null
  try {
    const scale = Math.min(1, 400 / Math.max(nw, nh))
    const w = Math.max(8, Math.round(nw * scale))
    const h = Math.max(8, Math.round(nh * scale))
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return null
    ctx.drawImage(img, 0, 0, w, h)
    const bw = Math.max(2, Math.round(w * 0.02))
    const bh = Math.max(2, Math.round(h * 0.02))
    const mean = (x: number, y: number, cw: number, ch: number): Rgb => {
      const d = ctx.getImageData(x, y, cw, ch).data
      let r = 0
      let g = 0
      let b = 0
      const n = d.length / 4
      for (let i = 0; i < d.length; i += 4) {
        r += d[i]
        g += d[i + 1]
        b += d[i + 2]
      }
      return [Math.round(r / n), Math.round(g / n), Math.round(b / n)]
    }
    return {
      top: mean(0, 0, w, bh),
      bottom: mean(0, h - bh, w, bh),
      left: mean(0, 0, bw, h),
      right: mean(w - bw, 0, bw, h),
    }
  } catch {
    return null
  }
}

function maxChannelDifference(a: Rgb, b: Rgb): number {
  return Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]), Math.abs(a[2] - b[2]))
}

function formatKb(bytes: number): string {
  return `${(bytes / 1024).toFixed(0)} KB`
}

interface ImageCardProps {
  asset: ImageAsset
  source: RenderSource
  hairline: boolean
  pageBlack: string
}

function ImageCard({ asset, source, hairline, pageBlack }: ImageCardProps) {
  const [edges, setEdges] = useState<EdgeReport | null>(null)
  const [shownWidth, setShownWidth] = useState<number | null>(null)

  const usingAvif = source === 'avif' && asset.avifSrc !== null
  const src = usingAvif && asset.avifSrc ? asset.avifSrc : asset.src
  const bgRgb = hexToRgb(pageBlack)

  const handleLoad = (event: SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget
    setShownWidth(Math.round(img.clientWidth))
    setEdges(sampleEdges(img))
  }

  const saving =
    asset.avifNativeBytes !== null ? Math.round((1 - asset.avifNativeBytes / asset.jpgBytes) * 100) : null

  const edgeRows: Array<[string, Rgb | null]> = [
    ['Top', edges?.top ?? null],
    ['Bottom', edges?.bottom ?? null],
    ['Left', edges?.left ?? null],
    ['Right', edges?.right ?? null],
  ]

  return (
    <article className={styles.card} aria-labelledby={`card-${asset.id}`}>
      <div className={styles.frame}>
        <img
          className={hairline ? styles.hairline : undefined}
          src={src}
          width={asset.width}
          height={asset.height}
          alt={asset.alt}
          loading="lazy"
          decoding="async"
          onLoad={handleLoad}
          style={{ maxWidth: `min(100%, ${asset.width}px)`, height: 'auto' }}
        />
      </div>

      <div className={styles.meta}>
        <h3 id={`card-${asset.id}`} className={styles.cardTitle}>
          {asset.id}
          {asset.optional ? <span className={styles.badge}>optional</span> : null}
        </h3>
        <dl className={styles.facts}>
          <dt>Source</dt>
          <dd>{asset.sourceFile}</dd>
          <dt>Assigned to</dt>
          <dd>{asset.assignment}</dd>
          <dt>Native size</dt>
          <dd>
            {asset.width} × {asset.height} px
          </dd>
          <dt>Shown at</dt>
          <dd>
            {shownWidth === null
              ? '…'
              : `${shownWidth} px wide${
                  shownWidth > asset.width
                    ? ' (UPSCALED, should never happen)'
                    : shownWidth === asset.width
                      ? ' (native, 1:1)'
                      : ` (${Math.round((shownWidth / asset.width) * 100)}% of native)`
                }`}
          </dd>
          <dt>Rendering now</dt>
          <dd>{usingAvif ? `AVIF, native width (q${asset.avifQuality}, chroma ${asset.avifChroma})` : 'Original JPEG'}</dd>
          <dt>File sizes</dt>
          <dd>
            JPEG {formatKb(asset.jpgBytes)}
            {asset.avifNativeBytes !== null && saving !== null
              ? `, AVIF ${formatKb(asset.avifNativeBytes)} (${saving}% smaller)`
              : ', no AVIF shipped'}
          </dd>
        </dl>

        <table className={styles.edges}>
          <caption>Edge colour vs page black {pageBlack}</caption>
          <thead>
            <tr>
              <th scope="col">Edge</th>
              <th scope="col">Colour</th>
              <th scope="col">RGB</th>
              <th scope="col">Max step</th>
            </tr>
          </thead>
          <tbody>
            {edgeRows.map(([label, rgb]) => (
              <tr key={label}>
                <th scope="row">{label}</th>
                <td>
                  {rgb ? (
                    <span
                      className={styles.chip}
                      style={{ background: `rgb(${rgb[0]} ${rgb[1]} ${rgb[2]})` } as CSSProperties}
                    />
                  ) : null}
                </td>
                <td>{rgb ? rgb.join(', ') : '…'}</td>
                <td>{rgb ? maxChannelDifference(rgb, bgRgb) : '…'}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {asset.note ? <p className={styles.note}>{asset.note}</p> : null}
      </div>
    </article>
  )
}

export default function MediaReview() {
  const env = useEnvironment()
  const [pageBlack, setPageBlack] = useState<string>('#030303')
  const [source, setSource] = useState<RenderSource>('avif')
  const [hairline, setHairline] = useState(false)
  const [tokens] = useState<Record<string, string>>(readSwatchTokens)

  const bgRgb = hexToRgb(pageBlack)

  return (
    <div className={styles.root} style={{ '--review-bg': pageBlack } as CSSProperties}>
      <header className={styles.top}>
        <div>
          <p className={styles.eyebrow}>Development only · Stage 1</p>
          <h1 className={styles.title}>Media review</h1>
          <p className={styles.lede}>
            Judge the page black, the bronze accent, the type, and every assigned photograph in a real browser. This page
            is not part of the production build.
          </p>
        </div>
        <a className={styles.back} href="#">
          Back to site placeholder
        </a>
      </header>

      <section className={styles.panel} aria-labelledby="env-heading">
        <h2 id="env-heading" className={styles.h2}>
          Your screen
        </h2>
        <p>
          Viewport {env.width}px wide · device pixel ratio {env.dpr} · reduced motion{' '}
          {env.reducedMotion ? 'ON' : 'off'}
        </p>
        <p className={styles.note}>
          To check on your phone (same Wi-Fi), start the server with <code>npm run dev -- --host</code> and open the
          “Network” address Vite prints. Windows may ask to allow access on private networks.
        </p>
      </section>

      <section className={styles.panel} aria-labelledby="controls-heading">
        <h2 id="controls-heading" className={styles.h2}>
          Controls
        </h2>
        <div className={styles.controls}>
          <fieldset className={styles.fieldset}>
            <legend>Page black</legend>
            {PAGE_BLACKS.map((option) => (
              <label key={option.hex} className={styles.choice}>
                <input
                  type="radio"
                  name="page-black"
                  value={option.hex}
                  checked={pageBlack === option.hex}
                  onChange={() => setPageBlack(option.hex)}
                />
                {option.label}
              </label>
            ))}
          </fieldset>
          <fieldset className={styles.fieldset}>
            <legend>Render images as</legend>
            <label className={styles.choice}>
              <input
                type="radio"
                name="render-source"
                value="avif"
                checked={source === 'avif'}
                onChange={() => setSource('avif')}
              />
              AVIF (what visitors’ browsers will get)
            </label>
            <label className={styles.choice}>
              <input
                type="radio"
                name="render-source"
                value="jpg"
                checked={source === 'jpg'}
                onChange={() => setSource('jpg')}
              />
              Original JPEG (byte-for-byte your file)
            </label>
          </fieldset>
          <fieldset className={styles.fieldset}>
            <legend>Edges</legend>
            <label className={styles.choice}>
              <input type="checkbox" checked={hairline} onChange={(e) => setHairline(e.target.checked)} />
              Add a 1px hairline around photographs
            </label>
          </fieldset>
        </div>
      </section>

      <section className={styles.panel} aria-labelledby="colour-heading">
        <h2 id="colour-heading" className={styles.h2}>
          Colour
        </h2>
        <p className={styles.note}>
          Values are read live from tokens.css. Contrast is computed against the page black selected above. Body text
          needs 4.5:1, large text and interface outlines 3:1.
        </p>
        <ul className={styles.swatches}>
          {SWATCHES.map((s) => {
            const hex = tokens[s.token]
            const ratio = hex ? contrastRatio(hexToRgb(hex), bgRgb) : null
            return (
              <li key={s.token} className={styles.swatch}>
                <span className={styles.swatchChip} style={{ background: hex || 'transparent' }} />
                <span className={styles.swatchText}>
                  <strong>{s.name}</strong> <code>{hex || '…'}</code>
                  <br />
                  <span className={styles.note}>{s.use}</span>
                  <br />
                  {ratio !== null ? (
                    <span>
                      {ratio.toFixed(1)}:1 · {contrastVerdict(ratio)}
                    </span>
                  ) : null}
                </span>
                <span className={styles.sample} style={{ color: hex || 'inherit' }}>
                  Aa
                </span>
              </li>
            )
          })}
        </ul>
      </section>

      <section className={styles.panel} aria-labelledby="type-heading">
        <h2 id="type-heading" className={styles.h2}>
          Typography
        </h2>
        <p className={styles.specName}>{SITE.nameUpper}</p>
        <p className={styles.specRole}>{SITE.role}</p>
        <p className={styles.specH2}>Stage</p>
        <p className={styles.specBody}>{SITE.intro}</p>
        <p className={styles.note}>
          Display: Newsreader (optical-size axis), shown at weights 300, 400, 500. Interface: Hanken Grotesk.
        </p>
        <p className={styles.weights}>
          <span style={{ fontWeight: 300 }}>Bishal Raj · 300</span>
          <span style={{ fontWeight: 400 }}>Bishal Raj · 400</span>
          <span style={{ fontWeight: 500 }}>Bishal Raj · 500</span>
        </p>
      </section>

      <section aria-labelledby="images-heading">
        <h2 id="images-heading" className={`${styles.h2} ${styles.imagesHeading}`}>
          Photographs ({imageList.length})
        </h2>
        <p className={styles.note}>
          Every image is shown uncropped, never wider than its native pixel width. Not loaded here: p9, p13 and photo1 (excluded images).
          Both performance videos are published; see the Performance section of the site.
        </p>
        <div className={styles.cards}>
          {imageList.map((asset) => (
            <ImageCard key={asset.id} asset={asset} source={source} hairline={hairline} pageBlack={pageBlack} />
          ))}
        </div>
      </section>
    </div>
  )
}
