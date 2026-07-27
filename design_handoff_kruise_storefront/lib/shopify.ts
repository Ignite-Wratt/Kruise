/**
 * Minimal Shopify Storefront API client.
 *
 * Server-only: the access token is read from the environment and never shipped
 * to the browser. All product/cart data flows through server components and
 * server actions (see lib/cart-actions.ts).
 */

export const SHOPIFY_API_VERSION = '2024-10';

const rawDomain = process.env.SHOPIFY_STORE_DOMAIN || '';
export const SHOPIFY_DOMAIN = rawDomain.replace(/^https?:\/\//, '').replace(/\/$/, '');
const TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || '';

/** True when both env vars are present. When false every call resolves to null and callers fall back to local data. */
export const shopifyConfigured = Boolean(SHOPIFY_DOMAIN && TOKEN);

export const SHOPIFY_ENDPOINT = `https://${SHOPIFY_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;

let warned = false;
function warnMissingEnv() {
  if (warned) return;
  warned = true;
  console.warn(
    '[shopify] SHOPIFY_STORE_DOMAIN / SHOPIFY_STOREFRONT_ACCESS_TOKEN are not set — ' +
      'rendering local fallback products. Copy .env.local.example to .env.local to connect the store.'
  );
}

interface FetchArgs {
  query: string;
  variables?: Record<string, unknown>;
  /** 'force-cache' (default) for catalog reads, 'no-store' for cart mutations. */
  cache?: RequestCache;
  /** Seconds. Only applied when cache is not 'no-store'. */
  revalidate?: number;
  tags?: string[];
}

/** Returns the GraphQL `data` object, or null if unconfigured / the request failed. Never throws. */
export async function shopifyFetch<T>({
  query,
  variables,
  cache = 'force-cache',
  revalidate = 300,
  tags,
}: FetchArgs): Promise<T | null> {
  if (!shopifyConfigured) {
    warnMissingEnv();
    return null;
  }
  try {
    const res = await fetch(SHOPIFY_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': TOKEN,
      },
      body: JSON.stringify({ query, variables }),
      ...(cache === 'no-store' ? { cache } : { cache, next: { revalidate, ...(tags ? { tags } : {}) } }),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);

    const body = (await res.json()) as { data?: T; errors?: { message: string }[] };
    if (body.errors?.length) throw new Error(body.errors.map((e) => e.message).join(' | '));
    return body.data ?? null;
  } catch (err) {
    console.error('[shopify] request failed:', err instanceof Error ? err.message : err);
    return null;
  }
}

export function formatMoney(amount: string | number, currencyCode = 'USD'): string {
  const value = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (!isFinite(value)) return '';
  const whole = value % 1 === 0;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);
}
