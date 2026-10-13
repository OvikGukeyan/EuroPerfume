# Shopify legal content transfer

Source repository: OvikGukeyan/EuroPerfume. Base commit: bb342b56ef381cee848b8de63d76b8176c1dbc06.

## Source documents

The current German policies were retrieved directly from europerfume.eu on 13 October 2026:

- /policies/legal-notice
- /policies/terms-of-service
- /policies/refund-policy
- /policies/privacy-policy
- /policies/shipping-policy

After the Shopify connection became available, the connected store identity and all five source policies were also checked through its Admin API. The source texts match (the AGB differ only in whitespace segmentation).

Merchant data: Vitalii Saiian / EURO PERFUME, Schillerstrasse 40, 49811 Lingen, Germany; europerfumeshop@gmail.com; +49 1523 1651047; VAT ID DE457176300.

The German contractual version is used on both existing locale routes. The public Russian Shopify translations of AGB and privacy were older and did not match the current German version. The Russian route explains the document language; the withdrawal interface, FAQ, information text and consent controls are localized.

## Result

- Replaced Impressum, AGB, withdrawal information and privacy pages with sanitized current content.
- Adapted hosting, database, transactional email, payment and consent references for Vercel, Supabase and Resend.
- Added a visible footer entry, guest withdrawal form, review step and confirmation step.
- Added durable storage of declarations and original receipt text. Email retries reuse the same record, receipt timestamp and provider idempotency key.
- Added the timestamped receipt email with a merchant copy, receipt download and mail-failure retry.
- Added an interactive, one-page PDF withdrawal form.
- Aligned FAQ, About Us, shipping/payment descriptions, product-format notice and footer with the transferred terms.
- Updated the seller address in future invoices and the DHL sender payload.
- Added independent consent choices for local browsing history, Google Analytics and Meta Pixel; optional functions activate after consent and support revocation.

## Database change

Supabase project: europerfumeshop (thgjecpmxhqwfoknvjiu).

Migration `create_withdrawal_requests` was applied through Supabase. The local migration SQL is idempotent. It creates only `public.WithdrawalRequest` and its access configuration. RLS is enabled; PUBLIC, anon and authenticated table privileges are revoked. The existing backend database connection and service role have access.

Verified schema: UUID ID, name, email, contract identifier, locale, original timestamp, email-status metadata, and original receipt text. Browser-role read/write privileges are absent. There were zero submitted declarations after setup.

## Verification

- Prisma client generation and TypeScript checking pass.
- Seven handler tests cover guest/partial withdrawals, durable persistence, mail failure and retry, duplicate suppression, database failure, conflicting IDs, invalid input and excessive new requests.
- Production compilation passes with temporary build-only configuration. Existing unrelated hook/realtime warnings remain.
- PDF fields and widget appearances were checked; its one-page rendering was visually reviewed.
- Production email delivery remains unverified because working service configuration is unavailable to this checkout.
- Browser QA could not run: the headless browser download failed. The local preview server started, but its loopback endpoint was inaccessible from the verification process.

## Publication and follow-up

Publication is performed through the linked GitHub repository. Direct Vercel API access was unavailable for the project's team scope, `vitaliys-projects-80c33059`; deployment checks and the public site are used for verification.

On 13 October 2026 the merchant confirmed that the current business remains a Kleinunternehmer and VAT charging is planned from January 2027. Shopify is being prepared for that later launch. This current Vercel release therefore adapts the AGB price clause to the §19(1) UStG exemption and retains the matching existing invoice behavior. The Shopify source store is unchanged. The later January transition is now implemented as described below.

The Supabase advisor separately reports an existing outdated Postgres version. The new table's informational no-policy notice is intentional: it is server-only and browser roles have no grants.


## Prepared VAT transition from 1 January 2027

- The effective instant is `2027-01-01T00:00:00+01:00`, i.e. midnight in Germany (23:00 UTC on the preceding day).
- The server determines the active policy. Dynamic AGB replace the §19 price clause with the VAT-inclusive price clause after this instant. The product/checkout notices refresh from a no-cache endpoint, including an open tab at the boundary.
- Catalog and checkout amounts remain final gross customer prices. For German deliveries from the effective date, the 19% tax share is extracted from the total, including shipping and after discounts. No additional 19% is added to the charged total.
- New orders preserve gross item prices, shipping, discounts, final amount, country and quoted tax policy in a JSON pricing snapshot. Later catalog changes do not change these invoice prices.
- New invoices require the actual supply date. This date governs the tax split, including orders placed in December and supplied in January. Issuing an invoice later does not automatically retax a December supply. Existing invoice PDFs are untouched.
- Invoice PDFs include the billing address, invoice and supply dates, VAT ID, net amount, tax rate/tax amount and gross total. Embedded fonts and explicit asset tracing support the deployed runtime.
- Order confirmation emails include the saved pricing and tax statement. Shipping and tax use the actual delivery country rather than the billing country.
- Dashboard item changes refresh the pricing snapshot; changes after invoicing are rejected. These mutations and invoice creation require an administrator session.
- Automatic 19% invoices are enabled for Germany. `EU_VAT_MODE` remains `review` until the merchant confirms origin-country taxation / OSS requirements. Foreign VAT invoices are blocked with a clear admin message rather than guessing a destination rate. This is the remaining tax configuration for non-German deliveries; no country-rate table or OSS registration is assumed.
- Additive migration `add_order_invoice_tax_snapshots` was applied to Supabase and verified: nullable `Order.pricingSnapshot`, `Invoice.taxSnapshot` and `Invoice.supplyDate`. Existing orders/invoices were not rewritten.
- Type checking and fifteen tests pass, covering the exact boundary, gross/net rounding, discounts, shipping, price snapshots, actual supply date, foreign-tax review, correct one-page PDF invoices and the seven withdrawal-handler scenarios.
- The date switch takes effect on the live site only after this code is deployed.
