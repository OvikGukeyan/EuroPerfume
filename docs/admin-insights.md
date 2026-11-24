# Admin shop insights

Open Shop Analysis in the existing protected dashboard. The 7/30/90 rolling-day CRM and order reports use Vercel shop records only. Newsletter delivery statuses are server send states, not inbox-placement receipts; account marketing dates are recorded state, not an immutable event log. Orders excluded from the analytics are in CENCELLED state; order amounts are not cash receipts. Guest orders remain separate. No new browser tracking, stores, or direct analytics/customer joins.

## Optional website traffic report

The storefront's existing GA tag is consent-gated (measurement ID G-YWQF5HZNPJ). That tag alone does not authorize reading its reporting property. Use the numeric GA4 property ID for this stream, not its measurement ID. Enable Google Analytics Data API for a dedicated Google Cloud project, grant the service account Viewer access to the specific Shopify-excluded Vercel GA4 property, and configure on Vercel: `GA4_PROPERTY_ID` and sensitive server-only `GA4_SERVICE_ACCOUNT_JSON`. Do not reuse the Google OAuth sign-in credentials or paste keys into chat/source control. `GA4_STOREFRONT_HOST` defaults to the existing Vercel storefront hostname, and can be set to the exact replacement storefront host. Do not set it to the separate Shopify site. Set Google Analytics reporting timezone to Europe/Berlin if appropriate; the panel displays the actual report timezone, and Google determines historical coverage and any thresholds. Only aggregated session starts for finished days are retrieved.

Test: `node --test tests/admin-insights.test.mjs` on Node 22+. Verify both localized insight pages require an existing admin session and traffic remains explicitly unconfigured without credentials.
