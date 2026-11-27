import { squareSetting } from '../../lib/square-context';
import { products } from './products';
export type BagLine = {id:string;spice:string;quantity:number};
type Mapping = Record<string, Record<string, string>>;
export function squareConfig() {
  const environment = squareSetting('SQUARE_ENVIRONMENT');
  const token = squareSetting('SQUARE_ACCESS_TOKEN');
  const locationId = squareSetting('SQUARE_LOCATION_ID');
  let mapping: Mapping = {};
  try { mapping = JSON.parse(squareSetting('SQUARE_CATALOG_MAPPING') || '{}'); } catch { /* Fail closed below. */ }
  // Production requires its own catalog mapping and an explicit launch switch.
  const enabled = !!token && !!locationId && ['sandbox','production'].includes(environment)
    && (environment === 'sandbox' || squareSetting('SQUARE_LIVE_ENABLED') === 'true')
    && products.every(p => p.spices.every(heat => typeof mapping[p.id]?.[heat] === 'string'));
  return {enabled,environment,token,locationId,mapping,base:environment === 'production'?'https://connect.squareup.com':'https://connect.squareupsandbox.com'};
}
export async function squareRequest<T>(path:string, body?:unknown) {
  const config=squareConfig();
  if(!config.enabled)throw new Error('Checkout is not configured.');
  const response=await fetch(config.base+path,{method:body?'POST':'GET',headers:{Authorization:'Bearer '+config.token,'Square-Version':'2026-11-18','Content-Type':'application/json'},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(20000)});
  const data=await response.json();
  if(!response.ok){console.error('Square request failed',response.status);throw new Error('Square could not process this request. Please try again.');}
  return data as T;
}
export function validateBag(value:unknown):BagLine[] {
  if(!Array.isArray(value)||!value.length||value.length>20)throw new Error('Choose between 1 and 20 product options.');
  const merged=new Map<string,BagLine>();
  for(const item of value){
    if(!item||typeof item!=='object')throw new Error('Invalid bag.');
    const {id,spice,quantity}=item;
    if(typeof id!=='string'||typeof spice!=='string'||!products.some(p=>p.id===id&&p.spices.includes(spice))||!Number.isInteger(quantity)||quantity<1||quantity>99)throw new Error('Check your product options and quantities.');
    const key=id+':'+spice;const count=(merged.get(key)?.quantity||0)+quantity;
    if(count>99)throw new Error('Please limit each option to 99 jars.');
    merged.set(key,{id,spice,quantity:count});
  }
  return [...merged.values()];
}
async function signingKey(){return crypto.subtle.importKey('raw',new TextEncoder().encode(squareConfig().token),{name:'HMAC',hash:'SHA-256'},false,['sign','verify']);}
export async function signReceipt(payload:string){const bytes=await crypto.subtle.sign('HMAC',await signingKey(),new TextEncoder().encode(payload));return Array.from(new Uint8Array(bytes),b=>b.toString(16).padStart(2,'0')).join('');}
export async function validReceipt(payload:string,signature:string){if(!/^[a-f0-9]{64}$/.test(signature))return false;return crypto.subtle.verify('HMAC',await signingKey(),Uint8Array.from(signature.match(/../g)!,x=>parseInt(x,16)),new TextEncoder().encode(payload));}

export type SquareMoney={amount:number;currency:string};
export type SquareCatalogResponse={objects?:{id:string;is_deleted?:boolean;item_variation_data?:{sellable?:boolean;price_money?:SquareMoney}}[]};
export type SquareLinkResponse={payment_link:{url:string;order_id:string}};
export type SquareOrder={id:string;reference_id:string;state:string;total_money:SquareMoney;tenders?:{payment_id?:string}[]};
export type SquarePaymentResponse={payment:{status:string;amount_money:SquareMoney;tip_money?:SquareMoney}};
