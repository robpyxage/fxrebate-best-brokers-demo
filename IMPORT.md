# Developer handoff — exact FXRebate page

Reference: https://fxrebate-best-brokers-demo.vercel.app/brokers/best-forex-brokers
Route: `/brokers/best-forex-brokers`
H1: `Best Forex Brokers 2026`

## Run the exact page
Requires Node.js 22 or later. No npm dependency installation is required.

```bash
npm run build
npm run lint
npm test
npm run dev
```

Open `http://localhost:4173/brokers/best-forex-brokers`.

`output/site/` contains the ready-to-host HTML, CSS, JavaScript and all logo assets. It reproduces the published preview and includes both `/` and the target route. Serve this directory from the domain root; double-clicking the HTML or hosting it below an arbitrary subdirectory will not resolve the root-relative assets.

## Import into an existing website
This deliverable is a complete static implementation, not a framework-specific package. Either host the generated page directly or translate the reusable render functions into the site's framework without changing the design or text:

- `scripts/build.mjs`: complete page markup and section/FAQ copy.
- `src/components.mjs`: shared BrokerCard, Comparison, Summary and supporting helpers.
- `src/styles.css`: exact responsive design, color tokens and interaction styles.
- `src/client.js`: working filters, FAQ event hooks and card impressions.
- `src/collection.mjs`: placement order, best-for labels and broker editorial text.
- `src/catalog.mjs`: broker data adapter; replace its input with the production broker master, keeping placement data separate.
- `assets/`: all logos/favicon required by the page.
- `input/catalog-snapshot.json`: frozen, sourced projection for autonomous reproduction of the six demo cards. It is not a production broker database. The original workspace catalog is used when available.
- `input/public-profile-facts.json`: public-profile evidence supporting displayed ratings, deposits and rate formats.

The CSS defines global styles for the standalone page. When importing into an existing site, isolate them under a page wrapper or a CSS module to avoid restyling unrelated pages. Preserve the same 3/2/1 column card behavior, aligned cashback/CTA positions, focus indicators and reduced-motion support.

The demo profile CTAs point to existing `https://fxrebate.eu/brokers/{slug}` profiles. On the production FXRebate site, use the site's internal router and existing broker URLs. Do not recreate broker profile pages or introduce a parallel broker database.

Analytics emits local `fxrebate:analytics` CustomEvents only. Connect these to the site's existing provider; no telemetry destination is configured here.

## Before production
The client-preview labels and illustrative editorial order are intentional. Approve the ranking/copy, refresh factual data and account/entity/country eligibility, then replace preview labels as appropriate. The current metadata/robots.txt/Vercel header intentionally prevent indexing; replace them with the production canonical, schema and SEO utilities only on the real site. Integrate actual legal disclosures and CMS/editorial ownership. Missing XM deposit and variable cashback displays are explicit fallbacks.

## Verification
Build and four contract tests passed. Browser checks passed at 1600, 1280, 834, 390 and 320 px: responsive layout, images, keyboard FAQ, filters, anchors, links and no console errors or horizontal overflow. Optional `scripts/visual-qa.mjs` uses Playwright from the original workspace; it is not required to run/build/import the delivered page.

## Delivery contents
Full source plus the generated `output/site/`. Environment files, authentication tokens, Vercel account links, browser state and unrelated project data are excluded. The full source, generated static page and Git history are prepared for the GitHub repository at https://github.com/robpyxage/fxrebate-best-brokers-demo. Clone it and follow the commands in README.md.

## Version 2 — site alignment and podium
The updated demo bundles Satoshi and the new site's light/dark SVG logos. src/theme-init.js is included in the generated static page. DESIGN_SYSTEM.md describes the shared palette, podium colors and integration with the existing Next.js/Tailwind layout/theme. Gold/silver/bronze is derived from collection rank, not from the broker record or visible filter position. The comparison uses bold colored names for the same top three.

## Demo access and release
Demo Vercel Authentication/password protection is currently disabled. Security Checkpoint may still be enforced by Vercel automatic traffic filtering; deployment protection and this checkpoint are different layers. Review access/security settings before a production launch or client handover. This is a release step, not an automatic date-based reactivation.
