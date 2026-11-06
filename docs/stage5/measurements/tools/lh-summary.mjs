import fs from 'node:fs'
const [dir, ...names] = process.argv.slice(2)
for (const p of names) {
  const r = JSON.parse(fs.readFileSync(`${dir}/lh-${p}`, 'utf8'))
  const c = r.categories, a = r.audits
  console.log(`\n[${p}] Lighthouse ${r.lighthouseVersion}`, Object.fromEntries(Object.entries(c).map(([k, v]) => [k, Math.round(v.score * 100)])))
  for (const k of ['first-contentful-paint','largest-contentful-paint','total-blocking-time','cumulative-layout-shift','speed-index','interactive','total-byte-weight'])
    if (a[k]) console.log('  ', k.padEnd(28), a[k].displayValue)
  const failing = Object.values(a).filter(x => x.score !== null && x.score < 0.9 && x.scoreDisplayMode !== 'informative' && x.scoreDisplayMode!=='notApplicable' && x.scoreDisplayMode!=='manual')
  for (const f of failing) console.log('   ✗', f.id, '-', f.title, f.displayValue ? `(${f.displayValue})` : '')
}
