"use client";
import React from 'react';
import { KruiseProductCard as ProductCard } from './KruiseProductCard';
import { useCart } from './KruiseCartProvider';
import type { KruiseProduct } from '../lib/shopify-types';

/** Cheapest available variant — what "Add" on a card puts in the bag. */
export function defaultVariant(p: KruiseProduct) {
  return p.variants.find((v) => v.availableForSale) || p.variants[0] || null;
}

export function KruiseProductGrid({ products, columns = 3 }: { products: KruiseProduct[]; columns?: number }) {
  const { add } = useCart();

  return (
    <div style={{ display: 'grid', gap: 20, gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, justifyItems: 'center' }}>
      {products.map((p) => {
        const variant = defaultVariant(p);
        return (
          <div key={p.id} style={{ position: 'relative', width: 260 }}>
            <ProductCard
              id={p.id}
              name={p.name}
              image={p.image}
              price={p.price}
              notes={p.notes}
              flavor={p.flavor}
              badge={p.badge}
              onAdd={() => variant && add(variant.id)}
            />
            {/* Image area doubles as the link to the product page; the Add button sits below it. */}
            <a
              href={`/products/${p.handle}`}
              aria-label={`View ${p.name}`}
              style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 180, borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0' }}
            />
          </div>
        );
      })}
    </div>
  );
}
