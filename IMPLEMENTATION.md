# Implementation
Use a dependency-free Node static renderer, reusable broker card, catalog adapter and collection configuration. Publish only this project to Vercel. Verify responsive cards and interactions with Playwright.

## Six content pages — local review
1. Archive and parse the supplied DOCX files to a structured content projection with source formatting/order.
2. Reuse the brand assets/theme and add shared article layout, tables, contents navigation and related-page links.
3. Build all six routes plus /preview; add functional illustrative calculators and editable guide comparisons.
4. Run content coverage, route, responsive, keyboard and theme checks locally. Keep previous broker page working.
5. No Vercel deployment or GitHub push during this iteration.

## Educational guides
Use `scripts/import-learning-documents.py` to project the three original DOCX files without losing their figures, paragraphs or tables. `src/learning-pages.mjs` uses the existing content page shell and generates three routes. `npm run qa:learning` runs optional browser QA. Local server port 4173; `/preview` presents nine resource pages and the earlier broker page.
