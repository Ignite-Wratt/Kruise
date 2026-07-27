import { shopifyFetch, formatMoney } from './shopify';
import { CART_FRAGMENT, IMAGE_FRAGMENT } from './fragments';
import type { CartView, ShopifyCart } from './shopify-types';

/** localStorage key holding the visitor's Shopify cart id (an anonymous cart GID). */
export const CART_STORAGE_KEY = 'kruise_cart_id';

const wrap = (op: string) => /* GraphQL */ `
  ${IMAGE_FRAGMENT}
  ${CART_FRAGMENT}
  ${op}
`;

export const GET_CART = wrap(/* GraphQL */ `
  query GetCart($id: ID!) {
    cart(id: $id) {
      ...CartFields
    }
  }
`);

export const CREATE_CART = wrap(/* GraphQL */ `
  mutation CreateCart($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
`);

export const ADD_LINES = wrap(/* GraphQL */ `
  mutation AddLines($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
`);

export const UPDATE_LINES = wrap(/* GraphQL */ `
  mutation UpdateLines($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
`);

export const REMOVE_LINES = wrap(/* GraphQL */ `
  mutation RemoveLines($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
`);

export function normalizeCart(cart: ShopifyCart | null | undefined): CartView | null {
  if (!cart) return null;
  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    totalQuantity: cart.totalQuantity,
    subtotal: formatMoney(cart.cost.subtotalAmount.amount, cart.cost.subtotalAmount.currencyCode),
    lines: (cart.lines?.nodes || []).map((l) => {
      const variantTitle = l.merchandise.title === 'Default Title' ? null : l.merchandise.title;
      return {
        id: l.id,
        merchandiseId: l.merchandise.id,
        quantity: l.quantity,
        title: l.merchandise.product?.title || l.merchandise.title,
        variantTitle,
        handle: l.merchandise.product?.handle || '',
        image: l.merchandise.image?.url || l.merchandise.product?.featuredImage?.url || null,
        unitPrice: formatMoney(l.merchandise.price.amount, l.merchandise.price.currencyCode),
        lineTotal: formatMoney(l.cost.totalAmount.amount, l.cost.totalAmount.currencyCode),
      };
    }),
  };
}

/** Fetch a cart by id. Returns null if the cart expired or was completed. */
export async function getCartById(cartId: string): Promise<CartView | null> {
  const data = await shopifyFetch<{ cart: ShopifyCart | null }>({
    query: GET_CART,
    variables: { id: cartId },
    cache: 'no-store',
  });
  return normalizeCart(data?.cart);
}
