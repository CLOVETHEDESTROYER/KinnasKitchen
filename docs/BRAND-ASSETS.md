# Wordmark and catalog photography

## Wordmark

The lettering on the original jars is a very close visual match to **Herculanum**, including the distinctive K, N, A and S. This is a visual identification, not confirmation from the original designer's artwork. The new text mark uses Herculanum with an enlarged initial K to follow the proportions on the labels. No roof illustration or other packaging graphics were added to the simple text mark.

- `public/assets/kinnas-wordmark-red-v1.png`: transparent, 883 × 221, brand red `#9e3627`.
- `public/assets/kinnas-wordmark-white-v1.png`: transparent white version for future dark backgrounds.
- `app/components/brand-wordmark.tsx`: shared header/footer mark showing only “Kinna’s,” with the existing tagline below.

The wordmark was rendered from the locally installed Herculanum font. The font binary is not copied into the repository or served to visitors. Static PNG delivery makes the mark consistent across devices and uses no SVG. The website's body and heading fonts are unchanged.

[Herculanum, published by Linotype](https://www.myfonts.com/collections/herculanum-font-linotype).

## Product images

Four studio-style retouched catalog images are used in `app/data/storefront.json`. Original source photos remain untouched in `public/assets/original/`; the previous delivery files also remain available. The accepted PNG masters are in `design-explorations/product-photo-masters/`.

Each product has a full 1254 × 1254 transparent WebP and a 600 × 600 delivery version:

- `laos-chile-paste-studio-v1.webp`
- `vegan-tamarind-chile-sauce-studio-v1.webp`
- `vegan-mango-salsa-studio-v1.webp`
- `vegan-chile-paste-studio-v1.webp`

The thumbnail variants append `-600` before `.webp`. Product cards and detail pages use responsive image sources; bag/related/recipe thumbnails use the smaller versions. Original prices, product names, sizes, heat choices and recipe content were not changed.

The photos were edited with the built-in image-generation tool, using the original jar/bottle photograph as the reference for each product. The brief locks the packaging design, names, label colors, heat marks, food appearance and camera viewpoint while improving studio lighting, backgrounds and composition. A first mango-salsa pass introduced an extra mark on the right side of the label; a targeted correction removed it before selection. The exact prompts are preserved in `design-explorations/product-studio-prompts.json`.

These are AI-retouched visual variants, not pixel-identical or documentary replacements for the source files. Retouching can change fine lettering and illustration details. The owners should compare the labels, Lao script, small print and food appearance against their real packaging before approving public sales use. Do not describe these as a new physical product, use them to infer ingredients or certifications, or discard the source photography.

The approved hero scene, other original photographs, product facts and Square ordering behavior are unchanged.

## Retailer marks

- `public/assets/retailers/salsa-saint.png` is the official Salsa Saint image from its website’s social-sharing metadata. It is used to identify and link to the Albuquerque retailer: [salsasaint.com](https://www.salsasaint.com/).
- Salsa Saint’s official about page lists its Old Town Albuquerque location at 400 Romero St NW, Unit 2. Retailer availability can change, so the Find Us page directs customers to contact the retailer before visiting.

## Website typography and color

The local brand preview pairs Barlow Condensed Bold for bold display headlines, product names and calls to action with Libre Caslon Display for editorial and family-story headings, and DM Sans for body and interface text. Barlow Condensed is self-hosted in `public/fonts/`; its SIL Open Font License is included alongside it.

The supporting palette adds mango gold `#e5b74d` to the existing cream, chile red and deep green. Product images and packaging artwork are preserved. The homepage reflects the original site's Lao family heritage and New Mexico location, with a shared savory/tangy/fruity guide on the home and shop pages. No new ingredients, heat options, discounts, bundles or fulfillment promises were added.
