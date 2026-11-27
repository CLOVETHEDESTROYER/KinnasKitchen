import 'server-only';
import {cache} from 'react';
import {products,type Product} from './products';
import {squareConfig,squareRequest,type SquareCatalogResponse} from './square';
// Request-scoped only: owners' changes in Square are read afresh, not build-time snapshots.
export const getStoreProducts=cache(async():Promise<Product[]>=>{
 const config=squareConfig();if(!config.enabled)return products;
 try{
  const ids=products.flatMap(p=>p.spices.map(h=>config.mapping[p.id][h]));
  const catalog=await squareRequest<SquareCatalogResponse>('/v2/catalog/batch-retrieve',{object_ids:ids});
  return products.map(p=>{
   const pricesByHeat:Record<string,number>={};
   for(const heat of p.spices){const item=catalog.objects?.find(x=>x.id===config.mapping[p.id][heat]);const price=item?.item_variation_data?.price_money;if(!price||price.currency!=='USD')throw Error('Invalid product price');pricesByHeat[heat]=price.amount/100;}
   return {...p,price:Math.min(...Object.values(pricesByHeat)),pricesByHeat};
  });
 }catch{console.error('Square display prices unavailable; using approved fallback prices. Checkout remains authoritative.');return products;}
});
