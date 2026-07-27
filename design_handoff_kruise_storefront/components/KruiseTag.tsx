import React from 'react';
import type { Flavor } from './KruiseButton';

type TagFlavor = Flavor | 'blueberry' | 'neutral';

export function KruiseTag({ children, flavor = 'blueberry' as TagFlavor, size = 'md' as 'sm' | 'md' }: { children: React.ReactNode; flavor?: TagFlavor; size?: 'sm' | 'md' }) {
  const map: Record<TagFlavor, [string, string]> = {
    blueberry: ['var(--blueberry-100)', 'var(--blueberry-900)'],
    cherry: ['var(--cherry-100)', 'var(--cherry-900)'],
    tangerine: ['var(--tangerine-100)', 'var(--tangerine-900)'],
    lemon: ['var(--lemon-100)', 'var(--lemon-900)'],
    lime: ['var(--lime-100)', 'var(--lime-900)'],
    wave: ['var(--wave-100)', 'var(--wave-900)'],
    sky: ['var(--sky-100)', 'var(--sky-900)'],
    neutral: ['var(--ink-100)', 'var(--ink-700)'],
  };
  const [bg, fg] = map[flavor] || map.blueberry;
  const s = size === 'sm' ? { padding: '3px 10px', fontSize: '12px' } : { padding: '5px 14px', fontSize: '14px' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '6px', background: bg, color: fg,
      fontFamily: 'var(--font-body)', fontWeight: 800, borderRadius: 'var(--radius-pill)',
      border: '2px solid var(--border-ink)', whiteSpace: 'nowrap', ...s,
    }}>
      {children}
    </span>
  );
}
