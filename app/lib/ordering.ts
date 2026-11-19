// The owners will supply their Square link. Never invent a checkout destination
// or send a customer back to Wix when the link is missing.
export function resolveSquarePaymentLink(value?: string): string | null {
  if (!value?.trim()) return null;
  try {
    const url = new URL(value.trim());
    const squareHost = url.hostname === 'square.link'
      || url.hostname === 'squareup.com'
      || url.hostname.endsWith('.squareup.com')
      || url.hostname.endsWith('.square.site');
    if (url.protocol !== 'https:' || !squareHost || url.username || url.password || (url.port && url.port !== '443')) return null;
    return url.href;
  } catch {
    return null;
  }
}

const configured = process.env.SQUARE_PAYMENT_LINK || process.env.ORDERING_URL;
export const squarePaymentLink = resolveSquarePaymentLink(configured);
export const hasOnlineOrdering = squarePaymentLink !== null;
export const orderingUrl = squarePaymentLink
  || 'mailto:kinnaskitchen@gmail.com?subject=Ordering%20from%20Kinna%E2%80%99s%20Kitchen';
