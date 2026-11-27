# Square checkout implementation

Runtime: Next.js Node functions on Vercel. See [Vercel launch handoff](VERCEL-LAUNCH.md) for account setup and remaining owner decisions. The historical payment-link plan is in `docs/SQUARE.md`; integrated checkout supersedes it when fully configured.

## Shopping flow

Products/heat choices/quantities form a mixed bag. Homepage, shop and product display prices refresh from Square using server requests; approved static prices are the display-only fallback. Prices/tax totals submitted by a browser are ignored. At checkout, the server validates known product IDs and heat labels, merges duplicate lines, permits integer quantities 1–99 per choice, checks mapped catalog availability at the location, and creates a Square order/hosted link.

Customers explicitly select $9.99 delivery or free local pickup. Delivery collects the shipping address in Square and adds one non-taxed $9.99 shipping fee in the current test configuration. Pickup creates a proposed PICKUP fulfillment with coordination instructions; Square's internal ASAP schedule does not promise immediate readiness. The owner arranges the location/time directly and marks readiness. Sandbox catalog tax is 7.625% on all products. Neither zero nor stale stock counts are treated as a website purchasing limit. Real counts remain tracked.

The original current catalog is four products/nine heat options. Production maps existing Square entries, including the separate heat-specific items. No duplicate live catalog is created automatically. The 2 oz original paste is not added without a merchandising decision.

## Server configuration and safeguards

Use `.env.local` locally and Vercel private environment values when hosted. `.dev.vars` is retired. Production requires its own account/location/merchant/catalog mapping, durable Redis, signing secret, webhook URL/key, `SITE_URL` and explicit `SQUARE_LIVE_ENABLED=true`. Preview forbids live checkout. Incomplete configuration falls back to contact or verified fixed-link ordering; it never fabricates a completed order.

`POST /api/checkout` checks the browser origin against the configured live origin, validates input, enforces a per-minute server checkout limit (10 per client-IP hash) and claims a durable attempt record. Reusing a UUID with changed bag/fulfillment returns 409. An unchanged retry reuses the existing Square link. The reference's creation day is persisted, so retries across midnight do not alter its Square payload. The server persists the direct Square order ID before returning the destination; Square's own idempotency lets an unacknowledged request be recovered safely. No credentials or raw IPs reach browser code.

## Receipts and events

The return page sends only a signed reference to `/api/checkout/status`. Its private HMAC expires after seven days. The server looks up the direct order ID in Redis, verifies location/reference and reads current Square payments. It never searches the latest 100 orders or treats a redirect as payment proof. Refund states are exposed without customer information. The bag clears only after paid status and only if its contents still match the saved checkout snapshot.

`POST /api/square/webhook` validates Square's HMAC over the exact configured notification URL and raw request body, validates merchant identity, then handles payment/refund events. It reads current Square payment/order data, writes only minimal website-order state, and records the processed event ID after successful persistence. Repeated events are idempotent; an atomic Redis revision check prevents an older payment snapshot overwriting a newer state. No event triggers shipping automatically. Storage/API failure returns a retryable response instead of acknowledging a lost event.

Square is the authoritative source of the full order, buyer details, fulfillment workflow and receipts. Redis supplements it with checkout correlation, minimal payment status and rate limits. Local Sandbox may use memory to exercise the UI; hosted/live code fails closed without Redis. Tests simulate Redis REST and Square responses; a real hosted webhook/database still needs verification.

## Tests completed during preparation

Earlier Sandbox flow: two Medium Mango Salsa jars and one Hot original paste transferred correctly; subtotal $28, tax $2.14, delivery $9.99, total $40.13. Square's simulation completed and the website independently confirmed payment. Pickup was verified with no fee ($12.92 for a $12 jar plus tax), versus delivery $22.91. A tracked-zero-stock Sandbox variation could enter checkout; a browser price of $0.01 did not replace Square's $12 price. Invalid quantities, heat/product choices, cross-origin requests and forged receipt signatures were rejected. No real payment was taken.

This Vercel branch adds automated signature/origin, input, configuration-gating, durable-write, event retry/deduplication/refund and stale-event tests. Final Next.js runtime smoke results are recorded in the task handoff. Production launch is blocked on the checklist in `VERCEL-LAUNCH.md`.
