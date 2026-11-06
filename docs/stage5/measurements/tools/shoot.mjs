// Usage: node shoot.mjs <baseUrl> <outDir>
import { chromium } from '/home/claude/tools/node_modules/playwright-core/index.mjs'
import fs from 'node:fs'
const [base, out] = process.argv.slice(2)
fs.mkdirSync(out, { recursive: true })
const VIEWS = [
  { name: '1440', w: 1440, h: 900, mobile: false },
  { name: '1366', w: 1366, h: 768, mobile: false },
  { name: '768', w: 768, h: 1024, mobile: true },
  { name: '430', w: 430, h: 932, mobile: true },
  { name: '390', w: 390, h: 844, mobile: true },
  { name: '360', w: 360, h: 740, mobile: true },
]
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome', args: ['--no-sandbox'] })
for (const v of VIEWS) {
  const ctx = await b.newContext({ viewport: { width: v.w, height: v.h }, deviceScaleFactor: 1, isMobile: v.mobile, hasTouch: v.mobile })
  const p = await ctx.newPage()
  await p.goto(base, { waitUntil: 'networkidle' })
  await p.waitForTimeout(2200) // let hero entrance finish
  await p.screenshot({ path: `${out}/${v.name}-hero.jpg`, type: 'jpeg', quality: 80 })
  // scroll through so every Reveal fires, then full page
  const H = await p.evaluate(() => document.documentElement.scrollHeight)
  for (let y = 0; y < H; y += v.h * 0.6) { await p.evaluate((yy) => window.scrollTo(0, yy), y); await p.waitForTimeout(120) }
  await p.waitForTimeout(1200)
  await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(400)
  await p.screenshot({ path: `${out}/${v.name}-full.jpg`, type: 'jpeg', quality: 70, fullPage: true })
  const dims = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, h: document.documentElement.scrollHeight }))
  console.log(v.name, dims)
  await ctx.close()
}
await b.close()
