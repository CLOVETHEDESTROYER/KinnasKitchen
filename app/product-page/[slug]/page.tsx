import { notFound, permanentRedirect } from 'next/navigation';
import { products, productPath } from '../../lib/products';
// Preserve links to the four original Wix product URLs when the domain moves.
export default async function LegacyProduct({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;const product=products.find(p=>p.urlPart===slug);
  if(!product)notFound();
  permanentRedirect(productPath(product));
}
