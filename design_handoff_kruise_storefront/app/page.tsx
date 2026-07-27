import React from 'react';
import { ArrowRight } from '../components/icons';
import { KruiseButton as Button } from '../components/KruiseButton';
import { KruiseProductGrid } from '../components/KruiseProductGrid';
import { KruiseNewsletterForm } from '../components/KruiseNewsletterForm';
import { getProducts } from '../lib/products';

// Catalogue is cached for 5 minutes at the fetch level — see lib/shopify.ts.

const tiles = [
  { label: 'Vent Clips', bg: 'var(--cherry-100)', a: 'var(--cherry-900)', b: 'var(--cherry)' },
  { label: '3-Packs', bg: 'var(--tangerine-100)', a: '#f0421c', b: 'var(--tangerine)' },
  { label: 'Scent Bundles', bg: 'var(--lime-100)', a: 'var(--wave)', b: '#3fb6a0' },
  { label: 'Refills', bg: 'var(--sky-100)', a: 'var(--sky)', b: 'var(--sky-300)' },
];

const reviews = [
  { quote: '“My whole car smells like a candy store. Everyone asks what it is.”', author: 'Hailey B.' },
  { quote: '“Cherry Bomb still going strong after 6 weeks. Zero spills, all juice.”', author: 'Marcus T.' },
  { quote: '“Collected all six. Wave Rider is my summer, Cloud Nine is my winter.”', author: 'Priya N.' },
];

const editorial = [
  { eyebrow: 'On the drive', eyebrowColor: 'var(--cherry)', title: 'Make the commute smell good.', copy: 'One clip on the vent, and every red light smells like fresh-cut fruit.', cta: 'Shop vent clips', flavor: 'cherry' as const, alt: 'lifestyle — the daily commute', reverse: false },
  { eyebrow: 'Everywhere else', eyebrowColor: 'var(--lime-900)', title: 'Closets, lockers, gym bags.', copy: 'Not just cars. Hang a clip anywhere that could use a little candy-shop glow-up.', cta: 'Shop bundles', flavor: 'lime' as const, alt: 'lifestyle — closet + locker', reverse: true },
  { eyebrow: 'Keep it going', eyebrowColor: 'var(--wave-900)', title: "Refill, don't rebuy.", copy: 'Keep the clip, swap the scent. Half the price, half the waste, all the juice.', cta: 'Shop refills', flavor: 'wave' as const, alt: 'lifestyle — refill pack flatlay', reverse: false },
];

const pressLogos = ['VOGUE', 'GQ', 'Allure', 'Cosmo', 'Hypebeast'];
const igHandles = ['@ava.j', '@driveby', '@milo', '@sunnyd', '@rue', '@theo.g'];
const container: React.CSSProperties = { maxWidth: 'var(--container)', margin: '0 auto' };
const chunky = '3px solid var(--border-ink)';

export default async function storefrontPage() {
  const products = await getProducts();
  const heroProduct = products[0];

  return (
    <div style={{ fontFamily: 'var(--font-body)', color: 'var(--text-body)' }}>
      <section style={{ borderBottom: chunky, overflow: 'hidden', backgroundColor: '#FFDC42' }}>
        <div style={{ ...container, padding: '72px 24px', display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 48, alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--cherry)', color: 'var(--white)', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '7px 14px', borderRadius: 999, border: chunky, boxShadow: '0 3px 0 0 var(--ink-900)' }}>New drop 🍒</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--blueberry-900)', fontSize: 'clamp(44px, 6vw, 76px)', lineHeight: 1.02, letterSpacing: '-0.01em', margin: '20px 0 0' }}>Smells like<br />summer.<br />All drive long.</h1>
            <p style={{ fontSize: 19, lineHeight: 1.6, color: 'var(--ink-700)', maxWidth: 440, margin: '20px 0 0' }}>Clip it to the vent and let it rip. Juicy, loud candy-shop scents that stay fresh for 45+ days.</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 32 }}>
              <a href={heroProduct ? `/products/${heroProduct.handle}` : '#shop'}><Button variant="primary" size="lg">Shop the drop</Button></a>
              <Button variant="outline" size="lg">Take the scent quiz</Button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 28, fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--blueberry-900)', fontSize: 14 }}>
              <span>🌿 Non-toxic</span><span>♻️ Refillable</span><span>⭐ 4.9 / 5</span>
            </div>
          </div>
          <div style={{ position: 'relative', minHeight: 460, display: 'grid', placeItems: 'center' }}>
            <div className="kr-sunburst" style={{ position: 'relative', width: 320, height: 460, border: chunky, borderRadius: 34, boxShadow: 'var(--shadow-pop)', overflow: 'hidden', padding: '26px 22px', ['--sunburst-a' as any]: 'var(--cherry-900)', ['--sunburst-b' as any]: 'var(--cherry)' } as React.CSSProperties}>
              <div style={{ position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)', width: 78, height: 20, borderRadius: 999, background: 'var(--paper)', border: '2px solid var(--sky)' }} />
              <div className="kr-try-badge" style={{ position: 'absolute', top: 16, right: 16, width: 56, height: 56, fontSize: 12 }}>TRY<br />ME</div>
              <div style={{ marginTop: 52, textAlign: 'center' }}><span className="kr-wordmark-box" style={{ fontSize: 44 }}>KRUISE</span></div>
              <div style={{ marginTop: 22, fontFamily: 'var(--font-display)', fontWeight: 800, color: '#fff', fontSize: 38, lineHeight: 0.95, textTransform: 'uppercase', letterSpacing: '0.01em', textShadow: '0 2px 0 rgba(22,24,58,0.25)' }}>{heroProduct?.name || 'Cherry Bombastic'}</div>
              <div style={{ position: 'absolute', left: '50%', bottom: 104, transform: 'translateX(-50%)', width: 150, height: 150, borderRadius: 999, background: 'var(--cherry)', border: '6px solid var(--cherry-300)', display: 'grid', placeItems: 'center', boxShadow: 'inset 0 6px 12px rgba(255,255,255,0.35), inset 0 -6px 12px rgba(22,24,58,0.25)' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: '#fff', fontSize: 26, letterSpacing: '0.01em' }}>KRUISE</span>
              </div>
              <img src={heroProduct?.image || '/assets/cherries.png'} alt="" style={{ position: 'absolute', left: -10, bottom: -10, width: 120, filter: 'drop-shadow(0 4px 0 rgba(22,24,58,0.18))' }} />
              <div style={{ position: 'absolute', right: 18, bottom: 16, textAlign: 'right', fontFamily: 'var(--font-display)', color: '#fff', lineHeight: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 28 }}>30 DAY</div>
                <div style={{ fontWeight: 700, fontSize: 13, letterSpacing: '0.04em' }}>LONG LASTING</div>
                <div style={{ fontWeight: 600, fontSize: 12, opacity: .85, marginTop: 3 }}>10ML / 0.34 FL OZ</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '64px 24px 8px' }}>
        <div style={container}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {tiles.map((t) => (
              <a key={t.label} href="#shop" className="kTile" style={{ transition: 'transform var(--dur) var(--ease-bounce), box-shadow var(--dur) var(--ease-bounce)', background: t.bg, border: chunky, borderRadius: 28, boxShadow: '0 4px 0 0 var(--ink-900)', padding: 22, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="kr-sunburst" data-sunburst-rays="fine" style={{ ['--sunburst-a' as any]: t.a, ['--sunburst-b' as any]: t.b, height: 150, borderRadius: 18, border: '2px solid var(--border-ink)', display: 'grid', placeItems: 'center' } as React.CSSProperties}>
                  <span className="kr-wordmark-box" style={{ fontSize: 22, borderWidth: 3 }}>KRUISE</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--blueberry-900)', fontSize: 18 }}>{t.label} <ArrowRight size={20} /></div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="shop" style={{ padding: '56px 24px' }}>
        <div style={container}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--blueberry-900)', fontSize: 'clamp(32px, 4vw, 44px)', margin: 0, letterSpacing: '-0.01em' }}>Collect all six</h2>
            <a href="#shop" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--blueberry)', display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 15 }}>Shop all <ArrowRight size={18} /></a>
          </div>
          <KruiseProductGrid products={products} />
        </div>
      </section>

      <section style={{ background: 'var(--cherry-100)', borderTop: chunky, borderBottom: chunky, padding: '64px 24px' }}>
        <div style={container}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--blueberry-900)', fontSize: 'clamp(30px, 4vw, 42px)', textAlign: 'center', margin: '0 0 8px', letterSpacing: '-0.01em' }}>Words from the back seat</h2>
          <p style={{ textAlign: 'center', color: 'var(--ink-700)', fontSize: 17, margin: '0 0 36px' }}>45,000+ clips shipped · ⭐ 4.9 average</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {reviews.map((r) => (
              <div key={r.author} style={{ background: 'var(--white)', border: chunky, borderRadius: 24, boxShadow: '0 5px 0 0 var(--ink-900)', padding: 26 }}>
                <div style={{ color: 'var(--tangerine)', fontSize: 18, marginBottom: 10 }}>★★★★★</div>
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--blueberry-900)', fontSize: 19, lineHeight: 1.35, margin: '0 0 16px' }}>{r.quote}</p>
                <div style={{ fontWeight: 700, color: 'var(--ink-500)', fontSize: 14 }}>{r.author}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '72px 24px' }}>
        <div style={container}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--blueberry-900)', fontSize: 'clamp(32px, 4.5vw, 52px)', textAlign: 'center', margin: '0 0 48px', letterSpacing: '-0.01em' }}>Scent every mile.</h2>
          {editorial.map((row) => (
            <div key={row.title} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center', marginBottom: 56 }}>
              <div className="kEmpty" style={{ height: 340, border: chunky, borderRadius: 32, boxShadow: '0 6px 0 0 var(--ink-900)', order: row.reverse ? 2 : 0 }}><span>{row.alt}</span></div>
              <div style={{ order: row.reverse ? 1 : 0 }}>
                <div style={{ fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.12em', fontSize: 13, color: row.eyebrowColor, marginBottom: 10 }}>{row.eyebrow}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--blueberry-900)', fontSize: 32, margin: '0 0 12px' }}>{row.title}</h3>
                <p style={{ fontSize: 17, lineHeight: 1.6, color: 'var(--ink-700)', maxWidth: 420, margin: '0 0 22px' }}>{row.copy}</p>
                <Button variant="flavor" flavor={row.flavor}>{row.cta}</Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: 'var(--surface-sunk)', borderTop: '2px solid var(--border-soft)', borderBottom: '2px solid var(--border-soft)', padding: '36px 24px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
          <span style={{ fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.12em', fontSize: 12, color: 'var(--ink-500)' }}>As seen in</span>
          {pressLogos.map((p) => <span key={p} style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, color: 'var(--blueberry-300)' }}>{p}</span>)}
        </div>
      </section>

      <section style={{ background: 'var(--blueberry)', color: 'var(--white)', padding: '72px 24px' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(30px, 4vw, 44px)', margin: '0 0 12px' }}>Get 15% off ur first clip</h2>
          <p style={{ fontSize: 17, lineHeight: 1.6, color: 'var(--blueberry-100)', margin: '0 0 28px' }}>Join the club for early drops, restocks, and secret flavors before anyone else.</p>
          <KruiseNewsletterForm />
        </div>
      </section>

      <section style={{ padding: '64px 24px' }}>
        <div style={container}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--blueberry-900)', fontSize: 'clamp(28px, 3.5vw, 40px)', margin: '0 0 6px' }}>@kruise in the wild</h2>
            <a href="#" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--cherry)', fontSize: 15 }}>Tag us to be featured</a>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
            {igHandles.map((h) => (
              <div key={h} className="kIgTile kEmpty" style={{ aspectRatio: '1', border: '2px solid var(--border-ink)', borderRadius: 18, transition: 'transform var(--dur) var(--ease-bounce)' }}><span>{h}</span></div>
            ))}
          </div>
        </div>
      </section>

      </div>
  );
}
