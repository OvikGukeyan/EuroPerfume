export function orderFulfillmentBlock({
 cancelled, hasInvoice, clubEligible, awardsEnabled, hasPricing,
}: {
 cancelled: boolean;
 hasInvoice: boolean;
 clubEligible: boolean;
 awardsEnabled: boolean;
 hasPricing: boolean;
}) {
 if (!clubEligible) return "ACCOUNT_NOT_VERIFIED_AT_ORDER";
 if (cancelled) return "ORDER_CANCELLED";
 if (!hasInvoice) return "INVOICE_REQUIRED_BEFORE_LOYALTY_AWARD";
 if (!awardsEnabled) return "BONUS_AWARD_NOT_LIVE";
 if (!hasPricing) return "PRICING_SNAPSHOT_REQUIRED";
 return null;
}
