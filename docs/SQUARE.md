> Current integration: see [SQUARE-CHECKOUT.md](SQUARE-CHECKOUT.md). The local full-bag Sandbox checkout supersedes the static-link handoff below when configured. Historical notes follow.

# Square payment-link handoff

The client confirms Square use and will supply a payment link. No owner-approved URL has been supplied yet. The site is ready for design and shopping-flow review; live payment readiness still depends on that link and its actual checkout setup.

## Add the real link

1. Get the exact payment or store URL from the owners, along with what it sells: one jar, a fixed bundle, or a Square store where customers choose products.
2. In an ignored local environment file (or the production host's runtime environment), set `SQUARE_PAYMENT_LINK` to that URL. Restart the server after changing environment settings. No Square API credential is needed just to link to a hosted payment page.
3. The existing `ORDERING_URL` setting remains a legacy alias. `SQUARE_PAYMENT_LINK` takes precedence. The URL must be HTTPS on `square.link`, `squareup.com` or its subdomains, or a `*.square.site` host, without embedded credentials or a nonstandard port. If the owner supplies a custom domain, verify that exact destination before extending the accepted host list.
4. Without a valid link, the customer receives ordering help by email. There is no redirect to Wix, fake checkout confirmation, or order creation.

## What is connected

Product pages, the homepage FAQ, and the bag use the same configured Square destination. The bag still stores selections in the visitor's browser and remains usable if persistent browser storage is blocked. The customer is told that bag selections do not transfer automatically to a static Square link. Do not append unverified item, amount or quantity parameters to a payment URL.

A single fixed-item or fixed-bundle link cannot be treated as checkout for an arbitrary mix of the four products. If the supplied link cannot offer the necessary products and variants, use product-specific links, the owner's Square storefront, or an approved server-side Square Checkout integration. Resolve this against the real URL before launch; do not imply that the existing bag is an integrated Square cart.

## Verify before accepting orders

- The destination belongs to Kinna's Kitchen and is an active sell-item/store checkout, rather than a generic collect-payment, donation or subscription link.
- Products, jar sizes, heat variants, quantities and final prices match the owners' approved catalog. A generic link shared across all four product pages must actually let customers buy the desired jars; otherwise map appropriate destinations first.
- Confirm shipping destinations, shipping costs, tax, pickup (if offered), return/refund terms and the contact details shown to customers.
- Check the external handoff on a phone and desktop. Confirm that customers understand they must review their items in Square, and do not clear the local bag simply because the link was opened.
- The owner should verify order notifications, fulfillment, inventory behavior and the payment/refund flow through an appropriate authorized test. A redirect or thank-you page is not evidence of completed payment.

## References

- [Square: create and share payment links](https://squareup.com/help/us/en/article/6692-get-started-with-square-checkout-links)
- [Square Checkout API and order-based checkout](https://developer.squareup.com/docs/checkout-api)

## Local verification — November 19, 2026

Production build and TypeScript checks pass. All four product pages were checked in the pending-link state and against a separate local built Worker with a non-purchasing Square URL fixture; the configured link appeared exactly as supplied and was never opened. Missing/invalid links, non-HTTPS URLs, lookalike hosts, embedded credentials, unexpected ports and the old Wix shop URL were checked against the resolver. No live payment or order was attempted.

Browser review confirmed the Mango Salsa heat selector, a two-jar $16 subtotal, quantity increase to three jars/$24, and persistence of the Hot selection and quantity after reload. The test selection was removed before handoff. The customer's actual Square link, checkout line items, shipping, tax, notifications, inventory and refund behavior are still unverified.

## Owner direction: November 27, 2026

- Match the website to the supplied Square catalog: original 6 oz paste $12, vegan 6 oz paste $12, mango salsa $8, tamarind sauce $12. The local tamarind price has been corrected from $13. The 2 oz original paste ($5 in Square) is not yet in the website catalog.
- Retain Square stock tracking and existing counts. The user reports frequent replenishment and stale counts; zero stock should not by itself prevent website orders. Do not disable tracking, inflate quantities, or display these counts as reliable customer-facing availability.
- Evaluate server-created Square order checkout using existing catalog variation IDs for each product/heat selection. Fetch trusted prices on the server and verify payment status, order routing, shipping and tax before enabling purchases. Distinguish API-created checkout from dashboard payment links and Square Online; their availability behavior differs. Verify zero-stock and manually sold-out cases separately in an appropriate test environment.
- Square developer forum guidance states that API-created links do not reserve inventory or reject payment when stock changes after creation, whereas dashboard-created Sell an item links recheck availability. This is evidence for evaluation, not verification of this account's behavior: https://developer.squareup.com/forums/t/does-api-hosted-checkout-prevent-overselling-the-last-item-across-online-and-pos/28242
- No credentials, Square settings or real orders have been changed. Account connection and a confirmed dispatch timeframe are still needed.

## Shipping and tax inputs pending confirmation

The user reports a $9.99 delivery charge on the current live website. Treat this as a proposed per-order shipping/delivery charge for testing, not a confirmed nationwide fulfillment policy. Confirm shipping versus local delivery, eligible destinations, any quantity/weight limits, and dispatch timeframe before production.

Business is reported to be in Bernalillo County, New Mexico. Do not apply the screenshot's 7.625% universally or infer taxability from county alone. Confirm tax registrations, food deduction eligibility, destination sourcing, and shipping tax treatment with the owners' tax preparer. Tax collection in other states depends on their obligations there, including physical presence and applicable sales thresholds across sales channels. No live tax or shipping settings have been changed.

## Sandbox tax configured: November 27, 2026

At the user's direction, a 7.625% additive Sales Tax (matching the earlier Square item screenshot) is attached to all four Sandbox products and all nine heat variations. Catalog tax applies to catalog items only, not arbitrary custom amounts. Checkout order creation must enable `pricing_options.auto_apply_taxes` and reference the mapped catalog variation IDs. Square CalculateOrder verified tax on all nine variants: $92.00 product subtotal, $7.02 tax. This calculation did not create an order or charge a card. Private test mapping is in ignored `work/square-sandbox-tax.json`.

Production tax settings are unchanged. This is a flat Sandbox test configuration, not verified destination tax compliance. The old Wix screenshot's $1.02 tax on a $13 jar does not establish the same effective rate. Delivery remains a separate proposed $9.99 fee and is not included in the tax verification. Cart integration remains to be implemented.
