import type { MetadataRoute } from 'next';
import { products, productPath, recipePath } from './lib/products';
import { absoluteUrl, indexable } from './lib/seo';
export default function sitemap():MetadataRoute.Sitemap {
  if(!indexable)return [];
  return ['/', '/shop', '/recipes', '/find-us', '/guides/how-to-use-chile-paste', ...products.flatMap(p=>[productPath(p),recipePath(p)])].map(path=>({url:absoluteUrl(path)}));
}
