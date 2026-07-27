import React from 'react';

type Tone = 'accent' | 'primary' | 'success' | 'warning' | 'neutral';

export function KruiseBadge({ children, tone = 'accent' as Tone }: { children: React.ReactNode; tone?: Tone }) {
  const tones: Record<Tone, [string, string]> = {
    accent: ['var(--cherry)', '#fff'],
    primary: ['var(--blueberry)', '#fff'],
    success: ['var(--lime)', '#fff'],
    warning: ['var(--tangerine)', 'var(--ink-900)'],
    neutral: ['var(--ink-900)', '#fff'],
  };
  const [bg, fg] = tones[tone] || tones.accent;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      minWidth: '22px', height: '22px', padding: '0 7px', background: bg, color: fg,
      fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '12px', lineHeight: 1,
      borderRadius: 'var(--radius-pill)', border: '2px solid var(--ink-900)',
      textTransform: 'uppercase', letterSpacing: '0.04em',
    }}>
      {children}
    </span>
  );
}
