# Kinna’s website

This project targets **Vercel with standard Next.js 16 and Node 24**. Read `README.md`, `docs/VERCEL-LAUNCH.md` and `docs/SQUARE-CHECKOUT.md` before changing checkout or deployment. The earlier ChatGPT Sites/Cloudflare runtime is retired; do not restore its build scripts or require that hosting workflow.

## Scope and facts

- Describe the family heritage as Lao and production as New Mexico, the US state. Preserve the latest upstream design, family story, retailer list, typography and all source photography. No authored SVG graphics. The selected hero is `hero-products-v4.webp`.
- The brand mark is Kinna’s, with no appended Kitchen word. Keep the shared raster wordmark and responsive story signature. Retouch masters and label-review notes are in `docs/BRAND-ASSETS.md`.
- Square use is confirmed. The client reports a few online orders per month, with no verified account analytics. The full bag, product heat options, quantities, 7.625% test tax, optional $9.99 delivery and free local pickup have been tested in Sandbox. No fulfillment option is preselected. Pickup arrangements are confirmed directly after ordering.
- Keep Square inventory tracking and counts. The user specifically wants continued ordering despite stale/zero counts. Do not inflate stock or disable tracking. Still reject invalid, archived or explicitly unsellable catalog selections.
- Production is gated by separate live credentials/mapping, private receipt signing, durable Redis, webhook settings, merchant/location, explicit `SQUARE_LIVE_ENABLED=true` and a non-preview environment. Never enable live payments solely because a token exists. Never use Sandbox IDs with production credentials.
- Square supplies checkout prices and catalog taxes. Product display prices refresh from Square when integration is enabled, with approved static fallback on display-read failure. No browser-supplied price is trusted. Tax and fulfillment production review remains in the launch checklist.
- Payment confirmation requires verified Square payment data. Webhooks require a valid signature, expected merchant, durable status persistence, duplicate handling and retryable failures. Browser redirects are not proof of payment. Do not store card details or customer exports in this repository.
- Credentials belong only in ignored local files and Vercel’s private environment variables. Never print tokens, use browser-exposed prefixes or commit runtime files. `work/production-square.env` is the ignored manual handoff file; it is not automatically loaded by Next.js.
- Preserve SEO research in `../internal/Kinnas_Kitchen_SEO_Research_2026-11-18.md`; advertiser competition is not organic difficulty. Keep staging noindex until domain/redirect readiness. The final domain will be `kinnaskitchen.com`; the current Vercel project is `hyper-labs-ai/kinnaskitchen`.

## Development and deployment

- `npm ci`, `npm run dev` (port 5173), `npm test`, `npm run typecheck`, `npm run build`, `npm start`.
- Keep the lockfile aligned. No new dependencies or broad refactors for small copy changes.
- Vercel builds the repository root as Next.js using `vercel.json`. No `dist/` output directory or Worker bindings. `.vercelignore` excludes secrets, local artifacts, retouch masters and historical Sites metadata.
- Push a preparation branch for preview review. Do not merge to the production branch, switch domains or enable live payments until the launch checklist is completed or the user specifically authorizes the action.
- The original Sites documentation is retained only as historical reference in `docs/SITES-RUNTIME.md`.
