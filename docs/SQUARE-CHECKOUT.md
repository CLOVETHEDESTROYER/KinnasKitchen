# Integrated Square checkout

The local store now supports Square Sandbox checkout for the full bag. Product pages add a selected heat level and quantity to the same bag as the homepage. The server accepts only known website product/heat choices and integer quantities from 1 to 99, maps them to Square catalog variations, and uses Square's prices and attached taxes. It adds one $9.99 Delivery fee per order and asks Square to collect the shipping address.

The selected Sandbox catalog has 7.625% additive Sales Tax on all four products and nine heat variations. Delivery is not taxed in this test setup. Square stock counts are not used as a website purchase limit, per the user's replenishment policy; stock counts and live inventory have not been modified. Archived/unavailable catalog variations and invalid mappings must still be resolved rather than creating arbitrary line items.

## Private configuration

The Worker reads server secrets from `.dev.vars` locally and host runtime bindings in deployment. Local `.env.local` is available for setup scripts. Both are ignored by Git and must never be included in archives. None of these values use a browser-exposed prefix.

- `SQUARE_ENVIRONMENT`: `sandbox` or `production`.
- `SQUARE_ACCESS_TOKEN`: credential for that environment and account.
- `SQUARE_LOCATION_ID`: matching account location.
- `SQUARE_CATALOG_MAPPING`: JSON keyed by website product ID, then exact heat label, with Square variation ID values. Current Sandbox IDs are in ignored `work/square-sandbox-catalog.json`.
- `SQUARE_LIVE_ENABLED`: production requires the literal value `true`, in addition to a complete mapping. Sandbox needs no launch flag.

Without complete configuration the API refuses checkout and the storefront offers the existing contact/link fallback. Sandbox UI explicitly labels checkout as a test. Do not use Sandbox IDs in a live mapping. A static payment link remains an alternative flow and does not receive bag contents.

## Requests and payment verification

`POST /api/checkout` validates same-origin requests and bag data, checks mapped catalog variations, and calls Square CreatePaymentLink using the bag's stable attempt UUID as an idempotency key. Browser prices are ignored. Retry an unchanged bag with the same attempt ID; Square rejects changes to a reused key. A changed bag gets a new attempt ID. The returned destination is checked against Square's environment-specific HTTPS hosts. The bag is retained while checkout opens or fails.

`/checkout/return` does not trust redirect parameters as proof of payment. A short reference signed on the server identifies the checkout. `GET /api/checkout/status` verifies its HMAC and seven-day lifetime, finds the matching Square order at the configured location, and checks completed payments against the order total. It returns only payment status, never customer details. The page briefly retries pending status. The bag is cleared only after verified payment and only if its contents still match the saved checkout snapshot.

For launch, production order IDs should be recorded durably and completed/refunded payments reconciled with verified Square webhooks. The current status lookup examines the newest 100 matching-date orders, sufficient for this local low-volume test, and is not a production order-management database. If checkout is abandoned, the bag remains available. If payment cannot be confirmed, the page directs the buyer to their receipt/contact support rather than claiming success.

## Verification: November 27, 2026

A browser test added two Medium Mango Salsa jars ($16) and one Hot Laos Chile Paste ($12) from their product pages. The homepage bag retained both options and quantities. Square's preview showed $28.00 subtotal, $2.14 sales tax, $9.99 delivery and $40.13 total. Square's Sandbox Testing Panel simulated a successful payment; the website independently verified it and displayed “Test payment confirmed.” No real card or customer payment was used. Returning to the bag showed it empty only after payment verification.

Additional checks passed: same-bag retries reused the same payment link; invalid product/heat selections and zero/fractional/over-limit quantities were rejected; cross-origin checkout and forged payment-status signatures were rejected. A Sandbox variation with stock tracking enabled and an IN_STOCK count of zero could still enter checkout without changing its count. A tampered browser price of $0.01 was ignored: Square charged a $12 catalog base, $0.92 item tax and $9.99 delivery for a $22.91 test checkout. No payment was simulated for this additional zero-stock checkout. TypeScript and production build passed, and an exact-token scan of public browser artifacts found no credential.

## Production handoff

Live checkout remains disabled. Before launch: map the real catalog/heat IDs and account location; confirm the $9.99 eligible destinations/quantity policy, dispatch times, tax rate/sourcing and delivery tax treatment; verify order routing, notifications, stock deduction, refunds and fulfillment. The approved flat test tax setup is not a universal destination tax determination. Verify the zero-stock ordering policy on actual production catalog settings. Add hosting request limits and durable payment/webhook reconciliation. Credentials must stay in the client's account and host secret store.
