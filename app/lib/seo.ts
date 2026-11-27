import type { Metadata } from 'next';

// Keep previews out of search. Set both values explicitly on the production host.
const configuredUrl = process.env.SITE_URL;
export const siteUrl = (configuredUrl || 'https://www.kinnaskitchen.com').replace(/\/$/, '');
export const indexable = process.env.SITE_INDEXABLE === 'true' && process.env.VERCEL_ENV !== 'preview' && Boolean(configuredUrl?.startsWith('https://'));
export const absoluteUrl = (path: string) => new URL(path, `${siteUrl}/`).href;

export function pageMetadata({ title, description, path, image = '/assets/hero-products-v4.webp' }: {
  title: string; description: string; path: string; image?: string;
}): Metadata {
  return {
    title, description, alternates: { canonical: absoluteUrl(path) },
    openGraph: { type: 'website', locale: 'en_US', siteName: 'Kinna’s Kitchen', title, description,
      url: absoluteUrl(path), images: [{ url: absoluteUrl(image), alt: 'Kinna’s Kitchen, Lao roots and New Mexico made' }] },
    twitter: { card: 'summary_large_image', title, description, images: [absoluteUrl(image)] },
  };
}
