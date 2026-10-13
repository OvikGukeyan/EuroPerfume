-- Nullable, additive fields; historical records and existing PDFs are untouched.
ALTER TABLE public."Order" ADD COLUMN IF NOT EXISTS "pricingSnapshot" jsonb;
ALTER TABLE public."Invoice" ADD COLUMN IF NOT EXISTS "taxSnapshot" jsonb;
ALTER TABLE public."Invoice" ADD COLUMN IF NOT EXISTS "supplyDate" date;
COMMENT ON COLUMN public."Order"."pricingSnapshot" IS 'Order-time gross prices, shipping, discount and quoted tax policy; amounts in integer EUR cents.';
COMMENT ON COLUMN public."Invoice"."taxSnapshot" IS 'Invoice tax split based on actual supply date and saved order prices; amounts in integer EUR cents.';
COMMENT ON COLUMN public."Invoice"."supplyDate" IS 'Actual date of supply confirmed when issuing the invoice.';
