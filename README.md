# Kinna’s

HyperLabs website for Kinna’s handcrafted Lao chile pastes, sauces and mango salsa. The current design and retailer updates from `origin/main` are preserved alongside the integrated cart.

**Hosting: Vercel / Next.js 16 / Node 24.** The earlier Vinext/Cloudflare/Sites starter is retired. Vercel project: `hyper-labs-ai/kinnaskitchen`, current staging domain `kinnaskitchen.vercel.app`. The final domain moves to `kinnaskitchen.com` after launch verification.

**Payments: live Square checkout is enabled at https://kinnaskitchen.com.** The owner deferred the real purchase/refund test. The bag supports mixed jars, heat choices and quantities. Customers explicitly choose free local pickup arranged after ordering or $9.99 delivery. Square supplies checkout prices and configured item tax; pickup has no delivery fee. Stock counts remain tracked without being used as a website purchasing limit.

The production preparation adds private server credentials, durable checkout references/rate limits through Upstash Redis, signed Square payment/refund webhooks, direct signed-receipt status lookup, automatic display-price refresh and safe preview indexing. The webhook/storage paths have automated tests, and live catalog mapping, hosted Redis, signed notifications and unpaid production checkout handoffs have been verified. The owner still needs to complete the deferred real purchase/refund test.

## Develop locally

```sh
npm ci
# Add private Sandbox settings to .env.local. See .env.example.
npm run dev
```

Local address: `http://127.0.0.1:5173`. Next.js reads `.env.local`; `.dev.vars` is no longer used. Local Sandbox can use temporary in-memory order records. Vercel deployments always require durable Redis to enable checkout. Keep Preview and Production credentials/databases separate.

```sh
npm test
npm run typecheck
npm run build
npm start
```

## Vercel and live Square setup

Follow [the Vercel launch handoff](docs/VERCEL-LAUNCH.md) and [Square checkout details](docs/SQUARE-CHECKOUT.md). No secret values are committed. `scripts/prepare-square-production.mjs` reads the live catalog without changing it and saves an ignored mapping review. No production checkout activates without the explicit live switch and complete configuration.

Original photography is preserved in `public/assets/original/`; selected retouch masters are in `design-explorations/`. Read [brand asset notes](docs/BRAND-ASSETS.md) for the small-label approval requirement. Preserve the latest family story, Lao heritage, retailer list and raster assets.
