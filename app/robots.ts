import type { MetadataRoute } from 'next';
import { absoluteUrl, indexable } from './lib/seo';
export default function robots():MetadataRoute.Robots {
  // Let crawlers read the noindex tags on previews; blocking crawling would hide them.
  return { rules:{userAgent:'*',allow:'/',disallow:['/api/','/checkout/']}, ...(indexable?{sitemap:absoluteUrl('/sitemap.xml')}:{}) };
}
