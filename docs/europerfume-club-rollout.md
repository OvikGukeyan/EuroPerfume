# EURO PERFUME CLUB — independent Vercel implementation (staging only)

**Release gate:** This branch contains a staged schema migration. Do **not** merge to production or run migrations against production Supabase without the owner's separate approval. The preview currently shares a production database and cannot safely test writes to the new tables until an isolated test database is provisioned.

## Source of truth and privacy
- Shopify is fully separate. No Shopify imports, customer merge, promo sharing or balance synchronization.
- Customer history is loaded by `Order.userId` **only**. Never search orders by billing email; guest `userId=NULL` orders stay guest forever.
- Password login requires a verified email; Google OAuth sign-in verifies the account email through the identity provider.
- Admin CRM shows registered email addresses, verification, confirmed marketing consent, and counts. Only ADMIN session can access.
- Promotional mail requires *double-opt-in* (confirmed and not withdrawn), not merely registration; new users without newsletter consent can still see WELCOME10 in their account.

## Voucher model
- Keep the existing `PromoCode` table and historical orders intact.
- `CouponPolicy`: additional rules by canonical code. `CouponRedemption`: immutable attribution to user + order and campaign epoch. Managed codes require login + email verification.
- WELCOME10: 10% on first non-cancelled signed-in order, one use per verified account, 60 days after email verification, does not discount Sale, active Day Offer or active gift-campaign requirements; coupon discount never reduces delivery.
- Printed shared coupon: one common code on arbitrarily many physical cards, one redemption per account per campaign epoch, optional global limit. No reliable identity guarantee against multiple separately verified accounts.
- Old `disposable` codes remain global one-time and continue behaving as before until explicitly adopted/restarted.
- Restarting a code increments `epoch`, resets its current-period usage counter, keeps old redemption history. Historical price snapshots/invoices are not recalculated.
- Managed redemptions lock the policy row with `FOR UPDATE` and create redemption in the same transaction as `Order`; competing checkouts cannot spend the same allowance.

## Welcome email
- Account verification and newsletter confirmation are separate.
- An optional one-off welcome promotional email is delivered only after both have completed, with an unsubscribe link and short terms.
- Sending is claimed idempotently in `WelcomeNotice`; WELCOME10 is available in the verified profile even when marketing consent is absent.
- Signed opt-out uses a confirmation page plus POST, never a side-effecting GET; existing newsletter confirmation unsubscribe links are not overwritten.

## Loyalty (earning is staged; spending not enabled)
- `LoyaltyWallet` holds balance; `LoyaltyEntry` holds immutable ledger events with unique idempotency keys. No retroactive credit for guest orders.
- Proposed rate: 5 points per eligible 1 EUR after coupon reduction; 100 points equal 1 EUR. Exclude shipping, reduced Sale, day offers and the products qualifying a gift promotion.
- Award only when admin explicitly confirms **payment received AND physical carrier hand-over**. Creating Rechnung or generating DHL label is insufficient. Admin acknowledgments use `OrderFulfillment` and row locks; a second confirmation cannot award again.
- Never infer actual payment from OrderStatus alone. Bonus points only on account orders placed after email verification.
- Redemption in Checkout, cap 20%, point expiry, automatic reversal on partial Stornorechnung and returns **are not active** yet. These require a dedicated atomic order-price/refund implementation and tax-accounting approval before launch. Do not treat the wallet as redeemable credit until these checks pass.
- An invoice correction is not by itself proof of cash refund; refunds remain separate, with original pricing snapshots preserved.

## Marketing
- Draft campaign has RU/DE subject/body and audiences: ALL, NO_ORDERS, WITH_ORDERS among verified subscribers with confirmed, unwithdrawn consent.
- Admin must manually activate then explicitly send in batches of five; no scheduled or automatic mass emailing.
- Before each send the server rechecks consent. A unique `(campaignId,userId)` delivery row plus atomic QUEUED->SENDING claim prevents duplicate sends by concurrent clicks.
- Every email contains a signed unsubscribe link and Impressum/privacy links. Delivery history tracks provider IDs and failures. No open/click tracking is enabled.
- Failed emails are logged; recovery/retry UI and large-scale managed queues are a subsequent phase.

## Tests and release prerequisites
- `npm run test:club` covers first purchase, expired 60-day windows, account verification, global and per-account limits, guest-order exclusion, paid+handed-over idempotency and points calculation.
- Existing invoice correction, Black Friday, Day Offer, INCI and coupon-policy tests run in the build.
- Run schema migration **only in isolated staging** first, inspect row-level security and permissions, and perform registration/email/consent, account/coupon, duplicate checkout, paid+shipment, newsletter unsubscribe and refund E2E.
- Apply staged migration on production only after explicit approval, separately from code release; activate gradually using feature flags if necessary. No historical order, Invoice, or Stornorechnung mutation in this PR.
