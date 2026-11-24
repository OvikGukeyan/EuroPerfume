ALTER TABLE public."Product" ADD COLUMN "allowBackorder" boolean NOT NULL DEFAULT false;
COMMENT ON COLUMN public."Product"."allowBackorder" IS 'Allows orders before procurement; stockPieces remains owned inventory. Availability and final price are confirmed manually.';
