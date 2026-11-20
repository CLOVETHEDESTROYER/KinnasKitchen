# Square payment-link handoff

The client confirms Square use and will supply a payment link. No owner-approved URL has been supplied yet. The site is ready for design and shopping-flow review; live payment readiness still depends on that link and its actual checkout setup.

## Add the real link

1. Get the exact payment or store URL from the owners, along with what it sells: one jar, a fixed bundle, or a Square store where customers choose products.
2. In an ignored local environment file (or the production host's runtime environment), set `SQUARE_PAYMENT_LINK` to that URL. Restart the server after changing environment settings. No Square API credential is needed just to link to a hosted payment page.
3. The existing `ORDERING_URL` setting remains a legacy alias. `SQUARE_PAYMENT_LINK` takes precedence. The URL must be HTTPS on `square.link`, `squareup.com` or its subdomains, or a `*.square.site` host, without embedded credentials or a nonstandard port. If the owner supplies a custom domain, verify that exact destination before extending the accepted host list.
4. Without a valid link, the customer receives ordering help by email. There is no redirect to Wix, fake checkout confirmation, or order creation.

## What is connected

The ordering path is product card → product details → Square checkout (when configured). Product-specific links take precedence on their matching product pages. The global link remains a general ordering destination. Without a valid link, the site offers email ordering help.

The previous local bag, heat/quantity selectors and Add to bag flow have been removed. Customers review or choose options in Square according to the actual checkout configuration. Do not append unverified item, amount or quantity parameters to payment URLs. No card details or local orders are collected here.

## Verify before accepting orders

- The destination belongs to Kinna's Kitchen and is an active sell-item/store checkout, rather than a generic collect-payment, donation or subscription link.
- Products, jar sizes, heat variants, quantities and final prices match the owners' approved catalog. A generic link shared across all four product pages must actually let customers buy the desired jars; otherwise map appropriate destinations first.
- Confirm shipping destinations, shipping costs, tax, pickup (if offered), return/refund terms and the contact details shown to customers.
- Check the external handoff on a phone and desktop. Confirm customers can review the item, options and quantity in Square.
- The owner should verify order notifications, fulfillment, inventory behavior and the payment/refund flow through an appropriate authorized test. A redirect or thank-you page is not evidence of completed payment.

## References

- [Square: create and share payment links](https://squareup.com/help/us/en/article/6692-get-started-with-square-checkout-links)
- [Square Checkout API and order-based checkout](https://developer.squareup.com/docs/checkout-api)

## Historical local verification — November 19, 2026 (superseded bag flow)

Production build and TypeScript checks pass. All four product pages were checked in the pending-link state and against a separate local built Worker with a non-purchasing Square URL fixture; the configured link appeared exactly as supplied and was never opened. Missing/invalid links, non-HTTPS URLs, lookalike hosts, embedded credentials, unexpected ports and the old Wix shop URL were checked against the resolver. No live payment or order was attempted.

Browser review confirmed the Mango Salsa heat selector, a two-jar $16 subtotal, quantity increase to three jars/$24, and persistence of the Hot selection and quantity after reload. The test selection was removed before handoff. The customer's actual Square link, checkout line items, shipping, tax, notifications, inventory and refund behavior are still unverified.

## Product Buy buttons

Product detail pages support a direct **Buy now with Square** button when the corresponding owner-approved destination is configured:

| Product | Environment setting |
| --- | --- |
| Laos Chile Paste | `SQUARE_BUY_LINK_LAOS_CHILE_PASTE` |
| Vegan Tamarind Chile Sauce | `SQUARE_BUY_LINK_TAMARIND_SAUCE` |
| Vegan Mango Salsa | `SQUARE_BUY_LINK_MANGO_SALSA` |
| Vegan Chile Paste | `SQUARE_BUY_LINK_VEGAN_CHILE_PASTE` |

Obtain each product's Sell an item link or generated Buy button code from the owner's Square Dashboard. The current implementation uses a site-styled link to the Square-hosted checkout, rather than injecting an unprovided third-party embed. If an official generated embed is supplied, review its exact markup before integrating it. No API credential is needed for this static handoff.

Without a product-specific link, the existing general ordering/contact action remains. Each link belongs to the matching product page. Review heat options and quantities in the actual Square checkout before activation; do not assume a static link provides variant or quantity controls until its checkout has been reviewed. Restart after setting environment variables.

Official reference: [Square Buy buttons](https://squareup.com/us/en/payment-links/buy-button).

## Ordering simplification — November 20, 2026

The local bag and quick-view purchase controls were removed at client review. Every product card now leads to its product page. Buy now with Square appears only when that product’s approved link is configured; otherwise the existing ordering/contact fallback remains.
