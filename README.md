# FXRebate — Best Forex Brokers 2026

Complete source and ready-to-host static files for the client preview:
https://fxrebate-best-brokers-demo.vercel.app/brokers/best-forex-brokers

The repository includes the exact page design, English text, broker and brand logos, Satoshi fonts, gold/silver/bronze podium styling, light/dark theme, and logo-green FXRebate Advantage section. No external font service or broker API is needed to reproduce it.

## Clone and run

Requires Node.js 22 or later. The application has no npm dependencies.

```bash
git clone https://github.com/robpyxage/fxrebate-best-brokers-demo.git
cd fxrebate-best-brokers-demo
npm run build
npm run dev
```

Open http://localhost:4173/brokers/best-forex-brokers.

## Import the identical page

The committed `output/site/` contains the complete static page, styles, scripts, fonts and images used by the preview. Serve its contents from the domain root to preserve the root-relative asset URLs and the `/brokers/best-forex-brokers` route. No build is required to host these files directly.

For integration into the existing website framework, follow [IMPORT.md](IMPORT.md). Reuse the rendering and collection components under `src/`, preserve the styling and text, and replace the standalone header/footer with the site's layout only if desired. The deliverable is a static implementation; it is not a drop-in Next.js component package. [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) documents typography, brand tokens, responsive behavior and podium colors.

## Data and production integration

The build uses a frozen, sourced six-broker catalog projection in `input/catalog-snapshot.json` when the original workspace catalog is unavailable. This makes a fresh clone self-contained. The demo rank order is illustrative, some facts use explicit fallbacks, and analytics only emits local CustomEvents. Developers should connect the existing production broker/CMS data and analytics, verify account/entity/country terms, approve rankings, and configure production SEO. Preview indexing is intentionally disabled.

## Validation

```bash
npm run lint
npm test
```

Syntax checks, four contract tests and local responsive browser QA passed at 320, 390, 834, 1280 and 1600 pixels. Optional `scripts/visual-qa.mjs` requires Playwright and a Chromium installation; neither is required to build or host the page.

See [output/implementation-report.md](output/implementation-report.md) for implementation details and the Vercel access limitation. Environment files, authentication tokens and Vercel account links are excluded from this repository.
