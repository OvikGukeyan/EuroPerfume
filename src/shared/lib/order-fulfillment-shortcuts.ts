export function orderFulfillmentBlock({
 cancelled, hasInvoice, clubEligible, awardsEnabled, hasPricing,
}: {
 cancelled: boolean;
 hasInvoice: boolean;
 clubEligible: boolean;
 awardsEnabled: boolean;
 hasPricing: boolean;
}) {
 if (cancelled) return "ORDER_CANCELLED";
 if (!hasInvoice) return "INVOICE_REQUIRED_BEFORE_LOYALTY_AWARD";
 if (clubEligible && !awardsEnabled) return "BONUS_AWARD_NOT_LIVE";
 if (clubEligible && !hasPricing) return "PRICING_SNAPSHOT_REQUIRED";
 return null;
}
