-- Additive, admin-server-only ledger. No existing invoice or order is rewritten.
CREATE TABLE public."InvoiceCorrectionCounter" (
  year integer PRIMARY KEY, value integer NOT NULL CHECK (value > 0)
);
CREATE TABLE public."InvoiceCorrection" (
  id text PRIMARY KEY,
  number text NOT NULL UNIQUE,
  "invoiceId" integer NOT NULL REFERENCES public."Invoice"(id) ON DELETE RESTRICT,
  "grossCents" integer NOT NULL CHECK ("grossCents" > 0),
  "vatCents" integer NOT NULL CHECK ("vatCents" >= 0 AND "vatCents" <= "grossCents"),
  "issuedAt" timestamptz NOT NULL,
  snapshot jsonb NOT NULL,
  pdf bytea NOT NULL,
  "requestHash" text NOT NULL,
  "actorId" integer NOT NULL,
  CHECK (octet_length(pdf) > 0)
);
CREATE INDEX "InvoiceCorrection_invoiceId_idx" ON public."InvoiceCorrection" ("invoiceId");
CREATE TABLE public."InvoiceRefund" (
  "correctionId" text PRIMARY KEY REFERENCES public."InvoiceCorrection"(id) ON DELETE RESTRICT,
  "paidAt" text NOT NULL CHECK ("paidAt" ~ '^\d{4}-\d{2}-\d{2}$'),
  reference text NOT NULL,
  "actorId" integer NOT NULL,
  "recordedAt" timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public."InvoiceCorrectionCounter" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."InvoiceCorrection" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."InvoiceRefund" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public."InvoiceCorrectionCounter", public."InvoiceCorrection", public."InvoiceRefund" FROM anon, authenticated;
CREATE FUNCTION public.reject_invoice_ledger_mutation() RETURNS trigger
LANGUAGE plpgsql SET search_path = '' AS $$
BEGIN
  RAISE EXCEPTION 'Issued invoice corrections and refund records are append-only';
END;
$$;
REVOKE ALL ON FUNCTION public.reject_invoice_ledger_mutation() FROM PUBLIC;
CREATE TRIGGER invoice_correction_immutable BEFORE UPDATE OR DELETE ON public."InvoiceCorrection"
FOR EACH ROW EXECUTE FUNCTION public.reject_invoice_ledger_mutation();
CREATE TRIGGER invoice_refund_immutable BEFORE UPDATE OR DELETE ON public."InvoiceRefund"
FOR EACH ROW EXECUTE FUNCTION public.reject_invoice_ledger_mutation();
