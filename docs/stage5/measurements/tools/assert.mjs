import { chromium } from '/home/claude/tools/node_modules/playwright-core/index.mjs'
const base = process.argv[2]
const VIEWS = [[1440,900,false],[1366,768,false],[768,1024,true],[430,932,true],[390,844,true],[360,740,true],[375,667,true]]
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome', args: ['--no-sandbox'] })
let fail = 0
const ok = (c, m) => { console.log((c ? '  PASS ' : '  FAIL ') + m.slice(0,160)); if (!c) fail++ }
for (const [w,h,m] of VIEWS) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: m, hasTouch: m })
  const p = await ctx.newPage(); const errs = []
  p.on('console', x => { if (x.type()==='error') errs.push(x.text()) }); p.on('pageerror', e => errs.push(String(e)))
  await p.goto(base, { waitUntil: 'networkidle' }); await p.waitForTimeout(2200)
  console.log(`\n${w}x${h}`)
  for (const [sel, name] of [['a[href="#performance"]','View performances'],['a[href="#contact"]','Contact Bishal']]) {
    const r = await p.locator(`#home ${sel}`).first().boundingBox()
    ok(r && r.y >= 0 && r.y + r.height <= h && r.height >= 44, `${name} fully inside first screen (y=${Math.round(r?.y)}..${Math.round(r.y+r.height)} of ${h}, h=${Math.round(r.height)})`)
  }
  const sw = await p.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth])
  ok(sw[0] <= sw[1], `no horizontal overflow (${sw[0]} <= ${sw[1]})`)
  await p.locator('#contact').scrollIntoViewIfNeeded(); await p.waitForTimeout(1200)
  const em = await p.evaluate(() => { const a=document.querySelector('a[href^="mailto:"][class*=cardValue]'); const r=document.createRange(); r.selectNodeContents(a); return r.getClientRects().length })
  ok(em === 1, `email address on one line (${em} line box)`)
  ok(errs.length === 0, `no console errors ${errs.slice(0,2)}`)
  await ctx.close()
}
await b.close(); console.log(`\n${fail} failure(s)`); process.exit(fail ? 1 : 0)
