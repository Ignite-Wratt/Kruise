import React from 'react';
import type { Metadata } from 'next';
import { getProduct, getProducts } from '../../../lib/products';
import { KruiseVariantPicker } from '../../../components/KruiseVariantPicker';
import { KruiseProductGrid } from '../../../components/KruiseProductGrid';
import { KruiseTag } from '../../../components/KruiseTag';
import { ArrowRight } from '../../../components/icons';
import type { CardFlavor } from '../../../lib/shopify-types';

// Catalogue is cached for 5 minutes at the fetch level — see lib/shopify.ts.

const chunky = '3px solid var(--border-ink)';
const container: React.CSSProperties = { maxWidth: 'var(--container)', margin: '0 auto' };

const bursts: Record<CardFlavor, [string, string]> = {
  cherry: ['var(--cherry-900)', 'var(--cherry)'],
  tangerine: ['#f0421c', 'var(--tangerine)'],
  lemon: ['var(--lemon-900)', 'var(--lemon)'],
  lime: ['var(--lime-900)', 'var(--lime)'],
  wave: ['var(--wave)', '#3fb6a0'],
  sky: ['var(--sky)', 'var(--sky-300)'],
  blueberry: ['var(--blueberry)', 'var(--blueberry-500)'],
};

export async function generateMetadata({ params }: { params: { handle: string } }): Promise<Metadata> {
  const product = await getProduct(params.handle);
  if (!product) return { title: 'Not found — Kruise' };
  return {
    title: `${product.name} — Kruise`,
    description: product.description.slice(0, 155) || 'Car air fresheners that smell like a candy store.',
  };
}

export default async function productPage({ params }: { params: { handle: string } }) {
  const product = await getProduct(params.handle);

  if (!product) {
    return (
      <section style={{ padding: '96px 24px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--blueberry-900)', fontSize: 'clamp(32px, 4vw, 48px)', margin: '0 0 12px' }}>That scent isn't here</h1>
        <p style={{ fontSize: 18, lineHeight: 1.6, color: 'var(--ink-700)', margin: '0 0 26px' }}>It may have sold out or moved. Have a look at the rest of the range.</p>
        <a href="/#shop" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: '#fff', background: 'var(--blueberry)', border: chunky, boxShadow: '0 5px 0 0 var(--ink-900)', borderRadius: 'var(--radius-pill)', padding: '16px 32px', display: 'inline-flex' }}>Shop all scents</a>
      </section>
    );
  }

  const all = await getProducts();
  const others = all.filter((p) => p.handle !== product.handle).slice(0, 3);
  const [burstA, burstB] = bursts[product.flavor] || bursts.cherry;

  return (
    <div style={{ fontFamily: 'var(--font-body)', color: 'var(--text-body)' }}>
      <section style={{ padding: '28px 24px 64px' }}>
        <div style={container}>
          <nav style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-mono)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--ink-500)', marginBottom: 28 }}>
            <a href="/">Shop</a><span>/</span><span style={{ color: 'var(--blueberry-900)' }}>{product.name}</span>
          </nav>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'start' }}>
            {/* Pack visual */}
            <div
              className="kr-sunburst"
              data-sunburst-rays="fine"
              style={{
                position: 'relative', minHeight: 520, border: chunky, borderRadius: 34,
                boxShadow: 'var(--shadow-pop)', overflow: 'hidden', display: 'grid', placeItems: 'center',
                ['--sunburst-a' as any]: burstA, ['--sunburst-b' as any]: burstB, ['--sunburst-origin' as any]: '50% 40%',
              } as React.CSSProperties}
            >
              <div style={{ position: 'absolute', top: 22, left: '50%', transform: 'translateX(-50%)' }}>
                <span className="kr-wordmark-box" style={{ fontSize: 30 }}>KRUISE</span>
              </div>
              <div className="kr-try-badge" style={{ position: 'absolute', top: 20, right: 20, width: 58, height: 58, fontSize: 12 }}>TRY<br />ME</div>
              <div style={{ width: 300, height: 300, borderRadius: 999, background: 'rgba(255,255,255,0.26)', boxShadow: 'inset 0 0 0 3px rgba(255,255,255,0.45)', display: 'grid', placeItems: 'center', marginTop: 20 }}>
                <img src={product.image} alt={product.name} style={{ maxWidth: '76%', maxHeight: '76%', objectFit: 'contain', filter: 'drop-shadow(0 5px 0 rgba(22,24,58,0.18))' }} />
              </div>
              <div style={{ position: 'absolute', right: 20, bottom: 18, textAlign: 'right', fontFamily: 'var(--font-display)', color: '#fff', lineHeight: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 26 }}>30 DAY</div>
                <div style={{ fontWeight: 700, fontSize: 12, letterSpacing: '0.04em' }}>LONG LASTING</div>
                <div style={{ fontWeight: 600, fontSize: 11, opacity: .85, marginTop: 3 }}>10ML / 0.34 FL OZ</div>
              </div>
            </div>

            {/* Buy box */}
            <div>
              {product.badge && (
                <div style={{ display: 'inline-flex', alignItems: 'center', background: 'var(--cherry)', color: 'var(--white)', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '7px 14px', borderRadius: 999, border: chunky, boxShadow: '0 3px 0 0 var(--ink-900)', marginBottom: 16 }}>
                  {product.badge}
                </div>
              )}
              <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--blueberry-900)', fontSize: 'clamp(38px, 4.5vw, 56px)', lineHeight: 1.02, letterSpacing: '-0.01em', margin: '0 0 14px' }}>{product.name}</h1>

              {product.notes.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
                  {product.notes.map((n) => (
                    <KruiseTag key={n} flavor={product.flavor === 'blueberry' ? 'cherry' : product.flavor}>{n}</KruiseTag>
                  ))}
                </div>
              )}

              <p style={{ fontSize: 18, lineHeight: 1.65, color: 'var(--ink-700)', maxWidth: 460, margin: '0 0 28px', textWrap: 'pretty' } as React.CSSProperties}>
                {product.description || 'Juicy, loud, and long-lasting. Clip it to the vent and let it rip.'}
              </p>

              <KruiseVariantPicker product={product} />
              <div style={{ marginTop: 34, borderTop: '2px solid var(--border-soft)', paddingTop: 22, display: 'grid', gap: 12 }}>
                {[
                  ['Lasts', '45+ days of scent, then swap the refill'],
                  ['Fits', 'Any standard car vent — clip on, twist to dial in'],
                  ['Made with', 'Non-toxic, phthalate-free fragrance oils'],
                ].map(([label, value]) => (
                  <div key={label} style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: 14, fontSize: 15, lineHeight: 1.55 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 12, color: 'var(--ink-500)', paddingTop: 2 }}>{label}</span>
                    <span style={{ color: 'var(--ink-700)' }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {others.length > 0 && (
        <section style={{ background: 'var(--cherry-100)', borderTop: chunky, borderBottom: chunky, padding: '64px 24px' }}>
          <div style={container}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--blueberry-900)', fontSize: 'clamp(28px, 3.5vw, 40px)', margin: 0, letterSpacing: '-0.01em' }}>Collect the rest</h2>
              <a href="/#shop" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--blueberry)', display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 15 }}>Shop all <ArrowRight size={18} /></a>
            </div>
            <KruiseProductGrid products={others} columns={3} />
          </div>
        </section>
      )}
    </div>
  );
}
