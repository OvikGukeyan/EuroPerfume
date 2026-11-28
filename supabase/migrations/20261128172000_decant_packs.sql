BEGIN;
SET LOCAL lock_timeout = '3s';
ALTER TABLE public."CartItem" ADD COLUMN IF NOT EXISTS "packMl" integer;
ALTER TABLE public."OrderItem" ADD COLUMN IF NOT EXISTS "packMl" integer;
COMMIT;
