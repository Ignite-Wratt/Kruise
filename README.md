# Kruise — Shopify theme

Online Store 2.0 theme built from the Kruise design system. Every home-page block from the
`KruiseStorefront` design-system template exists here as an editable section.

## Structure

```
layout/theme.liquid            page shell, fonts, token + theme CSS, section groups
assets/kruise-tokens.css       design-system tokens (colours, type, sunburst, wordmark)
assets/kruise-theme.css        all theme styling (sections, buttons, product card, PDP, cart)
assets/kruise-theme.js         AJAX add-to-cart, cart count, PDP variant + gallery, icons
sections/                      header-group, footer-group + every home section
snippets/product-card.liquid   sunburst product card (badge, scent-note tags, Add button)
templates/*.json               index, product, collection, cart, page, search, blog, article, 404, list-collections
config/settings_schema.json    theme settings (logo, footer blurb, product-card defaults)
locales/en.default.json        all UI strings
```

## Home sections (all with presets, blocks and theme-editor settings)

announcement-bar · header · hero-pack · category-tiles · featured-products · reviews ·
editorial-rows · press-bar · newsletter · instagram-grid · footer

## Product data conventions

| What | Where it comes from |
| --- | --- |
| Flavour colour (sunburst + button + tag colours) | product tag `flavor:cherry` **or** metafield `custom.flavor`. Values: cherry, tangerine, lemon, lime, wave, sky, blueberry |
| Scent-note chips | product tags `note:Juicy Cherry`, `note:Sour Pop` |
| "New" / "Best seller" badge | product tags `new` / `best-seller` |
| "Sold out" badge | product availability |

The hero pack graphic is drawn in CSS (sunburst + wordmark + clip disc) so it needs no image;
add a hero image in the section settings to override it.

## Run locally

```bash
npm i -g @shopify/cli @shopify/theme
cd shopify-theme
shopify theme dev --store your-store.myshopify.com
```

## Deploy

```bash
shopify theme push --unpublished --store your-store.myshopify.com
```

Or connect the branch in Shopify admin → Online Store → Themes → Add theme → Connect from GitHub,
and pick the `shopify-theme` branch.
