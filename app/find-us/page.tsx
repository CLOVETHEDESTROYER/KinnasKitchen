import PageShell from '../components/page-shell';
import { Breadcrumbs } from '../components/structured-data';
import { pageMetadata } from '../lib/seo';
const salsaSaintUrl = 'https://www.salsasaint.com/';

export const metadata = pageMetadata({
  title: 'Find Kinna’s Kitchen in New Mexico',
  description: 'Find Kinna’s Kitchen at select New Mexico retailers, including Salsa Saint and Ta-Lin International Market in Albuquerque.',
  path: '/find-us',
  image: '/assets/chili-peppers.webp',
});

export default function FindUs() {
  return (
    <PageShell>
      <Breadcrumbs items={[{ name: 'Find us', path: '/find-us' }]} />
      <section className="page-intro">
        <p className="eyebrow">LAO ROOTS. NEW MEXICO MADE.</p>
        <h1>A little Kinna’s,<br /><em>closer to home.</em></h1>
        <p>Looking for our Lao chile pastes, vegan sauces, or mango salsa in New Mexico? Find us through select retail partners in Albuquerque and around the state.</p>
      </section>
      <p className="stockist-intro">Availability can change. Contact the retailer before making a trip, or ask us where to find your favorite jar.</p>
      <div className="stockist-grid">
        <section>
          <p className="stockist-tagline">Good flavor. Local shelves.</p>
          <h2>Albuquerque</h2>
          <ul>
            <li className="stockist-salsa-saint">
              <a href={salsaSaintUrl} target="_blank" rel="noreferrer" aria-label="Visit Salsa Saint’s website">
                <img src="/assets/retailers/salsa-saint.png" alt="Salsa Saint" />
              </a>
            </li>
            <li><img src="/assets/retailers/talin.png" alt="Ta-Lin International Market" /></li>
          </ul>
        </section>
        <section>
          <p className="stockist-tagline">Your neighborhood pantry stop.</p>
          <h2>Around New Mexico</h2>
          <ul>
            <li className="stockist-kellers"><img src="/assets/retailers/kellers.png" alt="Keller’s Farm Stores" /></li>
            <li className="stockist-text">Select local co-ops</li>
          </ul>
        </section>
      </div>
      <aside className="pantry-note market-note">
        <p className="eyebrow">COME SAY HELLO</p>
        <h2>Looking for us at a growers market?</h2>
        <p>We’d love to help you find us. Get in touch for our current market dates and locations, or ask which nearby shops carry the jar you’re looking for.</p>
        <a className="button primary" href="mailto:kinnaskitchen@gmail.com?subject=Where%20can%20I%20find%20Kinna%E2%80%99s%20Kitchen%3F">Ask Kinna’s Kitchen <span>↗</span></a>
      </aside>
      <section className="local-order">
        <h2>Bring a taste of our kitchen<br /><em>to your table.</em></h2>
        <p>Explore the full pantry and find your favorite flavor.</p>
        <a className="button primary" href="/shop">Shop the pantry <span>↗</span></a>
      </section>
    </PageShell>
  );
}
