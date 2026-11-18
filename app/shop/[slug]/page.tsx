import { notFound } from 'next/navigation';
import PageShell from '../../components/page-shell';
import { Breadcrumbs, StructuredData } from '../../components/structured-data';
import { products, productPath, recipePath, currentOrderUrl, money } from '../../lib/products';
import { absoluteUrl, pageMetadata } from '../../lib/seo';
import { hasOnlineOrdering } from '../../lib/ordering';
type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams(){return products.map(p=>({slug:p.slug}));}
export async function generateMetadata({params}:Props){const {slug}=await params;const p=products.find(p=>p.slug===slug);if(!p)return {};return pageMetadata({title:`${p.displayName}, ${p.size} | Kinna’s Kitchen`,description:`${p.short} Handcrafted in New Mexico. Explore ${p.displayName}, available heat levels, and a recipe to try at home.`,path:productPath(p),image:p.image});}
export default async function ProductPage({params}:Props){
  const {slug}=await params;const p=products.find(p=>p.slug===slug);if(!p)notFound();
  return <PageShell><Breadcrumbs items={[{name:'Shop',path:'/shop'},{name:p.displayName,path:productPath(p)}]}/>
    <StructuredData data={{'@context':'https://schema.org','@type':'Product','@id':absoluteUrl(productPath(p)+'#product'),name:p.displayName,description:p.short,image:absoluteUrl(p.image),url:absoluteUrl(productPath(p)),brand:{'@type':'Brand',name:'Kinna’s Kitchen'},category:'Chile pastes, sauces and salsa'}}/>
    <article className="single-product"><div className="single-product-photo"><img src={p.image} alt={p.displayName+' jar'} width="600" height="600" fetchPriority="high"/></div><div className="single-product-copy"><p className="eyebrow">{p.vegan?'PLANT-BASED · ':''}{p.size} · NEW MEXICO MADE</p><h1>{p.displayName}</h1><p className="detail-price">{money(p.price)}</p>{p.intro.map(t=><p key={t}>{t}</p>)}<div className="heat-list"><b>Available heat levels</b><p>{p.spices.join(' · ')}</p></div><a className="button primary full" href={currentOrderUrl(p)}>{hasOnlineOrdering?'Order through our current shop':'Ask us about ordering'} <span>↗</span></a><p className="fine-print">{hasOnlineOrdering?'Choose your heat and check current pricing, availability, and delivery options in our current shop.':'Contact us for current prices, availability, and delivery options.'} Always check the current label for ingredients and allergens.</p><a className="text-link" href={recipePath(p)}>Make {p.recipeTitle.toLowerCase()} →</a></div></article>
    <aside className="pantry-note"><p className="eyebrow">A SPOONFUL OF INSPIRATION</p><h2>Bring this jar to the table.</h2><p>{p.vegan?'Pair it with vegetables, tofu, noodles, or a favorite plant-based meal.':'Stir a little into noodles, use it as a dipping sauce, or add it to a favorite marinade.'} Start with a small spoonful and add more to taste.</p><a className="text-link" href="/guides/how-to-use-chile-paste">Explore our kitchen guide →</a></aside>
    <section className="related-products"><p className="eyebrow">MORE FROM OUR PANTRY</p><h2>Find your next <em>favorite.</em></h2><div className="related-grid">{products.filter(x=>x.id!==p.id).map(x=><a href={productPath(x)} key={x.id}><img src={x.image} alt={x.displayName+' jar'} width="280" height="280" loading="lazy"/><h3>{x.displayName}</h3><p>{x.short}</p></a>)}</div></section>
  </PageShell>;
}
