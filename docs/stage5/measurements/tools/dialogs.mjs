import { chromium } from '/home/claude/tools/node_modules/playwright-core/index.mjs'
const [base, out] = process.argv.slice(2)
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome', args: ['--no-sandbox'] })
for (const [name, vp, mobile] of [['desktop', { width: 1440, height: 900 }, false], ['mobile', { width: 390, height: 844 }, true]]) {
  const ctx = await b.newContext({ viewport: vp, isMobile: mobile, hasTouch: mobile }); const p = await ctx.newPage()
  await p.goto(base, { waitUntil: 'networkidle' }); await p.waitForTimeout(1500)
  await p.evaluate(() => document.querySelector('#gallery').scrollIntoView()); await p.waitForTimeout(1200)
  await p.locator('#gallery button').nth(1).click(); await p.waitForTimeout(900)
  await p.screenshot({ path: `${out}/${name}-lightbox.jpg`, type: 'jpeg', quality: 80 }); await p.keyboard.press('Escape'); await p.waitForTimeout(300)
  if (mobile) { await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(300); await p.locator('button[aria-haspopup="dialog"]').tap(); await p.waitForTimeout(900); await p.screenshot({ path: `${out}/mobile-menu.jpg`, type: 'jpeg', quality: 80 }) }
  await ctx.close()
}
await b.close()
