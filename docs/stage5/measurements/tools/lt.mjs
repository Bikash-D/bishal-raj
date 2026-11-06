// Usage: node lt.mjs <url> [trials=8]  -> median/min/max of "blocking time" (sum of long-task ms over 50) in the first 4s, CPU 4x throttled
import { chromium } from '/home/claude/tools/node_modules/playwright-core/index.mjs'
const [url, n = '8'] = process.argv.slice(2)
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome', args: ['--no-sandbox'] })
const vals = []
for (let i = 0; i < Number(n); i++) {
  const ctx = await b.newContext({ viewport: { width: 412, height: 823 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 })
  const p = await ctx.newPage(); const c = await ctx.newCDPSession(p)
  await c.send('Emulation.setCPUThrottlingRate', { rate: 4 })
  await p.addInitScript(() => { window.__lt = 0; new PerformanceObserver(l => { for (const e of l.getEntries()) window.__lt += Math.max(0, e.duration - 50) }).observe({ type: 'longtask', buffered: true }) })
  await p.goto(url, { waitUntil: 'load' }); await p.waitForTimeout(4000)
  vals.push(Math.round(await p.evaluate(() => window.__lt))); await ctx.close()
}
await b.close(); vals.sort((a, c) => a - c)
console.log(`${url}  median ${vals[Math.floor(vals.length / 2)]}ms  min ${vals[0]}  max ${vals.at(-1)}  [${vals.join(',')}]`)
