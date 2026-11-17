CREATE TABLE public."AccountConsent" (
"userId" INTEGER PRIMARY KEY REFERENCES public."User"("id") ON DELETE CASCADE,
"locale" TEXT NOT NULL, "termsVersion" TEXT NOT NULL, "privacyVersion" TEXT NOT NULL,
"termsText" TEXT NOT NULL, "privacyNotice" TEXT NOT NULL, "marketingText" TEXT NOT NULL,
"acceptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
"marketingRequestedAt" TIMESTAMP(3), "marketingConfirmedAt" TIMESTAMP(3), "marketingWithdrawnAt" TIMESTAMP(3),
"confirmationTokenHash" TEXT UNIQUE, "confirmationExpiresAt" TIMESTAMP(3),
"confirmationSentAt" TIMESTAMP(3), "confirmationEmailId" TEXT,
"unsubscribeTokenHash" TEXT UNIQUE
);
ALTER TABLE public."AccountConsent" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public."AccountConsent" FROM anon, authenticated;
