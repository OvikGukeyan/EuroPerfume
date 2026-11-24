# Supplier import review — isolated draft

Routes: `/ru/supplier-import` and `/de/supplier-import`.

Enable `SUPPLIER_IMPORT_REVIEW_ENABLED=true` only for local development or a reviewed Vercel Preview. `VERCEL_ENV=production` always disables the route. Both the dashboard layout and page require an authenticated current ADMIN role. Page metadata is noindex and sitemap generation excludes the route.

Open the privately supplied `shortlist.json` (pilot), `draft-offers.json` (all selected offers), or a saved review. The browser validates JSON, supplier/SKU uniqueness, decimal costs and identifiers, recomputes prices, and displays data problems. Maximum 10 MB / 5,000 rows. One supplier SKU is one offer, not necessarily one distinct product.

The only decisions are pending, pilot and hold. Pilot is a review selection, never a sales approval. Missing image, INCI, image rights, current stock, identity and catalog mapping always remain release blockers. Name-based candidate IDs are unverified hints. Supplier stock, including `> 300`, is never written to own inventory.

Download the review before replacing the file or closing the page. A downloaded review can be reopened. Data stays in memory until downloaded; no upload, localStorage, server action, database write, Product insert, stock movement or invoice operation is implemented. Supplier data and wholesale prices must never be committed to this public repository or placed in public assets.

Prices use exact integer decimal arithmetic: `(cost + 5) * 1.30 * 1.19`, rounded half up once to euro cents. Imported prices are compared with this computation, never trusted. The price is a 2027 German gross recommendation. The export explicitly records 2026 exemption with no charged VAT. It does not modify existing tax settings or determine acquisition tax/input deduction eligibility.

Run `npm run test:supplier-import`. Optionally set `SUPPLIER_TEST_FILE` to a local private batch path to validate every real offer and round-trip. This variable is for local tests only; do not configure it on Vercel.

## Before a preview or persistence integration

Confirm Preview has a separate test database and test auth configuration: the existing dashboard session and notifications use the project's configured database. Do not copy Production secrets. This change introduces no database migration and does not solve Preview isolation automatically.

Next persistence phase needs ImportBatch (source hashes, timestamp, original rows), SupplierOffer (supplier/SKU key, stock timestamp, exact/lower-bound quantity), and a manually verified product map with volume/concentration/packaging. EAN collisions go to review. Include transaction rollback, idempotent re-import and optimistic version checks before any approved Product write. Existing full-bottle checkout depends on own stock; a separate under-order workflow is required before supplier availability can be used on the storefront.
