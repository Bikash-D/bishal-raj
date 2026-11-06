# Deployment guide (Windows PowerShell, for a beginner)

**No domain exists yet, so nothing has been deployed and no address has been invented.** This guide gets the site online on a free temporary address first, then shows exactly what to change when you buy a domain.

## 0. One-time setup

1. Install **Node.js LTS** from https://nodejs.org (accept defaults). Open a new PowerShell window and check:
   ```powershell
   node -v      # should print v22.18 or newer (v24 LTS is fine)
   npm -v
   ```
2. Extract the ZIP and go to the project folder (the one containing `package.json`):
   ```powershell
   Expand-Archive -Path "$HOME\Downloads\bishal-raj-portfolio-stage5.zip" -DestinationPath "$HOME\bishal-stage5"
   cd "$HOME\bishal-stage5\bishal-raj-portfolio"
   dir package.json
   ```
   If PowerShell says scripts are disabled, use `npm.cmd` instead of `npm`, or run once: `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`.

## 1. Check that everything builds (this is the production check)

```powershell
npm ci
npm run lint
npm run build
```

Expected: `npm ci` ends with "found 0 vulnerabilities"; `npm run lint` says "Found 0 warnings and 0 errors"; `npm run build` ends with "built in …". The finished site is the `dist` folder.

Preview exactly what will be published (works like a plain web host, including video seeking and the 404 page):

```powershell
npm run serve:dist     # then open http://127.0.0.1:4173/   (Ctrl+C to stop)
```

## 2. Put it online (pick ONE; Cloudflare Pages or Netlify are the easiest)

The site is plain static files (the contents of `dist`). Any static host works.

### Option A: Netlify (drag and drop, no account setup beyond sign-up)
1. `npm run build`
2. Go to https://app.netlify.com/drop and drag the **`dist` folder** onto the page.
3. You get an address like `https://something.netlify.app`. Security headers, caching and the 404 page work automatically because `dist/_headers` and `dist/404.html` are included.

### Option B: Cloudflare Pages
Create a Pages project, choose "Upload assets", and upload the **`dist` folder**. `_headers` and `404.html` are honoured automatically.

### Option C: GitHub Pages (no `_headers` support: you lose the security/caching headers)
This serves from a sub-folder, so set the base path **before building** (PowerShell):
```powershell
$env:VITE_BASE_PATH = "/your-repository-name/"
$env:VITE_SITE_URL  = "https://your-username.github.io/your-repository-name"
npm run build
```
Then publish the contents of `dist` to the `gh-pages` branch (or use the Pages "deploy from branch" setting). The 404 page is picked up automatically.

> Videos are 7.0 MB and 6.2 MB. Netlify/Cloudflare serve them with range requests (seeking works). Any host you pick must allow files of this size.

## 3. When you buy a domain: what to change

1. Point the domain at your host (the host's dashboard shows the DNS records to add; HTTPS certificates are issued automatically on Netlify, Cloudflare and GitHub Pages).
2. Copy the settings file and fill in the address (no trailing slash):
   ```powershell
   Copy-Item .env.example .env.production
   notepad .env.production
   ```
   Set the line: `VITE_SITE_URL=https://your-domain.example`  (leave `VITE_BASE_PATH=` empty for a domain)
3. Rebuild and re-upload:
   ```powershell
   npm run build
   ```
   What this updates automatically: canonical link, share-preview address and absolute share image, `sitemap.xml`, the `Sitemap:` line in `robots.txt`, and `url`/`image` in the structured data.
4. Optional: print the website on the PDF profile: `$env:SITE_URL="https://your-domain.example"; npm run profile:pdf`, then rebuild.
5. Test the share preview: paste the address into Facebook's Sharing Debugger (developers.facebook.com/tools/debug), LinkedIn Post Inspector, and check Google Search Console (add the site, then "URL inspection" and submit `sitemap.xml`).

## 4. What each production file is for

| File in `dist` | Purpose |
|---|---|
| `index.html` | the site (+ JSON-LD, social metadata, no-JavaScript content) |
| `404.html` | branded "page not found", `noindex` |
| `robots.txt`, `sitemap.xml` | search engines (`sitemap.xml` appears only when `VITE_SITE_URL` is set) |
| `_headers` | security headers (CSP, `X-Frame-Options`, HSTS, etc.) and cache rules for Netlify/Cloudflare Pages |
| `og-image.jpg`, `favicon*`, `apple-touch-icon.png` | share card and icons |
| `Bishal-Raj-Actor-Profile.pdf` | casting profile download |
| `media/`, `assets/` | photographs, posters, videos, fonts, code |

**Security headers** are in `public/_headers` (a strict Content-Security-Policy that allows only the site's own files). They only take effect on hosts that read that file (Netlify, Cloudflare Pages). On Vercel or Apache/Nginx the same values must be set in that host's own configuration. I verified the CSP produces zero browser console violations on the production build, but I have **not** verified the headers on a live host.

## 5. If something goes wrong

| Symptom | Fix |
|---|---|
| Blank page on GitHub Pages | You forgot `VITE_BASE_PATH` (step 2C) |
| Share preview shows no image | `VITE_SITE_URL` was empty at build time; set it and rebuild; then use the platform's debugger to refresh its cache |
| `npm run profile:pdf` says Chrome not found | `$env:CHROME_PATH = "C:\Program Files\Google\Chrome\Application\chrome.exe"` |
| PowerShell blocks `npm` | use `npm.cmd` |
