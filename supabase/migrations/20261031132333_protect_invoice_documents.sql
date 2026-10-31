CREATE TABLE public."InvoiceDocument" (
 "invoiceId" integer PRIMARY KEY REFERENCES public."Invoice"(id) ON DELETE RESTRICT,
 pdf bytea NOT NULL CHECK (octet_length(pdf)>0),
 sha256 text NOT NULL CHECK (sha256 ~ '^[a-f0-9]{64}$'),
 "sourceUrl" text,
 "archivedAt" timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public."InvoiceDocument" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public."InvoiceDocument" FROM anon, authenticated;
CREATE TRIGGER invoice_document_immutable BEFORE UPDATE OR DELETE ON public."InvoiceDocument"
FOR EACH ROW EXECUTE FUNCTION public.reject_invoice_ledger_mutation();
CREATE TRIGGER invoice_original_immutable BEFORE UPDATE OR DELETE ON public."Invoice"
FOR EACH ROW EXECUTE FUNCTION public.reject_invoice_ledger_mutation();
