# Vercel launch handoff

Project: **hyper-labs-ai/kinnaskitchen**. Repository: **CLOVETHEDESTROYER/KinnasKitchen**. Current staging alias: **https://kinnaskitchen.vercel.app**. Final domain: **https://kinnaskitchen.com**, after verification. This preparation branch must be previewed before merging into `main`, which Vercel uses for its Production deployment.

## What is prepared

- Standard Next.js/Node runtime, private environment variables, Vercel configuration and normal npm install/build commands. No Cloudflare runtime dependency.
- Existing upstream design, local photos, fonts, family story and retailers merged with the current bag and Square integration.
- Required fulfillment choice: free local pickup (arranged directly) or $9.99 delivery. Square handles the payment form, prices, configured product taxes and shipping address for delivery.
- Durable checkout references and payment state via Upstash Redis REST; private HMAC receipts; direct order lookup; retry idempotency and server-side checkout rate limiting.
- Signed Square payment/refund webhook validation, merchant checks, duplicate processing, monotonic reconciliation and retry responses when persistence fails.
- Current Square prices read by the homepage/shop/product pages; static approved price fallback if a display read fails. Checkout remains authoritative. Existing `/product-page/...` redirects and `/about`/`/contact` redirects are prepared.
- Previews remain noindex. API and payment return pages are excluded from robots. No marketing or purchase analytics has been enabled automatically.

## Account setup still required

### 1. Connect order storage in Vercel

Open this project's **Storage**, connect an **Upstash Redis** database and obtain its REST URL/token. Use a separate database for live and Sandbox. Existing account/database reuse is fine; any provider plan or terms should be selected by the owner. No paid plan has been purchased by this work.

The connected Vercel integration supplies `KV_REST_API_URL` and `KV_REST_API_TOKEN`; the application accepts these directly. Use the read/write token, never `KV_REST_API_READ_ONLY_TOKEN`. No SDK installation is needed. Alternatively, a matching pair can use these private server environment names:

| Variable | Purpose |
| --- | --- |
| `UPSTASH_REDIS_REST_URL` | HTTPS REST endpoint for the matching database |
| `UPSTASH_REDIS_REST_TOKEN` | Private read/write REST credential |
| `CHECKOUT_SIGNING_SECRET` | Random secret of at least 32 characters; use a separate value per environment |

Order records contain Square IDs, fulfillment choice, amounts and payment state, not names, addresses, card data or raw webhook bodies. Order state retention is one year; receipt lookup seven days; event deduplication 30 days; rate-limit identifiers about 70 seconds. These records supplement Square, which remains the primary order system.

### 2. Prepare the real Square mapping without enabling payments

In Square Developer Console → Kinna’s Website → **Production → Credentials**, copy the production token directly into ignored `work/production-square.env`. Add the real production Location ID from **Locations**. Do not put secrets in chat, screenshots or Git. The file is not loaded by Next.js, so it cannot switch local checkout to live accidentally.

Run using Node 24:

```sh
node --env-file=work/production-square.env scripts/prepare-square-production.mjs
```

This reads locations, merchant, items, variants and tax objects. It never changes inventory, prices or item settings. It saves `work/square-production-review.json` and a proposed `work/square-production-mapping.json`. Confirm the reported merchant/location and review every item/heat match. The original 6 oz item's Hot mapping needs owner confirmation because its Square item name has no explicit heat label. The $5 2 oz item is preserved in Square but is not offered by the current website.

Current approved product base prices: original 6 oz $12; vegan 6 oz $12; tamarind 12 oz $12; mango salsa 12 oz $8. Inventory must remain tracked; do not alter real counts to force online availability. Confirm real zero-stock and manually sold-out behavior on the mapped items before launch.

### 3. Configure matching Vercel environments

Add variables from `.env.example` to the project's Vercel **Environment Variables**. Keep Sandbox variables in Preview/Development. To test the stable staging alias while it is Vercel's Production deployment, use Sandbox credentials there until ready to launch. Never put live credentials in Preview or share environment secrets with browser code.

Required live values: `SQUARE_ENVIRONMENT=production`, `SQUARE_ACCESS_TOKEN`, `SQUARE_LOCATION_ID`, `SQUARE_MERCHANT_ID`, `SQUARE_CATALOG_MAPPING`, `CHECKOUT_SIGNING_SECRET`, Redis REST values, webhook URL/key and `SITE_URL`. Keep `SQUARE_LIVE_ENABLED=false` until verified. Production checkout refuses to activate if any required connection is absent; Preview deployments refuse live checkout even if the switch is set.

While staging: `SITE_URL=https://kinnaskitchen.vercel.app`, `SITE_INDEXABLE=false`. When moving the domain: `SITE_URL=https://kinnaskitchen.com`, update webhook URL/receipt origin accordingly and enable indexing only after redirects/domain are ready. `CHECKOUT_ORIGIN` is optional when origin equals `SITE_URL`; if set, update it at cutover too.

Vercel build defaults are encoded in `vercel.json`: Next.js, Node 24 from `package.json`, `npm ci`, `npm run build`; no custom output directory. Redeploy after changing environment variables. If the dashboard has an old `npm run build:vercel` override, the repository configuration replaces it; verify settings on the preview deployment.

### 4. Register Square webhooks once the endpoint is deployed

In the matching Square application environment, add a webhook subscription for the exact public URL:

`https://kinnaskitchen.vercel.app/api/square/webhook`

Subscribe to `payment.created`, `payment.updated`, `refund.created` and `refund.updated`. Save its private signature key as `SQUARE_WEBHOOK_SIGNATURE_KEY` and the exact registered URL as `SQUARE_WEBHOOK_URL`, then redeploy. Sandbox and live subscriptions/keys are separate. The endpoint must be reachable by Square; deployment protection may need the provider-supported automation bypass or the public staging alias. Do not expose the project's settings or credentials.

Confirm a signed notification reaches the endpoint, saves an order state and gets 200. Invalid signatures/merchants must return 403; backend persistence failure must return 503 so Square retries. Stored status can be inspected through the private database; no public order administration screen is provided.

### 5. Launch checks and owner decisions

Confirm eligible delivery destinations/quantity limits, dispatch time, pickup coordination, production tax and delivery-tax treatment, refund/damage policy and privacy information. The flat 7.625% Sandbox tax is an approved test setup, not an independently verified destination-tax determination. Final label/photo review also remains with the owners.

On staging, test mixed products, heat choices, quantities, current prices, delivery versus pickup, failed/abandoned payments, repeat requests, payment confirmation after closing the browser, duplicate webhooks and refunds. Verify Square order notifications, fulfillment routing, stock changes and refund receipts. A real live payment/refund is performed by the owner after live settings are ready.

Then promote the verified branch, set the final domain/DNS and webhook URL/key, and enable indexing. Preserve existing email DNS records. Keep the old Wix site until checkout, redirects and email pass verification. No domain has been switched and no live payment has been taken by this preparation.

## Verification and limitations

Verified locally on November 27, 2026: Next.js production build, TypeScript check, nine automated payment/security tests, seven public routes, pickup and delivery handoffs, identical retry reuse, changed-bag rejection, origin rejection, and absence of the private Sandbox token from browser assets. A browser-driven Square Sandbox test payment returned to the site and displayed TEST PAYMENT CONFIRMED. No real payment was taken. A read-only production catalog check on November 27, 2026 authenticated the active merchant/location and matched all nine website options. All paste/sauce choices are $12 and all salsa choices are $8, and all nine choices carry the enabled 7.625% Sales Tax. The original paste has no explicit heat label in Square and remains mapped to the website’s sole Hot choice. Three location overrides report sold_out: original 6 oz paste and Mild/Hot mango salsa; real hosted purchasing behavior still needs verification without changing tracking/counts. The merchant ID and proposed production mapping are saved only in ignored work/. An actual hosted Redis connection, deployed webhook and production payment/refund remain unverified until private account setup is completed. Local Sandbox memory records disappear on restart and are never used for live/hosted order tracking. Checkout rate limiting uses the trusted Vercel client-IP header; keep Vercel firewall/bot protections enabled as an additional layer.
