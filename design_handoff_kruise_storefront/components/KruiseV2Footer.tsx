'use client';
import React from 'react';
import { KruiseButton } from './KruiseButton';

const SOCIALS = [
  { label: 'Instagram', bg: 'var(--cherry)' },
  { label: 'TikTok', bg: 'var(--graphite-900)' },
  { label: 'YouTube', bg: 'var(--tangerine)' },
  { label: 'Club chat', bg: 'var(--wave)' },
];

export function KruiseV2Footer() {
  return (
    <>
      <nav className="v2-social" aria-label="Social">
        {SOCIALS.map((s) => <a key={s.label} href="#" style={{ background: s.bg }}>{s.label}</a>)}
      </nav>

      <section className="v2-news">
        <h2>Sign up for the drops</h2>
        <p>15% off your first clip, plus first look at every restock.</p>
        <form onSubmit={(e) => e.preventDefault()}>
          <input type="email" placeholder="you@email.com" aria-label="Email address" required />
          <KruiseButton variant="accent" size="lg" type="submit">Subscribe</KruiseButton>
        </form>
      </section>

      <footer className="v2-foot">
        <div className="v2-foot__in">
          <span>© {'2026'} Kruise · Smells like summer, all drive long.</span>
          <div className="v2-foot__links">
            <a href="/#scents">Shop</a>
            <a href="/#drop">Bundles</a>
            <a href="/#story">Our story</a>
            <a href="#">Refill program</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </footer>
    </>
  );
}
