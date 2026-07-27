import React from 'react';

const footerCols = [
  { title: 'Shop', links: ['Vent Clips', '3-Packs', 'Bundles', 'Refills'] },
  { title: 'Help', links: ['FAQ', 'Shipping', 'Returns', 'Contact'] },
  { title: 'Connect', links: ['Instagram', 'TikTok', 'Rewards', 'Careers'] },
];

export function KruiseSiteFooter() {
  return (
    <footer style={{ background: 'var(--blueberry-900)', color: 'var(--white)', padding: '56px 24px 32px' }}>
      <div style={{ maxWidth: 'var(--container)', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 32, paddingBottom: 40, borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 30, letterSpacing: '0.02em', marginBottom: 12 }}>KRUISE</div>
            <p style={{ color: 'var(--blueberry-100)', fontSize: 15, lineHeight: 1.6, maxWidth: 260, margin: 0 }}>Car air fresheners that smell like a candy store. Collect all six.</p>
          </div>
          {footerCols.map((col) => (
            <div key={col.title}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>{col.title}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, color: 'var(--blueberry-100)', fontSize: 15 }}>
                {col.links.map((l) => <a key={l} href="#">{l}</a>)}
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12, paddingTop: 20, color: 'var(--blueberry-300)', fontSize: 13 }}>
          <span>© 2026 Kruise</span>
          <div style={{ display: 'flex', gap: 18 }}><a href="#">Terms</a><a href="#">Privacy</a></div>
        </div>
      </div>
    </footer>
  );
}
