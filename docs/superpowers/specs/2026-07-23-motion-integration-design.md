# Motion (Framer Motion) infra wiring — design

## Context

The `framer-motion` skill (from `mindrally/skills`) was installed both project-locally
and globally, giving Claude reference guidance for using the Motion library. The user
wants the actual `motion` npm package made *available* in this repo for future use —
no specific page or animation is being built yet.

This repo has two distinct front-end surfaces:
- `index.html` — a React app. React/ReactDOM are vendored UMD builds
  (`react.min.js`, `react-dom.min.js`, React 18, `createRoot` present on the global).
  `shared.jsx`/`variant-a.jsx` are compiled by Babel (`preset-react` only — JSX syntax
  stripped, no module resolution) into plain non-module scripts loaded via
  `<script defer>`, calling `React.createElement` against the global.
- `case-*.html` (7 pages) — static HTML/CSS, no JS animation framework, only the
  Vercel Insights script tag.

There is no module bundler anywhere in the build. `vercel.json` sets
`"buildCommand": null`, so Vercel deploys exactly what's committed — `shared.js` and
`variant-a.js` (Babel output) are themselves committed to git, not gitignored.
`.gitignore` excludes `node_modules/` and `.claude/` only.

## Hard constraint

**Nothing in this change may alter the live site's rendered output, performance,
layout, or behavior.** No existing HTML file is modified. No existing script's load
order, timing, or content changes. This phase adds new, inert files only — code that
exists in the repo but is not referenced by any page, and therefore cannot affect
what a visitor sees, how fast it loads, or how it responds across breakpoints. This
is verified explicitly in the testing plan below, not just assumed from "we didn't
touch index.html."

## Goal

Make `motion` (vanilla DOM API) and `motion/react` (React component API) available
as ready-to-import local files, so that whenever a real animation is built — on the
homepage or a case-study page — it's a one-line `import` away, with no bundler
migration and no risk of loading a second copy of React.

## Approach

Chosen: **local esbuild-produced vendor bundles + import-map-based React/ReactDOM
shims.** (Two alternatives — full bundler migration, and CDN + import map without
local vendoring — were considered and rejected: the former is a disproportionate
architecture change for an unused feature; the latter would make this the only
JS on the site depending on a third-party CDN at request time, breaking the
existing "vendor everything locally" convention that `react.min.js`/
`react-dom.min.js` already establish.)

### 1. Dependencies & build script

Add two devDependencies: `motion` and `esbuild`. `esbuild` is used *only* to produce
the vendor bundles below — it does not replace Babel and does not touch the existing
`build` script or `shared.jsx`/`variant-a.jsx` compile step.

New npm script, `build:vendor`, run manually when the vendor files need
(re)generating (not run automatically by `build`, and never run by Vercel since
`buildCommand` is `null`):

```json
"build:vendor": "esbuild --bundle --format=esm --minify <motion vanilla entry> --outfile=vendor/motion.js && esbuild --bundle --format=esm --minify --external:react --external:react-dom <motion/react entry> --outfile=vendor/motion-react.js"
```

Exact entry paths are resolved against the installed `motion` package's `exports`
map at implementation time (confirm via `node -e "console.log(require('motion/package.json').exports)"`
or equivalent after `npm install`).

### 2. React/ReactDOM shims

Two hand-written files:
- `vendor/react-shim.mjs` — re-exports `window.React`'s surface as named ESM
  exports (`useState`, `useEffect`, `useRef`, `useMemo`, `useCallback`, `useContext`,
  `useReducer`, `useLayoutEffect`, `useImperativeHandle`, `useId`, `createElement`,
  `cloneElement`, `createContext`, `createRef`, `forwardRef`, `isValidElement`,
  `memo`, `Fragment`, `StrictMode`, `Suspense`, `Children`, `Component`,
  `PureComponent`, plus default export), plus a default export of `window.React`
  itself.
- `vendor/react-dom-shim.mjs` — same pattern for `window.ReactDOM`
  (`createRoot`, `createPortal`, `flushSync`, `findDOMNode`, default export).

An import map (documented in `vendor/README.md`, **not inserted into any HTML file
in this phase**) aliases bare specifiers `"react"` → `react-shim.mjs` and
`"react-dom"` → `react-dom-shim.mjs`. When `motion-react.js` internally does
`import { useState } from "react"`, it resolves to the shim and receives the exact
React instance already mounted on the page — never a second copy, which would
otherwise cause "invalid hook call" errors the moment `motion/react` is actually
used inside the existing React tree.

### 3. File layout & git

New files, all committed to git (matching the existing convention that build output
like `shared.js`/`variant-a.js` is committed, since Vercel does not run a build):

```
vendor/
  motion.js            # bundled vanilla Motion DOM API, no external deps
  motion-react.js       # bundled motion/react, react + react-dom left external
  react-shim.mjs
  react-dom-shim.mjs
  README.md            # import-map snippet + load-order requirement, for future use
```

`vendor/README.md` documents (as reference only — this is not wired into any page):

```html
<!-- Must appear after react.min.js / react-dom.min.js, before any consumer module -->
<script type="importmap">
{
  "imports": {
    "react": "/vendor/react-shim.mjs",
    "react-dom": "/vendor/react-dom-shim.mjs"
  }
}
</script>
<script type="module">
  import { motion } from "/vendor/motion-react.js";
  // ...
</script>
```

No existing file (`index.html`, any `case-*.html`, `shared.jsx`, `variant-a.jsx`,
`init.js`) is modified.

## Testing plan

1. `npm run build:vendor` completes without error.
2. Inspect both output files: confirm `motion-react.js` has no unresolved bare
   imports other than `react`/`react-dom`; confirm `motion.js` has zero bare
   imports (fully self-contained).
3. A throwaway, uncommitted local HTML page (outside the repo's served paths, e.g.
   in the scratchpad) loads the site's real vendored `react.min.js` /
   `react-dom.min.js`, the two shims via an import map, and `motion-react.js`;
   mounts a single `motion.div` with a basic animation; verified in an actual
   Chrome tab via browser automation with zero console errors. This proves the
   shim/import-map mechanism genuinely works, not just that it type-checks.
4. **Regression check on the live site**, run via the `/run` pattern (build, serve
   locally, drive in a real browser tab): reload the homepage and the same three
   previously-verified case studies (Aatmnirbhar, LevelUp, EvaluateUs), confirm
   pixel-level layout is unchanged, scroll-triggered stat counters still animate,
   no new console errors or warnings, and `git diff` confirms zero changes to any
   existing HTML/JS/CSS file. This is the concrete check against the "must not
   hamper performance/design/layout/responsiveness" requirement — not touching the
   files is necessary but this step confirms it's also sufficient.
5. `npm run build` (existing Babel step) still succeeds unchanged, proving the new
   `build:vendor` script is fully additive and doesn't interfere with the existing
   pipeline.

## Out of scope (explicitly deferred)

- Actually using `motion`/`motion/react` in any page or component.
- Inserting the import map or any `<script type="module">` tag into `index.html` or
  any `case-*.html`.
- Any change to `shared.jsx`, `variant-a.jsx`, or `init.js`.
- Deciding whether future animation work happens on the homepage, case pages, or
  both — that's a separate design conversation once there's a concrete animation
  to build.
