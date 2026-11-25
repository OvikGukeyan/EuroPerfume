CREATE TABLE public."PallasGiftCampaign" (
  id text PRIMARY KEY,
  "promotionId" text NOT NULL UNIQUE REFERENCES public."Promotion"(id) ON DELETE RESTRICT,
  "productId" integer NOT NULL REFERENCES public."Product"(id) ON DELETE RESTRICT,
  slots integer NOT NULL DEFAULT 10 CHECK (slots=10),
  "lastSlot" integer NOT NULL DEFAULT 0 CHECK ("lastSlot">=0 AND "lastSlot"<=slots),
  enabled boolean NOT NULL DEFAULT false,
  "startsAt" timestamptz NOT NULL DEFAULT now(),
  "endsAt" timestamptz
);
CREATE TABLE public."PallasGiftClaim" (
  "campaignId" text NOT NULL REFERENCES public."PallasGiftCampaign"(id) ON DELETE RESTRICT,
  slot integer NOT NULL CHECK (slot BETWEEN 1 AND 10),
  "buyerKey" text NOT NULL CHECK (length("buyerKey")=64),
  "accountKey" text CHECK (length("accountKey")=64),
  "orderId" integer NOT NULL UNIQUE REFERENCES public."Order"(id) ON DELETE RESTRICT,
  quantity integer NOT NULL CHECK (quantity=1),
  "giftMl" integer NOT NULL CHECK ("giftMl"=5),
  PRIMARY KEY ("campaignId",slot),
  UNIQUE ("campaignId","buyerKey"),
  UNIQUE ("campaignId","accountKey")
);
ALTER TABLE public."PallasGiftCampaign" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."PallasGiftClaim" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public."PallasGiftCampaign",public."PallasGiftClaim" FROM PUBLIC, anon, authenticated;
-- The dormant Promotion record lets established order/receipt/invoice readers
-- consume the snapshot without making it a generic cart promotion.
DO $$
DECLARE pallas_id int;
BEGIN
  SELECT p.id INTO STRICT pallas_id
  FROM public."Product" p
  JOIN public."ProductGroup" g ON g.id=p."productGroupId"
  WHERE lower(btrim(p.name))='argos pallas athene'
    AND p."bottleParentId" IS NULL AND g."onTap" IS TRUE;
  INSERT INTO public."Promotion" (id,slug,"titleRu","titleDe",active,"requiredMl","giftMl","giftProductId","updatedAt")
  VALUES ('9c217e51-febd-4ef7-912f-e71b2c556609','pallas-athene-threshold-2026','Подарок к заказу','Geschenk zur Bestellung',false,0,5,pallas_id,now());
  INSERT INTO public."PallasGiftCampaign" (id,"promotionId","productId")
  VALUES ('pallas-athene-threshold-2026','9c217e51-febd-4ef7-912f-e71b2c556609',pallas_id);
END $$;
