CREATE TABLE public."CustomerAddress" (
"id" TEXT PRIMARY KEY,
"userId" INTEGER NOT NULL REFERENCES public."User"("id") ON DELETE CASCADE,
"fullName" TEXT NOT NULL, "street" TEXT NOT NULL, "houseNumber" TEXT NOT NULL,
"city" TEXT NOT NULL, "postalCode" TEXT NOT NULL, "country" TEXT NOT NULL,
"phone" TEXT NOT NULL DEFAULT '', "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "CustomerAddress_userId_idx" ON public."CustomerAddress"("userId");
ALTER TABLE public."CustomerAddress" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public."CustomerAddress" FROM anon, authenticated;
