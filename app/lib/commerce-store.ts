import 'server-only';
import { createHash } from 'node:crypto';

// Memory is only a convenience for local Sandbox. Hosted/live deployments require Redis.
const local = new Map<string,{value:string;expires:number}>();
function storageCredentials(){
 // Keep URL/token pairs together. Vercel's Upstash integration uses KV_* names.
 if(process.env.UPSTASH_REDIS_REST_URL||process.env.UPSTASH_REDIS_REST_TOKEN)return {endpoint:process.env.UPSTASH_REDIS_REST_URL,token:process.env.UPSTASH_REDIS_REST_TOKEN};
 return {endpoint:process.env.KV_REST_API_URL,token:process.env.KV_REST_API_TOKEN};
}
export function durableStoreConfigured(){const {endpoint,token}=storageCredentials();return !!endpoint&&!!token;}
function namespace(key:string){return `kinnas:${process.env.SQUARE_ENVIRONMENT}:${key}`;}
export async function redis(command:(string|number)[]):Promise<unknown>{
 const {endpoint,token}=storageCredentials();
 if(!endpoint||!token)throw Error('Durable order storage is not configured.');
 const url=new URL(endpoint);if(url.protocol!=='https:'||!url.hostname.endsWith('.upstash.io'))throw Error('Invalid order storage endpoint.');
 const response=await fetch(url,{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify(command),cache:'no-store',signal:AbortSignal.timeout(10000)});
 const data=await response.json() as {result:unknown;error?:string};
 if(!response.ok||data.error)throw Error('Order storage is unavailable.');
 return data.result;
}
function memoryAllowed(){return process.env.SQUARE_ENVIRONMENT==='sandbox'&&!process.env.VERCEL;}
export async function readRecord<T>(key:string):Promise<T|null>{
 const full=namespace(key);
 if(durableStoreConfigured()){const result=await redis(['GET',full]);return typeof result==='string'?JSON.parse(result) as T:null;}
 if(!memoryAllowed())throw Error('Durable order storage is required.');
 const result=local.get(full);if(!result||result.expires<Date.now()){local.delete(full);return null;}return JSON.parse(result.value) as T;
}
export async function writeRecord(key:string,value:unknown,seconds:number,onlyIfMissing=false){
 const full=namespace(key),serialized=JSON.stringify(value);
 if(durableStoreConfigured())return await redis(['SET',full,serialized,'EX',seconds,...(onlyIfMissing?['NX']:[])])==='OK';
 if(!memoryAllowed())throw Error('Durable order storage is required.');
 if(onlyIfMissing&&local.has(full)&&local.get(full)!.expires>Date.now())return false;
 if(local.size>5000){for(const [key,item] of local)if(item.expires<Date.now())local.delete(key);if(local.size>5000)throw Error('Local test storage is full. Restart the test server.');}
 local.set(full,{value:serialized,expires:Date.now()+seconds*1000});return true;
}
export async function limitCheckout(ip:string){
 const hashed=createHash('sha256').update(ip).digest('hex').slice(0,24);
 const key=namespace('rate:'+hashed+':'+Math.floor(Date.now()/60000));
 if(durableStoreConfigured()){
  const result=await redis(['EVAL',"local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],70) end; return n",1,key]);
  return typeof result==='number'&&result<=10;
 }
 const count=(await readRecord<number>('rate:'+key)||0)+1;await writeRecord('rate:'+key,count,70);return count<=10;
}
export type CheckoutRecord={reference:string;fingerprint:string;createdAt:string;orderId?:string;url?:string;totalCents?:number};
export const receiptLifetime=7*86400;

export async function writePaymentRecord(key:string,value:Record<string,unknown>,sourceUpdatedAt:number){
 const full=namespace(key),record={...value,sourceUpdatedAt};
 if(durableStoreConfigured()){
  return await redis(['EVAL',"local old=redis.call('GET',KEYS[1]); if old and (cjson.decode(old).sourceUpdatedAt or 0)>tonumber(ARGV[2]) then return 0 end; redis.call('SET',KEYS[1],ARGV[1],'EX',31536000); return 1",1,full,JSON.stringify(record),sourceUpdatedAt])===1;
 }
 const old=await readRecord<{sourceUpdatedAt?:number}>(key);
 if((old?.sourceUpdatedAt||0)>sourceUpdatedAt)return false;
 return writeRecord(key,record,365*86400);
}
