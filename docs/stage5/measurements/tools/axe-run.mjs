// Usage: node axe-run.mjs <baseUrl> [outJson]
import { chromium } from '/home/claude/tools/node_modules/playwright-core/index.mjs'
import fs from 'node:fs'
const [base, out] = process.argv.slice(2)
const axeSrc = fs.readFileSync('/home/claude/tools/node_modules/axe-core/axe.min.js', 'utf8')
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome', args: ['--no-sandbox'] })
const results = {}
async function scan(page, label) {
  await page.evaluate(axeSrc)
  const r = await page.evaluate(async () => await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa','best-practice'] } }))
  results[label] = r.violations.map(v => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.map(n => n.target.join(' ')).slice(0, 6), count: v.nodes.length }))
  console.log(`\n[${label}] violations: ${r.violations.length}, passes: ${r.passes.length}, incomplete: ${r.incomplete.length}`)
  for (const v of results[label]) console.log(`  - ${v.id} (${v.impact}) x${v.count}: ${v.help}\n      ${v.nodes.slice(0,3).join(' | ')}`)
  if (r.incomplete.length) console.log('  incomplete:', r.incomplete.map(i => `${i.id}(${i.nodes.length})`).join(', '))
}
for (const [name, vp, mobile] of [['desktop-1440', { width: 1440, height: 900 }, false], ['mobile-390', { width: 390, height: 844 }, true]]) {
  const ctx = await b.newContext({ viewport: vp, isMobile: mobile, hasTouch: mobile })
  const p = await ctx.newPage()
  await p.goto(base, { waitUntil: 'networkidle' }); await p.waitForTimeout(2000)
  // reveal everything
  const H = await p.evaluate(() => document.documentElement.scrollHeight)
  for (let y = 0; y < H; y += 500) { await p.evaluate(yy => window.scrollTo(0, yy), y); await p.waitForTimeout(80) }
  await p.waitForTimeout(1200)
  await scan(p, `${name} page`)
  // lightbox
  await p.evaluate(() => document.querySelector('#gallery button')?.scrollIntoView({ block: 'center' })); await p.waitForTimeout(600)
  await p.click('#gallery button'); await p.waitForTimeout(700)
  await scan(p, `${name} lightbox`)
  await p.keyboard.press('Escape'); await p.waitForTimeout(300)
  if (mobile) {
    await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(300)
    await p.click('button[aria-haspopup="dialog"]'); await p.waitForTimeout(700)
    await scan(p, `${name} menu`)
  }
  await ctx.close()
}
await b.close()
if (out) fs.writeFileSync(out, JSON.stringify(results, null, 2))
