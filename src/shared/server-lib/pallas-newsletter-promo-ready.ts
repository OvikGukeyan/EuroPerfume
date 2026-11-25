import "server-only";
import {prisma} from "@/prisma/prisma-client";

// A campaign can never advertise an unavailable gift. An absent migration,
// disabled promotion, exhausted allotment or unavailable product fails closed.
export async function pallasNewsletterPromoReady(){
  try {
    const [state] = await prisma.$queryRaw<{ready:boolean}[]>`
      SELECT EXISTS (
        SELECT 1
        FROM public."PallasGiftCampaign" AS g
        JOIN public."Product" AS p ON p.id = g."productId"
        WHERE g.id = 'pallas-athene-threshold-2026'
          AND g."productId" = 295 AND p.available
          AND g.enabled AND g."startsAt" <= now()
          AND (g."endsAt" IS NULL OR g."endsAt" > now())
          AND g."lastSlot" < g.slots
      ) AS ready`;
    return state?.ready === true;
  } catch {
    return false;
  }
}
