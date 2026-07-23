# vendor/

Local, git-tracked bundles of the `motion` npm package, built via `npm run
build:vendor`. Nothing in this directory is wired into any page yet — these
files are ready to import whenever a real animation is built.

## Vanilla DOM API (no React involved)

Usable anywhere, including the static `case-*.html` pages, with just:

```html
<script type="module">
  import { animate, scroll, inView } from "/vendor/motion.js";
  animate("#some-element", { opacity: 1 }, { duration: 0.3 });
</script>
```

## React API (`motion/react`)

Requires resolving the bare specifiers `"react"` and `"react/jsx-runtime"` to
this repo's already-loaded global React (`react.min.js`/`react-dom.min.js`),
via an import map placed **after** those two scripts and **before** any
module that imports `/vendor/motion-react.js`:

```html
<script defer src="/react.min.js"></script>
<script defer src="/react-dom.min.js"></script>
<script type="importmap">
{
  "imports": {
    "react": "/vendor/react-shim.mjs",
    "react/jsx-runtime": "/vendor/react-jsx-runtime-shim.mjs"
  }
}
</script>
<script type="module">
  import { motion } from "/vendor/motion-react.js";
  // React.createElement(motion.div, { animate: { opacity: 1 } })
</script>
```

Do not use `/vendor/motion-react.js` without the import map above — it will
otherwise fail to resolve `"react"` and `"react/jsx-runtime"` and throw at
import time. No react-dom shim exists or is needed: this version of
`motion/react`'s public API has no react-dom dependency (verified by
inspecting the full bundled output for any reference to it).

## Regenerating

Run `npm run build:vendor` after upgrading the `motion` devDependency. Re-run
the bare-import checks described in the implementation plan
(`docs/superpowers/plans/2026-07-23-motion-vendor-wiring.md`, Task 2 Step 4)
against the new output before trusting it — a version bump could introduce a
new dependency (e.g. on react-dom) that isn't shimmed yet. Also re-check
whether the new bundle's compiled `jsx`/`jsxs` calls pass a third (`key`)
argument — `vendor/react-jsx-runtime-shim.mjs` forwards it correctly, but
it's worth confirming a version bump hasn't changed how keys reach it.
