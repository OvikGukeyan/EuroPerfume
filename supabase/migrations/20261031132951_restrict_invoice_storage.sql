-- Restrictive policy overrides the pre-existing permissive ALL policy for invoices only.
-- Public bucket delivery bypasses SELECT RLS; bucket must ALSO be set private via Storage API/dashboard.
CREATE POLICY invoice_storage_server_only ON storage.objects AS RESTRICTIVE
FOR ALL TO anon, authenticated
USING (bucket_id <> 'invoice') WITH CHECK (bucket_id <> 'invoice');
