"use client";
import React from 'react';
import { KruiseButton as Button } from './KruiseButton';

const chunky = '3px solid var(--border-ink)';

/** Newsletter capture. Not wired to a provider yet — point onSubmit at Klaviyo/Shopify marketing. */
export function KruiseNewsletterForm() {
  return (
    <form style={{ display: 'flex', gap: 12, maxWidth: 460, margin: '0 auto' }} onSubmit={(e) => e.preventDefault()}>
      <input type="email" placeholder="you@email.com" style={{ flex: 1, height: 52, borderRadius: 999, border: chunky, padding: '0 20px', fontFamily: 'var(--font-body)', fontSize: 16, background: 'var(--white)', color: 'var(--ink-900)' }} />
      <Button variant="accent" size="lg">Join</Button>
    </form>
  );
}
