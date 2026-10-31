# Protected invoice documents

Issued original PDFs are stored in InvoiceDocument as bytes plus SHA-256, with invoice ID, archive timestamp and (for migrated documents) the original source URL. Existing invoice rows, numbers, dates and PDF bytes are preserved. Archive time proves import time only, not historic integrity before migration.

New issuance locks the order row and atomically allocates the number, inserts the invoice and stores the PDF. Repeat requests return the original route. All year/date values derive from the same timestamp in Europe/Berlin. No Storage overwrite is used. Database triggers reject UPDATE/DELETE on Invoice and InvoiceDocument. RLS and revoked browser grants prevent direct Data API access.

GET /api/invoices/{orderId} rechecks the current user's database role; only ADMIN or the linked order owner may download. It checks the PDF hash and serves private/no-store responses. Guest access is not provided by a guessable/public URL. Historical public links cease working after storage sealing; use the dashboard instead.

Migration copies and verifies each existing file before sealing the old bucket. A short-lived, token-hash-protected maintenance endpoint is removed after completion. No real invoices are issued for testing. The invoice bucket must also be set private through the Storage API or dashboard. A proposed temporary privileged Edge Function was rejected by automatic security review and was NOT deployed. The bucket-public setting remains a separate cutover step requiring verification. A restrictive Storage policy prevents browser roles reading/writing/deleting legacy invoice objects; other buckets are unchanged.

This is application access/integrity protection, not a standalone certified archive or independently verified long-term backup. Continue preserving existing local/cloud copies. Independent retention-locked backup, restore drills and a business-specific Verfahrensdokumentation remain separate work. Do not delete archive tables during rollback. Do not roll back to public Storage downloads after sealing.

Migration verified 2026-10-31: 745/745 invoices, 63,102,466 bytes; zero SHA-256 mismatches on database re-read. Original invoice identifiers and timestamps were not modified. Anonymous protected download returned 403; original record and PDF immutability were exercised in rolled-back transactions. Public flag on legacy invoice bucket still needs to be disabled in Supabase dashboard; anonymous Storage RLS access is already denied. No privileged Edge Function was deployed.
