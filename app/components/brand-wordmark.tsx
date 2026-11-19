export default function BrandWordmark({ href = '/', tagline = 'LAO ROOTS · NEW MEXICO MADE' }: {
  href?: string;
  tagline?: string;
}) {
  return <a href={href} className="wordmark brand-wordmark" aria-label="Kinna’s home">
    <span className="brand-wordmark-line"><img src="/assets/kinnas-wordmark-red-v1.png" width="883" height="221" alt="Kinna’s"/></span>
    <small>{tagline}</small>
  </a>;
}
