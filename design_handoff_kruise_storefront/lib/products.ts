import { shopifyFetch, formatMoney, shopifyConfigured } from './shopify';
import { IMAGE_FRAGMENT, PRODUCT_FRAGMENT, VARIANT_FRAGMENT } from './fragments';
import { resolveBadge, resolveFlavor, resolveNotes, fallbackImage } from './scents';
import type { KruiseProduct, KruiseVariant, ShopifyProduct } from './shopify-types';

const PRODUCTS_QUERY = /* GraphQL */ `
  ${IMAGE_FRAGMENT}
  ${VARIANT_FRAGMENT}
  ${PRODUCT_FRAGMENT}
  query Products($first: Int!, $sortKey: ProductSortKeys, $query: String) {
    products(first: $first, sortKey: $sortKey, query: $query) {
      nodes {
        ...ProductFields
      }
    }
  }
`;

const PRODUCT_QUERY = /* GraphQL */ `
  ${IMAGE_FRAGMENT}
  ${VARIANT_FRAGMENT}
  ${PRODUCT_FRAGMENT}
  query Product($handle: String!) {
    product(handle: $handle) {
      ...ProductFields
    }
  }
`;

export function normalizeProduct(p: ShopifyProduct): KruiseProduct {
  const variants: KruiseVariant[] = (p.variants?.nodes || []).map((v) => ({
    id: v.id,
    title: v.title,
    price: formatMoney(v.price.amount, v.price.currencyCode),
    compareAtPrice: v.compareAtPrice ? formatMoney(v.compareAtPrice.amount, v.compareAtPrice.currencyCode) : null,
    availableForSale: v.availableForSale,
    selectedOptions: v.selectedOptions || [],
  }));

  const images = (p.images?.nodes || []).map((i) => i.url);
  const image = p.featuredImage?.url || images[0] || fallbackImage(p);
  const min = p.priceRange?.minVariantPrice;

  return {
    id: p.id,
    handle: p.handle,
    name: p.title,
    description: p.description || '',
    image,
    images: images.length ? images : [image],
    price: min ? formatMoney(min.amount, min.currencyCode) : variants[0]?.price || '',
    currencyCode: min?.currencyCode || 'USD',
    notes: resolveNotes(p),
    flavor: resolveFlavor(p),
    badge: resolveBadge(p),
    availableForSale: p.availableForSale,
    options: (p.options || [])
      .map((o) => ({ name: o.name, values: (o.optionValues || []).map((v) => v.name) }))
      // Shopify gives single-variant products a synthetic "Title: Default Title" option.
      .filter((o) => !(o.values.length === 1 && o.values[0] === 'Default Title')),
    variants,
  };
}

/** Storefront catalogue. Falls back to the local six scents when Shopify is unreachable. */
export async function getProducts(first = 12): Promise<KruiseProduct[]> {
  const data = await shopifyFetch<{ products: { nodes: ShopifyProduct[] } }>({
    query: PRODUCTS_QUERY,
    variables: { first, sortKey: 'BEST_SELLING' },
    tags: ['products'],
  });
  const nodes = data?.products?.nodes;
  if (!nodes?.length) return FALLBACK_PRODUCTS;
  return nodes.map(normalizeProduct);
}

export async function getProduct(handle: string): Promise<KruiseProduct | null> {
  const data = await shopifyFetch<{ product: ShopifyProduct | null }>({
    query: PRODUCT_QUERY,
    variables: { handle },
    tags: ['products', `product:${handle}`],
  });
  if (data?.product) return normalizeProduct(data.product);
  if (shopifyConfigured) return null;
  return FALLBACK_PRODUCTS.find((p) => p.handle === handle) || null;
}

/* ---------- Local fallback catalogue ----------
   Keeps the page renderable with no token, offline, or if the API errors.
   Variant ids are fake — add-to-cart is disabled for these (see ProductGrid). */

function local(
  handle: string,
  name: string,
  image: string,
  flavor: KruiseProduct['flavor'],
  notes: string[],
  badge: string | null = null
): KruiseProduct {
  const packs: [string, string][] = [
    ['Single clip', '$12'],
    ['3-pack', '$30'],
    ['Refill', '$7'],
  ];
  return {
    id: `local:${handle}`,
    handle,
    name,
    description: `${name} — juicy, loud, and long-lasting. Clip it to the vent and let it rip. Smells fresh for 45+ days.`,
    image,
    images: [image],
    price: '$12',
    currencyCode: 'USD',
    notes,
    flavor,
    badge,
    availableForSale: true,
    options: [{ name: 'Pack', values: packs.map((p) => p[0]) }],
    variants: packs.map(([title, price]) => ({
      id: `local:${handle}:${title}`,
      title,
      price,
      compareAtPrice: null,
      availableForSale: true,
      selectedOptions: [{ name: 'Pack', value: title }],
    })),
  };
}

export const FALLBACK_PRODUCTS: KruiseProduct[] = [
  local('cherry-bombastic', 'Cherry Bombastic', '/assets/cherries.png', 'cherry', ['Juicy Cherry', 'Sour Pop'], 'NEW'),
  local('cotton-cloud', 'Cotton Cloud', '/assets/cloud.png', 'sky', ['Cotton Candy', 'Vanilla']),
  local('tropic-punch', 'Tropic Punch', '/assets/fruit.png', 'tangerine', ['Pineapple', 'Orange'], 'BEST SELLER'),
  local('tsunami-breeze', 'Tsunami Breeze', '/assets/wave.png', 'wave', ['Sea Salt', 'Fresh Air']),
  local('clean-machine', 'Clean Machine', '/assets/bubbles.png', 'blueberry', ['Fresh Linen', 'Clean Soap']),
  local('coconut-bliss', 'Coconut Bliss', '/assets/fruit.png', 'lime', ['Coconut', 'Pineapple']),
];

export const isLocalId = (id: string) => id.startsWith('local:');
