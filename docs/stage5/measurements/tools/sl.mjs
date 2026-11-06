import { chromium } from '/home/claude/tools/node_modules/playwright-core/index.mjs'
const [url, n = '6'] = process.argv.slice(2)
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome', args: ['--no-sandbox'] })
const rows = []
for (let i = 0; i < Number(n); i++) {
  const ctx = await b.newContext({ viewport: { width: 412, height: 823 }, isMobile: true, hasTouch: true }); const p = await ctx.newPage(); const c = await ctx.newCDPSession(p)
  await c.send('Performance.enable'); await c.send('Emulation.setCPUThrottlingRate', { rate: 4 })
  await p.goto(url, { waitUntil: 'load' }); await p.waitForTimeout(3500)
  const m = Object.fromEntries((await c.send('Performance.getMetrics')).metrics.map(x => [x.name, x.value]))
  rows.push({ layoutMs: m.LayoutDuration * 1000, styleMs: m.RecalcStyleDuration * 1000, layouts: m.LayoutCount, styles: m.RecalcStyleCount, scriptMs: m.ScriptDuration * 1000, nodes: m.Nodes })
  await ctx.close()
}
await b.close()
const med = k => rows.map(r => r[k]).sort((a, b) => a - b)[Math.floor(rows.length / 2)]
console.log(url, Object.fromEntries(['layoutMs', 'styleMs', 'layouts', 'styles', 'scriptMs', 'nodes'].map(k => [k, Math.round(med(k) * 10) / 10])))
