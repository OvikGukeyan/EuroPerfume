# Manual invoice corrections

Scope: existing Vercel shop, admin order detail next to the existing invoice download. No automatic issue, email, bank payment, stock adjustment or order cancellation. No age cutoff. Old invoice dates and original PDFs remain unchanged; corrections use the actual issue date in Europe/Berlin.

## Admin workflow

1. Open the existing Rechnung and the Stornorechnung panel.
2. Verify original customer/address and total against that PDF. Historical order data is only a suggested starting point. For legacy invoices without a tax snapshot, explicitly confirm §19 treatment from the original PDF. Unknown or post-transition legacy tax requires separate review.
3. Choose full remaining cancellation or a partial reduction. Partial descriptions must identify original goods, volume/quantity, and net-of-discount refund amounts; add shipping as a separate row when applicable. This is manual amount entry, not automatic per-item return entitlement validation.
4. Preview an unnumbered PDF draft. Check it, then explicitly confirm issue. Only the final issue action reserves an EP-ST-YYYY-NNNNNN number and stores the PDF.
5. Download the issued PDF, send it to the customer separately, and attach it with the original invoice and bank proof in the accounting application.
6. After making a bank transfer outside this shop, record its date/reference and confirm the whole correction amount was paid. The first version records one full settlement per correction; split bank payments and edits of recorded payments require a later append-only adjustment workflow. Do not guess data or mark an unpaid transfer as settled.

## Integrity and access

An invoice row lock serializes corrections. Request UUID plus payload hash provides retry idempotency. Preview hashes become stale after another correction. Cumulative corrections cannot exceed the verified original total. VAT comes from the original snapshot; cumulative allocation reverses original VAT exactly at final settlement. Legacy §19 invoices retain their exemption after 2027.

First correction freezes the verified original baseline; later corrections reuse it. All issued PDFs and snapshots are stored atomically in PostgreSQL. Downloads require a fresh database ADMIN role check and are private/no-store. RLS and revoked anon/authenticated grants block the Data API. No policies is intentional server-only access. Triggers reject updates/deletes of issued corrections and refund records. Invoice deletion is restricted once a correction exists.

Migration: supabase/migrations/20261030142639_invoice_corrections.sql. New Prisma models reflect the additive tables; the implementation uses parameterized raw SQL for explicit row locks and atomic document inserts. Never use db push to remove these records.

## Validation

Five calculation/validation tests cover §19, original VAT rounding across partial corrections, excess/invalid amounts, decimal input and required verification/idempotency fields. Next production build completed. Synthetic PDF visually inspected. Live database tests ran inside a rolled-back transaction: duplicate prevention and immutable correction/refund records passed. Data API privileges and RLS inspected; no issued test documents, refunds or numbers remained.

Authenticated browser end-to-end testing still required before describing the feature as fully verified. Do not issue a real accounting document merely to test it. An admin may safely load old invoices and generate drafts without reserving a number or sending anything.

## Rollback

Revert application commit to hide new controls. Keep additive database tables and all issued documents; never drop ledger data to roll back UI. No original invoice or order data was migrated or rewritten.
