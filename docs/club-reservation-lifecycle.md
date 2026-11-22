# EURO PERFUME CLUB — pre-invoice reservation lifecycle

**Custom Vercel shop only. Shopify is separate.**

## Business process

1. A verified customer submits an **enquiry**. Requested bonus points are locked from the wallet immediately, but the ledger records `RESERVE`, **not** a final `SPEND`.
2. Merchant checks stock and edits quantities/items while the order has **no Invoice**, **no confirmed payment**, is not shipped, and is not cancelled. The Order row is locked for the whole edit transaction.
3. `reviseOrderPricing()` keeps historical line prices, re-evaluates shipping on merchandise subtotal, applies coupon only to eligible items and caps the **remaining** reservation to 20% of eligible after-coupon merchandise. The new reserved amount is always <= prior reserved amount; extra points cannot be taken without customer agreement.
4. Extra points are returned in the same SQL transaction using a positive `RESERVATION_RELEASE` entry and wallet credit, and the pricing snapshot/total are updated. Repeating an unchanged edit creates no additional release.
5. If merchant cancels an **unpaid, uninvoiced** enquiry, the remainder returns exactly once as `RESERVATION_CANCELLED`. Managed `CouponRedemption` and the appropriate policy epoch's used-count are released. No Stornorechnung, cash refund or payment occurs. Repeated cancellation is a no-op.
6. Original Rechnung issuance locks Order and creates PDF/document, then books `RESERVATION_FINALIZED` (positive) and `SPEND` (negative) for the final reserved amount inside **the same transaction**. The pair does not affect wallet balance again. Previously issued invoices are returned unchanged on retry.
7. Confirmed partial/full monetary returns **after** invoice continue to use separate Stornorechnung and recorded confirmed cash refund. Refunds restore only final settled `SPEND`, not the earlier released reservation. Awarding EARN requires a created Invoice, admin-confirmed payment and actual carrier handover.

## Safeguards

- Distinct immutable ledger event kinds `RESERVE`, `RESERVATION_RELEASE`, `RESERVATION_CANCELLED`, `RESERVATION_FINALIZED`, `SPEND`.
- Stable unique idempotency keys for initial reserve, cancelled release and final spend. Every edit/cancel/issue locks Order, and coupon policy is updated before customer wallet to avoid cross-request lock inversion.
- No destructive order deletion from the admin; use cancel status with audit trail. No cancellation after Invoice/payment/shipping.
- `WELCOME10` remains 10%, one verified account, 60 days after email verification, never stacked with sale or other coupons. Unpaid, uninvoiced cancellation frees its redemption exactly once.
- Do not reset `CouponPolicy.usedCount` in the wrong epoch if an older order is cancelled after a campaign restart.

## Verification status and production roll-out

- `npm run test:preinvoice-reservations` is deterministic and uses **dummy data only**. It covers two-item edits, qty reductions, shipping threshold, zero eligible items, coupon exclusion, duplicate edits, calculations for no-points orders, WELCOME10 and paid refund math. Other existing automated test suites also run during Vercel builds.
- On 2026-11-22 a **separate temporary Supabase PostgreSQL branch** was provisioned with explicit owner approval (quoted $0.01344/hour, spending cap €2). It contained **no production rows**, only a minimal synthetic schema using the same ledger/event constraints, plus fabricated users, enquiries, invoices and corrections. Five real Postgres transaction/constraint scenarios passed: (1) two items -> remove one -> release 900 points, shipping, coupon, invoice settle and EARN; (2) unpaid cancellation twice -> return once, WELCOME10 freed, no Stornorechnung/cash; (3) plain order -> partial and full invoice refund, original immutable and WELCOME10 unchanged; (4) redeemed-point invoice -> cumulative partial/full cash refunds including settled-point restoration and EARN reversal; (5) duplicate SPEND idempotency constraint. This validates ledger and database mechanics, **but not the full Prisma HTTP handlers**: the fixture schema is deliberately minimal and does not implement the full production Prisma schema; it is **not** proof of successful end-to-end browser or concurrent HTTP integration.
- Vercel Preview can inherit production database credentials: do **not** run integration HTTP requests there. The production build and pure/static regression suite verify source, arithmetic and TypeScript. A later dedicated full-schema staging environment is recommended for extra regression coverage.
- Never create fake users, orders, balances, invoices, emails or financial events in production.
