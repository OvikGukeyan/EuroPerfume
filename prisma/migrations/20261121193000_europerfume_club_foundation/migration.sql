-- EURO PERFUME CLUB: staged only; do not run on the production Supabase project without approval.
-- Existing PromoCode, Order, User and historical invoices stay unchanged.
CREATE TABLE IF NOT EXISTS "CouponPolicy" (
  "code" TEXT PRIMARY KEY,
  "kind" TEXT NOT NULL DEFAULT 'PER_ACCOUNT',
  "active" BOOLEAN NOT NULL DEFAULT TRUE,
  "validDaysAfterVerification" INTEGER,
  "perUserLimit" INTEGER NOT NULL DEFAULT 1,
  "globalLimit" INTEGER,
  "usedCount" INTEGER NOT NULL DEFAULT 0,
  "epoch" INTEGER NOT NULL DEFAULT 1,
  "startsAt" TIMESTAMP(3),
  "endsAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CouponPolicy_limits_check" CHECK ("perUserLimit">=1 AND ("globalLimit" IS NULL OR "globalLimit">=1) AND "usedCount">=0 AND "epoch">=1),
  CONSTRAINT "CouponPolicy_kind_check" CHECK ("kind" IN ('WELCOME','PER_ACCOUNT','UNLIMITED'))
);
CREATE TABLE IF NOT EXISTS "CouponRedemption" (
 "id" TEXT PRIMARY KEY,
 "code" TEXT NOT NULL,
 "epoch" INTEGER NOT NULL,
 "userId" INTEGER NOT NULL,
 "orderId" INTEGER NOT NULL UNIQUE,
 "discountCents" INTEGER NOT NULL,
 "redeemedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT "CouponRedemption_code_fkey" FOREIGN KEY ("code") REFERENCES "CouponPolicy"("code") ON DELETE RESTRICT ON UPDATE CASCADE,
 CONSTRAINT "CouponRedemption_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
 CONSTRAINT "CouponRedemption_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
 CONSTRAINT "CouponRedemption_discount_check" CHECK ("discountCents">0)
);
CREATE INDEX IF NOT EXISTS "CouponRedemption_code_epoch_userId_idx" ON "CouponRedemption"("code","epoch","userId");
CREATE TABLE IF NOT EXISTS "LoyaltyWallet" (
 "userId" INTEGER PRIMARY KEY,
 "balancePoints" INTEGER NOT NULL DEFAULT 0,
 "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT "LoyaltyWallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
 CONSTRAINT "LoyaltyWallet_balance_check" CHECK ("balancePoints">=0)
);
CREATE TABLE IF NOT EXISTS "LoyaltyEntry" (
 "id" TEXT PRIMARY KEY,
 "userId" INTEGER NOT NULL,
 "orderId" INTEGER,
 "points" INTEGER NOT NULL,
 "kind" TEXT NOT NULL,
 "idempotencyKey" TEXT NOT NULL UNIQUE,
 "note" TEXT,
 "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT "LoyaltyEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
 CONSTRAINT "LoyaltyEntry_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
 CONSTRAINT "LoyaltyEntry_points_check" CHECK ("points"<>0)
);
CREATE INDEX IF NOT EXISTS "LoyaltyEntry_userId_createdAt_idx" ON "LoyaltyEntry"("userId","createdAt");
CREATE TABLE IF NOT EXISTS "OrderFulfillment" (
 "orderId" INTEGER PRIMARY KEY,
 "paymentConfirmedAt" TIMESTAMP(3),
 "shippedConfirmedAt" TIMESTAMP(3),
 "loyaltyAwardedAt" TIMESTAMP(3),
 "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT "OrderFulfillment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
-- Seed only if WELCOME10 does not already exist; never overwrite existing campaign settings.
INSERT INTO "PromoCode" ("id","code","discount","isActive","disposable","expiresAt","createdAt","updatedAt")
SELECT gen_random_uuid()::text,'WELCOME10',10,TRUE,FALSE,NULL,NOW(),NOW()
WHERE NOT EXISTS(SELECT 1 FROM "PromoCode" WHERE upper("code")='WELCOME10');
INSERT INTO "CouponPolicy" ("code","kind","active","validDaysAfterVerification","perUserLimit","createdAt","updatedAt")
SELECT "code",'WELCOME',TRUE,60,1,NOW(),NOW() FROM "PromoCode"
WHERE upper("code")='WELCOME10' AND "discount"=10
ON CONFLICT ("code") DO NOTHING;
-- All new tables are accessed only from authenticated Next.js server routes, not the public Data API.
ALTER TABLE "CouponPolicy" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CouponRedemption" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LoyaltyWallet" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LoyaltyEntry" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OrderFulfillment" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE "CouponPolicy","CouponRedemption","LoyaltyWallet","LoyaltyEntry","OrderFulfillment" FROM anon,authenticated;

CREATE TABLE IF NOT EXISTS "WelcomeNotice"(
 "userId" INTEGER PRIMARY KEY,
 "claimAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 "sentAt" TIMESTAMP(3),
 CONSTRAINT "WelcomeNotice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
ALTER TABLE "WelcomeNotice" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE "WelcomeNotice" FROM anon,authenticated;
