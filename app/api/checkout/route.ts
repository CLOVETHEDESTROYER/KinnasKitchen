import {createHash} from 'node:crypto';
import type {SquareCatalogResponse,SquareLinkResponse} from '../../lib/square';
import {squareConfig,squareRequest,validateBag,signReceipt} from '../../lib/square';
import {checkoutOrigin} from '../../lib/square-security';
import {readRecord,writeRecord,limitCheckout,receiptLifetime,type CheckoutRecord} from '../../lib/commerce-store';
export const dynamic='force-dynamic';
export const runtime='nodejs';
export const maxDuration=60;
export async function POST(request:Request){
 const headers={'Cache-Control':'no-store'};const origin=checkoutOrigin(request);
 if(!origin)return Response.json({error:'Please start checkout from this website.'},{status:403,headers});
 if(!squareConfig().enabled)return Response.json({error:'Checkout is unavailable. Please contact us for help.'},{status:503,headers});
 let lines,attempt,fulfillment;
 try{
  const text=await request.text();if(text.length>10000)throw Error('Your bag is too large.');
  const body=JSON.parse(text);lines=validateBag(body.lines);attempt=body.attempt;fulfillment=body.fulfillment;
  if(fulfillment!=='delivery'&&fulfillment!=='pickup')throw Error('Choose delivery or local pickup.');
  if(typeof attempt!=='string'||!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(attempt))throw Error('Please reopen your bag and try again.');
 }catch(e){return Response.json({error:e instanceof SyntaxError?'Invalid checkout request.':e instanceof Error?e.message:'Invalid bag.'},{status:400,headers});}
 try{
  const ip=request.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim()||'local';
  if(!await limitCheckout(ip))return Response.json({error:'Please wait a minute before trying checkout again.'},{status:429,headers:{...headers,'Retry-After':'60'}});
  const fingerprint=createHash('sha256').update(JSON.stringify({lines,fulfillment})).digest('hex');
  const key='checkout:'+attempt;let saved=await readRecord<CheckoutRecord>(key);
  if(!saved){await writeRecord(key,{reference:attempt.replaceAll('-','')+':'+Math.floor(Date.now()/86400000),fingerprint,createdAt:new Date().toISOString()},receiptLifetime,true);saved=await readRecord<CheckoutRecord>(key);}
  if(!saved)throw Error('Could not save checkout. Please try again.');
  if(saved.fingerprint!==fingerprint)return Response.json({error:'Your bag changed. Please reopen it before checking out.'},{status:409,headers});
  if(saved.url)return Response.json({url:saved.url,environment:squareConfig().environment},{headers});
  const config=squareConfig();const mapped=lines.map(l=>({catalog_object_id:config.mapping[l.id][l.spice],quantity:String(l.quantity)}));
  const catalog=await squareRequest<SquareCatalogResponse>('/v2/catalog/batch-retrieve',{object_ids:mapped.map(x=>x.catalog_object_id)});
  if(mapped.some(line=>!catalog.objects?.some(x=>x.id===line.catalog_object_id&&!x.is_deleted&&x.item_variation_data?.sellable!==false&&x.item_variation_data?.price_money?.currency==='USD'&&!x.absent_at_location_ids?.includes(config.locationId)&&(x.present_at_all_locations!==false||x.present_at_location_ids?.includes(config.locationId)))))throw Error('A product option is unavailable. Please contact us.');
  const returnUrl=new URL('/checkout/return',origin);returnUrl.searchParams.set('reference',saved.reference);returnUrl.searchParams.set('signature',await signReceipt(saved.reference));
  const result=await squareRequest<SquareLinkResponse>('/v2/online-checkout/payment-links',{
   idempotency_key:attempt,description:'Kinna’s website bag: '+fulfillment,
   payment_note:fulfillment==='pickup'?'Local pickup. Arrange the time and location directly with the customer.':'Delivery order',
   order:{location_id:config.locationId,reference_id:saved.reference,line_items:mapped,pricing_options:{auto_apply_taxes:true},metadata:{fulfillment_choice:fulfillment,website_order:'true'},...(fulfillment==='pickup'?{fulfillments:[{type:'PICKUP',state:'PROPOSED',pickup_details:{schedule_type:'ASAP',note:'Arrange pickup time and location with the customer. Do not mark ready until confirmed.'}}]}:{})},
   checkout_options:{allow_tipping:false,ask_for_shipping_address:fulfillment==='delivery',...(fulfillment==='delivery'?{shipping_fee:{name:'Delivery',charge:{amount:999,currency:'USD'}}}:{}),merchant_support_email:'kinnaskitchen@gmail.com',redirect_url:returnUrl.href},
  });
  const destination=new URL(result.payment_link.url);const allowed=config.environment==='sandbox'?['sandbox.square.link','squareupsandbox.com']:['square.link','squareup.com'];
  if(destination.protocol!=='https:'||!allowed.some(host=>destination.hostname===host||destination.hostname.endsWith('.'+host)))throw Error('Invalid checkout destination.');
  const record={...saved,url:destination.href,orderId:result.payment_link.order_id};
  await writeRecord('receipt:'+saved.reference,record,receiptLifetime);
  await writeRecord(key,record,receiptLifetime);
  await writeRecord('order:'+record.orderId,{reference:saved.reference,status:'pending',fulfillment,updatedAt:new Date().toISOString()},365*86400,true);
  return Response.json({url:destination.href,environment:config.environment},{headers});
 }catch(e){console.error('Checkout handoff failed',e instanceof Error?e.name:'unknown');return Response.json({error:'Checkout could not be opened. Your bag is saved. Please try again or contact us.'},{status:502,headers});}
}
