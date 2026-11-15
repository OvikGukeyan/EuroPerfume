ALTER TABLE public."Product" ADD COLUMN "bottleParentId" integer
  REFERENCES public."Product"(id) ON DELETE RESTRICT ON UPDATE CASCADE;
CREATE UNIQUE INDEX "Product_bottleParentId_volume_key" ON public."Product" ("bottleParentId", volume);
ALTER TABLE public."Product" ADD CONSTRAINT "valid_linked_bottle"
  CHECK ("bottleParentId" IS NULL OR
    ("bottleParentId" <> id AND volume IS NOT NULL AND volume ~ '^[1-9][0-9]{0,3}$'
     AND price > 0 AND "stockPieces" >= 0));

CREATE FUNCTION public.bottle_piece_availability() RETURNS trigger
LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
BEGIN
  NEW.available := NEW."stockPieces" > 0;
  RETURN NEW;
END $$;
REVOKE ALL ON FUNCTION public.bottle_piece_availability() FROM PUBLIC;
CREATE TRIGGER bottle_piece_availability BEFORE INSERT OR UPDATE OF "stockPieces" ON public."Product"
  FOR EACH ROW WHEN (NEW."bottleParentId" IS NOT NULL) EXECUTE FUNCTION public.bottle_piece_availability();

-- An order line reserves pieces, including when an administrator changes its quantity.
-- A Storno or change of order status alone does not put physical goods back on sale.
CREATE FUNCTION public.bottle_order_quantity() RETURNS trigger
LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
DECLARE sku integer; delta integer;
BEGIN
  IF TG_OP='DELETE' THEN
    sku:=OLD."productId"; delta:=-OLD.quantity;
  ELSE
    sku:=NEW."productId";
    IF TG_OP='UPDATE' AND OLD."productId" <> sku THEN
      IF EXISTS (SELECT 1 FROM public."Product" WHERE id IN (sku,OLD."productId") AND "bottleParentId" IS NOT NULL) THEN
        RAISE EXCEPTION 'Change a bottle SKU using separate order lines';
      END IF;
    END IF;
    IF TG_OP='INSERT' THEN delta:=NEW.quantity; ELSE delta:=NEW.quantity-OLD.quantity; END IF;
  END IF;
  IF NOT EXISTS(SELECT 1 FROM public."Product" WHERE id=sku AND "bottleParentId" IS NOT NULL) THEN RETURN NULL; END IF;
  IF TG_OP <> 'DELETE' AND (NEW.quantity <= 0 OR NEW."variationId" IS NOT NULL) THEN RAISE EXCEPTION 'Invalid bottle quantity or variant'; END IF;
  IF delta <> 0 THEN
    UPDATE public."Product" SET "stockPieces"="stockPieces"-delta, "updatedAt"=clock_timestamp()
      WHERE id=sku AND (delta < 0 OR (available AND "stockPieces" >= delta));
    IF NOT FOUND THEN RAISE EXCEPTION 'Not enough full bottles in stock'; END IF;
  END IF;
  RETURN NULL;
END $$;
REVOKE ALL ON FUNCTION public.bottle_order_quantity() FROM PUBLIC;
CREATE TRIGGER bottle_order_quantity AFTER INSERT OR UPDATE OF quantity,"productId","variationId" OR DELETE
  ON public."OrderItem" FOR EACH ROW EXECUTE FUNCTION public.bottle_order_quantity();
