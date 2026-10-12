# Verb conjugation rules

Static React 18 app (no backend). Built with esbuild.

## Build

```
npm ci
npm run site      # builds both pages and assembles ./site
npm run preview   # serves ./site locally
```

`./site` is the complete publishable folder (index.html, comparison.html, styles, fonts, two JS bundles).
Fonts are self-hosted (Inter, JetBrains Mono, SIL OFL) — no third-party requests.

## Deploy (GitHub Pages)

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds and publishes `./site`.
One-time setup: repo Settings → Pages → Source: **GitHub Actions**.
