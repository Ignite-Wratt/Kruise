# Kruise Storefront (Next.js + Shopify headless)

DTC storefront for Kruise (car vent-clip air fresheners), built on the Kruise Design System and wired to the **Shopify Storefront API** — real products, real cart, real Shopify checkout.

## Setup

```
cd design_handoff_kruise_storefront
cp .env.local.example .env.local     # then paste your Storefront token
npm install
npm run dev
```

`.env.local` needs two values:

| Var | Value |
|---|---|
| `SHOPIFY_STORE_DOMAIN` | `shopify-nqcwt4-sp.myshopify.com` |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | public Storefront API token |

**Getting the token:** Shopify admin → Settings → Apps and sales channels → Develop apps → Create an app → Configuration → Storefront API → enable `unauthenticated_read_product_listings`, `unauthenticated_read_product_inventory`, `unauthenticated_write_checkouts`, `unauthenticated_read_checkouts` → Save → Install app → API credentials → copy the **Storefront API access token**. It's a public token (safe in a server env var); an Admin API token must never be used here.

Without a token the site still renders — it falls back to the six local scents and add-to-cart surfaces a "Shopify is not connected" notice in the drawer.

## Shopify layer

| File | Role |
|---|---|
| `lib/shopify.ts` | Thin `fetch` wrapper around `/api/2024-10/graphql.json`. Server-only, never throws — returns `null` on failure so callers can fall back. Also `formatMoney`. |
| `lib/shopify-types.ts` | Raw Shopify types + the normalized `KruiseProduct` / `CartView` shapes the UI consumes. |
| `lib/fragments.ts` | Shared GraphQL fragments (`ProductFields`, `VariantFields`, `CartFields`) so every operation returns the same shape. |
| `lib/products.ts` | `getProducts()`, `getProduct(handle)`, normalization, and the local fallback catalogue. |
| `lib/scents.ts` | Maps Shopify data onto brand vocabulary: scent notes, flavor accent colour, badge. |
| `lib/cart.ts` | Cart queries/mutations, `normalizeCart`, `getCartById(id)`, and the `kruise_cart_id` storage key. |
| `lib/cart-actions.ts` | `'use server'` actions: `addToCart`, `updateCartLine`, `removeCartLine`, `fetchCart`. Each takes the cart id as an argument, so the layer is framework-agnostic. |

Data flow: server components fetch the catalogue (cached 5 min at the fetch level, tag `products`) → `KruiseCartProvider` keeps the cart id in `localStorage`, rehydrates the cart on mount, and calls the server actions → Shopify returns the cart → **Checkout** sends the visitor to `cart.checkoutUrl` (Shopify-hosted checkout, so payments/tax/shipping stay in Shopify).

## Storefront UI

- `app/layout.tsx` — wraps everything in `KruiseCartProvider`; renders announcement bar + header, page, footer, cart drawer.
- `app/page.tsx` — landing page (server component), `components/KruiseProductGrid.tsx` for the card grid. Hero pack art and the best-seller grid come from live Shopify products; the first product drives the hero pack name/art.
- `app/products/[handle]/page.tsx` — product detail page: pack visual, scent-note tags, description, variant picker, add-to-bag, "collect the rest" row. Generates its own metadata.
- `components/KruiseCartProvider.tsx` — cart context, optimistic quantity/remove, `pending` + `error` state.
- `components/KruiseCartDrawer.tsx` — slide-out bag (sticker styling, quantity steppers, subtotal, checkout). Chosen over a `/cart` page so shoppers never leave the page they're browsing.
- `components/KruiseVariantPicker.tsx` — pack/variant pills + quantity + add-to-bag on the PDP.
- `components/KruiseSiteHeader.tsx` / `KruiseSiteFooter.tsx` / `KruiseNewsletterForm.tsx` — shared chrome, extracted so every route gets them.
- `components/Kruise*.tsx` — design-system components (Button, Tag, Badge, ProductCard) unchanged; every new component follows the same `Kruise*` naming so nothing collides with the design system's own exports.

## Product model in Shopify

One product per scent; **variants are the pack size** — `Single clip` / `3-pack` / `Refill` under an option named `Pack`. Card "Add" uses the cheapest available variant; the PDP lets shoppers choose.

Scent notes and flavour colour resolve in this order — set the metafields and the front end stops guessing:

| Field | Metafield | Type | Example |
|---|---|---|---|
| Scent notes | `custom.scent_notes` | `list.single_line_text_field` | `["Juicy Cherry","Sour Pop"]` |
| Flavour colour | `custom.flavor` | `single_line_text_field` | `cherry` (or `tangerine` `lemon` `lime` `wave` `sky` `blueberry`) |
| Badge | `custom.badge` | `single_line_text_field` | `NEW`, `BEST SELLER` |

Tags work as an alternative (`flavor:cherry`, `notes:Juicy Cherry`, `badge:NEW`), and failing both, `lib/scents.ts` keyword-matches the handle/title (cherry → cherry, tsunami → wave, …). Sold-out products get a `SOLD OUT` badge automatically.

## Design notes

- Tokens live in `app/globals.css`, ported verbatim from the Kruise Design System (`tokens/*.css`) plus the sunburst pattern and hover-only classes.
- Hero background `#FFDC42` is a literal hex (a direct edit in the design tool, not a token).
- Product images come straight from the Shopify CDN via `<img>` (no `next/image` domain config needed). If a product has no image, a local scent illustration stands in.
- Icons are local SVGs in `components/icons.tsx` (Lucide-style, 2.25 stroke).

## Notes

- The cart id lives in `localStorage` (an anonymous Shopify cart token) rather than a cookie, and navigation uses plain `<a>` rather than `next/link`, so every file compiles outside Next as well — the Kruise design system can lint and preview these components directly.
- Swap `<a>` for `next/link` and the cart id for an httpOnly cookie if you prefer client-side transitions and SSR-rendered cart state; both are drop-in.

## Still to do

- Collections → the four category tiles (currently anchor-link to the grid) and a `/collections/[handle]` route.
- Search, customer accounts, and the newsletter provider (`KruiseNewsletterForm` just prevents default).
- Lifestyle photography for the editorial rows and Instagram grid are still placeholders.
- Optional: `/api/revalidate` route + Shopify webhook to purge the `products` cache tag on product updates instead of waiting out the 5-minute window.
