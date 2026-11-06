/**
 * Serves the production build (dist/) with no dependencies, the way a plain static host would:
 *  - correct MIME types and HTTP Range support (needed for video seeking),
 *  - 404.html for unknown paths with a real 404 status,
 *  - `_headers` rules applied (so security headers can be tested locally),
 *  - gzip for text files (as every real host does), so size measurements are realistic,
 *  - never serves anything outside dist/.
 *
 * Usage:  node scripts/serve-dist.mjs [dir=dist] [port=4173]
 */
import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import zlib from 'node:zlib'

const root = path.resolve(process.argv[2] ?? 'dist')
const port = Number(process.argv[3] ?? 4173)

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.avif': 'image/avif',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.mp4': 'video/mp4',
  '.vtt': 'text/vtt; charset=utf-8',
  '.pdf': 'application/pdf',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json',
}

/** Minimal parser for the Netlify / Cloudflare Pages `_headers` file format. */
function loadHeaderRules() {
  const file = path.join(root, '_headers')
  if (!fs.existsSync(file)) return []
  const rules = []
  let current = null
  for (const raw of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    if (!raw.trim() || raw.trim().startsWith('#')) continue
    if (!/^\s/.test(raw)) {
      current = { pattern: raw.trim(), headers: [] }
      rules.push(current)
    } else if (current) {
      const i = raw.indexOf(':')
      current.headers.push([raw.slice(0, i).trim(), raw.slice(i + 1).trim()])
    }
  }
  return rules
}

function patternToRegExp(pattern) {
  const esc = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*')
  return new RegExp(`^${esc}$`)
}

const rules = loadHeaderRules().map((r) => ({ ...r, re: patternToRegExp(r.pattern) }))

function send(res, status, headers, body) {
  res.writeHead(status, headers)
  res.end(body)
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost')
  let rel = decodeURIComponent(url.pathname)
  const extra = []
  for (const r of rules) if (r.re.test(rel)) extra.push(...r.headers)
  const extraObj = {}
  for (const [k, v] of extra) extraObj[k] = extraObj[k] ? `${extraObj[k]}, ${v}` : v

  if (rel.endsWith('/')) rel += 'index.html'
  let file = path.join(root, rel)
  if (!file.startsWith(root)) return send(res, 403, {}, 'Forbidden')

  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
    const notFound = path.join(root, '404.html')
    const body = fs.existsSync(notFound) ? fs.readFileSync(notFound) : 'Not found'
    return send(res, 404, { ...extraObj, 'Content-Type': TYPES['.html'] }, body)
  }

  const size = fs.statSync(file).size
  const type = TYPES[path.extname(file).toLowerCase()] ?? 'application/octet-stream'
  const base = { ...extraObj, 'Content-Type': type, 'Accept-Ranges': 'bytes' }
  const range = req.headers.range
  if (range) {
    const m = /^bytes=(\d*)-(\d*)$/.exec(range)
    if (m) {
      const start = m[1] === '' ? size - Number(m[2]) : Number(m[1])
      const end = m[1] === '' || m[2] === '' ? size - 1 : Math.min(Number(m[2]), size - 1)
      if (start >= size || start > end) return send(res, 416, { 'Content-Range': `bytes */${size}` }, '')
      res.writeHead(206, { ...base, 'Content-Range': `bytes ${start}-${end}/${size}`, 'Content-Length': end - start + 1 })
      return fs.createReadStream(file, { start, end }).pipe(res)
    }
  }
  const compressible = /^(text\/|application\/(javascript|json|xml)|image\/svg)/.test(type)
  if (compressible && /\bgzip\b/.test(String(req.headers['accept-encoding'] ?? ''))) {
    res.writeHead(200, { ...base, 'Content-Encoding': 'gzip', Vary: 'Accept-Encoding' })
    if (req.method === 'HEAD') return res.end()
    return fs.createReadStream(file).pipe(zlib.createGzip({ level: 9 })).pipe(res)
  }
  res.writeHead(200, { ...base, 'Content-Length': size })
  if (req.method === 'HEAD') return res.end()
  fs.createReadStream(file).pipe(res)
})

server.listen(port, '127.0.0.1', () => console.log(`Serving ${root} at http://127.0.0.1:${port}/`))
