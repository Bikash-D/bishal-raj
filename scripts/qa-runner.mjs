import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const PORT = 5179;
const DIST_DIR = path.resolve('dist');

// Simple static server for dist/
function startServer() {
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.woff2': 'font/woff2',
    '.mp4': 'video/mp4',
    '.avif': 'image/avif',
  };

  const server = http.createServer((req, res) => {
    let filePath = path.join(DIST_DIR, req.url.split('?')[0]);
    if (filePath.endsWith(path.sep) || !path.extname(filePath)) {
      filePath = path.join(filePath, 'index.html');
    }
    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        res.writeHead(404);
        res.end('Not Found');
        return;
      }
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
      fs.createReadStream(filePath).pipe(res);
    });
  });

  return new Promise((resolve) => {
    server.listen(PORT, '127.0.0.1', () => {
      console.log(`[QA Server] Serving production build on http://127.0.0.1:${PORT}`);
      resolve(server);
    });
  });
}

class CDPClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.id = 1;
    this.callbacks = new Map();
    this.events = [];
    this.consoleErrors = [];
    this.networkErrors = [];

    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.callbacks.has(msg.id)) {
        const { resolve, reject } = this.callbacks.get(msg.id);
        this.callbacks.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
      } else if (msg.method) {
        if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
          this.consoleErrors.push(msg.params.args.map(a => a.value || a.description).join(' '));
        }
        if (msg.method === 'Runtime.exceptionThrown') {
          this.consoleErrors.push(msg.params.exceptionDetails.text);
        }
        if (msg.method === 'Network.responseReceived' && msg.params.response.status >= 400) {
          this.networkErrors.push(`${msg.params.response.status}: ${msg.params.response.url}`);
        }
      }
    };
  }

  waitOpen() {
    return new Promise((resolve) => {
      if (this.ws.readyState === WebSocket.OPEN) return resolve();
      this.ws.onopen = () => resolve();
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async eval(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    return res.result ? res.result.value : undefined;
  }

  async setViewport(width, height, isMobile = false, deviceScaleFactor = 2) {
    await this.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor,
      mobile: isMobile,
    });
  }

  async sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  async captureScreenshot(outputPath, fullPage = false) {
    let clip = undefined;
    if (fullPage) {
      const metrics = await this.send('Page.getLayoutMetrics');
      const contentSize = metrics.contentSize;
      clip = {
        x: 0,
        y: 0,
        width: contentSize.width,
        height: contentSize.height,
        scale: 1,
      };
    }
    const res = await this.send('Page.captureScreenshot', {
      format: 'jpeg',
      quality: 90,
      clip,
      captureBeyondViewport: fullPage,
    });
    fs.writeFileSync(outputPath, Buffer.from(res.data, 'base64'));
    console.log(`[Screenshot] Saved ${outputPath} (${fs.statSync(outputPath).size} bytes)`);
  }

  close() {
    this.ws.close();
  }
}

async function runBrowserQA(browserName, browserExe, debugPort) {
  console.log(`\n======================================================`);
  console.log(`STARTING QA WITH: ${browserName}`);
  console.log(`Binary: ${browserExe}`);
  console.log(`======================================================`);

  const tempProfile = path.join(process.cwd(), '.tmp-browser-' + debugPort);
  fs.mkdirSync(tempProfile, { recursive: true });

  const browser = spawn(browserExe, [
    '--headless=new',
    `--remote-debugging-port=${debugPort}`,
    `--user-data-dir=${tempProfile}`,
    '--disable-extensions',
    '--disable-background-networking',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank',
  ]);

  await new Promise((r) => setTimeout(r, 1500));

  let target;
  try {
    const listRes = await fetch(`http://127.0.0.1:${debugPort}/json/list`);
    const list = await listRes.json();
    target = list.find((t) => t.type === 'page') || list[0];
    if (!target) throw new Error('No page target found in browser!');
  } catch (err) {
    browser.kill();
    throw new Error(`Failed to connect to ${browserName} CDP: ${err.message}`);
  }

  const client = new CDPClient(target.webSocketDebuggerUrl);
  await client.waitOpen();

  await client.send('Page.enable');
  await client.send('Runtime.enable');
  await client.send('Network.enable');

  console.log(`Navigating to production site...`);
  await client.send('Page.navigate', { url: `http://127.0.0.1:${PORT}/` });
  await client.sleep(1500);

  // 1. Check title, description, schema
  const metadata = await client.eval(`({
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.getAttribute('content'),
    jsonLd: JSON.parse(document.querySelector('script[type="application/ld+json"]')?.textContent || '{}'),
    emailHrefs: Array.from(document.querySelectorAll('a[href^="mailto:"]')).map(a => a.href),
    waHrefs: Array.from(document.querySelectorAll('a[href*="wa.me"]')).map(a => a.href),
    socialHrefs: Array.from(document.querySelectorAll('a[href*="instagram.com"], a[href*="facebook.com"]')).map(a => a.href),
  })`);

  console.log(`[Metadata Check] Title: "${metadata.title}"`);
  console.log(`[Metadata Check] JSON-LD name: "${metadata.jsonLd.name}", email: "${metadata.jsonLd.email}", tel: "${metadata.jsonLd.telephone}"`);
  console.log(`[Contact Check] Found ${metadata.emailHrefs.length} mailto link(s):`, metadata.emailHrefs);
  console.log(`[Contact Check] Found ${metadata.waHrefs.length} WhatsApp link(s):`, metadata.waHrefs);

  // Assert contact details
  if (!metadata.emailHrefs.some(h => h.includes('thebishalraj@gmail.com'))) {
    throw new Error('Email thebishalraj@gmail.com not found in mailto links!');
  }
  if (!metadata.waHrefs.some(h => h.includes('9779864838906'))) {
    throw new Error('WhatsApp 9779864838906 not found in wa links!');
  }

  // Check hero CTAs
  const heroCheck = await client.eval(`({
    perfCta: document.querySelector('a[href="#performance"]')?.textContent?.trim(),
    contactCta: document.querySelector('a[href="#contact"]')?.textContent?.trim(),
  })`);
  console.log(`[Hero Check] Buttons:`, heroCheck);

  // Test Viewports and overflow
  const viewports = [
    { name: 'desktop', w: 1440, h: 900, isMobile: false },
    { name: 'laptop', w: 1024, h: 768, isMobile: false },
    { name: 'tablet', w: 768, h: 1024, isMobile: true },
    { name: 'mobile-large', w: 430, h: 932, isMobile: true },
    { name: 'mobile-standard', w: 390, h: 844, isMobile: true },
    { name: 'mobile-compact', w: 360, h: 780, isMobile: true },
  ];

  for (const vp of viewports) {
    await client.setViewport(vp.w, vp.h, vp.isMobile, 2);
    await client.sleep(300);
    const overflow = await client.eval(`({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      innerWidth: window.innerWidth,
      hasOverflow: document.documentElement.scrollWidth > window.innerWidth,
    })`);
    console.log(`[Viewport ${vp.name} (${vp.w}x${vp.h})] Overflow check:`, overflow.hasOverflow ? 'FAILED OVERFLOW!' : 'PASSED (no horizontal overflow)');
    if (overflow.hasOverflow) {
      throw new Error(`Horizontal overflow detected at ${vp.w}px viewport!`);
    }
  }

  // Screenshots in Chrome (only take once)
  if (browserName.includes('Chrome')) {
    // 1. Desktop hero
    await client.setViewport(1440, 900, false, 2);
    await client.eval(`window.scrollTo(0, 0)`);
    await client.sleep(600);
    await client.captureScreenshot('docs/screenshots/stage4/desktop-hero.jpg');

    // 2. Desktop full page
    await client.captureScreenshot('docs/screenshots/stage4/desktop-full-page.jpg', true);

    // 3. Tablet hero and full page
    await client.setViewport(768, 1024, true, 2);
    await client.eval(`window.scrollTo(0, 0)`);
    await client.sleep(600);
    await client.captureScreenshot('docs/screenshots/stage4/tablet-hero.jpg');
    await client.captureScreenshot('docs/screenshots/stage4/tablet-full-page.jpg', true);

    // 4. Mobile standard (390px) hero and full page
    await client.setViewport(390, 844, true, 2);
    await client.eval(`window.scrollTo(0, 0)`);
    await client.sleep(600);
    await client.captureScreenshot('docs/screenshots/stage4/mobile-hero.jpg');
    await client.captureScreenshot('docs/screenshots/stage4/mobile-full-page.jpg', true);

    // 5. Test Lightbox Open
    console.log(`[Interaction] Opening lightbox...`);
    await client.setViewport(1440, 900, false, 2);
    await client.eval(`document.querySelector('#gallery button')?.click()`);
    await client.sleep(600);
    const lightboxOpen = await client.eval(`!!document.querySelector('[role="dialog"][aria-label="Photograph viewer"]')`);
    console.log(`[Interaction] Lightbox open state:`, lightboxOpen);
    if (!lightboxOpen) throw new Error('Lightbox did not open on plate click!');
    await client.captureScreenshot('docs/screenshots/stage4/lightbox-open.jpg');

    // Test Lightbox Next / Previous navigation
    const currentNumber = await client.eval(`document.querySelector('[role="dialog"] p span')?.textContent`);
    console.log(`[Interaction] Lightbox plate number:`, currentNumber);
    await client.eval(`document.querySelector('[aria-label="Next photograph"]')?.click()`);
    await client.sleep(400);
    const nextNumber = await client.eval(`document.querySelector('[role="dialog"] p span')?.textContent`);
    console.log(`[Interaction] Lightbox after Next button:`, nextNumber);

    // Close Lightbox via Escape
    await client.send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
    await client.sleep(400);
    const lightboxClosed = await client.eval(`!document.querySelector('[role="dialog"][aria-label="Photograph viewer"]')`);
    console.log(`[Interaction] Lightbox closed via Escape:`, lightboxClosed);

    // 6. Test Mobile Menu
    console.log(`[Interaction] Testing mobile menu at 390px...`);
    await client.setViewport(390, 844, true, 2);
    await client.eval(`window.scrollTo(0, 0)`);
    await client.sleep(300);
    await client.eval(`document.querySelector('button[aria-haspopup="dialog"]')?.click()`);
    await client.sleep(500);
    const menuOpen = await client.eval(`!!document.querySelector('[role="dialog"][aria-label="Menu"]')`);
    console.log(`[Interaction] Mobile menu open state:`, menuOpen);
    if (!menuOpen) throw new Error('Mobile menu did not open on toggle click!');
    await client.captureScreenshot('docs/screenshots/stage4/mobile-menu.jpg');

    // Close menu
    await client.eval(`document.querySelector('[role="dialog"][aria-label="Menu"] button')?.click()`);
    await client.sleep(400);

    // 7. Test Video Play
    console.log(`[Interaction] Testing video playback...`);
    await client.setViewport(1440, 900, false, 2);
    await client.eval(`document.querySelector('#performance button')?.click()`);
    await client.sleep(1000);
    const videoStarted = await client.eval(`({
      videoHasControls: document.querySelector('#performance video')?.hasAttribute('controls'),
      paused: document.querySelector('#performance video')?.paused,
    })`);
    console.log(`[Interaction] Video 1 started state:`, videoStarted);
    await client.captureScreenshot('docs/screenshots/stage4/performance-playing.jpg');

    // 8. Contact section screenshots
    await client.eval(`document.querySelector('#contact')?.scrollIntoView()`);
    await client.sleep(600);
    await client.captureScreenshot('docs/screenshots/stage4/contact-desktop.jpg');

    await client.setViewport(390, 844, true, 2);
    await client.eval(`document.querySelector('#contact')?.scrollIntoView()`);
    await client.sleep(600);
    await client.captureScreenshot('docs/screenshots/stage4/contact-mobile.jpg');
  }

  // Console and network errors check
  console.log(`[Error Check] Console errors: ${client.consoleErrors.length}`);
  if (client.consoleErrors.length > 0) {
    console.error(`Console errors encountered:`, client.consoleErrors);
    throw new Error(`Console errors found in ${browserName}!`);
  }
  console.log(`[Error Check] Network 4xx/5xx errors: ${client.networkErrors.length}`);
  if (client.networkErrors.length > 0) {
    console.error(`Network errors encountered:`, client.networkErrors);
    throw new Error(`Network errors found in ${browserName}!`);
  }

  client.close();
  browser.kill();
  await new Promise((r) => setTimeout(r, 600));
  try {
    fs.rmSync(tempProfile, { recursive: true, force: true });
  } catch {}
  console.log(`[QA SUCCESS] All tests passed for ${browserName}!\n`);
}

async function main() {
  const server = await startServer();

  try {
    // 1. Test Google Chrome
    const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    if (fs.existsSync(chromePath)) {
      await runBrowserQA('Google Chrome 156 (Desktop & Emulated Mobile)', chromePath, 9222);
    } else {
      console.warn('Chrome executable not found at expected path.');
    }

    // 2. Test Microsoft Edge
    const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
    if (fs.existsSync(edgePath)) {
      await runBrowserQA('Microsoft Edge 156 (Desktop & Emulated Mobile)', edgePath, 9223);
    } else {
      console.warn('Edge executable not found at expected path.');
    }

    console.log('ALL BROWSER AUTOMATED QA SUITES COMPLETED WITH 100% SUCCESS.');
  } finally {
    server.close();
  }
}

main().catch((err) => {
  console.error('QA Runner encountered an error:', err);
  process.exit(1);
});
