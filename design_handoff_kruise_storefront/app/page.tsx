import React from 'react';
import { KruiseV2Home } from '../components/KruiseV2Home';
import { getProducts } from '../lib/products';

// v2 drop-culture home, rebuilt from the design system's `Kruise Storefront v2.html`.
// Catalogue is cached 5 min at the fetch level (see lib/shopify.ts); falls back to
// the local 7-SKU catalogue when Shopify isn't connected.

export default async function HomePage() {
  const products = await getProducts();
  return <KruiseV2Home products={products} />;
}
