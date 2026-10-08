# FXRebate collection design system — aligned client demo v2

Visual reference: http://141.98.155.230/en and its Forex Rebates listing. This is the same brand/site supplied by the client; competitor references remain structural only.

## Typography and brand assets
Satoshi 400/500/700 is bundled locally under assets/ and declared in src/styles.css. Public source font declarations were observed in /_next/static/chunks/0bg.1ksv61719.css. Both SVG brand logos are from the site's public /assets/darkFxRebate-logo.svg and /assets/lightFxRebate-logo.svg paths. Use the existing app's font and brand components on integration; do not load a second copy of Satoshi in production.

## Shared visual tokens
Light: text/CTA #0C110F, inverse #F9F9F9, white background, neutral gray surfaces #F6F6F6, green #008138. The cashback panel retains a distinct green inset. Dark theme uses dark surfaces and light text with lighter cashback/podium text for contrast. Detailed component tokens live in :root and :root[data-theme=dark] in src/styles.css.

## Podium
Ranking comes from placement.rank. podiumClass(rank) maps ranks 1/2/3 to podium-gold/podium-silver/podium-bronze. Other ranks stay neutral. Filtering never recalculates rank.

| Rank | Card top band | Text on light | Text on dark |
| --- | --- | --- | --- |
| 1 / Gold | #C4A156 | #86620D | #E6C878 |
| 2 / Silver | #A9B3C0 | #596573 | #C4CFDF |
| 3 / Bronze | #B88055 | #905633 | #E1AD84 |

Card bands are five pixels, with restrained tint/shadow. Card rank numerals share the podium text color. Comparison broker names use weight 700 and the matching text tone, distinct from the brighter decorative band; this keeps small text legible. Visible rank numbers also communicate position independently of color. The same table markup transforms into mobile comparison rows with podium colors preserved.

## Theme
The standalone demo applies data-theme to html before paint using src/theme-init.js, then updates logo, colors, accessible toggle state and browser theme color in src/client.js. It respects a saved demo preference or system preference on initial load. The localStorage key is fxrebate-demo-theme. In production use the site's existing theme provider and map the CSS token values; do not create a second theme provider. Head and footer are demonstration wrappers and should be replaced by the application's shared layout.

## Behavior and layout
Top cards: 3 columns on wide/laptop, 2 on tablet, 1 on mobile. Named font weights match the actual bundled faces. Equal card slots align cashback and CTA on multi-column layouts. Small-screen facts use label/value rows. Very narrow editorial summary headers wrap their logos to avoid overflow. Filters, keyboard FAQ, focus indicators and reduced-motion support remain.
