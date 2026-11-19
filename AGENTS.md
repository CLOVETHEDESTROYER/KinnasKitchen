# Kinna’s Kitchen website

This is the HyperLabs design concept, not a production ecommerce store. Read `README.md` and `COMMERCE-LAUNCH.md` before changing shopping behavior or deployment.

## Scope and facts

- Preserve the original catalog images, copy and family identity. Use the existing warm raster imagery and current hero; do not introduce SVG graphics into the authored interface.
- The client has confirmed Square use and reports only a few online orders per month. Exact sales figures and account settings have not been reviewed. Evaluate a simple Square checkout first; the payment integration is not connected yet.
- The owners will provide a Square payment link. `SQUARE_PAYMENT_LINK` configures the external destination; it does not transfer this site's bag. Verify the link's exact products, variants, quantities and fulfillment before launch. Do not restore a Wix checkout fallback.
- Keyword research is saved outside the repository in `../internal/Kinnas_Kitchen_SEO_Research_2026-11-18.md`, including the November 19 broader US shortlist and source records in `../internal/seo-evidence/`. Consult it when SEO work resumes; advertiser competition is not organic difficulty.
- Checkout must remain clearly unavailable until a real integration is configured and verified. Keep the explanation in customer language; do not restore development/demo banners or fake checkout completion screens. Do not collect card details in the prototype or imply that an order was placed.
- Confirm ingredients, allergens, vegan claims, heat variants, founding dates and current retailers with the owners. Never invent reviews, sales results or search rankings.
- The separate audit and internal business notes belong outside this repository. Do not copy credentials, customer/order exports or local tool state into source control.

## Development

- Use Node >=22.13; `.nvmrc` and CI use Node 24.
- `npm run install:ci` installs the locked dependencies. `npm run dev` starts the local preview. `npm run build` validates the production build; `npm start` previews it locally.
- Run checks appropriate to changes. Do not install new dependencies or run broad unrelated refactors for copy or styling changes.
- Keep `package-lock.json` aligned with `package.json`. Preserve the Sites build integration, Worker entry point and hosting manifest identity.
- Updates to GitHub do not publish a Site. Use the existing Site identity and its supported publishing workflow only when deployment is requested.
- The original starter/runtime documentation is retained in `docs/SITES-RUNTIME.md`.
