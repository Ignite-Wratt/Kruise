"use client";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { addToCart, fetchCart, removeCartLine, updateCartLine, type CartResult } from '../lib/cart-actions';
import { CART_STORAGE_KEY } from '../lib/cart';
import type { CartView } from '../lib/shopify-types';

interface CartContextValue {
  cart: CartView | null;
  count: number;
  open: boolean;
  pending: boolean;
  error: string | null;
  openCart: () => void;
  closeCart: () => void;
  add: (merchandiseId: string, quantity?: number) => void;
  setQuantity: (lineId: string, quantity: number) => void;
  remove: (lineId: string) => void;
  dismissError: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function KruiseCartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartView | null>(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const cartId = useRef<string | null>(null);

  // Restore the cart id and re-read the cart from Shopify on mount.
  useEffect(() => {
    const stored = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return;
    cartId.current = stored;
    fetchCart(stored).then((res) => {
      if (res.cart) setCart(res.cart);
      // Cart was completed or expired — drop the stale id.
      else window.localStorage.removeItem(CART_STORAGE_KEY);
    });
  }, []);

  const apply = useCallback((res: CartResult) => {
    setError(res.error ?? null);
    if (res.cartId && res.cartId !== cartId.current) {
      cartId.current = res.cartId;
      window.localStorage.setItem(CART_STORAGE_KEY, res.cartId);
    }
    if (res.cart) setCart(res.cart);
  }, []);

  const add = useCallback(
    (merchandiseId: string, quantity = 1) => {
      setOpen(true);
      startTransition(async () => apply(await addToCart(cartId.current, merchandiseId, quantity)));
    },
    [apply]
  );

  const setQuantity = useCallback(
    (lineId: string, quantity: number) => {
      // Optimistic: reflect the new quantity immediately; the server result overwrites it.
      setCart((c) =>
        c
          ? {
              ...c,
              totalQuantity: Math.max(0, c.totalQuantity + (quantity - (c.lines.find((l) => l.id === lineId)?.quantity ?? 0))),
              lines: c.lines.map((l) => (l.id === lineId ? { ...l, quantity } : l)).filter((l) => l.quantity > 0),
            }
          : c
      );
      startTransition(async () => apply(await updateCartLine(cartId.current, lineId, quantity)));
    },
    [apply]
  );

  const remove = useCallback(
    (lineId: string) => {
      setCart((c) =>
        c
          ? {
              ...c,
              totalQuantity: Math.max(0, c.totalQuantity - (c.lines.find((l) => l.id === lineId)?.quantity ?? 0)),
              lines: c.lines.filter((l) => l.id !== lineId),
            }
          : c
      );
      startTransition(async () => apply(await removeCartLine(cartId.current, lineId)));
    },
    [apply]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      count: cart?.totalQuantity ?? 0,
      open,
      pending,
      error,
      openCart: () => setOpen(true),
      closeCart: () => setOpen(false),
      add,
      setQuantity,
      remove,
      dismissError: () => setError(null),
    }),
    [cart, open, pending, error, add, setQuantity, remove]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <KruiseCartProvider>');
  return ctx;
}
