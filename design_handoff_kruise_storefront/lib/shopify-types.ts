import type { Flavor } from '../components/KruiseButton';

/* ---------- Raw Shopify shapes ---------- */

export interface Money {
  amount: string;
  currencyCode: string;
}

export interface ShopifyImage {
  url: string;
  altText: string | null;
  width?: number;
  height?: number;
}

export interface SelectedOption {
  name: string;
  value: string;
}

export interface ShopifyVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  quantityAvailable: number | null;
  price: Money;
  compareAtPrice: Money | null;
  selectedOptions: SelectedOption[];
  image: ShopifyImage | null;
}

export interface ShopifyMetafield {
  namespace: string;
  key: string;
  value: string;
  type: string;
}

export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  availableForSale: boolean;
  tags: string[];
  featuredImage: ShopifyImage | null;
  images: { nodes: ShopifyImage[] };
  options: { name: string; optionValues: { name: string }[] }[];
  priceRange: { minVariantPrice: Money };
  variants: { nodes: ShopifyVariant[] };
  metafields: (ShopifyMetafield | null)[];
}

export interface ShopifyCartLine {
  id: string;
  quantity: number;
  cost: { totalAmount: Money };
  merchandise: {
    id: string;
    title: string;
    price: Money;
    selectedOptions: SelectedOption[];
    image: ShopifyImage | null;
    product: { handle: string; title: string; featuredImage: ShopifyImage | null };
  };
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: { subtotalAmount: Money; totalAmount: Money };
  lines: { nodes: ShopifyCartLine[] };
}

/* ---------- Normalized shapes used by the UI ---------- */

export type CardFlavor = Flavor | 'blueberry';

/** A Shopify product mapped onto the Kruise design-system vocabulary. */
export interface KruiseProduct {
  id: string;
  handle: string;
  name: string;
  description: string;
  image: string;
  images: string[];
  /** Display price of the cheapest variant, e.g. "$12". */
  price: string;
  currencyCode: string;
  notes: string[];
  flavor: CardFlavor;
  badge: string | null;
  availableForSale: boolean;
  options: { name: string; values: string[] }[];
  variants: KruiseVariant[];
}

export interface KruiseVariant {
  id: string;
  title: string;
  price: string;
  compareAtPrice: string | null;
  availableForSale: boolean;
  selectedOptions: SelectedOption[];
}

export interface CartLineView {
  id: string;
  merchandiseId: string;
  quantity: number;
  title: string;
  variantTitle: string | null;
  handle: string;
  image: string | null;
  unitPrice: string;
  lineTotal: string;
}

export interface CartView {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  subtotal: string;
  lines: CartLineView[];
}
