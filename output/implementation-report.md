# FXRebate Best Forex Brokers 2026 — client demo

Published: https://fxrebate-best-brokers-demo.vercel.app/brokers/best-forex-brokers

## Built
A lightweight, pre-rendered English client prototype with six reusable broker cards, 3/2/1 column layouts, normalized logo containers, sourced public profile ratings where available, editorial verdicts, broker facts, dedicated cashback panels, two highlights and profile CTAs. Includes working platform/cashback filters, mobile comparison rows, methodology, six editorial summaries, decision support, educational checks, cashback explanation, eight keyboard-accessible native FAQ accordions and disclosure.

## Source files
- `src/catalog.mjs`: read-only adapter over the existing 100-broker catalog and public-profile evidence. No new broker database.
- `src/collection.mjs`: demo editorial placements, separated from broker master data.
- `src/components.mjs`: shared BrokerCard, Comparison, Summary, logo, rating, CTA and cashback rendering.
- `src/styles.css`: brand styling and responsive layouts.
- `src/client.js`: filters and local CustomEvent analytics integration hooks; no third-party analytics or collection service.
- `scripts/build.mjs`, `scripts/serve.mjs`: dependency-free build and local preview.
- `scripts/contract.test.mjs`, `scripts/visual-qa.mjs`: fallback, escaping, provenance and browser QA.
- `input/`: handoff and sourced HTML/facts. `assets/`: FXRebate brand and broker logos.
- `output/site/`: public static deployment only. `output/qa/`: screenshots and browser report.

## Assumptions and temporary content
User clarified that this is a Vercel example for a client before the production programmers implement it. No website application source was available. Node static rendering uses the existing catalog without modifying the bot. Editorial order and “best for” labels are demonstration content, explicitly labeled on page. Existing public profile ratings are displayed as such, without inventing review scores or structured rating data. Unknown XM deposit falls back to “See profile”. Variable cashback is shown for FP Markets and XM because no reliably fetched current complete schedule was available. Platform evidence remains the catalog snapshot dated 2026-08-12; public profile evidence is dated 2026-10-08. All offers need production verification, including residence/entity restrictions. The source profile itself may contain stale or conflicting information.

## Validation
`npm run build`: passed. `npm run lint`: JavaScript syntax checks passed. `npm test`: 4 contract tests passed. TypeScript check not applicable (plain JavaScript, no framework dependencies). Local and public Vercel Playwright checks at 1600, 1280, 834, 390 and 320 pixels: no horizontal overflow, all images load, correct grid columns, no page errors, filters work, FAQ works by keyboard, analytics hook dispatch verified, methodology anchor works. Cashbacks and CTAs align identically on desktop/tablet. Public route HTTP 200; secret file request HTTP 404.

## Deployment
Isolated Vercel project `robpyxages-projects/fxrebate-best-brokers-demo`, production deployment `dpl_GKbVSBbpxsSZa7rzqi3W6LcFYFPP`. No custom domain or existing live site changed. Robots meta, robots.txt and X-Robots-Tag prevent preview indexing. Only `output/site/` uploaded; source evidence, master catalog and local environment files excluded.

## Production handoff
No backend is required to view this demo. Developers should integrate the reusable collection/card model with their real site framework, CMS, reviewed rankings and analytics provider. Approve editorial order and methodology, verify regulator/entity/rate/minimum-deposit data, and integrate site legal components. Production should use its canonical/schema/SEO utilities and internal broker routes. Demo links deliberately open existing FXRebate broker profiles. No CMS/GHL writes performed.
