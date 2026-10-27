# Six FXRebate resource pages — local review

Built on 27 October 2026. Local index: http://localhost:4173/preview

## Delivered
Three rebate explainers and three decision guides share the existing Satoshi font files, FXRebate SVG logos, light/dark theme, neutral surfaces and logo green #006A3D. A new local index links all six pages and the original broker shortlist. The source screenshot informs the content/sidebar/table hierarchy. Its competitor profile, identity, reviews, restrictions and offer rates were not copied. The user confirmed that the six DOCX documents and image are sufficient without Figma.

## Routes
| Topic | Rebates | Decision guide |
| --- | --- | --- |
| Forex | /rebates/forex-broker-rebates | /guides/how-to-choose-a-forex-broker |
| Crypto | /rebates/crypto-exchange-rebates | /guides/how-to-choose-a-crypto-exchange |
| Prop Firms | /rebates/prop-firm-rebates | /guides/how-to-choose-a-prop-firm |

Routes are proposed for the standalone demo; production routing remains to be mapped to the real application. The original /brokers/best-forex-brokers and root page remain.

## Architecture and changed files
- `input/pages-2026-10-27/`: six original DOCX sources, reference screenshot and generated structured `content.json`.
- `scripts/import-documents.py`: standard-library importer retaining paragraph order, bold/italic runs, lists and table placement. Build consumes the projection without Python or a DOCX dependency.
- `src/content-pages.mjs`: page/market configuration and reusable head, header, footer, tabs, article, table, contents, related-resource, calculator and index renderers.
- `src/content-pages.css`: responsive editorial layouts using the approved style tokens; scoped resource styles, worksheet, table, calculator and print styling.
- `src/content-client.js`: local example calculator, downloadable CSV worksheet, interactive checklist, print action and active contents marker. Worksheet inputs and checkbox state are temporary and not submitted.
- `src/client.js`: shared theme behavior remains; analytics page events now use a resource page ID when present, preserving the original broker collection events. No external analytics endpoint.
- `scripts/build-content-pages.mjs` and `scripts/build.mjs`: main build now generates all six routes, /preview and their assets.
- `scripts/content-pages.test.mjs`, `scripts/content-pages-qa.mjs`, `package.json`: content coverage, links/anchors, escaping and browser checks.
- `output/site/`: built portable site. `output/pages-2026-10-27/`: screenshots, browser report and this report.
- README, IMPORT, Plan, Phases, Findings, IMPLEMENTATION, CONCLUSION and .gitignore updated for the local review.

## Content and assumptions
All source paragraphs and table cells are present. Numerical examples are client-provided illustrative figures, not live provider offers. Displayed worksheet comparison names (Broker A/B, Exchange A/B, Firm A/B) and empty fields come from the documents. No broker, exchange or prop firm master database was added. The existing broker page still uses the catalog adapter.

The three calculators use the supplied example structures: Forex lots × dollars per lot; Crypto eligible fees × percentage; Prop eligible challenge price × percentage. Percentage inputs are limited to 0–100; negative/empty/invalid values have no estimate. Rates are editable illustrative inputs and never fetched as live rates. CSV export quotes cells and prefixes spreadsheet-formula characters in user notes. No note content is included in analytics events.

Source-provided descriptions of FXRebate services, loyalty/affiliate programmes, jurisdictional and regulatory matters are retained for editorial review. Implementation verification is not independent factual or legal verification of those statements. Missing production service destinations were not fabricated: guides link to the corresponding explanation and Forex can link to the existing local broker comparison.

## Validation
- `npm run build`: passed.
- `npm run lint`: passed (JavaScript syntax).
- `npm test`: 7 tests passed, including all source-block/table-cell coverage, local routes/anchors, content escaping and the original broker contracts. No TypeScript project is present.
- `npm run qa:content`: 24 page/viewport combinations passed (six pages × 1440, 834, 390 and 320 px), plus the index at all four widths. Verified HTTP 200, one H1, font/image loading, no overflow/offscreen controls, keyboard contents, active desktop navigation, calculator math/invalid values, checklist, CSV download/content, light/dark persistence and zero external requests or browser errors.
- Original `scripts/visual-qa.mjs`: five viewports passed (1600, 1280, 834, 390, 320) with broker filters, podium contrast, keyboard FAQ, theme persistence and aligned cards.
- Manual screenshot inspection: article heroes desktop/mobile, guide comparison table, editable worksheet, rebate flow and logo-green calculator. The worksheet final row was corrected to remain neutral rather than inheriting the numeric-result highlight; the targeted browser style check passed. The print button was verified against a browser print stub. The one source Word hyperlink (Compare Forex Brokers → https://fxrebate.eu/brokers) is intentionally mapped to the existing local comparison for this review.

## Local review and production work
The local server listens on port 4173; open /preview. Run `npm run build` then `npm run dev` if restarting. The Vercel preview was deployed after local review; no live website/CMS/GHL mutation or email was performed. Generated screenshots stay local and are ignored by Git.

No backend is needed for this preview. Before production, integrate the real website layout/router/theme, CMS editorial content, provider offer catalogues, reviewed current eligibility/rates, account/referral services, available calculators/tools, analytics provider and SEO/legal components. The preview intentionally retains noindex metadata and deployment headers. The Vercel preview was published after local review.

## Editorial UX revision — local review
The three rebate pages now lead with an at-a-glance panel and surface the explanation, calculation, payment methods and timing before the optional questions. Related questions are native keyboard-accessible disclosures; table-of-contents links and direct URLs open the matching answer, including repeated clicks on the same link. Lists are visually grouped and longer lists offer a Show more control. Benefits become readable cards. The choosing guides retain their source comparison tables, and their checklist has a green grouped treatment. Printing temporarily reveals collapsed information and restores the user's previous state afterwards. The source copy and terms are retained in the DOM, rather than losing important details or introducing unverified edits. No live/provider data has been invented.

The user approved the implementation for the Vercel preview. Verification: build/lint/tests, 24 page/viewport browser cases, plus 12 disclosure-specific browser cases (keyboard, direct links/reload, repeat links, show more, print state and responsiveness); desktop/mobile light and dark screenshots were inspected. No live website/CMS/GHL changes were made.

## Vercel publication
User confirmed Vercel rather than WordPress. Six standalone resource routes and the optional /preview index were deployed to the existing isolated project `fxrebate-best-brokers-demo`, production preview deployment `dpl_4P3RzZ7h5f4jtdFh44s2ok7getJT`; the previous broker page remains. Vercel serves this as the demo project and noindex remains enabled. The complete source is prepared for the same GitHub repository and the developer ZIP. The live website and WordPress were not modified.

Public verification: all six new routes, the preview index and the existing broker route returned HTTP 200 with expected H1 on an initial Chromium pass. Subsequent fresh automated browser requests returned HTTP 403 with title Vercel Security Checkpoint for three tested routes, so access is intermittent and full remote interactive QA could not be completed. Request logs are not accessible to this Vercel account. Local browser QA passed 24 page/viewport cases and 12 disclosure cases; ZIP build, lint, tests and 29-file comparison passed.
