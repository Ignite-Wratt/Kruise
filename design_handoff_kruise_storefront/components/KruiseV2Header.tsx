'use client';
import React, { useState } from 'react';
import { useCart } from './KruiseCartProvider';
import { KruiseMarquee } from './KruiseMarquee';

const NAV = [
  { label: 'Shop all', href: '/#scents' },
  { label: 'The drop', href: '/#drop' },
  { label: 'Bundles', href: '/#drop' },
  { label: 'Refills', href: '/#scents' },
  { label: 'Our story', href: '/#story' },
];

// Minimal inline icons (Lucide-style, stroke 2.25) — no CDN, per the design contract.
const Ico = ({ d, size = 20 }: { d: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d.split('|').map((p, i) => <path key={i} d={p} />)}</svg>
);
const BAG = 'M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z|M3 6h18|M16 10a4 4 0 0 1-8 0';
const SEARCH = 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z|M21 21l-4.3-4.3';
const USER = 'M20 21a8 8 0 1 0-16 0|M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z';

export function KruiseV2Header() {
  const { count, openCart } = useCart();
  const [menu, setMenu] = useState(false);

  return (
    <>
      <div className="v2-ticker">
        <KruiseMarquee fast>
          <span>Free shipping over $35</span><span className="k-dot">•</span>
          <span>30 day long lasting</span><span className="k-dot">•</span>
          <span>Refill, don&apos;t rebuy</span><span className="k-dot">•</span>
          <span>Collect all 7 scents</span><span className="k-dot">•</span>
        </KruiseMarquee>
      </div>

      <header className="v2-head">
        <div className="v2-head__in">
          <button className="v2-menu" onClick={() => setMenu(true)} aria-expanded={menu} aria-label="Open menu">
            <Ico d="M3 6h18|M3 12h18|M3 18h18" size={22} /> Menu
          </button>
          <a href="/" className="k-logo" aria-label="Kruise home"><img src="/assets/kruise-logo.png" alt="Kruise" style={{ height: 30 }} /></a>
          <div className="v2-head__right">
            <a className="v2-ico" href="/#scents" aria-label="Search"><Ico d={SEARCH} size={19} /></a>
            <a className="v2-ico" href="/#scents" aria-label="Account"><Ico d={USER} size={19} /></a>
            <button className="v2-bag" onClick={openCart} aria-label="Open cart">
              <Ico d={BAG} size={18} /> Cart{count > 0 ? ` · ${count}` : ''}
            </button>
          </div>
        </div>
      </header>

      {/* slide-in menu */}
      <div
        onClick={() => setMenu(false)}
        style={{ position: 'fixed', inset: 0, background: 'rgba(22,24,58,.45)', zIndex: 80, opacity: menu ? 1 : 0, visibility: menu ? 'visible' : 'hidden', transition: 'opacity 220ms ease, visibility 220ms' }}
        aria-hidden={!menu}
      >
        <nav
          onClick={(e) => e.stopPropagation()}
          style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: 'min(340px, 84vw)', background: 'var(--paper)', borderRight: '3px solid var(--ink-900)', padding: '24px', display: 'flex', flexDirection: 'column', gap: 6, transform: menu ? 'none' : 'translateX(-104%)', transition: 'transform 260ms var(--ease-bounce)' }}
          aria-label="Main menu"
        >
          <button onClick={() => setMenu(false)} aria-label="Close menu" style={{ alignSelf: 'flex-end', background: 'none', border: 0, cursor: 'pointer', color: 'var(--blueberry-900)', marginBottom: 12 }}><Ico d="M6 6l12 12|M18 6L6 18" size={24} /></button>
          {NAV.map((n) => (
            <a key={n.label} href={n.href} onClick={() => setMenu(false)} style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 26, color: 'var(--blueberry-900)', padding: '8px 0', textTransform: 'uppercase', letterSpacing: '-0.01em' }}>{n.label}</a>
          ))}
        </nav>
      </div>
    </>
  );
}
