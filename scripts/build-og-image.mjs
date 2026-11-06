/**
 * Builds public/og-image.jpg (1200x630 social share card) with the site's real fonts.
 * Needs Playwright (dev-only, not a project dependency):  npx -y -p playwright-core node scripts/build-og-image.mjs
 * with CHROME_PATH set to Chrome/Edge. Text comes from src/content/site.ts.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright-core'
import { HERO_FACTS, SITE } from '../src/content/site.ts'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const b64 = (f) => fs.readFileSync(path.join(root, f)).toString('base64')
const html = `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:N;font-weight:200 800;src:url(data:font/woff2;base64,${b64('node_modules/@fontsource-variable/newsreader/files/newsreader-latin-opsz-normal.woff2')})}
@font-face{font-family:H;font-weight:100 900;src:url(data:font/woff2;base64,${b64('node_modules/@fontsource-variable/hanken-grotesk/files/hanken-grotesk-latin-wght-normal.woff2')})}
*{box-sizing:border-box}html,body{margin:0;width:1200px;height:630px;background:#030303;overflow:hidden;color:#efe9df;font-family:H,sans-serif}
.photo{position:absolute;right:0;top:0;width:640px;height:630px;background:url(data:image/jpeg;base64,${b64('public/media/kneel-wide.jpg')}) 50% 18%/cover no-repeat}
.photo::after{content:'';position:absolute;inset:0;background:linear-gradient(to right,#030303 0,rgba(3,3,3,.8) 10%,transparent 40%)}
.t{position:absolute;left:84px;top:96px}
h1{margin:0;font-family:N;font-weight:300;font-size:116px;line-height:.95;text-transform:uppercase}
.r{display:flex;align-items:center;gap:22px;margin-top:38px;font-size:22px;letter-spacing:.34em;text-transform:uppercase;color:#a39b8e}
.r::before{content:'';width:64px;height:2px;background:#b08051}
.f{position:absolute;left:84px;bottom:70px;font-size:21px;line-height:1.7;color:#d6cfc3}
.f span{display:block}</style>
<div class="photo"></div><div class="t"><h1>${SITE.name.split(' ')[0]}<br>${SITE.name.split(' ')[1]}</h1><div class="r">${SITE.role}</div></div>
<div class="f">${HERO_FACTS.map((x) => `<span>${x}</span>`).join('')}</div>`
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH, args: ['--no-sandbox'] })
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
await page.setContent(html)
await page.evaluate(() => document.fonts.ready)
await page.screenshot({ path: path.join(root, 'public', 'og-image.jpg'), type: 'jpeg', quality: 90 })
await browser.close()
console.log('Wrote public/og-image.jpg')
