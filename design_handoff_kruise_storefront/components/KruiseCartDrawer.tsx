"use client";
import React, { useEffect } from 'react';
import { useCart } from './KruiseCartProvider';
import { KruiseButton as Button } from './KruiseButton';

const chunky = '3px solid var(--border-ink)';

export function KruiseCartDrawer() {
  const { cart, open, closeCart, setQuantity, remove, pending, error, dismissError } = useCart();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, closeCart]);

  const lines = cart?.lines ?? [];

  return (
    <>
      <div
        onClick={closeCart}
        aria-hidden={!open}
        style={{
          position: 'fixed', inset: 0, zIndex: 90, background: 'rgba(22,24,58,0.45)',
          opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 220ms var(--ease-bounce)',
        }}
      />
      <aside
        role="dialog"
        aria-label="Your bag"
        aria-hidden={!open}
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 100,
          width: 'min(420px, 100vw)', background: 'var(--paper)', borderLeft: chunky,
          display: 'flex', flexDirection: 'column',
          transform: open ? 'translateX(0)' : 'translateX(102%)',
          transition: 'transform 320ms var(--ease-bounce)',
          boxShadow: '-8px 0 0 0 rgba(22,24,58,0.12)',
        }}
      >
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '18px 20px', borderBottom: chunky, background: 'var(--blueberry)', color: 'var(--white)' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, letterSpacing: '0.01em' }}>
            Your bag {cart?.totalQuantity ? `(${cart.totalQuantity})` : ''}
          </div>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            style={{ width: 38, height: 38, borderRadius: 999, border: chunky, background: 'var(--white)', color: 'var(--ink-900)', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, lineHeight: 1, cursor: 'pointer', boxShadow: '0 3px 0 0 var(--ink-900)' }}
          >
            ×
          </button>
        </header>

        {error && (
          <div style={{ margin: '14px 16px 0', padding: '12px 14px', background: 'var(--lemon-100, #fff6d6)', border: '2px solid var(--border-ink)', borderRadius: 16, fontSize: 14, lineHeight: 1.5, color: 'var(--ink-900)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span style={{ flex: 1 }}>{error}</span>
            <button onClick={dismissError} aria-label="Dismiss" style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16 }}>×</button>
          </div>
        )}

        <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {lines.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px 16px', color: 'var(--ink-700)' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, color: 'var(--blueberry-900)', marginBottom: 8 }}>Nothing in here yet</div>
              <p style={{ fontSize: 15, lineHeight: 1.6, margin: '0 0 20px' }}>Pick a scent and it'll show up right here.</p>
              <Button variant="primary" onClick={closeCart}>Keep shopping</Button>
            </div>
          )}

          {lines.map((line) => (
            <div key={line.id} style={{ display: 'flex', gap: 12, background: 'var(--white)', border: '2px solid var(--border-ink)', borderRadius: 20, padding: 12, alignItems: 'center' }}>
              <div style={{ width: 64, height: 64, flex: '0 0 64px', borderRadius: 999, background: 'var(--blueberry-50, #f2f4ff)', border: '2px solid var(--border-soft)', display: 'grid', placeItems: 'center', overflow: 'hidden' }}>
                {line.image ? <img src={line.image} alt="" style={{ maxWidth: '78%', maxHeight: '78%', objectFit: 'contain' }} /> : null}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, color: 'var(--blueberry-900)', lineHeight: 1.2 }}>{line.title}</div>
                {line.variantTitle && <div style={{ fontSize: 13, color: 'var(--ink-500)', marginTop: 2 }}>{line.variantTitle}</div>}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 2, border: '2px solid var(--border-ink)', borderRadius: 999, background: 'var(--white)', padding: 2 }}>
                    <Stepper label="Decrease quantity" onClick={() => setQuantity(line.id, line.quantity - 1)}>−</Stepper>
                    <span style={{ minWidth: 22, textAlign: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14 }}>{line.quantity}</span>
                    <Stepper label="Increase quantity" onClick={() => setQuantity(line.id, line.quantity + 1)}>+</Stepper>
                  </div>
                  <button onClick={() => remove(line.id)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 13, color: 'var(--ink-500)', textDecoration: 'underline' }}>Remove</button>
                </div>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, color: 'var(--blueberry-900)' }}>{line.lineTotal}</div>
            </div>
          ))}
        </div>

        {lines.length > 0 && (
          <footer style={{ borderTop: chunky, padding: 18, background: 'var(--white)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--ink-700)' }}>Subtotal</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, color: 'var(--blueberry-900)' }}>{cart?.subtotal}</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--ink-500)', margin: '0 0 14px' }}>Shipping and taxes calculated at checkout. Free over $35.</p>
            <Button
              variant="accent"
              size="lg"
              fullWidth
              disabled={pending || !cart?.checkoutUrl}
              onClick={() => { if (cart?.checkoutUrl) window.location.href = cart.checkoutUrl; }}
            >
              {pending ? 'Updating…' : 'Checkout'}
            </Button>
          </footer>
        )}
      </aside>
    </>
  );
}

function Stepper({ children, label, onClick }: { children: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      style={{ width: 26, height: 26, borderRadius: 999, border: 'none', background: 'var(--blueberry-50, #f2f4ff)', color: 'var(--blueberry-900)', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15, lineHeight: 1, cursor: 'pointer', display: 'grid', placeItems: 'center' }}
    >
      {children}
    </button>
  );
}
