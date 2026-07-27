"use client";
import React, { useState } from 'react';
import { KruiseButton as Button, type Flavor } from './KruiseButton';
import { useCart } from './KruiseCartProvider';
import type { KruiseProduct } from '../lib/shopify-types';

/** Variant + quantity selection and add-to-cart for a product detail page. */
export function KruiseVariantPicker({ product }: { product: KruiseProduct }) {
  const { add, pending } = useCart();
  const available = product.variants.filter((v) => v.availableForSale);
  const [variantId, setVariantId] = useState((available[0] || product.variants[0])?.id);
  const [qty, setQty] = useState(1);

  const variant = product.variants.find((v) => v.id === variantId) || product.variants[0];
  const flavor = (product.flavor === 'blueberry' ? 'cherry' : product.flavor) as Flavor;
  const multi = product.variants.length > 1;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 22 }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 34, color: 'var(--blueberry-900)' }}>{variant?.price || product.price}</span>
        {variant?.compareAtPrice && (
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, color: 'var(--ink-500)', textDecoration: 'line-through' }}>{variant.compareAtPrice}</span>
        )}
      </div>

      {multi && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.12em', fontSize: 12, color: 'var(--ink-500)', marginBottom: 10 }}>
            {product.options[0]?.name || 'Pack'}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {product.variants.map((v) => {
              const selected = v.id === variantId;
              return (
                <button
                  key={v.id}
                  onClick={() => setVariantId(v.id)}
                  disabled={!v.availableForSale}
                  style={{
                    fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15, padding: '11px 18px',
                    borderRadius: 'var(--radius-pill)', cursor: v.availableForSale ? 'pointer' : 'not-allowed',
                    border: '3px solid var(--ink-900)',
                    background: selected ? 'var(--blueberry)' : 'var(--white)',
                    color: selected ? '#fff' : 'var(--blueberry-900)',
                    boxShadow: selected ? '0 4px 0 0 var(--ink-900)' : '0 2px 0 0 var(--ink-900)',
                    opacity: v.availableForSale ? 1 : 0.45,
                    transition: 'transform 120ms var(--ease-bounce), box-shadow 120ms var(--ease-bounce)',
                  }}
                >
                  {v.title}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, border: '3px solid var(--ink-900)', borderRadius: 'var(--radius-pill)', background: 'var(--white)', padding: 4, boxShadow: '0 3px 0 0 var(--ink-900)' }}>
          <Qty label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</Qty>
          <span style={{ minWidth: 28, textAlign: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17 }}>{qty}</span>
          <Qty label="Increase quantity" onClick={() => setQty((q) => Math.min(20, q + 1))}>+</Qty>
        </div>
        <Button
          variant="flavor"
          flavor={flavor}
          size="lg"
          disabled={!variant?.availableForSale || pending}
          onClick={() => variant && add(variant.id, qty)}
        >
          {!variant?.availableForSale ? 'Sold out' : pending ? 'Adding…' : 'Add to bag'}
        </Button>
      </div>

      <p style={{ fontSize: 14, color: 'var(--ink-500)', margin: '16px 0 0' }}>Free shipping over $35 · 45+ days of scent · Refillable</p>
    </div>
  );
}

function Qty({ children, label, onClick }: { children: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      style={{ width: 34, height: 34, borderRadius: 999, border: 'none', background: 'var(--blueberry-50, #f2f4ff)', color: 'var(--blueberry-900)', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, lineHeight: 1, cursor: 'pointer', display: 'grid', placeItems: 'center' }}
    >
      {children}
    </button>
  );
}
