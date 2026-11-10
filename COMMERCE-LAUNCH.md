# Kinna’s Kitchen: commerce recommendation

This is a private design and shopping-flow demo. It does not create orders, charge cards, calculate shipping/tax, or check live inventory. Bag data is stored only in the visitor’s browser. The checkout deliberately needs no personal or payment information.

## Recommended live solution: Shopify Basic with a native custom theme

Use this visual design as the specification for a Shopify Online Store theme. Keep product catalog, images, variants, inventory, orders, discounts, payments, shipping and fulfillment in Shopify. The owners should edit products in Shopify and page sections in the theme editor. Avoid a separate headless storefront for this four-product catalog unless there is a demonstrated need; a native theme reduces the number of systems and integrations the owners must maintain.

The current Sites/React concept is not a drop-in Shopify theme. Production work includes translating its sections into Shopify Liquid and theme sections, wiring the actual product and variant records, replacing the demo bag with the platform’s cart, and using Shopify’s hosted checkout. No credentials or payment details are needed for reviewing this design.

For growers markets, evaluate Shopify POS against their actual market workflow and hardware. Confirm staff access and subscription needs before choosing a plan. Do not assume POS hardware or advanced retail features are included.

Shopify’s official cost guide published November 2026 lists Basic at US$29/month billed annually. Treat that as a planning reference, not a quote. Add payment processing, domain renewal, any paid apps, implementation and agreed maintenance. Confirm current checkout/renewal pricing and the billing term before purchase. A move is not automatically cheaper than Wix; compare actual annual totals. No revenue lift is promised.

Sources checked November 10, 2026:
- https://www.shopify.com/blog/ecommerce-website-cost
- https://help.shopify.com/en/manual/products
- https://help.shopify.com/en/manual/online-store
- https://help.shopify.com/en/manual/fulfillment/managing-orders
- https://help.shopify.com/en/manual/online-sales-channels

## What the owners maintain

- Products: descriptions, price, stock, heat variants, jar size and photographs.
- Orders: payment status, pack/ship status, fulfillment and refunds.
- Content: approved family story, recipes, retailers, market schedule and contact details.
- Marketing: approved email campaigns and discounts, with clear consent.

Developer maintenance covers the custom theme, accessibility, integration health, performance and any changes outside supported theme sections. Put the scope and recurring fee in writing.

## Required before accepting real orders

1. Owners approve the story, wordmark treatment, photo use, copy and product names. Resolve 2003 versus 2013 founding dates; this concept avoids asserting a year.
2. Confirm current ingredients, allergen statements, nutrition/label information, storage, shelf life and dietary claims for each product. Preserve the distinction between original paste and vegan paste.
3. Confirm SKU and heat combinations, current pricing and stock, weights, package dimensions, shipping destinations/rates, refund policy and customer service commitments.
4. Set up an owner-controlled Shopify account, payout account, payment provider, tax configuration, shipping and policy pages; use collaboration access for implementation.
5. Import products and approved content, recreate theme sections, map old URLs and relevant domain redirects, preserve email/DNS and Search Console ownership.
6. Verify desktop/mobile accessibility and speed, perform test-mode orders covering variants, shipping, tax, confirmation, fulfillment and refund, and reconcile with actual inventory.
7. Configure analytics and consent as appropriate; record purchase, cart and checkout events without exposing payment or customer data.
8. Launch under their domain only after review. Keep Wix until orders and redirects are verified; monitor errors, search traffic and sales after launch.

## Assets and editable source

- `app/data/catalog.json`: reviewed product source, descriptions, recipes and heat options.
- `public/assets/original/`: all collected original photos, source copy and asset manifest, plus original social icons for preservation. Unrelated Wix social links are intentionally not used in the design.
- `public/assets/*.webp`: smaller delivery copies. The product photos and labels remain unaltered beyond delivery encoding/resizing.
- `public/assets/handcrafted-background.webp`: generated decorative background; not represented as a real photograph of the family or production kitchen.
- `app/page.tsx` and `app/globals.css`: the design and functional demo.

No SVG graphics are used in the authored interface. Existing original photographs are used throughout the homepage; original stock food images are shown as general food imagery, not claimed to document the family’s Lao kitchen. The wordmark was text on the original site; the design retains the name and original jar-label artwork.
