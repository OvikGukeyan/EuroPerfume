# Pallas Athene threshold gift

This dedicated reservation pool is separate from regular sales stock and from the existing gift product bundles. Ten physical 5 ml gifts must be set aside by the owner before activating. The first ten successful qualifying checkout submissions receive one 5 ml decant; the order remains a normal new enquiry. A guest can qualify. Eligibility is one per normalized checkout email; a verified signed-in email is also used where available. This does not guarantee that distinct emails belong to distinct people. Cancellations do not recycle slots.

Qualification uses merchandise after coupons and loyalty, before delivery, at €100 inclusive. The server locks a campaign row, checks prior buyer keys, advances one slot, persists the order promotion snapshot and links the claim in a single checkout transaction. Requests that saw a gift but lose eligibility get a retry choice before the order is submitted. The invoice uses a separate 0,00 € snapshot row. Existing standard stock is not altered.

Deployment order: apply the checked-in Supabase migration, which creates private RLS tables and a disabled row; deploy; verify public status is off, then activate only after readiness and merchant confirmation. Use `UPDATE public."PallasGiftCampaign" SET enabled = true, "startsAt" = now() WHERE id = 'pallas-athene-threshold-2026' AND enabled = false AND "lastSlot" = 0`. Disable by setting enabled false without changing ledger or order snapshots. No expiry unless agreed.

Tests: npm run test:promotions. For production smoke testing use read-only status endpoint and cart display only, without submitting a live order or sending emails.
