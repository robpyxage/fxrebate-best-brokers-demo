# FXRebate Best Brokers demo
Client design prototype, published on a separate Vercel project. Build: npm run build. Preview: npm run dev. Source catalog remains in ../fxrebate-guide-bot/output/catalog-blog-2026-08-12/.

Public demo: https://fxrebate-best-brokers-demo.vercel.app/brokers/best-forex-brokers

`npm run lint` checks JavaScript syntax; `npm test` verifies contracts. `node scripts/visual-qa.mjs` uses existing workspace Playwright/browser installations. No application dependencies were added. Report: output/implementation-report.md. Deploy only output/site to the dedicated project; never upload input evidence or environment files.

## Portable developer handoff
See IMPORT.md. A frozen read-only six-broker catalog projection in input/catalog-snapshot.json allows the build to run outside this workspace. The adapter still uses the original catalog when present. This is a static Node implementation; integrating it into another framework requires adapting the render functions, not rebuilding the design or text.

Version 2 aligns typography, brand logos and palette with the supplied new website and adds light/dark theme plus gold/silver/bronze podium accents. See DESIGN_SYSTEM.md. The updated portable ZIP/bundle are under output/handoff/ with a -v2 suffix.
