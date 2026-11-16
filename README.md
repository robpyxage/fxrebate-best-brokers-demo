# FXRebate — Best Forex Brokers 2026

## Three educational guides — local review, 16 November 2026

Three source-preserving guides are available locally at `/learn/what-is-a-forex-broker`, `/learn/what-is-a-crypto-exchange` and `/learn/what-is-a-prop-firm`. Browse all nine topic resources at `/preview`; the original Best Forex Brokers page is the tenth page. New guides use the existing Satoshi, FXRebate branding and light/dark theme. They include accessible chapters, 18 responsive diagrams reconstructed from the source figures, expandable FAQs and quizzes, comparison worksheets and related links. Source text, tables, examples and editorial notes are retained from the three client documents. Work in this section is local only, awaiting review before GitHub/Vercel updates.

The ordered content projection is `input/pages-2026-11-16/content.json`; the original Word files remain local and ignored by Git. `scripts/import-learning-documents.py` regenerates that projection when the originals are present. `assets/learning/` retains the unmodified source illustrations as project references; `src/learning-figures.mjs` defines the visible diagrams and preserves the source examples. The source illustrations are not exposed through a link in the pages. Use `npm run qa:learning` for optional Playwright verification. See `output/pages-2026-11-16/implementation-report.md`.

## Six additional pages — Vercel review, 27 October 2026

Run `npm run build` and `npm run dev`, then open **http://localhost:4173/preview** to browse the three rebate explainers and three how-to-choose guides for Forex, Crypto and Prop Firms. They reuse the approved fonts, theme, green and responsive design. The original broker page remains at `/brokers/best-forex-brokers` and at `/`.

Content comes from the six client Word documents. The complete structured read-only projection `input/pages-2026-10-27/content.json` is included and built into shared page templates by `src/content-pages.mjs`. No extra runtime dependencies are needed. The original Word files and reference image are not included in this public repository. `python3 scripts/import-documents.py` is only needed when the Word originals are supplied separately and edited.

The new pages include an essentials overview, grouped lists, keyboard-accessible expandable questions, responsive contents navigation, example calculators, editable comparison tables with CSV download, checklists and print styles. Data entered into worksheets is held in the current page only. No account, offer catalogue, API, live rates, analytics provider or CMS is connected. `npm run qa:content` runs optional Playwright browser checks. See `output/pages-2026-10-27/implementation-report.md` for route mapping and validation. The six pages and the preview index are published at https://fxrebate-best-brokers-demo.vercel.app/preview. The complete source for the original broker page and all six resource pages is in this repository.

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

## Documents for handoff

- [Client presentation (PDF)](docs/FXRebate-Prezentare-Client.pdf)
- [Developer handoff (PDF)](docs/FXRebate-Handoff-Programatori.pdf)

The six added pages use the shared content renderer and remain distinct routes. The source and generated files in this repository correspond to the Vercel preview.
