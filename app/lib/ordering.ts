import { indexable } from './seo';
// Square is confirmed, but no owner-approved checkout URL has been supplied.
// The old Wix shop is usable during review, never as a fallback on its replacement domain.
const configured = process.env.ORDERING_URL;
export const orderingUrl = configured?.startsWith('https://') ? configured
  : indexable ? 'mailto:kinnaskitchen@gmail.com?subject=Ordering%20from%20Kinna%E2%80%99s%20Kitchen'
  : 'https://www.kinnaskitchen.com/shop';
export const hasOnlineOrdering = orderingUrl.startsWith('https://');
export const useOriginalShop = !configured && !indexable;
