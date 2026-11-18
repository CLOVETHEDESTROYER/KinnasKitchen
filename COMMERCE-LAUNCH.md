# Kinna’s Kitchen: commerce handover

This is a private design and shopping-flow demo. It does not create orders, charge cards, calculate shipping/tax or check live inventory. Bag data is stored only in the visitor’s browser. There is no simulated checkout or fake order confirmation. Orders link to the existing shop during review, with an explicit notice that bag contents do not transfer.

## Confirmed client update and proposed integration

The client has confirmed **Square** use and says the website receives only **a few orders per month**. This is a qualitative client update, not a verified order count or analytics report. Square account settings, online processing rates and inventory setup have not been reviewed. The current Wix bill, fulfillment needs and ongoing editing/support needs still need confirmation.

Start by evaluating the custom storefront with Square-hosted checkout, keeping the low reported online volume in mind. Simple purchase links can suit individual jars or fixed bundles. Keeping a multi-product bag needs a server-side connection for the correct catalog items, heat variants, quantities and trusted prices, with delivery/tax configuration and verified payment status. Test how market sales and online inventory interact; do not assume synchronization. A thank-you redirect alone is not proof of payment.

Square is the confirmed provider, but its account is not connected to this project. Prefer the simplest setup that meets the owners’ purchasing and fulfillment needs; WordPress/WooCommerce or another store layer would need a specific reason. Confirm provider pricing and the client’s actual account terms before quoting operating costs.

Official implementation references:

- [Square-hosted checkout](https://developer.squareup.com/docs/checkout-api)
- [Square order checkout](https://developer.squareup.com/docs/checkout-api/square-order-checkout)
- [Square Payment Links](https://squareup.com/us/en/payment-links)

## What the owners would maintain

- Approved product descriptions, prices, stock, heat options, jar sizes and images.
- Orders, packing/shipping, fulfillment and refunds in the agreed store/payment tools.
- Family story, recipes, retailers, market schedule and contact details.

Name the person responsible for software/integration updates, checkout checks, backups and recovery. Hosting, content changes and ongoing search work need clearly agreed scopes. The client AI editing service discussed during planning has not been built; it is not a feature of this repository.

## Required before accepting real orders

1. Review the confirmed Square account’s online checkout, catalog and processing-rate settings. Confirm the Wix bill, desired editing workflow, fulfillment and support needs; review actual order history only if needed. Do not request credentials in source files.
2. Approve the story, wordmark, images, copy and product names. Resolve the 2003 versus 2013 founding dates; the concept avoids asserting a year.
3. Confirm ingredients, allergens, nutrition/label facts, storage, shelf life and dietary claims for each product. Preserve the distinction between original paste and vegan paste.
4. Confirm SKU/heat combinations, pricing, inventory workflow, package weights/dimensions, shipping destinations/rates, pickup, refunds and customer service policies.
5. Review the implemented product, recipe, cooking guide and New Mexico shopping URLs with the owners. Check titles, descriptions and visible facts. Confirm the final domain and use the search launch checklist in `docs/SEO.md`. Keep visible product facts and checkout data consistent.
6. Connect the selected provider using owner-controlled accounts and server-side secrets. Connect the local bag to a verified checkout, or replace it with the agreed simpler purchase flow. Set `ORDERING_URL` to the owner-approved Square destination; test its full URL before enabling production indexing. The Wix shop fallback is disabled in production search mode to prevent links looping back through the migration redirects. Confirm delivery, tax, notifications and stock behavior; keep payment credentials out of browser code.
7. Preserve domain/email and Google search ownership. Map old product/recipe URLs to relevant new pages, retaining existing URLs where practical. Review both kinnaskitchen.com and linked kinnas.net before any domain change.
8. Check mobile shopping, accessibility and speed on the final deployment. Test product/heat choices, quantities, shipping/pickup, tax, payment status, confirmation, fulfillment, refund and stock changes using the provider’s supported test flow.
9. Set up agreed search and purchase measurement without putting customer/payment data in source control. No traffic, ranking or sales improvement has been measured for this concept.
10. Keep Wix available until checkout and redirects pass verification. Monitor orders, broken links and search visibility after launch. Provide the agreed source files, hosting instructions and recovery/handover information.

## Assets and editable source

- `app/data/storefront.json`: customer-facing product descriptions, recipes and heat options; `app/data/catalog.json` preserves the original source.
- `public/assets/original/`: all collected original photos, source copy and asset manifest, plus original social icons for preservation. Unrelated Wix social links are intentionally not used in the design.
- `public/assets/*.webp`: smaller delivery copies. The product photos and labels remain unaltered beyond delivery encoding/resizing.
- `public/assets/handcrafted-background.webp`: generated decorative background; not represented as a real photograph of the family or production kitchen.
- `app/components/storefront.tsx`, `app/shop/`, `app/recipes/`, `app/find-us/`, `app/guides/` and `app/globals.css`: storefront and content pages.

No SVG graphics are used in the authored interface. Existing original photographs are used throughout the homepage; original stock food images are shown as general food imagery, not claimed to document the family’s Lao kitchen. The wordmark was text on the original site; the design retains the name and original jar-label artwork.
