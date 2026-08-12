import React from 'react';
import { KruiseTag } from './KruiseTag';
import { KruiseBadge } from './KruiseBadge';
import { KruiseButton } from './KruiseButton';
import type { Flavor } from './KruiseButton';

type CardFlavor = Flavor | 'blueberry';

export interface Product {
  id: number | string;
  name: string;
  image: string;
  price: string;
  notes: string[];
  flavor: CardFlavor;
  badge?: string | null;
}

export function KruiseProductCard({ name, image, price, notes = [], flavor = 'cherry' as CardFlavor, badge = null, onAdd }: Product & { onAdd?: () => void }) {
  return (
    <div style={{ background: 'var(--white)', border: '3px solid var(--ink-900)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sticker-lg)', overflow: 'hidden', display: 'flex', flexDirection: 'column', width: '260px' }}>
      <div style={{
        position: 'relative', background: `var(--${flavor}-100)`,
        padding: '22px 18px 18px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '3px solid var(--ink-900)',
      }}>
        {badge && <span style={{ position: 'absolute', top: 12, left: 12, zIndex: 1 }}><KruiseBadge tone={badge === 'SOLD OUT' ? 'neutral' : 'accent'}>{badge}</KruiseBadge></span>}
        {image && (
          <img src={image} alt={name} style={{ width: '64%', maxWidth: 200, height: 'auto', filter: 'drop-shadow(0 6px 0 rgba(22,24,58,0.14))' }} />
        )}
      </div>
      <div style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <h4 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '22px', color: 'var(--blueberry-900)' }}>{name}</h4>
        {notes.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {notes.map((n) => <KruiseTag key={n} flavor={flavor} size="sm">{n}</KruiseTag>)}
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '20px', color: 'var(--blueberry-900)' }}>{price}</span>
          <KruiseButton variant="flavor" flavor={flavor as Flavor} size="sm" onClick={onAdd}>Add</KruiseButton>
        </div>
      </div>
    </div>
  );
}
