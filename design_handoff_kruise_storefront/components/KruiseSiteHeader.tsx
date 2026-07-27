"use client";
import React from 'react';
import { Search, User, ShoppingBag } from './icons';
import { useCart } from './KruiseCartProvider';

const chunky = '3px solid var(--border-ink)';

export function KruiseSiteHeader() {
  const { count, openCart } = useCart();

  return (
    <>
    <div style={{ background: 'var(--blueberry)', color: 'var(--white)', textAlign: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: 13, padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 28 }}>
      <span>Free shipping over $35</span><span style={{ opacity: .5 }}>•</span>
      <span>New drop: Cherry Bombastic 🍒</span><span style={{ opacity: .5 }}>•</span>
      <span>Collect all 6 scents</span>
    </div>
    <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--paper)', borderBottom: '2px solid var(--border-soft)', padding: '14px 24px' }}>
      <div style={{ maxWidth: 'var(--container)', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 16 }}>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 22, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, letterSpacing: '0.02em' }}>
          <a href="#shop" className="kNavLink">Shop</a><a href="#shop" className="kNavLink">New</a>
          <a href="#shop" className="kNavLink">Bundles</a><a href="#" className="kNavLink">Quiz</a>
        </nav>
        <a href="/" style={{ justifySelf: 'center', display: 'flex', alignItems: 'center' }}>
          <img src="/assets/kruise-logo.png" alt="Kruise" style={{ height: 30, width: 'auto', display: 'block' }} />
        </a>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
          <button aria-label="Search" style={{ width: 42, height: 42, borderRadius: 999, border: '2px solid var(--border-soft)', background: 'var(--white)', display: 'grid', placeItems: 'center', cursor: 'pointer' }}><Search size={19} color="var(--blueberry-900)" /></button>
          <button aria-label="Account" style={{ width: 42, height: 42, borderRadius: 999, border: '2px solid var(--border-soft)', background: 'var(--white)', display: 'grid', placeItems: 'center', cursor: 'pointer' }}><User size={19} color="var(--blueberry-900)" /></button>
          <div style={{ position: 'relative' }}>
            <button aria-label="Open cart" onClick={openCart} style={{ height: 42, padding: '0 16px 0 14px', borderRadius: 999, border: chunky, background: 'var(--blueberry)', color: 'var(--white)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer', boxShadow: '0 3px 0 0 var(--ink-900)' }}><ShoppingBag size={18} />Cart</button>
            <span style={{ position: 'absolute', top: -7, right: -7, minWidth: 22, height: 22, padding: '0 6px', borderRadius: 999, background: 'var(--cherry)', color: 'var(--white)', border: '2px solid var(--white)', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 12, display: 'grid', placeItems: 'center' }}>{count}</span>
          </div>
        </div>
      </div>
    </header>
    </>
  );
}
