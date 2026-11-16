# Reusable EURO PERFUME promotion engine (preview branch)

## Scope
- All promos use a database-backed `Promotion` record (titles RU/DE, slug, eligible fragrance product IDs, required millilitres, gift product ID and gift millilitres, dates, image).
- The lead slide is a compact responsive first slide with live text (mobile ~190px, desktop ~310px). Images have one common background and fixed object containment; future artwork may be uploaded as a single heroImage.
- `POST /api/promotions/[slug]/add` atomically ensures each required fragrance is in the same cart and persists a CartPromotion relation.
- Ordinary cart operations can then add/remove unrelated fragrances without losing the relation.
- Eligibility is rechecked for every cart read and at order creation. An invalid/deactivated promo produces no free gift.
- A qualifying order stores an immutable `OrderPromotion.snapshot`, including free gift details; the order note, admin details, confirmation email and invoice show the gift as zero value. No physical stock or free item is reserved automatically.
- Admin route: `/{locale}/promotions`. Products are selected by searching names, not manually typing IDs. Views/clicks/cart additions and order/upsell revenue are displayed.
- The starter wood-trio is inserted as **inactive** with catalog product IDs Cedar Chic 563, Bois Imperial 92, Encre Noire 164.

## Database safety and rollout
The Vercel preview currently uses the same production Supabase project. DO NOT run Prisma migration against the production DB just for preview. First connect a separate Supabase staging branch/project, apply `prisma/migrations/20261116170000_promotions/migration.sql` there, and configure Vercel preview database credentials to point only to staging. Then enable the starter promotion on staging through the admin. Until those steps, the frontend can be viewed in preview but checkout for this promotion intentionally remains disabled.

The migration enables RLS and revokes anon/authenticated PostgREST access on new promotion tables; server-side Prisma controls access. Do not automatically enable promotion on production when migrating.

## Regression checks
`npm run test:promotions` covers valid 5+5, extra unrelated products, removal of required product, insufficient volume, variation misuse, duplicate rule IDs, inactive promo, future start and exact expiry. This command is part of the Vercel build.

**Still required on isolated staging database before release:**
1. Admin create/edit/activate, product picker, languages, start/end dates and image.
2. Click hero, add offer; verify both items atomically and gift 0.00 in cart.
3. Add unrelated item; navigate back and through cart drawer; verify gift still attached.
4. Remove/resize one required item; verify gift revoked; restore it; verify eligibility restored.
5. Place a staged test order; check OrderPromotion snapshot, admin badge, email, immutable PDF 0.00 gift row and tax totals.
6. Verify price shifts and expiration with staged data; confirm no production data is modified.
7. Visual QA at actual mobile viewport, including image edges, consistent heights, carousel and desktop.

Do not merge this branch or enable the promotion until these checks pass.

### Black Friday 2026

Reserved campaign code `BLACK15` gives 15% off eligible lines only. The server validates the half-open Berlin interval `[2026-11-27T00:00:00+01:00, 2026-11-28T00:00:00+01:00)` both at validation and order submission. This code never falls through to a database code outside that interval. No schema migration or scheduled job is required. Existing sale prices and active daily offers are excluded line by line; delivery is excluded. Mixed carts retain their existing sale prices. The accepted pricing snapshot stores each line's coupon exclusion for later invoice/admin recalculation. The campaign banner appears before/during the campaign and hides automatically at its end. Test with `npm run test:black-friday`.
