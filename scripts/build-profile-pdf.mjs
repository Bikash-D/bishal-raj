/**
 * Builds public/Bishal-Raj-Actor-Profile.pdf: a ONE-PAGE casting profile sheet.
 *
 * It is generated from the same confirmed data as the website (src/content/site.ts and
 * src/content/profile.ts), so it can only ever contain what the owner confirmed. It is not a CV:
 * no CV or credits exist yet. When verified credits are added to profile.ts they appear here too.
 *
 * Needs Node 22.18+ (runs the TypeScript content files directly) and Google Chrome or Microsoft Edge
 * (used headlessly to print the PDF; nothing is installed or downloaded).
 *
 *   npm run profile:pdf
 *   (optional) $env:CHROME_PATH = "C:\Path\To\chrome.exe"
 *   (optional) $env:SITE_URL = "https://your-domain.example"   # prints the website address on the sheet
 */
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { CONTACT_CONFIG, SITE, TRAINING } from '../src/content/site.ts'
import { factText, visibleCredits, visibleFacts } from '../src/content/profile.ts'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const out = path.join(root, 'public', 'Bishal-Raj-Actor-Profile.pdf')

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ].filter(Boolean)
  const found = candidates.find((c) => fs.existsSync(c))
  if (!found) throw new Error('Chrome or Edge not found. Set CHROME_PATH to the browser .exe and run again.')
  return found
}

const b64 = (file) => fs.readFileSync(path.join(root, file)).toString('base64')
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const facts = visibleFacts()
const credits = visibleCredits()
const siteUrl = (process.env.SITE_URL ?? '').replace(/\/+$/, '')
const updated = new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })

const factRows = [
  `<div class="row"><dt>${esc(TRAINING.label)}</dt><dd>${esc(TRAINING.institution)}<span class="sub">${esc(TRAINING.status)}</span></dd></div>`,
  ...facts.map((f) =>
    Array.isArray(f.value)
      ? `<div class="row"><dt>${esc(f.label)}</dt><dd class="chips">${f.value.map((v) => `<span>${esc(v)}</span>`).join('')}</dd></div>`
      : `<div class="row"><dt>${esc(f.label)}</dt><dd>${esc(factText(f))}</dd></div>`,
  ),
].join('\n')

const creditBlock = credits.length
  ? `<section class="credits"><h2>Credits</h2><ul>${credits
      .map((c) => `<li><b>${esc(c.title)}</b><span>${esc([c.role, c.kind, c.company, c.year].filter(Boolean).join(' · '))}</span></li>`)
      .join('')}</ul></section>`
  : ''

const contacts = [
  ['Email', CONTACT_CONFIG.email],
  ['WhatsApp', CONTACT_CONFIG.phoneDisplay],
  [CONTACT_CONFIG.instagram.label, CONTACT_CONFIG.instagram.handle],
  [CONTACT_CONFIG.facebook.label, CONTACT_CONFIG.facebook.handle],
  ...(siteUrl ? [['Portfolio', siteUrl.replace(/^https?:\/\//, '')]] : []),
]

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${esc(SITE.name)} — Actor — Casting profile</title>
<style>
@font-face{font-family:'Newsreader';font-weight:200 800;src:url(data:font/woff2;base64,${b64('node_modules/@fontsource-variable/newsreader/files/newsreader-latin-opsz-normal.woff2')}) format('woff2');}
@font-face{font-family:'Hanken Grotesk';font-weight:100 900;src:url(data:font/woff2;base64,${b64('node_modules/@fontsource-variable/hanken-grotesk/files/hanken-grotesk-latin-wght-normal.woff2')}) format('woff2');}
@page{size:A4;margin:0}
*{box-sizing:border-box}
html,body{margin:0;background:#030303;-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{width:210mm;height:297mm;overflow:hidden;position:relative;color:#efe9df;font-family:'Hanken Grotesk',sans-serif}
.photo{position:absolute;top:0;right:0;width:108mm;height:192mm;background:url(data:image/jpeg;base64,${b64('public/media/kneel-close.jpg')}) center top/cover no-repeat;
}
.photo::after{content:'';position:absolute;inset:-.6mm;background:linear-gradient(to right,#030303 0,rgba(3,3,3,.85) 8%,transparent 38%),linear-gradient(to top,#030303 0,transparent 22%),linear-gradient(to bottom,rgba(3,3,3,.7) 0,transparent 8%)}
.left{position:absolute;left:18mm;top:24mm;width:92mm}
.role{display:flex;align-items:center;gap:4mm;margin:0;font-size:9pt;letter-spacing:.32em;text-transform:uppercase;color:#b08051}
.role::before{content:'';width:9mm;height:.25mm;background:#b08051}
h1{margin:6mm 0 0;font-family:'Newsreader',serif;font-weight:300;font-size:50pt;line-height:.95;letter-spacing:.01em;text-transform:uppercase}
dl{margin:20mm 0 0;padding:0;border-top:.25mm solid #221d18}
.row{display:grid;grid-template-columns:27mm 1fr;gap:3mm;padding:3.4mm 0;border-bottom:.25mm solid #221d18}
dt{font-size:7.5pt;letter-spacing:.2em;text-transform:uppercase;color:#a39b8e;padding-top:.6mm}
dd{margin:0;font-size:11pt;line-height:1.35}
.sub{display:block;margin-top:.8mm;font-size:8.5pt;color:#b08051;letter-spacing:.06em}
.chips span{display:inline-block;margin:0 1.6mm 1.6mm 0;padding:.8mm 2.4mm;border:.25mm solid #3a322a;font-size:8.5pt;color:#d6cfc3}
.credits h2{margin:10mm 0 2mm;font-size:7.5pt;font-weight:400;letter-spacing:.2em;text-transform:uppercase;color:#a39b8e}
.credits ul{margin:0;padding:0;list-style:none;border-top:.25mm solid #221d18}
.credits li{padding:2.4mm 0;border-bottom:.25mm solid #221d18;font-size:10pt}
.credits li span{display:block;font-size:8.5pt;color:#a39b8e}
.contact{position:absolute;left:18mm;right:18mm;top:222mm}
.contact h2{margin:0 0 4mm;display:flex;align-items:center;gap:4mm;font-size:8pt;font-weight:400;letter-spacing:.32em;text-transform:uppercase;color:#b08051}
.contact h2::before{content:'';width:9mm;height:.25mm;background:#b08051}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:0 10mm;border-top:.25mm solid #221d18}
.c{display:grid;grid-template-columns:24mm 1fr;padding:3.6mm 0;border-bottom:.25mm solid #221d18}
.c b{font-weight:400;font-size:7.5pt;letter-spacing:.2em;text-transform:uppercase;color:#a39b8e;padding-top:.8mm}
.c span{font-family:'Newsreader',serif;font-size:13pt;font-weight:300}
.foot{position:absolute;left:18mm;right:18mm;bottom:11mm;display:flex;justify-content:space-between;font-size:7pt;letter-spacing:.14em;text-transform:uppercase;color:#6d675e}
</style></head><body>
<div class="photo" role="img" aria-label="Bishal Raj kneeling in a spotlight, looking upward"></div>
<div class="left">
  <p class="role">${esc(SITE.role)}</p>
  <h1>${esc(SITE.name.split(' ')[0])}<br>${esc(SITE.name.split(' ')[1])}</h1>
  <dl>${factRows}</dl>
  ${creditBlock}
</div>
<section class="contact"><h2>Contact</h2><div class="grid">${contacts.map(([k, v]) => `<div class="c"><b>${esc(k)}</b><span>${esc(v)}</span></div>`).join('')}</div></section>
<div class="foot"><span>${esc(SITE.name)} · Casting profile</span><span>Confirmed details only · ${esc(updated)}</span></div>
</body></html>`

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'profile-pdf-'))
const htmlFile = path.join(tmp, 'profile.html')
fs.writeFileSync(htmlFile, html)
const chrome = findChrome()
execFileSync(
  chrome,
  [
    ...(/headless[-_]shell/i.test(chrome) ? [] : ['--headless=new']),
    '--disable-gpu',
    '--no-sandbox',
    '--no-pdf-header-footer',
    '--virtual-time-budget=4000',
    `--user-data-dir=${path.join(tmp, 'profile')}`,
    `--print-to-pdf=${out}`,
    pathToFileURL(htmlFile).href,
  ],
  { stdio: 'ignore', timeout: 90_000 },
)
fs.rmSync(tmp, { recursive: true, force: true })
console.log(`Wrote ${path.relative(root, out)} (${(fs.statSync(out).size / 1024).toFixed(0)} KB)`)
