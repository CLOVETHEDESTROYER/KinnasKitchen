import { absoluteUrl } from '../lib/seo';

export function StructuredData({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />;
}

export function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  return <><nav className="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a>{items.map(item => <span key={item.path}> / <a href={item.path}>{item.name}</a></span>)}</nav>
    <StructuredData data={{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ name: 'Home', path: '/' }, ...items].map((item, i) => ({ '@type': 'ListItem', position: i + 1, name: item.name, item: absoluteUrl(item.path) })) }} /></>;
}
