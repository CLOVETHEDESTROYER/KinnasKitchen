import { createHmac, timingSafeEqual } from 'node:crypto';
export function verifySquareSignature(rawBody:string,signature:string,url:string,key:string){
 if(!key||!url||!/^[A-Za-z0-9+/]{43}=$/.test(signature))return false;
 const expected=createHmac('sha256',key).update(url+rawBody).digest();
 const supplied=Buffer.from(signature,'base64');
 return supplied.length===expected.length&&timingSafeEqual(expected,supplied);
}
export function receiptSignature(payload:string,key:string){return createHmac('sha256',key).update(payload).digest('hex');}
export function verifyReceiptSignature(payload:string,signature:string,key:string){
 if(!key||!/^[a-f0-9]{64}$/.test(signature))return false;
 return timingSafeEqual(Buffer.from(signature,'hex'),Buffer.from(receiptSignature(payload,key),'hex'));
}
export function checkoutOrigin(request:Request){
 const actual=new URL(request.url).origin;
 const supplied=request.headers.get('origin');
 const configured=process.env.CHECKOUT_ORIGIN||process.env.SITE_URL;
 if(process.env.SQUARE_ENVIRONMENT==='production'){
  if(!configured)return null;
  const url=new URL(configured);if(url.protocol!=='https:'||supplied!==url.origin)return null;
  return url.origin;
 }
 if(supplied===actual)return actual;
 // Next's local server normalizes request URLs to localhost even when the
 // browser uses 127.0.0.1. Allow that alias only for local Sandbox testing.
 if(process.env.SQUARE_ENVIRONMENT==='sandbox'&&!process.env.VERCEL&&supplied){
  try{
   const source=new URL(supplied),target=new URL(actual);
   const loopback=(host:string)=>host==='localhost'||host==='127.0.0.1';
   if(source.protocol==='http:'&&target.protocol==='http:'&&loopback(source.hostname)&&loopback(target.hostname)&&source.port===target.port)return source.origin;
  }catch{}
 }
 return null;
}
