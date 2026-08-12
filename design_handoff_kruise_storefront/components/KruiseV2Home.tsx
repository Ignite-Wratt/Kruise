'use client';
import React, { useRef, useState } from 'react';
import { KruiseButton, type Flavor } from './KruiseButton';
import { KruiseTag } from './KruiseTag';
import { KruiseMarquee } from './KruiseMarquee';
import { useCart } from './KruiseCartProvider';
import { defaultVariant } from './KruiseProductGrid';
import type { KruiseProduct } from '../lib/shopify-types';

/* Storefront v2 — drop-culture home, rebuilt from `Kruise Storefront v2.html`.
   Product data (name, image, price, notes, variant) is live from getProducts();
   swirl / paper-hanger art and the editorial copy come from the design reference. */

const A = (f: string) => `/assets/${f}`;
const scroll = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

// per-SKU design metadata, keyed by handle
type Meta = { swirl: string; paper: string; eyebrow: string; sub: string; desc: string; flag?: string };
const META: Record<string, Meta> = {
  'cherry-bombastic': { swirl: 'cherry', paper: 'paper-cherry-bombastic.png', eyebrow: 'Newest scent', sub: 'Juicy, loud candy-shop cherry that keeps going for a full 30 days.', desc: 'Juicy, loud candy-shop cherry that keeps going for a full 30 days.', flag: 'Best seller' },
  'tropic-punch': { swirl: 'tropic', paper: 'paper-tropic-punch.png', eyebrow: 'Best seller', sub: 'Mango, passionfruit and a squeeze of citrus. Holiday air, school-run car.', desc: 'Mango, passionfruit and a squeeze of citrus. Holiday air, school-run car.' },
  'coconut-bliss': { swirl: 'coconut', paper: 'paper-coconut-bliss.png', eyebrow: 'Fan favourite', sub: 'Toasted coconut and pineapple. The one people text you about later.', desc: 'Warm coconut and vanilla — the softest one in the range by a mile.' },
  'cotton-cloud': { swirl: 'cotton', paper: 'paper-cotton-cloud.png', eyebrow: 'Everyday', sub: 'Fresh laundry on a warm day. The one nobody ever complains about.', desc: 'Fresh laundry on a warm day. The one nobody ever complains about.' },
  'new-car-overdrive': { swirl: 'newcar', paper: 'paper-new-car-overdrive.png', eyebrow: 'New in', sub: 'Showroom leather and clean plastic. Your 2012 hatchback, reborn.', desc: 'Showroom leather and clean plastic. Your 2012 hatchback, reborn.' },
  'tsunami-breeze': { swirl: 'tsunami', paper: 'paper-tsunami-breeze.png', eyebrow: 'In rotation', sub: 'Sea salt and clean air, like the window is down even when it isn’t.', desc: 'Cold blueberry and sea salt. Sharp, clean, weirdly refreshing.' },
  'black-knight': { swirl: 'knight', paper: 'paper-black-knight.png', eyebrow: 'Limited run', sub: 'Dark leather and musk. Built for winter and late drives.', desc: 'Dark amber, tobacco leaf and smoke. The grown-up of the line-up.', flag: 'Limited' },
};
const FLAVOR_SWIRL: Record<string, string> = { cherry: 'cherry', tangerine: 'tropic', wave: 'coconut', sky: 'cotton', marine: 'newcar', graphite: 'knight', lime: 'coconut', lemon: 'tropic', blueberry: 'tsunami' };
const metaFor = (p: KruiseProduct): Meta =>
  META[p.handle] ?? { swirl: FLAVOR_SWIRL[p.flavor] ?? 'cotton', paper: '', eyebrow: 'In rotation', sub: p.notes.join(' · '), desc: p.notes.join(' · ') };

const LIGHT_FLAVORS = ['cherry', 'tangerine', 'wave', 'sky', 'lime', 'lemon'];
const HERO_HANDLES = ['cherry-bombastic', 'tsunami-breeze', 'coconut-bliss', 'black-knight'];

const Arrow = ({ dir }: { dir: 'l' | 'r' }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={dir === 'l' ? 'M19 12H5' : 'M5 12h14'} /><path d={dir === 'l' ? 'M12 19l-7-7 7-7' : 'M12 5l7 7-7 7'} />
  </svg>
);

export function KruiseV2Home({ products }: { products: KruiseProduct[] }) {
  const { add } = useCart();
  const [cur, setCur] = useState(0);
  const [thumb, setThumb] = useState(0);
  const [format, setFormat] = useState(0);
  const railRef = useRef<HTMLDivElement>(null);
  const paused = useRef(false);

  const byHandle = Object.fromEntries(products.map((p) => [p.handle, p]));
  const heroes = HERO_HANDLES.map((h) => byHandle[h]).filter(Boolean) as KruiseProduct[];
  const featured = (heroes.length ? heroes : products).slice(0, 4);
  const bundle = products.slice(0, 5);
  const slideCount = featured.length;

  React.useEffect(() => {
    if (slideCount < 2) return;
    const t = setInterval(() => { if (!paused.current) setCur((c) => (c + 1) % slideCount); }, 5600);
    return () => clearInterval(t);
  }, [slideCount]);

  const addProduct = (p?: KruiseProduct) => { const v = p && defaultVariant(p); if (v) add(v.id); };

  const railStep = (dir: 1 | -1) => {
    const rail = railRef.current; if (!rail) return;
    const card = rail.querySelector('.v2-card') as HTMLElement | null;
    rail.scrollBy({ left: dir * ((card?.offsetWidth ?? 320) + 22), behavior: 'smooth' });
  };

  const gallery = bundle.slice(0, 4);
  const active = gallery[thumb] ?? gallery[0];

  return (
    <>
      {/* hero slideshow */}
      <section className="v2-hero" onMouseEnter={() => { paused.current = true; }} onMouseLeave={() => { paused.current = false; }}>
        {featured.map((p, i) => {
          const m = metaFor(p);
          const [first, ...rest] = p.name.split(' ');
          const light = LIGHT_FLAVORS.includes(p.flavor);
          return (
            <article key={p.id} className="v2-slide kr-swirl" data-swirl={m.swirl} data-on={i === cur}>
              <div className="v2-slide__in">
                <div className="v2-slide__copy">
                  <span className="v2-slide__eyebrow">{m.eyebrow}</span>
                  <h1 className="kr-sticker-text">{first}<br />{rest.join(' ')}</h1>
                  <div className="v2-slide__notes">{p.notes.slice(0, 2).map((n) => <KruiseTag key={n} flavor={p.flavor} size="sm">{n}</KruiseTag>)}</div>
                  <p className="v2-slide__sub">{m.sub}</p>
                  <div className="v2-slide__ctas">
                    <KruiseButton variant={light ? 'flavor' : 'primary'} flavor={light ? (p.flavor as Flavor) : 'cherry'} size="lg" onClick={() => addProduct(p)}>Shop this scent</KruiseButton>
                    <KruiseButton variant="outline" size="lg" onClick={() => scroll('scents')}>See all seven</KruiseButton>
                  </div>
                </div>
                <div className="v2-slide__pack">
                  <img className="v2-slide__clip" src={p.image} alt={`${p.name} vent clip pack`} />
                  {m.paper && <img className="v2-slide__paper" src={A(m.paper)} alt={`${p.name} paper hanger`} />}
                </div>
              </div>
            </article>
          );
        })}
        <span className="kr-try-badge v2-hero__badge">Try<br />me</span>
        <div className="v2-hero__dots">
          {featured.map((p, i) => <button key={p.id} className="v2-dot" aria-current={i === cur} aria-label={`Show scent ${i + 1}`} onClick={() => setCur(i)} />)}
        </div>
      </section>

      {/* claims marquee */}
      <div className="v2-claims">
        <KruiseMarquee>
          <span className="v2-claim">Next level scent</span>
          <span className="v2-claim--alt">Refillable clip</span>
          <span className="v2-claim">30 days, no fade</span>
          <span className="v2-claim--alt">Made in the USA</span>
        </KruiseMarquee>
      </div>

      {/* scent rail */}
      <section className="v2-sec" id="scents">
        <div className="k-wrap">
          <div className="v2-sec__head">
            <div><p className="v2-kicker">All seven</p><h2 className="v2-h2">Meet the scents</h2></div>
            <div className="v2-arrows">
              <button className="v2-arrow" aria-label="Previous" onClick={() => railStep(-1)}><Arrow dir="l" /></button>
              <button className="v2-arrow" aria-label="Next" onClick={() => railStep(1)}><Arrow dir="r" /></button>
            </div>
          </div>
        </div>
        <div className="v2-rail" ref={railRef}>
          {products.map((p) => {
            const m = metaFor(p);
            return (
              <article className="v2-card" key={p.id}>
                <div className="v2-card__art kr-swirl" data-swirl={m.swirl}>
                  {(m.flag || p.badge) && <span className="v2-card__flag">{m.flag ?? p.badge}</span>}
                  <img src={p.image} alt={`${p.name} vent clip`} />
                  <div className="v2-quick"><KruiseButton variant="outline" size="md" fullWidth onClick={() => addProduct(p)}>Add to cart</KruiseButton></div>
                </div>
                <div className="v2-card__body">
                  <h3 className="v2-card__name"><a href={`/products/${p.handle}`}>{p.name}</a></h3>
                  <p className="v2-card__desc">{m.desc}</p>
                  <div className="v2-card__foot"><span className="v2-price">{p.price}</span><span className="v2-card__note">1 clip · 30 days</span></div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* founder note */}
      <section className="v2-note" id="story">
        <div className="v2-note__in">
          <p>“We got tired of cars smelling like nothing. So we built the clip we wanted — 10ml of real scent oil, refillable, still going on day thirty. Seven scents so far. We&apos;re not stopping there.”</p>
          <span className="v2-note__by">The Kruise crew — est. 2024</span>
          <KruiseButton variant="outline" size="md">Our story</KruiseButton>
        </div>
      </section>

      {/* featured drop */}
      <section className="v2-drop" id="drop">
        <div className="v2-drop__grid">
          <div className="v2-gal">
            <div className="v2-gal__main kr-swirl" data-swirl={active ? metaFor(active).swirl : 'cherry'}>
              {active && <img src={active.image} alt={active.name} />}
            </div>
            <div className="v2-gal__thumbs">
              {gallery.map((p, i) => (
                <button key={p.id} className="v2-thumb kr-swirl" data-swirl={metaFor(p).swirl} aria-current={i === thumb} onClick={() => setThumb(i)} aria-label={p.name}>
                  <img src={p.image} alt="" />
                </button>
              ))}
            </div>
          </div>
          <div className="v2-buy">
            <p className="v2-kicker" style={{ margin: 0 }}>Latest drop</p>
            <div className="v2-rate"><span className="v2-stars">★★★★★</span><strong>4.9</strong><span>/ 5.0 · 214 reviews</span></div>
            <h2>The Summer Five</h2>
            <div className="v2-buy__price">$45.00 <span>Tax included · free shipping</span></div>
            <p>Five clips built for windows-down season. Loud fruit, salt air, and one that just smells like a brand new car.</p>
            <ul>
              <li>5 × vent clips — {bundle.map((p) => p.name).join(', ')}</li>
              <li>1 × limited vinyl sticker sheet</li>
              <li>10ml each · 30 days each · fully refillable</li>
            </ul>
            <div>
              <p className="v2-kicker" style={{ marginBottom: 8 }}>Format</p>
              <div className="v2-swatches">
                {['Vent clips', 'Paper hangers', 'Mixed five'].map((f, i) => (
                  <button key={f} className="v2-sw" aria-pressed={i === format} onClick={() => setFormat(i)}>{f}</button>
                ))}
              </div>
            </div>
            <div className="v2-buy__cta">
              <KruiseButton variant="accent" size="lg" onClick={() => bundle.forEach((p) => addProduct(p))}>Add the five</KruiseButton>
              <KruiseButton variant="outline" size="lg" onClick={() => scroll('scents')}>Not sure? See the scents</KruiseButton>
            </div>
          </div>
        </div>
      </section>

      {/* stockists */}
      <section className="v2-stock">
        <h2 className="v2-stock__label">Find us in</h2>
        <KruiseMarquee className="v2-stock">
          {Array.from({ length: 6 }).map((_, i) => <span key={i} className="v2-logo k-empty"><span>stockist logo</span></span>)}
        </KruiseMarquee>
        <div style={{ textAlign: 'center', marginTop: 30 }}><KruiseButton variant="outline" size="md">See all stores</KruiseButton></div>
      </section>
    </>
  );
}
