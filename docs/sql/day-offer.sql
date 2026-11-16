ALTER TABLE public."Product"
  ADD COLUMN IF NOT EXISTS "dayOfferStartsAt" timestamptz(3),
  ADD COLUMN IF NOT EXISTS "dayOfferEndsAt" timestamptz(3),
  ADD COLUMN IF NOT EXISTS "dayOfferReferenceCheckedAt" timestamptz(3);
ALTER TABLE public."Slide"
  ADD COLUMN IF NOT EXISTS "dayOfferProductId" integer,
  ADD COLUMN IF NOT EXISTS "visibleFrom" timestamptz(3),
  ADD COLUMN IF NOT EXISTS "visibleUntil" timestamptz(3);
ALTER TABLE public."Product" ADD CONSTRAINT product_day_offer_window
  CHECK (("dayOfferStartsAt" IS NULL AND "dayOfferEndsAt" IS NULL) OR
         ("dayOfferStartsAt" IS NOT NULL AND "dayOfferEndsAt" IS NOT NULL AND "dayOfferEndsAt" > "dayOfferStartsAt"));
ALTER TABLE public."Slide" ADD CONSTRAINT slide_day_offer_product_fk
  FOREIGN KEY ("dayOfferProductId") REFERENCES public."Product"(id) ON DELETE CASCADE;
