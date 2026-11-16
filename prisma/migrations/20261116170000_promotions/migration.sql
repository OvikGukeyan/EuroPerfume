-- Apply to a staging database first. Do not run on the production shared Supabase database automatically.
CREATE TABLE IF NOT EXISTS "Promotion" (
  "id" TEXT PRIMARY KEY,
  "slug" TEXT NOT NULL UNIQUE,
  "titleRu" TEXT NOT NULL,
  "titleDe" TEXT NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT FALSE,
  "startsAt" TIMESTAMP(3),
  "endsAt" TIMESTAMP(3),
  "priority" INTEGER NOT NULL DEFAULT 0,
  "requiredMl" INTEGER NOT NULL DEFAULT 5,
  "giftMl" INTEGER NOT NULL DEFAULT 2,
  "heroImage" TEXT,
  "productIds" INTEGER[] NOT NULL DEFAULT ARRAY[]::INTEGER[],
  "giftProductId" INTEGER,
  "allowMultiple" BOOLEAN NOT NULL DEFAULT FALSE,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS "CartPromotion" (
  "id" TEXT PRIMARY KEY,
  "cartId" INTEGER NOT NULL REFERENCES "Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "promotionId" TEXT NOT NULL REFERENCES "Promotion"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CartPromotion_cartId_promotionId_key" UNIQUE ("cartId","promotionId")
);
CREATE TABLE IF NOT EXISTS "OrderPromotion" (
  "id" TEXT PRIMARY KEY,
  "orderId" INTEGER NOT NULL REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "promotionId" TEXT NOT NULL REFERENCES "Promotion"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  "snapshot" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "OrderPromotion_orderId_promotionId_key" UNIQUE ("orderId","promotionId")
);
