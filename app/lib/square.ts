import 'server-only';
import { squareSetting } from '../../lib/square-context';
import { products } from './products';
import { durableStoreConfigured } from './commerce-store';
import { receiptSignature, verifyReceiptSignature } from './square-security';
export type BagLine={id:string;spice:string;quantity:number};
export type Mapping=Record<string,Record<string,string>>;
export function squareConfig(){
 const environment=squareSetting('SQUARE_ENVIRONMENT'),token=squareSetting('SQUARE_ACCESS_TOKEN'),locationId=squareSetting('SQUARE_LOCATION_ID');
 let mapping:Mapping={};try{const parsed=JSON.parse(squareSetting('SQUARE_CATALOG_MAPPING')||'{}');if(parsed&&typeof parsed==='object'&&!Array.isArray(parsed))mapping=parsed;}catch{}
 const complete=products.every(p=>p.spices.every(h=>typeof mapping[p.id]?.[h]==='string'&&!!mapping[p.id][h]));
 const signingReady=squareSetting('CHECKOUT_SIGNING_SECRET').length>=32;
 const storageReady=durableStoreConfigured()||(environment==='sandbox'&&!process.env.VERCEL);
 const liveReady=environment==='sandbox'||(squareSetting('SQUARE_LIVE_ENABLED')==='true'&&process.env.VERCEL_ENV!=='preview'&&squareSetting('SQUARE_MERCHANT_ID')&&squareSetting('SITE_URL').startsWith('https://')&&squareSetting('SQUARE_WEBHOOK_SIGNATURE_KEY')&&squareSetting('SQUARE_WEBHOOK_URL').startsWith('https://'));
 const enabled=!!token&&!!locationId&&['sandbox','production'].includes(environment)&&complete&&signingReady&&storageReady&&!!liveReady;
 return {enabled,credentialsReady:!!token&&!!locationId&&['sandbox','production'].includes(environment),environment,token,locationId,mapping,base:environment==='production'?'https://connect.squareup.com':'https://connect.squareupsandbox.com'};
}
export async function squareRequest<T>(path:string,body?:unknown){
 const c=squareConfig();if(!c.credentialsReady)throw Error('Square is not configured.');
 const r=await fetch(c.base+path,{method:body?'POST':'GET',headers:{Authorization:'Bearer '+c.token,'Square-Version':'2026-11-18','Content-Type':'application/json'},body:body?JSON.stringify(body):undefined,cache:'no-store',signal:AbortSignal.timeout(20000)});
 if(!r.ok){console.error('Square request failed',r.status);throw Error('Square could not process this request. Please try again.');}
 return await r.json() as T;
}
export function validateBag(value:unknown):BagLine[]{
 if(!Array.isArray(value)||!value.length||value.length>20)throw Error('Choose between 1 and 20 product options.');
 const merged=new Map<string,BagLine>();
 for(const item of value){
  if(!item||typeof item!=='object')throw Error('Invalid bag.');
  const {id,spice,quantity}=item;
  if(typeof id!=='string'||typeof spice!=='string'||!products.some(p=>p.id===id&&p.spices.includes(spice))||!Number.isInteger(quantity)||quantity<1||quantity>99)throw Error('Check your product options and quantities.');
  const key=id+':'+spice,count=(merged.get(key)?.quantity||0)+quantity;if(count>99)throw Error('Please limit each option to 99 jars.');merged.set(key,{id,spice,quantity:count});
 }
 return [...merged.values()].sort((a,b)=>(a.id+':'+a.spice).localeCompare(b.id+':'+b.spice));
}
export async function signReceipt(payload:string){return receiptSignature(payload,squareSetting('CHECKOUT_SIGNING_SECRET'));}
export async function validReceipt(payload:string,signature:string){return verifyReceiptSignature(payload,signature,squareSetting('CHECKOUT_SIGNING_SECRET'));}
export type SquareMoney={amount:number;currency:string};
export type SquareVariation={id:string;type?:string;is_deleted?:boolean;present_at_all_locations?:boolean;present_at_location_ids?:string[];absent_at_location_ids?:string[];item_variation_data?:{name?:string;item_id?:string;sellable?:boolean;price_money?:SquareMoney}};
export type SquareCatalogResponse={objects?:SquareVariation[];related_objects?:SquareVariation[]};
export type SquareLinkResponse={payment_link:{url:string;order_id:string};related_resources?:{orders?:SquareOrder[]}};
export type SquareOrder={id:string;reference_id?:string;location_id?:string;state:string;updated_at?:string;total_money:SquareMoney;metadata?:Record<string,string>;tenders?:{id?:string;payment_id?:string}[]};
export type SquarePayment={id:string;order_id?:string;status:string;amount_money:SquareMoney;refunded_money?:SquareMoney;tip_money?:SquareMoney;updated_at?:string};
export type SquarePaymentResponse={payment:SquarePayment};
export type PaymentState='paid'|'pending'|'canceled'|'refunded'|'partially_refunded';
export async function orderPaymentSummary(order:SquareOrder):Promise<{status:PaymentState;sourceUpdatedAt:number}>{
 const ids=[...new Set((order.tenders||[]).map(t=>t.payment_id||t.id).filter((id):id is string=>!!id))];
 const payments=await Promise.all(ids.map(id=>squareRequest<SquarePaymentResponse>('/v2/payments/'+encodeURIComponent(id))));
 let paid=0,refunded=0,sourceUpdatedAt=Date.parse(order.updated_at||'')||0;
 for(const {payment:p} of payments){sourceUpdatedAt=Math.max(sourceUpdatedAt,Date.parse(p.updated_at||'')||0);if(p.status==='COMPLETED'&&p.amount_money.currency==='USD'){paid+=p.amount_money.amount+(p.tip_money?.amount||0);refunded+=p.refunded_money?.amount||0;}}
 const status:PaymentState=paid>0&&refunded>=paid?'refunded':refunded>0?'partially_refunded':paid>=order.total_money.amount&&paid>0?'paid':order.state==='CANCELED'?'canceled':'pending';
 return {status,sourceUpdatedAt};
}
export async function orderPaymentState(order:SquareOrder):Promise<PaymentState>{return (await orderPaymentSummary(order)).status;}
