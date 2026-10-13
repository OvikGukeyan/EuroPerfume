CREATE TABLE IF NOT EXISTS public."WithdrawalRequest" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "fullName" text NOT NULL CHECK (char_length("fullName") BETWEEN 1 AND 150),
  "email" text NOT NULL CHECK (char_length("email") BETWEEN 3 AND 254),
  "contractIdentifier" text NOT NULL CHECK (char_length("contractIdentifier") BETWEEN 1 AND 1000),
  "locale" text NOT NULL CHECK ("locale" IN ('de', 'ru')),
  "receivedAt" timestamptz(3) NOT NULL DEFAULT now(),
  "confirmationSentAt" timestamptz(3),
  "confirmationEmailId" text,
  "receiptText" text NOT NULL CHECK (char_length("receiptText") > 0)
);
ALTER TABLE public."WithdrawalRequest" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public."WithdrawalRequest" FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public."WithdrawalRequest" TO service_role;
COMMENT ON TABLE public."WithdrawalRequest" IS 'Server-only statutory withdrawal declarations and original confirmations; no browser-role access.';
