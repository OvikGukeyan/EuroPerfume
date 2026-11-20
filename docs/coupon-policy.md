# EURO PERFUME — unified coupon exclusions (preview)

All coupon codes including BLACK15 are validated against the live server cart before acceptance and revalidated in the order transaction. The client uses the same integer-cent rule and server recomputes the final amount, rejecting mismatches.

## Eligible / excluded
- Active Sale: exclude from coupon, retain catalog Sale price.
- Active Day Offer: exclude from coupon even if a better existing Sale price is displayed.
- Gift campaign: exclude required product IDs **only** when the cart meets the active campaign's requirements and the gift is available.
- Other ordinary products in the same cart remain eligible; gift is represented as a separate zero-value line and never added to the payable subtotal.
- Coupon amount = round(eligible gross item cents × percentage / 100). Shipment is never discounted; free-delivery threshold is evaluated on the original merchandise subtotal.
- Server resolves normal DB promo codes and reserved time-bound BLACK15. No eligible items => HTTP 422, no code stored on the order.
- Single-use coupons are marked inactive after a successful discount rather than being deleted.

## Price snapshots and tax
- New order PricingSnapshot v1 stores each line's `couponExcluded` flag and accepted gross amounts; historical snapshots are read without repricing.
- Existing historical snapshots without exclusion flags retain their historical coupon behavior in admin revisions, instead of silently applying today's policy.
- German tax cutover stays in `src/config/tax.ts`; protected invoices and Storno documents are not migrated or modified.
- Partial returns currently use **manual gross refund line amounts** and are bounded by the original invoice amount; invoice correction logic does not automatically allocate a basket coupon to a specific SKU. Staff must refund the actual paid amount (from the saved order), not today's catalog price. Automatic per-SKU allocations would need a separately reviewed specification.

## Tests and release
- `npm run test:coupon-policy` covers Creed Original Santal/Viking/Himalaya, gift expiry, existing Creed Sale, mixed carts, multiple promotions, rounding, BLACK15, shipping, saved pricing, VAT cutover and correction bounds.
- Existing Black Friday and Day Offer tests continue to run in the Next.js build.
- No migrations, live order changes, invoice reissues, or production deployment in this branch.
- Manual mobile/browser checkout and real order+invoice integration test remain before merging.
