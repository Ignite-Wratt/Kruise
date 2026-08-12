'use client';
import React, { useEffect, useRef, useState } from 'react';
import { KruiseButton, type Flavor } from './KruiseButton';
import { KruiseTag } from './KruiseTag';

/* Storefront v2 — drop-culture home, rebuilt from `Kruise Storefront v2.html`.
   Editorial copy is the design reference's; swap to live Shopify products later. */

const A = (f: string) => `/assets/${f}`;
const scroll = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

type Slide = { eyebrow: string; l1: string; l2: string; notes: string[]; noteFlavor: 'cherry' | 'sky' | 'wave' | 'blueberry'; sub: string; ctaVariant: 'flavor' | 'primary'; ctaFlavor: Flavor; swirl: string; pack: string; paper: string };
const SLIDES: Slide[] = [
  { eyebrow: 'Newest scent', l1: 'Cherry', l2: 'Bombastic', notes: ['Juicy Cherry', 'Sour Pop'], noteFlavor: 'cherry', sub: 'Juicy, loud candy-shop cherry that keeps going for a full 30 days.', ctaVariant: 'flavor', ctaFlavor: 'cherry', swirl: 'cherry', pack: 'pack-cherry-bombastic.png', paper: 'paper-cherry-bombastic.png' },
  { eyebrow: 'In rotation', l1: 'Tsunami', l2: 'Breeze', notes: ['Sea Salt', 'Fresh Air'], noteFlavor: 'sky', sub: 'Sea salt and clean air, like the window is down even when it isn’t.', ctaVariant: 'flavor', ctaFlavor: 'sky', swirl: 'tsunami', pack: 'pack-tsunami-breeze.png', paper: 'paper-tsunami-breeze.png' },
  { eyebrow: 'Fan favourite', l1: 'Coconut', l2: 'Bliss', notes: ['Coconut', 'Pineapple'], noteFlavor: 'wave', sub: 'Toasted coconut and pineapple. The one people text you about later.', ctaVariant: 'flavor', ctaFlavor: 'wave', swirl: 'coconut', pack: 'pack-coconut-bliss.png', paper: 'paper-coconut-bliss.png' },
  { eyebrow: 'Limited run', l1: 'Black', l2: 'Knight', notes: ['Leather', 'Dark Musk'], noteFlavor: 'blueberry', sub: 'Dark leather and musk. Built for winter and late drives.', ctaVariant: 'primary', ctaFlavor: 'cherry', swirl: 'knight', pack: 'pack-black-knight.png', paper: 'paper-black-knight.png' },
];

type Card = { swirl: string; pack: string; name: string; handle: string; desc: string; flag?: string };
const RAIL: Card[] = [
  { swirl: 'cherry', pack: 'pack-cherry-bombastic.png', name: 'Cherry Bombastic', handle: 'cherry-bombastic', desc: 'Juicy, loud candy-shop cherry that keeps going for a full 30 days.', flag: 'Best seller' },
  { swirl: 'tropic', pack: 'pack-tropic-punch.png', name: 'Tropic Punch', handle: 'tropic-punch', desc: 'Mango, passionfruit and a squeeze of citrus. Holiday air, school-run car.' },
  { swirl: 'coconut', pack: 'pack-coconut-bliss.png', name: 'Coconut Bliss', handle: 'coconut-bliss', desc: 'Warm coconut and vanilla — the softest one in the range by a mile.' },
  { swirl: 'tsunami', pack: 'pack-tsunami-breeze.png', name: 'Tsunami Breeze', handle: 'tsunami-breeze', desc: 'Cold blueberry and sea salt. Sharp, clean, weirdly refreshing.' },
  { swirl: 'cotton', pack: 'pack-cotton-cloud.png', name: 'Cotton Cloud', handle: 'cotton-cloud', desc: 'Fresh laundry on a warm day. The one nobody ever complains about.' },
  { swirl: 'newcar', pack: 'pack-new-car-overdrive.png', name: 'New Car Overdrive', handle: 'new-car-overdrive', desc: 'Showroom leather and clean plastic. Your 2012 hatchback, reborn.' },
  { swirl: 'knight', pack: 'pack-black-knight.png', name: 'Black Knight', handle: 'black-knight', desc: 'Dark amber, tobacco leaf and smoke. The grown-up of the line-up.', flag: 'Limited' },
];

const THUMBS = [
  { swirl: 'cherry', img: 'pack-cherry-bombastic.png' },
  { swirl: 'tropic', img: 'pack-tropic-punch.png' },
  { swirl: 'cotton', img: 'pack-cotton-cloud.png' },
  { swirl: 'tsunami', img: 'paper-tsunami-breeze.png' },
];

const Marquee = ({ children, className = '', fast = false }: { children: React.ReactNode; className?: string; fast?: boolean }) => (
  <div className={`mq${fast ? ' mq--fast' : ''} ${className}`}>
    <div className="mq__track">
      <div className="mq__set">{children}</div>
      <div className="mq__set" aria-hidden="true">{children}</div>
    </div>
  </div>
);

export function KruiseV2Home() {
  const [cur, setCur] = useState(0);
  const [thumb, setThumb] = useState(0);
  const [format, setFormat] = useState(0);
  const railRef = useRef<HTMLDivElement>(null);
  const paused = useRef(false);

  useEffect(() => {
    const t = setInterval(() => { if (!paused.current) setCur((c) => (c + 1) % SLIDES.length); }, 5600);
    return () => clearInterval(t);
  }, []);

  const railStep = (dir: 1 | -1) => {
    const rail = railRef.current; if (!rail) return;
    const card = rail.querySelector('.v2-card') as HTMLElement | null;
    rail.scrollBy({ left: dir * ((card?.offsetWidth ?? 320) + 22), behavior: 'smooth' });
  };

  const active = THUMBS[thumb];

  return (
    <>
      {/* ticker */}
      <div className="v2-ticker">
        <Marquee fast>
          <span>Free shipping over $35</span><span className="k-dot">•</span>
          <span>30 day long lasting</span><span className="k-dot">•</span>
          <span>Refill, don&apos;t rebuy</span><span className="k-dot">•</span>
          <span>Collect all 7 scents</span><span className="k-dot">•</span>
        </Marquee>
      </div>

      {/* hero slideshow */}
      <section className="v2-hero" onMouseEnter={() => { paused.current = true; }} onMouseLeave={() => { paused.current = false; }}>
        {SLIDES.map((s, i) => (
          <article key={s.l1} className="v2-slide kr-swirl" data-swirl={s.swirl} data-on={i === cur}>
            <div className="v2-slide__in">
              <div className="v2-slide__copy">
                <span className="v2-slide__eyebrow">{s.eyebrow}</span>
                <h1 className="kr-sticker-text">{s.l1}<br />{s.l2}</h1>
                <div className="v2-slide__notes">{s.notes.map((n) => <KruiseTag key={n} flavor={s.noteFlavor} size="sm">{n}</KruiseTag>)}</div>
                <p className="v2-slide__sub">{s.sub}</p>
                <div className="v2-slide__ctas">
                  <KruiseButton variant={s.ctaVariant} flavor={s.ctaFlavor} size="lg" onClick={() => scroll('drop')}>Shop this scent</KruiseButton>
                  <KruiseButton variant="outline" size="lg" onClick={() => scroll('scents')}>Take the quiz</KruiseButton>
                </div>
              </div>
              <div className="v2-slide__pack">
                <img className="v2-slide__clip" src={A(s.pack)} alt={`${s.l1} ${s.l2} vent clip pack`} />
                <img className="v2-slide__paper" src={A(s.paper)} alt={`${s.l1} ${s.l2} paper hanger`} />
              </div>
            </div>
          </article>
        ))}
        <span className="kr-try-badge v2-hero__badge">Try<br />me</span>
        <div className="v2-hero__dots">
          {SLIDES.map((s, i) => (
            <button key={s.l1} className="v2-dot" aria-current={i === cur} aria-label={`Show scent ${i + 1}`} onClick={() => setCur(i)} />
          ))}
        </div>
      </section>

      {/* claims marquee */}
      <div className="v2-claims">
        <Marquee>
          <span className="v2-claim">Next level scent</span>
          <span className="v2-claim--alt">Refillable clip</span>
          <span className="v2-claim">30 days, no fade</span>
          <span className="v2-claim--alt">Made in the USA</span>
        </Marquee>
      </div>

      {/* scent rail */}
      <section className="v2-sec" id="scents">
        <div className="k-wrap">
          <div className="v2-sec__head">
            <div><p className="v2-kicker">All seven</p><h2 className="v2-h2">Meet the scents</h2></div>
            <div className="v2-arrows">
              <button className="v2-arrow" aria-label="Previous" onClick={() => railStep(-1)}>←</button>
              <button className="v2-arrow" aria-label="Next" onClick={() => railStep(1)}>→</button>
            </div>
          </div>
        </div>
        <div className="v2-rail" ref={railRef}>
          {RAIL.map((c) => (
            <article className="v2-card" key={c.handle}>
              <div className="v2-card__art kr-swirl" data-swirl={c.swirl}>
                {c.flag && <span className="v2-card__flag">{c.flag}</span>}
                <img src={A(c.pack)} alt={`${c.name} vent clip`} />
                <div className="v2-quick"><KruiseButton variant="outline" size="md" fullWidth>Add to cart</KruiseButton></div>
              </div>
              <div className="v2-card__body">
                <h3 className="v2-card__name"><a href={`/products/${c.handle}`}>{c.name}</a></h3>
                <p className="v2-card__desc">{c.desc}</p>
                <div className="v2-card__foot"><span className="v2-price">$12.00</span><span className="v2-card__note">1 clip · 30 days</span></div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* founder note */}
      <section className="v2-note">
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
            <div className="v2-gal__main kr-swirl" data-swirl={active.swirl}><img src={A(active.img)} alt="Featured pack" /></div>
            <div className="v2-gal__thumbs">
              {THUMBS.map((t, i) => (
                <button key={t.img} className="v2-thumb kr-swirl" data-swirl={t.swirl} aria-current={i === thumb} onClick={() => setThumb(i)}>
                  <img src={A(t.img)} alt="" />
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
              <li>5 × vent clips — Cherry Bombastic, Tropic Punch, Coconut Bliss, Tsunami Breeze, New Car Overdrive</li>
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
              <KruiseButton variant="accent" size="lg">Add to cart</KruiseButton>
              <KruiseButton variant="outline" size="lg" onClick={() => scroll('scents')}>Not sure? See the scents</KruiseButton>
            </div>
          </div>
        </div>
      </section>

      {/* stockists */}
      <section className="v2-stock">
        <h2 className="v2-stock__label">Find us in</h2>
        <Marquee className="v2-stock">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="v2-logo k-empty"><span>stockist logo</span></span>
          ))}
        </Marquee>
        <div style={{ textAlign: 'center', marginTop: 30 }}><KruiseButton variant="outline" size="md">See all stores</KruiseButton></div>
      </section>

      {/* social strip */}
      <nav className="v2-social" aria-label="Social">
        <a href="#" style={{ background: 'var(--cherry)' }}>Instagram</a>
        <a href="#" style={{ background: 'var(--graphite-900)' }}>TikTok</a>
        <a href="#" style={{ background: 'var(--tangerine)' }}>YouTube</a>
        <a href="#" style={{ background: 'var(--wave)' }}>Club chat</a>
      </nav>

      {/* newsletter */}
      <section className="v2-news">
        <h2>Sign up for the drops</h2>
        <p>15% off your first clip, plus first look at every restock.</p>
        <form onSubmit={(e) => e.preventDefault()}>
          <input type="email" placeholder="you@email.com" aria-label="Email address" />
          <KruiseButton variant="accent" size="lg" type="submit">Subscribe</KruiseButton>
        </form>
      </section>
    </>
  );
}
