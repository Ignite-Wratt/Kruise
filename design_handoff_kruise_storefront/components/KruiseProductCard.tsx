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
  const bursts: Record<CardFlavor, [string, string]> = {
    cherry: ['var(--cherry-900)', 'var(--cherry)'],
    tangerine: ['#f0421c', 'var(--tangerine)'],
    lemon: ['var(--lemon-900)', 'var(--lemon)'],
    lime: ['var(--lime-900)', 'var(--lime)'],
    wave: ['var(--wave)', '#3fb6a0'],
    sky: ['var(--sky)', 'var(--sky-300)'],
    marine: ['var(--marine-900)', 'var(--marine)'],
    graphite: ['var(--graphite-900)', 'var(--graphite)'],
    blueberry: ['var(--blueberry)', 'var(--blueberry-500)'],
  };
  const [burstA, burstB] = bursts[flavor] || bursts.cherry;

  return (
    <div style={{ background: 'var(--white)', border: '3px solid var(--ink-900)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sticker-lg)', overflow: 'hidden', display: 'flex', flexDirection: 'column', width: '260px' }}>
      <div className="kr-sunburst" data-sunburst-rays="fine" style={{
        position: 'relative', ['--sunburst-a' as any]: burstA, ['--sunburst-b' as any]: burstB, ['--sunburst-origin' as any]: '50% 30%',
        height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '3px solid var(--ink-900)',
      } as React.CSSProperties}>
        {badge && <span style={{ position: 'absolute', top: 12, left: 12 }}><KruiseBadge tone={badge === 'SOLD OUT' ? 'neutral' : 'accent'}>{badge}</KruiseBadge></span>}
        {image && (
          <div style={{ width: '132px', height: '132px', borderRadius: 'var(--radius-pill)', background: 'rgba(255,255,255,0.28)', display: 'grid', placeItems: 'center', boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.45)' }}>
            <img src={image} alt={name} style={{ maxWidth: '78%', maxHeight: '78%', objectFit: 'contain', filter: 'drop-shadow(0 3px 0 rgba(22,24,58,0.18))' }} />
          </div>
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
