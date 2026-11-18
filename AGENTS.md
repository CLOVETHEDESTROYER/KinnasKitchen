# Kinna’s Kitchen website

This is the HyperLabs design concept, not a production ecommerce store. Read `README.md` and `COMMERCE-LAUNCH.md` before changing shopping behavior or deployment.

## Scope and facts

- Preserve the original catalog images, copy and family identity. Use the existing warm raster imagery and current hero; do not introduce SVG graphics into the authored interface.
- Square use is unconfirmed. Ask which provider the owners use before selecting or connecting payments.
- Demo checkout must remain clearly labeled until a real integration is configured and verified. Do not collect card details in the prototype or imply that an order was placed.
- Confirm ingredients, allergens, vegan claims, heat variants, founding dates and current retailers with the owners. Never invent reviews, sales results or search rankings.
- The separate audit and internal business notes belong outside this repository. Do not copy credentials, customer/order exports or local tool state into source control.

## Development

- Use Node >=22.13; `.nvmrc` and CI use Node 24.
- `npm run install:ci` installs the locked dependencies. `npm run dev` starts the local preview. `npm run build` validates the production build; `npm start` previews it locally.
- Run checks appropriate to changes. Do not install new dependencies or run broad unrelated refactors for copy or styling changes.
- Keep `package-lock.json` aligned with `package.json`. Preserve the Sites build integration, Worker entry point and hosting manifest identity.
- Updates to GitHub do not publish a Site. Use the existing Site identity and its supported publishing workflow only when deployment is requested.
- The original starter/runtime documentation is retained in `docs/SITES-RUNTIME.md`.
