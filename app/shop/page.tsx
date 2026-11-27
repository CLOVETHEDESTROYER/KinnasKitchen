import {getStoreProducts} from '../lib/catalog-prices';
export const dynamic='force-dynamic';
import PageShell from '../components/page-shell';
import { Breadcrumbs } from '../components/structured-data';
import { products, productPath, money } from '../lib/products';
import { pageMetadata } from '../lib/seo';
export const metadata = pageMetadata({title:'Shop Lao Chile Pastes & Vegan Sauces | Kinna’s Kitchen',description:'Explore our original Laos Chile Paste, vegan chile paste, tangy tamarind sauce, and mango salsa. Handcrafted family flavors made in New Mexico.',path:'/shop'});
export default async function Shop() {
  const products=await getStoreProducts();
  return <PageShell><Breadcrumbs items={[{name:'Shop',path:'/shop'}]}/><section className="page-intro"><p className="eyebrow">GOOD THINGS COME IN JARS</p><h1>Lao roots.<br/><em>Pantry favorites.</em></h1><p>Small-batch Lao chile pastes, vegan sauces, and mango salsa, made in New Mexico. Find a little heat for your everyday cooking.</p></section>
    <div className="product-grid page-products">{products.map((p,i)=><article className={'product tone-'+i} key={p.id}><a className="product-photo" href={productPath(p)}><span className="product-tag">{p.vegan?'PLANT-BASED':'THE ORIGINAL'}</span><img src={p.imageSmall} srcSet={`${p.imageSmall} 600w, ${p.image} 1254w`} sizes="(max-width:760px) 44vw, 280px" alt={p.displayName+' jar'} width="1254" height="1254" loading="lazy"/><span className="photo-plus" aria-hidden="true">↗</span></a><div className="product-title"><h2><a href={productPath(p)}>{p.displayName}</a></h2><span>{money(p.price)}</span></div><p className="product-size">{p.size} · SMALL BATCH</p><p>{p.short}</p><a className="product-cta" href={productPath(p)}>Explore this jar <span>↗</span></a></article>)}</div>
    <aside className="pantry-note"><h2>Not sure where to start?</h2><p>Choose our original Laos Chile Paste for deep, savory heat, or try the Vegan Chile Paste for a recipe made without fish sauce. Mango Salsa brings sweetness; Tamarind Chile Sauce adds a tangy finish.</p><a className="text-link" href="/guides/how-to-use-chile-paste">A few delicious ways to use chile paste →</a></aside>
  </PageShell>;
}
