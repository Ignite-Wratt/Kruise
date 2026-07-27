'use server';

import { shopifyFetch, shopifyConfigured } from './shopify';
import { ADD_LINES, CREATE_CART, REMOVE_LINES, UPDATE_LINES, getCartById, normalizeCart } from './cart';
import { isLocalId } from './products';
import type { CartView, ShopifyCart } from './shopify-types';

/**
 * Cart server actions.
 *
 * The cart id is owned by the client (localStorage, see KruiseCartProvider) and
 * passed in on every call, so these actions stay framework-agnostic — no cookie
 * plumbing, and the same functions work from a route handler or an edge worker.
 * A Shopify cart id is an anonymous token; nothing sensitive lives in it.
 */

export interface CartResult {
  cart: CartView | null;
  /** Present when a new cart was created — the client should persist it. */
  cartId?: string;
  error?: string;
}

interface MutationPayload {
  cart: ShopifyCart | null;
  userErrors?: { field: string[] | null; message: string }[];
}

function unconfigured(): CartResult {
  return {
    cart: null,
    error: 'Shopify is not connected — add SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN to .env.local.',
  };
}

const firstError = (p?: MutationPayload | null) => p?.userErrors?.[0]?.message;

/** Re-read an existing cart (called on mount to hydrate the drawer). */
export async function fetchCart(cartId: string | null): Promise<CartResult> {
  if (!shopifyConfigured || !cartId) return { cart: null };
  return { cart: await getCartById(cartId) };
}

export async function addToCart(cartId: string | null, merchandiseId: string, quantity = 1): Promise<CartResult> {
  if (!shopifyConfigured || isLocalId(merchandiseId)) return unconfigured();
  const lines = [{ merchandiseId, quantity }];

  // Existing cart: add lines. If it expired, fall through and create a new one.
  if (cartId) {
    const data = await shopifyFetch<{ cartLinesAdd: MutationPayload }>({
      query: ADD_LINES,
      variables: { cartId, lines },
      cache: 'no-store',
    });
    const cart = data?.cartLinesAdd?.cart;
    if (cart) return { cart: normalizeCart(cart), cartId: cart.id, error: firstError(data?.cartLinesAdd) };
  }

  const created = await shopifyFetch<{ cartCreate: MutationPayload }>({
    query: CREATE_CART,
    variables: { lines },
    cache: 'no-store',
  });
  const cart = created?.cartCreate?.cart;
  if (!cart) return { cart: null, error: firstError(created?.cartCreate) || 'Could not add to cart. Please try again.' };
  return { cart: normalizeCart(cart), cartId: cart.id };
}

export async function updateCartLine(cartId: string | null, lineId: string, quantity: number): Promise<CartResult> {
  if (quantity <= 0) return removeCartLine(cartId, lineId);
  if (!shopifyConfigured) return unconfigured();
  if (!cartId) return { cart: null };

  const data = await shopifyFetch<{ cartLinesUpdate: MutationPayload }>({
    query: UPDATE_LINES,
    variables: { cartId, lines: [{ id: lineId, quantity }] },
    cache: 'no-store',
  });
  return { cart: normalizeCart(data?.cartLinesUpdate?.cart), error: firstError(data?.cartLinesUpdate) };
}

export async function removeCartLine(cartId: string | null, lineId: string): Promise<CartResult> {
  if (!shopifyConfigured) return unconfigured();
  if (!cartId) return { cart: null };

  const data = await shopifyFetch<{ cartLinesRemove: MutationPayload }>({
    query: REMOVE_LINES,
    variables: { cartId, lineIds: [lineId] },
    cache: 'no-store',
  });
  return { cart: normalizeCart(data?.cartLinesRemove?.cart), error: firstError(data?.cartLinesRemove) };
}
