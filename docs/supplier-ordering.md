# Supplier-held full bottles

The owner's clarified workflow (24 November 2026) is the existing cart and order enquiry, including at zero owned inventory. No online payment or automatic invoice is introduced. The merchant confirms availability, price and delivery, agrees substitutions/removals, receives payment, and manually issues the invoice.

`Product.allowBackorder` is an explicit database flag, default false. Reviewed imported bottles use `available=true`, `allowBackorder=true`, `stockPieces=0`. `available` means enabled for ordering, not physically in stock. Never synthesize stock quantities. Products can still be disabled deliberately. Existing owned bottles retain their stock limit. A supplier stock update must not disable a backorder listing merely because the supplier currently has none.

The flag is read from the database in cart POST, cart PATCH and order creation. Client payloads cannot enable it. Invalid quantities and child-bottle variation IDs remain rejected. Catalog filters include enabled backorder children. The product page shows “Под заказ” / “Auf Bestellung”, with availability, final price and delivery confirmed after the enquiry. Saving an existing supplier bottle's price or stock preserves its ordering mode.

Rollout: apply the additive migration, deploy the code, verify build and cart behavior, then enable only the reviewed product IDs. This replaces the earlier email-only interpretation in the supplier review document. Other source/content checks remain required before new catalog publication.

Tests: `npm run test:supplier-ordering`, `npm run test:supplier-import`, `npm run test:preinvoice-reservations`. Preview shares live services, so do not submit test orders or generate invoices there. Read-only page checks and disposable cart checks are safe; they are not proof of a real completed order.
