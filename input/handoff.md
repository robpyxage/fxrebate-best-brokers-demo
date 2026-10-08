# CODEX HANDOFF — FXRebate “Best Forex Brokers 2026” Interactive Page

## Goal

Implement an interactive **Best Forex Brokers 2026** page for the new FXRebate website.

This is not a standalone static mockup and not a redesign of the full website. Build it inside the existing project, using the current stack, design system, broker data model, routing, components and conventions wherever possible.

The main purpose of the page is:

**Discovery → Broker Profile → FXRebate Conversion**

The page should quickly help a user understand which brokers are recommended, what each broker is best for, and why they should click through to the internal broker profile.

---

## Reference pages

Use these only as structural / UX inspiration. Do not copy their design or text 1:1.

1. CashbackForex — primary reference  
   https://www.cashbackforex.com/brokers/best-forex-brokers

2. BrokerChooser — secondary reference  
   https://brokerchooser.com/broker-reviews/capitalcom-review

Main inspiration:
- CashbackForex: broker discovery, top broker cards, ranking/category logic, comparison, SEO structure.
- BrokerChooser: editorial clarity, “Best for”, trust signals, summary/decision-support style.

FXRebate must keep its own visual identity.

---

# 1. First inspect the existing project

Before changing code:

1. Inspect the repository structure.
2. Identify:
   - framework and routing;
   - existing broker model/data source;
   - existing broker profile page;
   - existing broker cards/components;
   - design system / typography / spacing / colors;
   - existing rating component;
   - existing rebate/cashback data;
   - existing comparison functionality;
   - CMS/admin conventions if visible in the repo;
   - SEO/meta utilities;
   - analytics/event tracking conventions.
3. Reuse existing architecture rather than creating parallel systems.

Do not replace the current stack.

Do not create a second broker database.

Do not hard-code six brokers into presentation components if the existing project already has broker data.

If a required data source does not yet exist, create the smallest sensible temporary adapter/mock layer with a clear TODO, but keep the component API compatible with future real data.

Proceed with implementation after inspection. Do not stop at a plan unless there is a genuine technical blocker.

---

# 2. Target page

Recommended route:

`/brokers/best-forex-brokers`

If the project already has another routing convention, follow it.

H1:

**Best Forex Brokers 2026**

The page should be data-driven and reusable for future collections such as:

- Best Forex Brokers for Beginners
- Best MT5 Brokers
- Best cTrader Brokers
- Best Scalping Brokers
- Best Low Spread Brokers
- Best Regulated Brokers
- Best Cashback Brokers
- country-specific Best Broker pages

Do not implement all future pages now. Build the current page so the same architecture can support them later.

---

# 3. Core architecture

Conceptual model:

**Broker Master Profile → Reusable Broker Card → Collection / Placement → Page**

Broker master data should remain the single source of truth.

## Broker master data examples

Use existing fields if already available:

- id
- name
- slug
- logo
- rating
- regulators
- minimum deposit
- platforms
- rebate/cashback information
- broker profile URL

## Placement-specific / category-specific data

This information belongs to the collection/page, not to the broker itself:

- rank
- bestFor
- shortVerdict
- highlight1
- highlight2
- displayOrder
- enabled

Example:

IC Markets may be:

- #1 / Best for Active Traders on “Best Forex Brokers”
- #3 / Best for Algorithmic Trading on “Best MT5 Brokers”

Do not store “Best for Active Traders” as universal broker data.

---

# 4. Reusable broker card

Create or extend a reusable `BrokerCard` component.

The component must not be tied only to this page.

Recommended information hierarchy:

## A. Ranking / editorial position

Display:

- `#1`
- `BEST FOR ACTIVE TRADERS`

Ranking and “Best For” are placement-specific.

## B. Broker identity

Display:

- broker logo
- broker name
- FXRebate rating if a valid existing rating exists

If no real rating exists, do not invent one.

The card must render correctly without a rating.

## C. Short verdict

Maximum around 2 visual lines.

Example:

“Low spreads, fast execution and strong platform support for active forex traders.”

## D. Three key facts

Default fields:

- Regulation
- Minimum Deposit
- Platforms

Example:

Regulation: ASIC · CySEC  
Minimum Deposit: $200  
Platforms: MT4 · MT5 · cTrader

These should come from broker master data.

## E. FXRebate cashback/rebate area

This must be visually distinct.

Examples:

**FXREBATE CASHBACK**  
**Up to $4.00 / lot**  
Available through FXRebate

or, where no single rate can be shown:

**FXREBATE CASHBACK**  
**Multiple rebate options available**  
See rates →

Support different rebate display formats where the data model allows:

- USD per lot
- EUR per lot
- pips
- % commission
- % spread
- tiered / variable
- generic “Cashback available”

Do not assume every rebate can be represented by one numeric field.

## F. Two highlights

Maximum 2 short points.

Example:

- Low trading costs
- Strong regulation

## G. Primary CTA

Use:

**View Broker**

or:

**See Broker Details**

CTA should link to the internal FXRebate broker profile.

Do not use an external “Open Account” CTA as the main action on this page.

---


# 4A. NON-NEGOTIABLE DESIGN PRIORITY — TOP BROKER CARDS

The Top Broker cards are the visual centerpiece of this page and must receive more design attention than any other section.

The reference point is the **CashbackForex Best Forex Brokers card concept**, especially its fast scanability, ranking logic and compact broker comparison. However, the FXRebate implementation must look materially better: more premium, cleaner, better spaced and more deliberate.

Do NOT deliver generic dashboard cards, default framework cards, simple white rectangles with a border, or a literal visual copy of CashbackForex.

The target is a polished fintech/editorial ranking card that could credibly sit on a premium financial product website.

## Card design goals

Each card must communicate, in this order:

1. **Why this broker is in the ranking**
2. **Who it is best for**
3. **Who the broker is**
4. **Three decision-making facts**
5. **What FXRebate adds**
6. **Why the user should explore the broker**
7. **Clear internal CTA**

The card should be understandable in approximately 3–5 seconds.

## Recommended visual anatomy

### Header strip / top line

Left:
- prominent ranking marker such as `#1`

Right:
- compact editorial badge such as `BEST FOR ACTIVE TRADERS`

The ranking should feel important but not oversized.

The “Best For” badge should be visually distinct from generic tags and should support different text lengths.

### Broker identity row

Use:
- broker logo with controlled dimensions;
- broker name as the strongest text after the ranking;
- rating on the right only if a real rating exists.

Avoid oversized broker logos.

Do not let inconsistent logo aspect ratios destroy alignment between cards.

Create a normalized logo container.

### Editorial verdict

One concise sentence, preferably limited to two lines on desktop.

Use line clamping if required, but do not hide essential information.

This text should explain the broker's positioning, not repeat its name or generic marketing claims.

### Key facts row

Create a visually structured 3-column facts area:

- Regulation
- Minimum Deposit
- Platforms

Use compact labels and stronger values.

Example:

REGULATION  
ASIC · CySEC

MIN. DEPOSIT  
$200

PLATFORMS  
MT4 · MT5 · cTrader

Use separators, subtle background treatment, or grid alignment so these read as structured facts rather than body copy.

Do not use large decorative icons for every field unless the existing FXRebate design system already does so.

### FXRebate advantage panel

This is the signature part of the card.

Create a visually distinct inset/panel inside the card.

Example:

FXREBATE CASHBACK  
**Up to $4.00 / lot**  
Available through FXRebate

This area should be:
- clearly branded as FXRebate;
- more visually prominent than normal metadata;
- immediately recognizable across all cards;
- consistent in position and height where possible.

It should NOT look like an external advertisement pasted into the card.

It should feel native to the card design.

If a precise rebate cannot be represented:
- `Cashback options available`
- `Multiple rebate rates available`

The design must support both cases without breaking.

### Highlights

Maximum two.

Use subtle checkmarks or existing success iconography.

Example:

✓ Low trading costs  
✓ Strong regulation

Keep them short.

### CTA area

Place the CTA consistently at the bottom of every card.

Preferred:

**View Broker →**

The CTA should have strong contrast and a clear hover/focus state.

The entire card can have a subtle hover treatment, but the CTA must remain visually obvious.

## Recommended card interaction

Desktop hover:
- subtle elevation or shadow change;
- subtle border/accent change;
- CTA arrow movement or similar micro-interaction;
- no exaggerated scaling.

Mobile:
- no hover-dependent information;
- full information remains available;
- CTA should be easy to tap.

Keep animation restrained and professional.

## Card consistency

Cards in the same row should visually align.

Where possible:
- equal overall height;
- same logo area height;
- same verdict area height;
- same facts area height;
- same rebate panel position;
- CTA aligned at the bottom.

Use CSS grid/flex layout deliberately to achieve this.

Do not allow one card to become 25–30% taller solely because of copy length.

## Visual hierarchy

Recommended order of emphasis:

**Rank / Best For**
→ **Broker Name**
→ **FXRebate Cashback**
→ **Key Facts**
→ **Short Verdict / Highlights**
→ **CTA**

The cashback block should be one of the strongest visual elements because this is where FXRebate differentiates itself from generic broker-comparison sites.

## Desktop layout

For the initial Top 6:

- 3 cards per row;
- generous horizontal gap;
- enough page width that cards do not feel squeezed;
- avoid tiny text to force everything into the card.

If the existing site container is too narrow for readable 3-column cards, adapt the page container for this section rather than compressing the content excessively.

## Tablet

- 2 cards per row;
- preserve the same content hierarchy.

## Mobile

- 1 card per row;
- convert the 3-column key facts row into a layout that remains readable;
- CTA may become full width;
- maintain clear separation between broker data and FXRebate cashback.

## Suggested visual direction

Use the current FXRebate branding and design tokens.

Preferred feel:
- clean premium fintech;
- modern editorial comparison;
- subtle depth;
- restrained borders;
- strong typography;
- intentional white/negative space;
- subtle FXRebate accent treatment in rebate areas;
- professional, not “casino affiliate” or aggressive promotion.

Avoid:
- excessive gradients;
- neon effects;
- oversized glow;
- crowded badges;
- generic SaaS dashboard look;
- cheap affiliate-site aesthetics.

## Design implementation check

Before considering the page complete, visually inspect the Top 6 cards at:

- desktop wide screen;
- standard laptop width;
- tablet;
- mobile.

If browser/screenshot tools are available, compare the first fold against the CashbackForex reference for information density and scanability.

The FXRebate version should feel:
- easier to scan;
- more premium;
- less cluttered;
- more consistent;
- more clearly differentiated through the FXRebate cashback panel.

Do not accept the implementation as complete if the card section looks generic or visually secondary to the text sections below it.


# 5. Broker card UX

Desktop:
- cards should have consistent height;
- important sections should align across cards;
- CTA should sit consistently near the bottom;
- ranking / Best For should be immediately visible;
- cashback/rebate block should be prominent but not dominate the entire card.

Tablet:
- 2 cards per row.

Mobile:
- 1 card per row;
- do not simply shrink the desktop card;
- use readable spacing;
- full-width or clearly tappable CTA;
- preserve information hierarchy.

The full card may be clickable if compatible with the existing codebase and accessibility patterns.

Do not create invalid nested interactive elements.

Ensure keyboard navigation and visible focus states.

---

# 6. Page layout — implement in this order

## Section 1 — Breadcrumbs

Example:

Home → Brokers → Best Forex Brokers

Use existing breadcrumb component if available.

## Section 2 — Hero

H1:

**Best Forex Brokers 2026**

Short intro: 2–3 lines maximum.

Content direction:

“We compared leading forex brokers based on regulation, trading costs, platforms, account conditions and FXRebate benefits to identify our top choices for 2026.”

Add, where supported:

- Last updated
- How we rank brokers / Methodology link

Keep the hero compact.

Users should reach the broker cards quickly.

## Section 3 — Top Forex Brokers

Primary section.

Initial target:

**Top 6 brokers**

Responsive layout:

- Desktop: 3 columns × 2 rows
- Tablet: 2 columns
- Mobile: 1 column

The number of brokers should come from data/configuration, not from six manually duplicated components.

Each card uses the reusable BrokerCard component.

## Section 4 — Quick Comparison

Add a compact broker comparison section immediately after the cards.

Recommended columns:

- Broker
- Best For
- Rating
- Minimum Deposit
- Platforms
- FXRebate Offer

Desktop:
- table or structured comparison grid.

Mobile:
- responsive cards/list or another usable format.
- avoid a huge unreadable horizontal table.

Broker name/logo should link to the internal broker profile.

If the project already has a comparison component, reuse it.

## Section 5 — How We Selected the Best Forex Brokers

Create a concise methodology/criteria section.

Recommended criteria:

- Regulation & safety
- Trading costs
- Platforms
- Trading conditions
- Account accessibility
- Broker reliability / reputation
- FXRebate availability/value
- Overall suitability

Do not claim a numeric scoring model if FXRebate does not actually have one.

## Section 6 — Detailed Broker Summaries

For each Top Broker, add a richer editorial block.

Recommended structure:

### `#1 Broker Name — Best for X`

Include:

- logo
- short editorial overview
- “Why we picked it”
- 2–3 strengths
- 1–2 things to consider
- FXRebate availability
- internal link to full broker profile

Do not duplicate the entire broker profile.

This section should provide enough unique editorial value for users and search engines.

## Section 7 — Which Forex Broker Is Right for You?

Create a decision-support section.

Example rows/cards:

- Best Overall → Broker A
- Best for Beginners → Broker B
- Best for Low Spreads → Broker C
- Best for MT5 → Broker D
- Best for Scalping → Broker E
- Best FXRebate Opportunity → Broker F

Use actual placement data where possible.

Do not create links to future category pages unless those routes actually exist.

## Section 8 — What to Look for When Choosing a Forex Broker

Short educational section.

Cover:

- Regulation
- Trading costs
- Platforms
- Execution
- Account types
- Deposits/withdrawals
- Customer support
- Rebates

Keep it useful and concise.

Do not turn the page into a generic 8,000-word SEO article.

## Section 9 — How FXRebate Can Reduce Trading Costs

Create a distinct FXRebate business-value section.

Explain visually / succinctly:

**Broker pays commission → FXRebate receives partner commission → FXRebate returns part of it to the trader**

Link to relevant existing pages if available:

- How Forex Rebates Work
- Rebate Calculator
- FXRebate FAQ

Reuse current routes.

Do not invent dead links.

## Section 10 — FAQ

Implement 6–8 FAQs.

Initial content topics:

- What is the best forex broker in 2026?
- How does FXRebate rank forex brokers?
- Which forex broker is best for beginners?
- Which broker has the lowest trading costs?
- Are forex rebates available with all brokers?
- Does FXRebate change my broker trading conditions?
- How do forex broker rebates work?
- How often are broker rankings updated?

Use an accessible accordion if the site already uses one.

FAQ content should be readable in the rendered HTML.

## Section 11 — Editorial / Methodology / Trust

Add a compact section containing, where the platform supports the data:

- Written by / Reviewed by
- Last updated
- Methodology
- Data/source verification
- Advertising disclosure

Reuse existing author/editor components if available.

## Section 12 — Risk / Advertising Disclosure

Use the current site’s legal/disclosure component if one exists.

Do not duplicate global legal text unnecessarily.

---

# 7. Information that should NOT appear on the main card

Do not overload the Top Broker card with:

- all asset classes
- all account types
- detailed leverage
- all deposit methods
- withdrawal times
- long company history
- long pros/cons
- detailed fee tables
- every legal entity
- 10 badges
- large legal disclaimers
- long descriptions

Those belong on the broker profile page.

---

# 8. Interactivity

The page should feel interactive but remain fast and focused.

## Required
- clickable broker cards / View Broker CTA
- responsive quick comparison
- FAQ accordion
- methodology anchor/link
- smooth in-page navigation only if the current project already uses this pattern

## Optional if existing infrastructure exists
- Compare toggle on broker card
- compare drawer/bar
- “Show differences only”
- sticky section navigation

Do not build a large new comparison application if none exists unless it can be done cleanly without delaying the page.

Prioritize the core page first.

---

# 9. Design direction

Follow the existing FXRebate design system first.

Desired visual qualities:

- premium fintech
- trustworthy
- modern
- clean
- data-driven
- easy to scan
- high information density without clutter

Do not copy CashbackForex or BrokerChooser visually.

Use the references for hierarchy and functionality only.

Important visual priorities:

1. Rank / Best For
2. Broker identity
3. Short verdict
4. Key broker facts
5. FXRebate cashback
6. Highlights
7. View Broker CTA

Keep cashback visually identifiable as an FXRebate-specific advantage.

---

# 10. SEO implementation

Use the project’s existing SEO utilities.

Support:

- unique page title
- meta description
- canonical
- OpenGraph
- breadcrumb metadata if supported
- semantic HTML
- one H1
- logical H2/H3 hierarchy
- server-rendered/indexable broker content where the stack supports SSR/SSG
- internal links to broker profiles
- internal links to relevant FXRebate educational content

Recommended URL concept:

`/brokers/best-forex-brokers`

Do not include the year in the permanent URL unless the existing project convention requires it.

The H1/title can contain the current year.

---

# 11. Structured data

Reuse existing schema utilities if available.

Potentially applicable:

- BreadcrumbList
- Article / WebPage
- Organization
- Person

Only add Review/AggregateRating if the current rating data and implementation are genuinely valid.

Do not fabricate schema data.

Structured data must match visible content.

---

# 12. Analytics

Reuse current analytics infrastructure.

Recommended events:

- `best_brokers_page_view`
- `broker_card_impression`
- `broker_card_click`
- `broker_profile_click`
- `broker_compare_click`
- `rebate_offer_click`
- `methodology_click`
- `faq_expand`

Include relevant properties where supported:

- broker_id
- collection_id
- rank
- placement
- device

Suggested placement:

`best_forex_brokers`

Do not introduce another analytics provider if one already exists.

---

# 13. Suggested TypeScript interface

Adapt this to the current project rather than forcing it if incompatible.

```ts
type BrokerPlacement = {
  brokerId: string;
  rank?: number;
  displayOrder: number;
  bestFor: string;
  shortVerdict?: string;
  highlights?: string[];
  enabled: boolean;
};

type BrokerCardData = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  rating?: number;
  regulators?: string[];
  minimumDeposit?: {
    amount: number;
    currency: string;
  };
  platforms?: string[];
  rebate?: {
    available: boolean;
    displayValue?: string;
    displayType?: string;
  };
};
```

If the existing data model already provides better types, use those instead.

---

# 14. Fallback behaviour

The card/page must not break when optional data is missing.

Examples:

No rating:
- hide rating.

No simple rebate value:
- show “Cashback options available”.

No minimum deposit:
- hide the value or use the project’s approved fallback.

Only one platform:
- display one platform normally.

Missing editorial highlights:
- do not render empty bullets.

Never invent broker data to preserve layout.

---

# 15. Performance

Keep the page lightweight.

Do not fetch full broker profile content if the card needs only a small subset.

Use:

- existing optimized image component
- lazy loading where appropriate
- proper logo dimensions
- code splitting only where useful
- server data loading conventions already used by the project

Avoid unnecessary client-side JavaScript.

---

# 16. Accessibility

Target the project’s existing accessibility standard, ideally WCAG AA.

Ensure:

- keyboard navigation
- visible focus
- accessible CTA labels
- semantic headings
- readable contrast
- accessible tables/accordions
- meaning is not communicated by color alone

---

# 17. Acceptance criteria

The task is complete when:

- `/brokers/best-forex-brokers` exists and renders correctly;
- page uses existing FXRebate layout/design system;
- top broker cards are generated from data, not manually duplicated;
- reusable BrokerCard component exists or existing one is extended cleanly;
- placement-specific content is separated from broker master data;
- Top 6 layout works on desktop/tablet/mobile;
- Top Broker cards are the dominant visual feature above the fold and follow the dedicated card design contract;
- cards look intentionally designed for FXRebate rather than like generic framework/dashboard cards;
- the FXRebate cashback panel is visually distinct and consistently positioned across cards;
- cards link to internal broker profiles;
- FXRebate rebate/cashback information is clearly visible;
- quick comparison works responsively;
- detailed broker summary blocks are implemented;
- methodology section exists;
- educational / FXRebate explainer content exists;
- FAQ is interactive and accessible;
- missing optional broker data does not break the UI;
- SEO metadata is implemented;
- relevant analytics hooks/events are added using existing project conventions;
- no competitor content/design is copied 1:1;
- no unnecessary new dependency is introduced;
- lint/typecheck/tests pass;
- production build succeeds.

---

# 18. Implementation workflow

Please perform the work in this order:

1. Inspect repo.
2. Identify existing broker/data/design/SEO/analytics components.
3. Decide what can be reused.
4. Implement data adapter / collection config if needed.
5. Implement or extend reusable BrokerCard.
6. Build page sections.
7. Connect real broker data where available.
8. Add responsive states.
9. Add SEO/meta.
10. Add analytics hooks.
11. Run lint/typecheck/tests/build.
12. Fix any issues found.
13. If browser preview/testing is available, inspect desktop and mobile rendering and correct layout problems.

Do not stop after explaining what should be done. Implement it.

---

# 19. Final response expected from Codex

After implementation, return:

1. Short summary of what was built.
2. Files created/modified.
3. Any assumptions made.
4. Any temporary/mock data still present.
5. Commands/tests run and results.
6. Any follow-up item that requires backend/CMS work.

Keep the final report concise.

---

# Product principle

Do not build a static “Best Brokers” landing page.

Build the first reusable **broker ranking / discovery page** for FXRebate.

The visible page is:

**Best Forex Brokers 2026**

The underlying architecture should be reusable later for homepage broker placements and future Best Broker categories, without duplicating broker master data.
