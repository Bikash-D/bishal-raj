import { chromium } from '/home/claude/tools/node_modules/playwright-core/index.mjs'
const base = process.argv[2]
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome', args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] })
let fail = 0
const ok = (c, m) => { console.log((c ? '  PASS ' : '  FAIL ') + m); if (!c) fail++ }
const head = async (path) => { const r = await fetch(new URL(path, base)); return { status: r.status, type: r.headers.get('content-type'), len: Number(r.headers.get('content-length')), csp: r.headers.get('content-security-policy') } }

console.log('\n== HTTP')
for (const [p, st, t] of [['/', 200, 'text/html'], ['/robots.txt', 200, 'text/plain'], ['/Bishal-Raj-Actor-Profile.pdf', 200, 'application/pdf'], ['/og-image.jpg', 200, 'image/jpeg'], ['/media/video/bishal-video-1.mp4', 200, 'video/mp4'], ['/media/video/bishal-video-2.mp4', 200, 'video/mp4'], ['/does-not-exist', 404, 'text/html'], ['/sitemap.xml', 404, 'text/html']]) {
  const r = await head(p); ok(r.status === st && r.type?.startsWith(t), `${p} -> ${r.status} ${r.type}`)
}
const idx = await head('/'); ok(!!idx.csp && idx.csp.includes("default-src 'self'"), 'security headers (CSP) served from _headers')

const ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, permissions: ['clipboard-read', 'clipboard-write'] })
const p = await ctx.newPage(); const reqs = []; const errs = []
p.on('request', r => reqs.push(r.url())); p.on('console', m => { if (['error','warning'].includes(m.type())) errs.push(m.text().slice(0,120)) }); p.on('pageerror', e => errs.push(String(e)))
await p.goto(base, { waitUntil: 'networkidle' }); await p.waitForTimeout(1500)

console.log('\n== Load behaviour')
ok(!reqs.some(u => u.endsWith('.mp4')), 'no video file requested before play')
ok(!reqs.some(u => u.includes('/posters/')), 'video posters not fetched during initial load (lazy)')
ok(reqs.some(u => /kneel-wide-\d+\.avif/.test(u)), 'hero AVIF requested')
ok(reqs.filter(u => /kneel-wide-\d+\.avif/.test(u)).length === 1, 'hero image fetched once (preload matches img srcset)')

console.log('\n== Contact links')
const hrefs = await p.$$eval('#contact a', as => as.map(a => a.getAttribute('href')))
ok(hrefs.some(h => h.startsWith('mailto:thebishalraj@gmail.com?subject=')), 'mailto link correct')
const wa = hrefs.find(h => h.startsWith('https://wa.me/'))
ok(wa?.startsWith('https://wa.me/9779864838906?text=') && decodeURIComponent(wa).includes('discuss a professional opportunity'), 'WhatsApp link: wa.me/9779864838906 with encoded message')
ok(hrefs.includes('https://www.instagram.com/biishal.rajjj/'), 'Instagram link correct')
ok(hrefs.includes('https://www.facebook.com/bishalrajjj'), 'Facebook link correct')
ok(await p.locator('text=thebishalraj@gmail.com').first().isVisible() && await p.locator('text=+977 986-4838906').first().isVisible(), 'email and phone visible as text')
const targets = await p.$$eval('a[target=_blank]', as => as.map(a => a.rel))
ok(targets.every(r => r.includes('noopener')), `all ${targets.length} target=_blank links have rel=noopener`)
await p.locator('#contact').scrollIntoViewIfNeeded(); await p.waitForTimeout(900)
await p.getByRole('button', { name: /copy email address/i }).click()
ok((await p.evaluate(() => navigator.clipboard.readText())) === 'thebishalraj@gmail.com', 'Copy email puts the exact address on the clipboard')
ok((await p.locator('[role=status]').first().textContent()).includes('copied'), 'copy confirmation exposed via role=status')
await p.getByRole('button', { name: /copy phone number/i }).click()
ok((await p.evaluate(() => navigator.clipboard.readText())) === '+977 986-4838906', 'Copy phone puts the exact number on the clipboard')

console.log('\n== Floating action')
await p.evaluate(() => window.scrollTo(0, 1400)); await p.waitForTimeout(700)
ok(await p.locator('aside[aria-label="Quick actions"] a[href^="https://wa.me/"]').count() === 1, 'floating WhatsApp visible mid-page')
await p.locator('#contact').scrollIntoViewIfNeeded(); await p.evaluate(() => document.querySelector('#contact').scrollIntoView({block:'center'})); await p.waitForTimeout(900)
ok(await p.locator('aside[aria-label="Quick actions"] a[href^="https://wa.me/"]').count() === 0, 'floating WhatsApp steps aside inside Contact section')

console.log('\n== Lightbox (keyboard)')
await p.evaluate(() => document.querySelector('#gallery').scrollIntoView()); await p.waitForTimeout(1200)
const first = p.locator('#gallery button').first(); await first.focus(); await p.keyboard.press('Enter'); await p.waitForTimeout(500)
ok(await p.locator('[role=dialog]').count() === 1, 'Enter opens lightbox')
ok(await p.evaluate(() => document.getElementById('root').inert === true), 'page behind is inert while open')
ok(await p.evaluate(() => !!document.activeElement.closest('[role=dialog]')), 'focus moved into dialog')
const c1 = await p.locator('[role=dialog] [aria-live]').first().textContent(); await p.keyboard.press('ArrowRight'); await p.waitForTimeout(300)
const c2 = await p.locator('[role=dialog] [aria-live]').first().textContent(); ok(c1 !== c2, `ArrowRight advances (${c1.trim()} -> ${c2.trim()})`)
for (let i = 0; i < 6; i++) await p.keyboard.press('Tab')
ok(await p.evaluate(() => !!document.activeElement.closest('[role=dialog]')), 'Tab cycles inside dialog (focus trap)')
await p.keyboard.press('Escape'); await p.waitForTimeout(400)
ok(await p.locator('[role=dialog]').count() === 0 && await p.evaluate(() => document.getElementById('root').inert === false), 'Escape closes and restores page')
ok(await p.evaluate(() => document.activeElement === document.querySelector('#gallery button')), 'focus returns to the plate that opened it')

console.log('\n== Video (both)')
await p.evaluate(() => document.querySelector('#performance').scrollIntoView()); await p.waitForTimeout(1500)
ok(reqs.some(u => u.includes('/posters/performance-01')) && reqs.some(u => u.includes('/posters/performance-02')), 'posters load once the section nears the viewport')
const before = reqs.filter(u => u.endsWith('.mp4')).length
for (const n of ['01', '02']) {
  await p.getByRole('button', { name: new RegExp(`Play Footage.*Performance ${n}`) }).click(); await p.waitForTimeout(2200)
  const st = await p.evaluate(() => [...document.querySelectorAll('video')].map(v => ({ t: +v.currentTime.toFixed(2), paused: v.paused, ready: v.readyState, err: v.error?.code ?? null, dur: Math.round(v.duration || 0) })))
  console.log('    state', JSON.stringify(st))
  const idx = Number(n) - 1; ok(!st[idx].paused && st[idx].t > 0.5 && st[idx].err === null, `Performance ${n} plays (t=${st[idx].t}s, duration ${st[idx].dur}s)`)
  ok(st.filter(s => !s.paused).length === 1, `only one video plays at a time after starting ${n}`)
}
ok(reqs.filter(u => u.endsWith('.mp4')).length > before, 'video bytes requested only after pressing play')
ok(await p.locator('video[controls]').count() === 2, 'native controls appear after play')
ok(await p.locator('video track').count() === 0, 'no caption track published (none verified yet: see docs)')

console.log('\n== Console')
ok(errs.length === 0, `no console errors/warnings ${errs.join(' | ')}`)
await ctx.close()

console.log('\n== Mobile menu (touch, 390)')
const m = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }); const mp = await m.newPage()
await mp.goto(base, { waitUntil: 'networkidle' }); await mp.waitForTimeout(1500)
const toggle = mp.locator('button[aria-haspopup="dialog"]'); await toggle.tap(); await mp.waitForTimeout(600)
ok(await mp.locator('[role=dialog]').count() === 1 && await mp.evaluate(() => document.getElementById('root').inert === true), 'menu opens, page inert')
ok(await mp.evaluate(() => !!document.activeElement.closest('[role=dialog]')), 'focus inside menu')
const tgt = await mp.$$eval('[role=dialog] a, [role=dialog] button', els => els.map(e => { const r = e.getBoundingClientRect(); return Math.round(r.height) }))
ok(Math.min(...tgt) >= 40, `menu touch targets >= 40px tall (min ${Math.min(...tgt)}px)`)
await mp.keyboard.press('Escape'); await mp.waitForTimeout(400)
ok(await mp.locator('[role=dialog]').count() === 0 && await mp.evaluate(() => document.activeElement === document.querySelector('button[aria-haspopup="dialog"]')), 'Escape closes, focus back on Menu button')
await toggle.tap(); await mp.waitForTimeout(500); await mp.locator('[role=dialog] a[href="#performance"]').tap(); await mp.waitForTimeout(1200)
ok(await mp.locator('[role=dialog]').count() === 0 && (await mp.evaluate(() => window.scrollY)) > 300, 'tapping a menu link closes menu and scrolls')
const small = await mp.$$eval('#contact button, #contact a', els => els.filter(e => e.offsetParent).map(e => Math.round(e.getBoundingClientRect().height)))
ok(Math.min(...small) >= 44, `contact control heights: min ${Math.min(...small)}px`)
await m.close()

console.log('\n== Reduced motion')
const r = await b.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' }); const rp = await r.newPage()
await rp.goto(base, { waitUntil: 'load' }); await rp.waitForTimeout(250)
ok(await rp.evaluate(() => { const h = document.querySelector('h1'); return parseFloat(getComputedStyle(h).opacity) === 1 }), 'hero visible immediately with reduced motion')
await rp.evaluate(() => document.querySelector('#about').scrollIntoView()); await rp.waitForTimeout(250)
ok(await rp.evaluate(() => [...document.querySelectorAll('#about *')].filter(e => getComputedStyle(e).opacity !== '1' && e.children.length === 0 && e.textContent.trim()).length === 0), 'About content visible immediately with reduced motion')
await r.close()

console.log('\n== 404 page content')
const n = await (await fetch(new URL('/nope', base))).text(); ok(n.includes('This page does not exist') && n.includes('noindex'), '404 page is branded and noindex')
await b.close(); console.log(`\n${fail} failure(s)`); process.exit(fail ? 1 : 0)
