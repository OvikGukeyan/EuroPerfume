-- Legacy accounts lacked historic registration consent records; never fabricate AGB acceptance.
ALTER TABLE public."AccountConsent" ALTER COLUMN "acceptedAt" DROP NOT NULL;
CREATE TABLE public."LegacyNewsletterReward" (
  "userId" INTEGER PRIMARY KEY REFERENCES public."User"(id) ON DELETE RESTRICT,
  "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "code" TEXT UNIQUE,
  "grantedAt" TIMESTAMP(3),
  "expiresAt" TIMESTAMP(3),
  "emailClaimedAt" TIMESTAMP(3),
  "emailSentAt" TIMESTAMP(3),
  CONSTRAINT "LegacyNewsletterReward_grant_consistency" CHECK (
    ("code" IS NULL AND "grantedAt" IS NULL AND "expiresAt" IS NULL) OR
    ("code" IS NOT NULL AND "grantedAt" IS NOT NULL AND "expiresAt" IS NOT NULL AND "expiresAt" > "grantedAt")
  )
);
ALTER TABLE public."LegacyNewsletterReward" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public."LegacyNewsletterReward" FROM anon,authenticated;
CREATE INDEX "LegacyNewsletterReward_grantedAt_idx" ON public."LegacyNewsletterReward"("grantedAt");
