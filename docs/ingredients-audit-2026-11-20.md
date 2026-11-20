# EURO PERFUME — INCI storefront/catalog audit (20 November 2026)

## Verified read-only database findings
- Public parent product records: 495, available parent products: 286.
- Available perfume-category parent products: 280.
- Available perfume products with nonempty saved INCI in both RU and DE: 72.
- Available perfumes without a saved INCI in either locale: 208 (some may have a source reference fallback; distinguish “not stored” from “nothing displayed”).
- Available perfume products with saved INCI in only one locale: 0.
- Available non-perfume products with saved INCI: 4.
- Three available perfume records carry a review flag for an old ingredient name:
  - #481 Creed Original Santal
  - #564 Frédéric Malle En Passant
  - #581 Fueguia 1833 La Cautiva

## Root cause for La Cautiva
Saved RU/DE activeIngredients fields both contain a 428-character INCI list.
The public `ProductIngredients` component previously had `inci && !review`: the review flag replaced the entire saved INCI with a generic “verify packaging” message. The new component shows the original saved INCI with a clear bilingual verification / potential compliance warning.

## Rules preserved
- Never replace an existing saved INCI with note pyramids or guessed ingredients.
- A flag does **not** prove that the current batch contains a prohibited ingredient: confirm the specific package and manufacturer information before compliance decisions.
- Do not silently remove flagged substances. No product records, sale flags or stock data are changed here.
- Show the INCI accordion for every perfume regardless of concentration metadata, and for other products with saved ingredient text.
- Dashboard `/{locale}/ingredients` reports all perfume parent products (including those missing concentration) and other products with saved lists, by RU/DE and review/missing status.

## Outstanding catalog data work
The 208 active perfumes without saved lists need batch-verified manufacturer or packaging INCI; a blank list must not be fabricated. Existing published reference fallbacks may supply some text but are not proof of a particular stock batch. The audit page lists the specific items.

## Tests
`npm run test:ingredients` runs public-component static-render tests for La Cautiva RU/DE, saved INCI display, review notices, unflagged INCI and missing INCI. The Vercel preview build runs this test before compiling.
