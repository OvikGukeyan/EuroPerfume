# EURO PERFUME — unified mobile app roadmap

## Architecture
Build upon this Next.js website and the existing Shopify product/order infrastructure, rather than adding a competing shop or invoice ledger. A progressive web app is the first delivery; native wrappers can be evaluated later. No paid app-builder dependency.

## Milestone 1: PWA foundation
- Manifest, appropriate square 192px/512px icons, Apple touch icon, install experience, and device tests.
- Ensure no caching of authenticated pages, cart, checkout, stock, prices, tax data, invoices or account information.
- Preserve existing locale routes (/de, etc.) and SEO.

## Milestone 2: Product variants
- Display an eligible 2 ml sample first in the SAME fragrance detail view, before existing full-bottle variants.
- Eligibility: verified exact fragrance match on Parfinity and individually verifiable 2 ml offer/price; no assumptions from 'from €9'.
- Keep all existing Shopify full-bottle variants and prices unchanged.
- Each proposed sample variant has its own SKU, inventory and price and must be DRAFT/unpublished or unavailable to buy pending stock and German legal approval.
- Record source product URL, checked date, exact 2 ml price, match confidence and review state. No unverified samples may go live.
- Never scrape/republish competitor imagery or descriptions.

## Milestone 3: Discovery + loyalty
- Discovery Sets, eligibility rules and purchase-linked credit towards full-size bottles.
- Single customer identity, one cart/checkout and single order and invoice pipeline.
- Loyalty ledgers require idempotent earning/redemption, reversals for cancellations and refunds, expiration and fraud protection.
- Final reward values depend on contribution margin and tax/legal review.

## Milestone 4: Customer experience
- Mobile navigation, detailed search and note-based filters, favorites, fragrance quiz with verified attributes, order history and localized German/Russian content.
- Consent-controlled marketing notifications and DSGVO-compliant privacy controls.

## Release gates
- German cosmetic decanting legal review (including responsible person, product labelling, traceability, trademark issues).
- Packaging and fragrance shipping restrictions, statutory customer rights, accessibility and invoice/tax configuration.
- Staging preview, automated tests, real-device checks and explicit owner go-live approval.
