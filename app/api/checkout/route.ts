import type {SquareCatalogResponse,SquareLinkResponse} from '../../lib/square';
import { squareConfig, squareRequest, validateBag, signReceipt } from '../../lib/square';
export const dynamic='force-dynamic';
export async function POST(request:Request){
  const headers={'Cache-Control':'no-store'};
  const url=new URL(request.url);
  if(request.headers.get('origin')!==url.origin)return Response.json({error:'Please start checkout from this website.'},{status:403,headers});
  if(!squareConfig().enabled)return Response.json({error:'Checkout is unavailable. Please contact us for help.'},{status:503,headers});
  let lines,attempt,fulfillment;
  try{
    const text=await request.text();if(text.length>10000)throw Error('Your bag is too large.');
    const body=JSON.parse(text);lines=validateBag(body.lines);attempt=body.attempt;fulfillment=body.fulfillment;
    if(fulfillment!=='delivery'&&fulfillment!=='pickup')throw Error('Choose delivery or local pickup.');
    if(typeof attempt!=='string'||!/^[a-f0-9-]{36}$/.test(attempt))throw Error('Please reopen your bag and try again.');
  }catch(e){return Response.json({error:e instanceof Error?e.message:'Invalid bag.'},{status:400,headers});}
  try{
    const config=squareConfig();
    const mapped=lines.map(line=>({catalog_object_id:config.mapping[line.id][line.spice],quantity:String(line.quantity)}));
    // Square's catalog supplies prices and attached taxes. Do not trust browser totals
    // or use stale stock counts as a sales restriction for these replenished products.
    const catalog=await squareRequest<SquareCatalogResponse>('/v2/catalog/batch-retrieve',{object_ids:mapped.map(x=>x.catalog_object_id)});
    if(mapped.some(line=>!catalog.objects?.some((x:{id:string;is_deleted?:boolean;item_variation_data?:{price_money?:{currency:string;amount:number};sellable?:boolean}})=>x.id===line.catalog_object_id&&!x.is_deleted&&x.item_variation_data?.sellable!==false&&x.item_variation_data?.price_money?.currency==='USD')))throw Error('A product option is unavailable. Please contact us.');
    const payload=attempt.replaceAll('-','')+':'+Math.floor(Date.now()/1000/86400);
    const signature=await signReceipt(payload);
    const returnUrl=new URL('/checkout/return',url.origin);returnUrl.searchParams.set('reference',payload);returnUrl.searchParams.set('signature',signature);
    const result=await squareRequest<SquareLinkResponse>('/v2/online-checkout/payment-links',{
      idempotency_key:attempt,description:'Kinna’s website bag: '+fulfillment,
      payment_note:fulfillment==='pickup'?'Local pickup. Arrange the time and location directly with the customer.':'Delivery order',
      order:{location_id:config.locationId,reference_id:payload,line_items:mapped,pricing_options:{auto_apply_taxes:true},metadata:{fulfillment_choice:fulfillment},...(fulfillment==='pickup'?{fulfillments:[{type:'PICKUP',state:'PROPOSED',pickup_details:{schedule_type:'ASAP',note:'Arrange pickup time and location with the customer. Do not mark ready until confirmed.'}}]}:{})},
      checkout_options:{allow_tipping:false,ask_for_shipping_address:fulfillment==='delivery',...(fulfillment==='delivery'?{shipping_fee:{name:'Delivery',charge:{amount:999,currency:'USD'}}}:{}),merchant_support_email:'kinnaskitchen@gmail.com',redirect_url:returnUrl.href}
    });
    const destination=new URL(result.payment_link.url);
    const allowed=config.environment==='sandbox'?['sandbox.square.link','squareupsandbox.com']:['square.link','squareup.com'];
    if(destination.protocol!=='https:'||!allowed.some(host=>destination.hostname===host||destination.hostname.endsWith('.'+host)))throw Error('Invalid checkout destination.');
    return Response.json({url:destination.href,environment:config.environment},{headers});
  }catch(e){return Response.json({error:e instanceof Error?e.message:'Checkout could not be opened. Please try again.'},{status:502,headers});}
}
