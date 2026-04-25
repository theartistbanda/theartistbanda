# Dipesh Gurav — Portfolio (Swiss Grid)

Static site. No build step. All four files sit at the root.

## Files
- `index.html` — entry (the Swiss Grid variant)
- `shared.jsx` — shared React utilities + portfolio content
- `variant-a.jsx` — the Swiss Grid layout components
- `case-yourhour.html` — YourHour case-study page (linked from the Work index)
- `vercel.json` — keeps URLs clean on Vercel

## Deploy on Vercel (zero config)

### Option 1 — Drag & drop
1. Go to https://vercel.com/new
2. Click **Browse all templates → Other** OR just drag this folder onto the dashboard.
3. Vercel detects it as a static site, no framework, no build command. Hit **Deploy**.
4. Live at `https://<project-name>.vercel.app` in ~30 seconds.

### Option 2 — Vercel CLI
```bash
npm i -g vercel
cd deploy
vercel              # follow prompts; accept defaults
vercel --prod       # promote to production
```

When prompted:
- **Build command:** *(leave blank)*
- **Output directory:** `./`
- **Framework preset:** Other

### Option 3 — GitHub Pages
1. Push this folder to a repo named `<your-username>.github.io`
2. Settings → Pages → Source: `main` / root
3. Live at `https://<your-username>.github.io`

## Local preview
Just open `index.html` in a browser, **or** run a tiny static server (recommended — some browsers block `<script src>` on `file://`):
```bash
npx serve .
# or
python3 -m http.server 8000
```

## Notes
- React + Babel are loaded from unpkg (CDN). First load fetches ~250KB of vendor JS.
- Fonts come from Google Fonts.
- One image (YourHour preview) loads from `static.wixstatic.com`. Everything else is local.
