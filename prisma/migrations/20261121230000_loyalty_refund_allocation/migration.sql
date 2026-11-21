-- Additive loyalty refund allocation; supports partial returns without guessing excluded products or shipping.
CREATE TABLE IF NOT EXISTS "LoyaltyRefund"(
 "correctionId" TEXT PRIMARY KEY REFERENCES "InvoiceCorrection"(id) ON DELETE RESTRICT,
 "orderId" INTEGER NOT NULL REFERENCES "Order"(id) ON DELETE RESTRICT,
 "eligibleCents" INTEGER NOT NULL CHECK ("eligibleCents">=0),
 "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "LoyaltyRefund_orderId_idx" ON "LoyaltyRefund"("orderId");
ALTER TABLE "LoyaltyRefund" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON "LoyaltyRefund" FROM anon,authenticated;
-- Refunded earnings already spent are a negative point debt, repaid by future eligible earnings.
ALTER TABLE "LoyaltyWallet" DROP CONSTRAINT IF EXISTS "LoyaltyWallet_balance_check";
ALTER TABLE "LoyaltyWallet" ADD CONSTRAINT "LoyaltyWallet_balance_check" CHECK ("balancePoints">=-100000000 AND "balancePoints"<=100000000);
