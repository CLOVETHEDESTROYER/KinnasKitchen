import { squareConfig } from './lib/square';
import Storefront from './components/storefront';
import { pageMetadata } from './lib/seo';
import { orderingUrl, hasOnlineOrdering } from './lib/ordering';
export const metadata = pageMetadata({ title: 'Lao Chile Paste, Vegan Sauces & Mango Salsa | Kinna’s Kitchen', description: 'Discover small-batch Lao chile paste, vegan tamarind sauce, and mango salsa made in New Mexico. Explore family recipes and find Kinna’s Kitchen near you.', path: '/' });
export default function Home() { const square = squareConfig(); return <Storefront squareEnabled={square.enabled} squareSandbox={square.environment==='sandbox'} shopUrl={orderingUrl} hasOnlineOrdering={hasOnlineOrdering} />; }
