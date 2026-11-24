# Catalogue import regression checks

For every catalogue release, preserve existing pricing, promotions, checkout/request behaviour, orders and product IDs.

- Brand filters remain alphabetical in RU and DE, both collapsed and expanded, including new brands.
- A fragrance and concentration appear once; volumes and formats remain inside its card. Editions and testers are distinct.
- Every fragrance tile's displayed amount, volume and price per litre describe the same variant. Price per litre = effective variant price / volume in ml * 1000; promotions use the effective price. Never use the largest bottle's volume for a cheaper smaller bottle.
- General catalogue decant prices are labelled; bottle-only minimum prices exclude decants. Format/volume changes update the amount, unit price, image and SKU together.
- Cart quantity units are `шт.` in RU and `Stk.` in DE, with a space after the quantity. Decant quantities retain ml units. Do not change stored quantity semantics.
- Check desktop and mobile: filters, search, exact selected variant in cart, quantity update and removal. Zero-stock supplier bottles remain requestable. Do not submit a test order.
- Run the fragrance-variant and ordering regression tests and TypeScript validation before release, then verify the deployed pages. Record any unresolved data/photo issue rather than substituting a different bottle.
