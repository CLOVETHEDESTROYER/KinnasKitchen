# Kinna’s Kitchen

HyperLabs website concept for Kinna’s Kitchen, with a warm handcrafted design inspired by the family’s Lao recipes and New Mexico roots. The source includes original catalog photography, product copy and recipes, plus the selected direction for the generated hero scene.

**Status: design and shopping-flow demo.** The cart is stored in the visitor’s browser. The bag does not charge a card, create an order, calculate shipping/tax or verify inventory. Customer copy directs orders to the existing shop during review; the fake checkout and completion screens have been removed. The client has confirmed that they use Square and receive only a few online orders per month. Square checkout remains to be connected; account settings and exact sales figures have not been reviewed.

## Run locally

Use Node.js 22.13 or newer. `.nvmrc` selects Node 24. If your default Node is older, switch versions first.

```sh
nvm use
npm run install:ci
npm run dev
```

The default local address is `http://localhost:5173`. To use the port used during the design review:

```sh
npm run dev -- --port 5178
```

No application credentials are needed for local review. `.env.example` documents production search and ordering settings; real local environment files are ignored.

## Build and preview

```sh
npm run build
npm start
```

Use the local URL printed by the preview command. The production build contains a Cloudflare Worker in `dist/server/` and client assets in `dist/client/`; build output is ignored by Git.

The app uses React, TypeScript and Vinext (Next.js-compatible routing), with Vite and Cloudflare Workers tooling. See [the runtime guide](docs/SITES-RUNTIME.md) for installation, local state and deployment conventions.

## Where to make changes

| Path | Purpose |
| --- | --- |
| `app/page.tsx`, `app/components/storefront.tsx` | Homepage, product quick view and local bag |
| `app/shop/`, `app/recipes/`, `app/find-us/`, `app/guides/` | Readable product, recipe, local shopping and cooking guide pages |
| `app/lib/seo.ts`, `app/sitemap.ts`, `app/robots.ts` | Page metadata and environment-controlled indexing |
| `app/globals.css`, `app/fonts.css` | Layout, colors, typography and responsive styles |
| `app/data/storefront.json` | Customer-facing product copy, prices, heat choices, story and recipes |
| `app/data/catalog.json` | Preserved original catalog source |
| `docs/SEO.md` | Search configuration, redirects and launch checks |
| `public/assets/original/` | Original photos, source copy and asset manifest |
| `public/assets/*.webp` | Delivery images, including the current `hero-products-v4.webp` |
| `design-explorations/` | Hero generation prompts and prior image versions |
| `COMMERCE-LAUNCH.md` | Decisions and checks still needed for real ecommerce |
| `.openai/hosting.json` | Identity/configuration for the existing Sites preview |

Keep the original product photos and labels. The hero is AI-composited and should not be described as a documentary photograph. The prototype does not provide a client AI editor.

## GitHub and builds

This folder is the website repository. The separate `kinna-audit/` and workspace `internal/` folders contain reports and business planning and are outside this repository.

The `Build` GitHub Actions workflow installs the locked dependencies and builds pull requests and pushes to `main`. It has read-only repository permissions and does not deploy. Start with a private repository; no public open-source license has been added to this client project.

To upload this prepared local repository using GitHub CLI, run from this folder after signing into the intended GitHub account:

```sh
gh repo create kinnas-kitchen --private --source=. --remote=origin --push
```

Alternatively, create an empty private repository on GitHub, add its URL as `origin`, and push `main`. Do not initialize the remote with a second README or unrelated history.

Pushing to GitHub does not update the hosted preview. `.openai/hosting.json` retains the existing Site identity; use the Sites publishing workflow to update that same preview. Another hosting provider needs an appropriate Worker/runtime deployment setup, not just a copy of generated HTML.

## Before launch

Confirm the Square account setup, online processing rate, product labels, shipping and tax rules, and who will maintain the store. Review the new product/recipe pages and current labels, connect the agreed payment flow and complete an order/refund test before replacing Wix. [The launch notes](COMMERCE-LAUNCH.md) track that work. Keep secrets, customer records and payment details outside source control.
