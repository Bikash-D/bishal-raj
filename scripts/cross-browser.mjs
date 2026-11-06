/**
 * Cross-browser smoke test: Chromium, Firefox and WebKit (Safari's engine), desktop + phone emulation.
 *
 * ONE-TIME SETUP (does not change package.json or the lockfile):
 *   npm install --no-save playwright
 *   npx playwright install chromium firefox webkit
 *
 * RUN (builds first if dist/ is missing):
 *   npm run build
 *   node scripts/cross-browser.mjs
 *   node scripts/cross-browser.mjs firefox        # one browser only
 *
 * What this is and is not: automated engine testing. WebKit here is the Safari ENGINE, not Safari on a
 * real iPhone or Mac, and Playwright's Firefox may lack the H.264 codec on some systems (a video
 * failure in Firefox is reported as a warning to verify by hand, not as a site bug). A real phone check
 * is still on the checklist in docs/stage5/BROWSER-TESTING.md.
 */
import { spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

let pw
try {
  pw = await import('playwright')
} catch {
  pw = await import('playwright-core')
}
const { chromium, firefox, webkit, devices } = pw.default ?? pw
const engines = { chromium, firefox, webkit }
const wanted = process.argv.slice(2).length ? process.argv.slice(2) : ['chromium', 'firefox', 'webkit']

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const port = 4399
const server = spawn(process.execPath, [path.join(root, 'scripts', 'serve-dist.mjs'), 'dist', String(port)], { cwd: root, stdio: 'ignore' })
await new Promise((r) => setTimeout(r, 1200))
const base = `http://127.0.0.1:${port}/`

const results = []
const record = (browser, profile, name, pass, note = '', warn = false) => {
  results.push({ browser, profile, name, pass, warn })
  console.log(`  ${pass ? 'PASS' : warn ? 'WARN' : 'FAIL'}  ${name}${note ? ` (${note})` : ''}`)
}

for (const name of wanted) {
  const engine = engines[name]
  if (!engine) continue
  let browser
  try {
    browser = await engine.launch(process.env.CHROME_PATH && name === 'chromium' ? { executablePath: process.env.CHROME_PATH, args: ['--no-sandbox'] } : {})
  } catch (e) {
    console.log(`\n${name}: could not launch (${String(e.message).split('\n')[0]}). Run: npx playwright install ${name}`)
    record(name, '-', 'browser launches', false)
    continue
  }
  const profiles = [
    ['desktop 1280x800', { viewport: { width: 1280, height: 800 } }],
    ['phone (iPhone 14 profile)', devices['iPhone 14'] && name !== 'firefox' ? devices['iPhone 14'] : { viewport: { width: 390, height: 844 }, hasTouch: true }],
  ]
  for (const [label, opts] of profiles) {
    console.log(`\n== ${name} · ${label}`)
    const ctx = await browser.newContext(opts)
    const page = await ctx.newPage()
    const errors = []
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text().slice(0, 100)))
    page.on('pageerror', (e) => errors.push(String(e).slice(0, 100)))
    const phone = !!opts.hasTouch
    try {
      await page.goto(base, { waitUntil: 'networkidle' })
      await page.waitForTimeout(2000)
      const vp = page.viewportSize()
      const box = async (sel) => page.locator(`#home ${sel}`).first().boundingBox()
      const a = await box('a[href="#performance"]'), c = await box('a[href="#contact"]')
      record(name, label, 'hero shows View performances + Contact on the first screen', !!a && !!c && a.y + a.height <= vp.height && c.y + c.height <= vp.height)
      record(name, label, 'no horizontal scrolling', await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth))
      await page.locator('#contact').scrollIntoViewIfNeeded(); await page.waitForTimeout(900)
      const oneLine = await page.evaluate(() => { const el = document.querySelector('a[href^="mailto:"][class*=cardValue]'); const r = document.createRange(); r.selectNodeContents(el); return r.getClientRects().length === 1 })
      record(name, label, 'email address is on one line', oneLine)
      const hrefs = await page.$$eval('#contact a', (as) => as.map((x) => x.getAttribute('href')))
      record(name, label, 'mailto + wa.me/9779864838906 + both social links present', hrefs.some((h) => h.startsWith('mailto:thebishalraj@gmail.com')) && hrefs.some((h) => h.startsWith('https://wa.me/9779864838906?text=')) && hrefs.includes('https://www.instagram.com/biishal.rajjj/') && hrefs.includes('https://www.facebook.com/bishalrajjj'))

      await page.evaluate(() => document.querySelector('#gallery').scrollIntoView()); await page.waitForTimeout(1200)
      await page.locator('#gallery button').first().click(); await page.waitForTimeout(600)
      const open = (await page.locator('[role=dialog]').count()) === 1
      await page.keyboard.press('ArrowRight'); await page.waitForTimeout(200)
      const counter = (await page.locator('[role=dialog] [aria-live]').first().textContent()) ?? ''
      await page.keyboard.press('Escape'); await page.waitForTimeout(400)
      record(name, label, 'lightbox opens, ArrowRight advances, Escape closes', open && counter.includes('02') && (await page.locator('[role=dialog]').count()) === 0)

      if (phone) {
        await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(300)
        await page.locator('button[aria-haspopup="dialog"]').tap(); await page.waitForTimeout(600)
        const menuOpen = (await page.locator('[role=dialog]').count()) === 1
        await page.locator('[role=dialog] a[href="#performance"]').tap(); await page.waitForTimeout(1200)
        record(name, label, 'mobile menu opens; a link closes it and scrolls', menuOpen && (await page.locator('[role=dialog]').count()) === 0 && (await page.evaluate(() => window.scrollY)) > 300)
      }

      await page.evaluate(() => document.querySelector('#performance').scrollIntoView()); await page.waitForTimeout(1200)
      const videos = []
      for (const n of ['01', '02']) {
        await page.getByRole('button', { name: new RegExp(`Play Footage.*Performance ${n}`) }).click(); await page.waitForTimeout(2500)
        const t = await page.evaluate((i) => { const v = document.querySelectorAll('video')[i]; return { t: v.currentTime, paused: v.paused, err: v.error?.code ?? null } }, Number(n) - 1)
        videos.push(t)
      }
      const played = videos.every((v) => !v.paused && v.t > 0.5 && v.err === null)
      record(name, label, 'both performance videos play', played, played ? '' : `state ${JSON.stringify(videos)}`, name === 'firefox' && !played)
      record(name, label, 'no console errors', errors.length === 0, errors.join(' | '))
    } catch (e) {
      record(name, label, 'test run completed', false, String(e.message).split('\n')[0])
    }
    await ctx.close()
  }
  await browser.close()
}
server.kill()
const failed = results.filter((r) => !r.pass && !r.warn).length
const warned = results.filter((r) => !r.pass && r.warn).length
console.log(`\nSummary: ${results.filter((r) => r.pass).length} passed, ${failed} failed, ${warned} warning(s)  [engines: ${[...new Set(results.map((r) => r.browser))].join(', ')}]`)
process.exit(failed ? 1 : 0)
