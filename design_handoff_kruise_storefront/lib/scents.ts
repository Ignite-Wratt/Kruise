import type { CardFlavor, ShopifyProduct } from './shopify-types';

/**
 * Scent notes + flavor colour resolution.
 *
 * Priority: Shopify metafield → product tag → keyword match on the handle/title
 * → deterministic fallback. Set the metafields in Shopify and this file stops
 * mattering; until then the keyword map keeps the design on-brand.
 *
 *   custom.scent_notes  list.single_line_text_field  ["Juicy Cherry","Sour Pop"]
 *   custom.flavor       single_line_text_field       cherry | tangerine | lemon | lime | wave | sky | blueberry
 *   custom.badge        single_line_text_field       NEW | BEST SELLER | ...
 *
 * Tags work too: `flavor:cherry`, `notes:Juicy Cherry`, `badge:NEW`.
 */

export const FLAVORS: CardFlavor[] = ['cherry', 'tangerine', 'lemon', 'lime', 'wave', 'sky', 'marine', 'graphite', 'blueberry'];

interface ScentPreset {
  match: RegExp;
  flavor: CardFlavor;
  notes: string[];
  /** Local art used when the Shopify product has no image yet. */
  image: string;
}

const PRESETS: ScentPreset[] = [
  { match: /cherry|bombast|berry\b/i, flavor: 'cherry', notes: ['Juicy Cherry', 'Sour Pop'], image: '/assets/pack-cherry-bombastic.png' },
  { match: /tropic|punch|pineapple|mango/i, flavor: 'tangerine', notes: ['Pineapple', 'Orange'], image: '/assets/pack-tropic-punch.png' },
  { match: /coconut|bliss/i, flavor: 'wave', notes: ['Coconut', 'Pineapple'], image: '/assets/pack-coconut-bliss.png' },
  { match: /cotton|cloud|candy floss/i, flavor: 'sky', notes: ['Cotton Candy', 'Vanilla'], image: '/assets/pack-cotton-cloud.png' },
  { match: /new.?car|overdrive/i, flavor: 'marine', notes: [], image: '/assets/pack-new-car-overdrive.png' },
  { match: /tsunami|breeze|ocean|sea/i, flavor: 'sky', notes: ['Sea Salt', 'Fresh Air'], image: '/assets/pack-tsunami-breeze.png' },
  { match: /knight|black/i, flavor: 'graphite', notes: [], image: '/assets/pack-black-knight.png' },
];

function preset(product: Pick<ShopifyProduct, 'handle' | 'title' | 'tags'>): ScentPreset | undefined {
  const haystack = `${product.handle} ${product.title} ${(product.tags || []).join(' ')}`;
  return PRESETS.find((p) => p.match.test(haystack));
}

function metafield(product: ShopifyProduct, key: string): string | null {
  const found = (product.metafields || []).find((m) => m && m.key === key);
  return found?.value?.trim() || null;
}

function tagValue(tags: string[] = [], prefix: string): string[] {
  return tags
    .filter((t) => t.toLowerCase().startsWith(`${prefix}:`))
    .map((t) => t.slice(prefix.length + 1).trim())
    .filter(Boolean);
}

/** Deterministic so the same product always gets the same colour across renders. */
function hashFlavor(seed: string): CardFlavor {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 100000;
  return FLAVORS[h % FLAVORS.length];
}

export function resolveFlavor(product: ShopifyProduct): CardFlavor {
  const fromMeta = metafield(product, 'flavor')?.toLowerCase();
  if (fromMeta && FLAVORS.includes(fromMeta as CardFlavor)) return fromMeta as CardFlavor;

  const fromTag = tagValue(product.tags, 'flavor')[0]?.toLowerCase();
  if (fromTag && FLAVORS.includes(fromTag as CardFlavor)) return fromTag as CardFlavor;

  return preset(product)?.flavor ?? hashFlavor(product.handle || product.title);
}

export function resolveNotes(product: ShopifyProduct): string[] {
  const raw = metafield(product, 'scent_notes');
  if (raw) {
    // list.single_line_text_field arrives as a JSON array string.
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.map(String).slice(0, 3);
    } catch {
      return raw.split(/[,/|]/).map((s) => s.trim()).filter(Boolean).slice(0, 3);
    }
  }
  const fromTags = tagValue(product.tags, 'notes');
  if (fromTags.length) return fromTags.slice(0, 3);

  return preset(product)?.notes ?? [];
}

export function resolveBadge(product: ShopifyProduct): string | null {
  const fromMeta = metafield(product, 'badge');
  if (fromMeta) return fromMeta.toUpperCase();

  const fromTag = tagValue(product.tags, 'badge')[0];
  if (fromTag) return fromTag.toUpperCase();

  const tags = (product.tags || []).map((t) => t.toLowerCase());
  if (!product.availableForSale) return 'SOLD OUT';
  if (tags.includes('new')) return 'NEW';
  if (tags.some((t) => t === 'best-seller' || t === 'best seller' || t === 'bestseller')) return 'BEST SELLER';
  return null;
}

/** Local illustration to stand in for a missing Shopify product image. */
export function fallbackImage(product: Pick<ShopifyProduct, 'handle' | 'title' | 'tags'>): string {
  return preset(product)?.image ?? '/assets/kruise-logo.png';
}
