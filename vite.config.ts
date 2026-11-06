import fs from 'node:fs'
import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import { CONTACT_CONFIG, HERO_FACTS, SITE, SOCIAL_LINKS } from './src/content/site.ts'
import { generatedImages } from './src/content/media.generated.ts'

/**
 * Everything that depends on the real domain or on the content files is generated here, so the
 * HTML head, JSON-LD, <noscript> text, robots.txt, sitemap.xml and 404 page can never drift from
 * src/content/site.ts.
 *
 *  - VITE_SITE_URL : the full public address, including any sub-path (e.g. https://example.com).
 *                    Unset = no canonical, no og:url, no sitemap, relative share image. Nothing is
 *                    invented and localhost is never published.
 *  - VITE_BASE_PATH: only for hosts that serve the site from a sub-folder (e.g. /portfolio/).
 *                    Default "/" is right for a domain, Netlify, Vercel and Cloudflare Pages.
 */
function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function lcpPreloads(base: string): string {
  const tag = (id: 'kneelWide' | 'kneelClose', media: string, sizes: string) => {
    const img = generatedImages[id]
    const srcset = img.avif.map((v) => `${base}media/${img.file}-${v.width}.avif ${v.width}w`).join(', ')
    return `<link rel="preload" as="image" type="image/avif" fetchpriority="high" media="${media}" imagesrcset="${srcset}" imagesizes="${sizes}" />`
  }
  // Mirrors Hero.tsx: kneelWide from 900px up, kneelClose below, with the same `sizes`.
  return [
    tag('kneelWide', '(min-width: 900px)', '(min-width: 1600px) 884px, 62vw'),
    tag('kneelClose', '(max-width: 899px)', '100vw'),
  ]
    .filter(Boolean)
    .join('\n    ')
}

function siteHtml(siteUrl: string, base: string): Plugin {
  const site = siteUrl.replace(/\/+$/, '')
  const image = site ? `${site}/og-image.jpg` : `${base}og-image.jpg`

  const jsonLd = () => {
    const data: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: SITE.name,
      jobTitle: SITE.role,
      description: 'Actor trained in theatre at Mandala Theatre, performing in Nepali.',
      knowsLanguage: 'ne',
      email: `mailto:${CONTACT_CONFIG.email}`,
      telephone: '+977-986-4838906',
      alumniOf: { '@type': 'Organization', name: 'Mandala Theatre' },
      sameAs: SOCIAL_LINKS.map((l) => l.url),
    }
    if (site) {
      data.url = `${site}/`
      data.image = image
    }
    return `<script type="application/ld+json">\n${JSON.stringify(data, null, 2)}\n    </script>`
  }

  const noscript = () => `<noscript>
      <div style="max-width:38rem;margin:0 auto;padding:4rem 1.5rem;font-family:Georgia,'Times New Roman',serif;line-height:1.6;color:#efe9df">
        <h1 style="margin:0 0 .25rem;font-weight:300;font-size:2.5rem">${esc(SITE.name)}</h1>
        <p style="margin:0 0 1rem;letter-spacing:.2em;text-transform:uppercase;font-size:.85rem;color:#b08051">${esc(SITE.role)}</p>
        <p>${HERO_FACTS.map(esc).join('. ')}.</p>
        <p>The performance videos and photographs on this portfolio need JavaScript to display. To discuss casting or collaboration, contact Bishal directly:</p>
        <ul>
          <li>Email: <a style="color:#efe9df" href="mailto:${CONTACT_CONFIG.email}">${CONTACT_CONFIG.email}</a></li>
          <li>WhatsApp: <a style="color:#efe9df" href="https://wa.me/${CONTACT_CONFIG.whatsappNumber}">${esc(CONTACT_CONFIG.phoneDisplay)}</a></li>
${SOCIAL_LINKS.map((l) => `          <li>${esc(l.label)}: <a style="color:#efe9df" href="${l.url}">${esc(l.handle)}</a></li>`).join('\n')}
        </ul>
      </div>
    </noscript>`

  return {
    name: 'site-html',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        const meta = [
          site ? `<link rel="canonical" href="${site}/" />` : '',
          site ? `<meta property="og:url" content="${site}/" />` : '',
          `<meta property="og:image" content="${image}" />`,
          `<meta name="twitter:image" content="${image}" />`,
        ]
          .filter(Boolean)
          .join('\n    ')
        return html
          .replace('<!-- SITE_META -->', meta)
          .replace('<!-- JSON_LD -->', jsonLd())
          .replace('<!-- NOSCRIPT -->', noscript())
          .replace('<!-- LCP_PRELOAD -->', lcpPreloads(base))
          .replaceAll('%BASE%', base)
      },
    },
    generateBundle() {
      const robots = ['User-agent: *', 'Allow: /', site ? `Sitemap: ${site}/sitemap.xml` : '# Sitemap line appears once VITE_SITE_URL is set.', ''].join('\n')
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots })
      if (site) {
        const lastmod = new Date().toISOString().slice(0, 10)
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${site}/</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>\n</urlset>\n`
        this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: xml })
      }
      const template = fs.readFileSync(path.resolve(import.meta.dirname, 'src/static/404.html'), 'utf8')
      this.emitFile({ type: 'asset', fileName: '404.html', source: template.replaceAll('%BASE%', base) })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const rawBase = env.VITE_BASE_PATH || '/'
  const base = `/${rawBase.replace(/^\/+|\/+$/g, '')}/`.replace(/^\/\/$/, '/')
  return { base, build: { assetsInlineLimit: 0 }, plugins: [react(), siteHtml(env.VITE_SITE_URL ?? '', base)] }
})
