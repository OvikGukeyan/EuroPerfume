# Timed product of the day
Admin: /ru/day-offer (also /de/day-offer), ADMIN only.
One exact product ID/format, fixed 10% of its complete selling price including atomizer.
Each product stores one start/end pair in timestamptz. Other product IDs can be scheduled for subsequent, nonoverlapping intervals. Existing regular prices remain unchanged.
Date inputs use Europe/Berlin, reject nonexistent/ambiguous DST times. End is exclusive.
Activation requires a merchant check of the lowest 30-day price; historical prices before this feature cannot be inferred.
Start/end evaluation is per request, not a cron. Client clocks refresh at known boundaries. Server is authoritative at submission, with a quoted-total conflict response.
Sale price is never multiplied by another day discount; better existing sales win. Day offers do not combine with order promo codes.
Full bottles are separate products, not automatically discounted with their decant parent.
A submitted enquiry freezes prices and day-offer metadata in pricingSnapshot. Manual Rechnung uses that snapshot; admin revisions preserve existing line pricing.
Physical inventory is checked by the merchant after the enquiry; displayed availability governs offer selection.
Banners RU/DE desktop/mobile must be uploaded first, then their URLs and the schedule are saved in one transaction. Public slides bucket or /assets/day-offers/ on the Vercel site is accepted. A generated banner can be committed at that static path.
No product has been activated merely by installing this feature.
Tests: node --experimental-strip-types scripts/test-day-offer.mjs
