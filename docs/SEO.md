# Search setup and handover

Implemented locally on November 18, 2026. This is implementation guidance; it is not customer-facing website content or a claim of measured ranking improvement.

## What changed

- Thirteen readable pages: homepage, shop, four products, recipe index, four recipes, New Mexico stockists, and a cooking guide.
- Real HTML links connect product cards, recipes, products, guide, and stockists. Page content is present in the initial server response.
- Each page has its own title, description, canonical URL and social sharing metadata. Each content page has one main heading.
- Organization, BreadcrumbList and descriptive Product JSON-LD use visible source facts. Product offers, availability, reviews and ratings are intentionally absent until the Square catalog, current prices, inventory and purchasing flow are approved. Descriptive Product markup alone does not qualify these pages for Google's product rich results. Recipe markup is deferred until owners can supply actual dish photographs and approve recipe details; existing general food images are not presented as those specific dishes.
- All four known original Wix `/product-page/…` paths return permanent 308 redirects to the matching new product pages. Unknown product or recipe slugs return 404.
- A smaller, explicit storefront data file replaces the raw archived Wix catalog in the homepage client component. All original source material and photography remain in the repository.
- Development banners, internal asset descriptions and simulated checkout/completion screens have been removed. The local bag is a selection aid. The owner-provided Square payment link is pending; checkout defaults to contact help and clearly explains the separate Square handoff when configured.

## Production configuration

Previews default to `noindex, follow`. Crawlers may access HTML to see that directive; robots.txt does not block them. Preview sitemap.xml is empty. This does not replace authentication or make a private preview accessible to Google.

On the final HTTPS production host, set:

```text
SITE_URL=https://www.kinnaskitchen.com
SITE_INDEXABLE=true
SQUARE_PAYMENT_LINK=<exact owner-approved Square payment/store URL>
```

Set environment values in the host's runtime configuration. The built Cloudflare Worker reads them at runtime. Restart/redeploy as required by that host. The final canonical origin must match the selected domain, including the www choice.

Only the explicit HTTPS origin plus `SITE_INDEXABLE=true` enables indexable page metadata, the 13-URL sitemap and the robots sitemap reference. There are no fabricated modification dates.

An unset or invalid Square link directs ordering inquiries to email in every environment. There is no Wix fallback. `SQUARE_PAYMENT_LINK` takes precedence over the legacy `ORDERING_URL` alias. A configured link is an external destination only; it does not transfer the local bag, prices, quantities or heat choices. Verify the actual link and checkout using `docs/SQUARE.md` before launch. Payment readiness is independent of the search-indexing setting.

## Before replacing Wix

1. Confirm the chosen domain and email ownership. Review the relationship between kinnaskitchen.com and kinnas.net; redirect alternate domains to their matching final pages.
2. Review the complete old sitemap, Search Console landing pages and external links. Four known product redirects are implemented; other existing About, contact, recipe or category paths still need a full migration inventory and useful destinations. Never redirect every unknown URL to the homepage.
3. Get owner approval for current labels, ingredients, allergens, sizes, heat levels, prices, retailer participation and shipping destinations. Confirm the business contact number: the website and Elevate NM Ag directory show different numbers. Do not publish a directory address as a customer storefront without owner verification.
4. Verify Square checkout, shipping, tax, inventory, order notifications, refunds and support. Keep displayed prices and checkout catalog synchronized. Replace temporary ordering links and confirm real purchase attribution.
5. Test production HTML metadata, canonicals, 308 redirects, 404s, robots.txt and sitemap.xml. Ensure final pages have no noindex directive. Verify that staging/private hosts remain noindex.
6. Add owner-authorized Search Console access for the final domain, submit sitemap.xml and inspect important product pages. No Search Console data for Kinna's Kitchen was available in this session.
7. After checkout is eligible and complete, evaluate Google Merchant Center free product listings. Supply consistent prices, availability, product identifiers where applicable, shipping and return information; validate required product markup/feed fields. Eligibility and display are not guaranteed.
8. Measure search visits, actual paid orders and repeat purchases. Keep non-brand discovery separate from searches for Kinna's name. With only a few reported monthly orders, review longer periods before drawing conclusions from small changes. A click to external Square checkout is not a verified purchase.
9. Run mobile PageSpeed Insights on the public production pages after launch; compare equivalent pages, devices and test conditions. No new PageSpeed score or speed improvement is asserted for this change.

## Verification completed

- Production build and TypeScript check.
- Built Worker responses for all 13 pages: one H1, description, social URL, preview noindex, valid JSON-LD parsing, and no internal/demo prose.
- Four original product redirects return 308; invalid product and recipe paths return 404.
- A separate local built Worker with production runtime variables emits 13 sitemap URLs, an index/follow directive and a robots sitemap reference. With no approved ordering destination it uses contact help rather than the old product URL.
- Browser checks cover product-to-recipe navigation and the local bag; visual checks are recorded in the working session.

These checks establish implementation behavior, not Google indexing, rich result eligibility, traffic growth or sales uplift.
