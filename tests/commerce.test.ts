import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createHmac} from 'node:crypto';
import {verifySquareSignature,receiptSignature,verifyReceiptSignature,checkoutOrigin} from '../app/lib/square-security';
test('Square webhook signatures bind the exact URL and raw body',()=>{
 const url='https://shop.example/api/square/webhook',key='test-webhook-key',body='{"event_id":"abc"}';
 const signature=createHmac('sha256',key).update(url+body).digest('base64');
 assert.equal(verifySquareSignature(body,signature,url,key),true);
 assert.equal(verifySquareSignature(body+' ',signature,url,key),false);
 assert.equal(verifySquareSignature(body,signature,url+'/',key),false);
 assert.equal(verifySquareSignature(body,'bad',url,key),false);
});
test('Receipt signatures cannot be reused for another order',()=>{
 const key='private-test-signing-secret-123456789',reference='a'.repeat(32)+':20784',sig=receiptSignature(reference,key);
 assert.equal(verifyReceiptSignature(reference,sig,key),true);
 assert.equal(verifyReceiptSignature('b'+reference.slice(1),sig,key),false);
 assert.equal(verifyReceiptSignature(reference,sig,'other'),false);
 assert.equal(verifyReceiptSignature(reference,'',key),false);
});
test('Production checkout trusts the configured origin rather than a forged Host',()=>{
 const saved={...process.env};try{
  process.env.SQUARE_ENVIRONMENT='production';process.env.SITE_URL='https://www.example.com';delete process.env.CHECKOUT_ORIGIN;
  assert.equal(checkoutOrigin(new Request('https://forged.example/api/checkout',{headers:{origin:'https://forged.example'}})),null);
  assert.equal(checkoutOrigin(new Request('https://internal.example/api/checkout',{headers:{origin:'https://www.example.com'}})),'https://www.example.com');
 }finally{process.env=saved;}
});

test('Bag validation merges duplicates and rejects invalid heat/quantity',async()=>{
 const {validateBag}=await import('../app/lib/square');const {products}=await import('../app/lib/products');const p=products[0];
 assert.deepEqual(validateBag([{id:p.id,spice:'Hot',quantity:1},{id:p.id,spice:'Hot',quantity:2}]),[{id:p.id,spice:'Hot',quantity:3}]);
 for(const bad of [[],[{id:p.id,spice:'mystery',quantity:1}],[{id:p.id,spice:'Hot',quantity:0}],[{id:p.id,spice:'Hot',quantity:1.5}],[{id:p.id,spice:'Hot',quantity:100}]])assert.throws(()=>validateBag(bad));
});
test('Hosted and live checkout fail closed without durable storage or on preview',async()=>{
 const saved={...process.env};try{
  const {squareConfig}=await import('../app/lib/square');const {products}=await import('../app/lib/products');
  process.env.SQUARE_ENVIRONMENT='production';process.env.SQUARE_ACCESS_TOKEN='test-token';process.env.SQUARE_LOCATION_ID='test-location';process.env.SQUARE_LIVE_ENABLED='true';process.env.CHECKOUT_SIGNING_SECRET='x'.repeat(40);process.env.SQUARE_MERCHANT_ID='merchant';process.env.SITE_URL='https://example.com';process.env.SQUARE_WEBHOOK_SIGNATURE_KEY='webhook';process.env.SQUARE_WEBHOOK_URL='https://example.com/api/square/webhook';
  process.env.SQUARE_CATALOG_MAPPING=JSON.stringify(Object.fromEntries(products.map(p=>[p.id,Object.fromEntries(p.spices.map(h=>[h,'variation']))])));
  delete process.env.UPSTASH_REDIS_REST_URL;delete process.env.UPSTASH_REDIS_REST_TOKEN;
  assert.equal(squareConfig().enabled,false);
  process.env.UPSTASH_REDIS_REST_URL='https://test.upstash.io';process.env.UPSTASH_REDIS_REST_TOKEN='redis-token';process.env.VERCEL_ENV='production';assert.equal(squareConfig().enabled,true);
  process.env.VERCEL_ENV='preview';assert.equal(squareConfig().enabled,false);
 }finally{process.env=saved;}
});
test('Durable order writes use private authenticated REST and atomic monotonic updates',async()=>{
 const saved={...process.env},original=globalThis.fetch;
 try{
  process.env.SQUARE_ENVIRONMENT='production';process.env.UPSTASH_REDIS_REST_URL='https://test.upstash.io';process.env.UPSTASH_REDIS_REST_TOKEN='private-redis-token';
  const calls:unknown[][]=[];globalThis.fetch=async(input,init)=>{assert.equal(String(input),'https://test.upstash.io/');assert.equal((init?.headers as Record<string,string>).Authorization,'Bearer private-redis-token');const command=JSON.parse(String(init?.body));calls.push(command);return Response.json({result:command[0]==='EVAL'?1:'OK'});};
  const {writeRecord,writePaymentRecord}=await import('../app/lib/commerce-store');
  assert.equal(await writeRecord('receipt:test',{orderId:'order'},600,true),true);
  assert.deepEqual(calls[0].slice(-3),['EX',600,'NX']);
  assert.equal(await writePaymentRecord('order:test',{status:'refunded'},123),true);
  assert.equal(calls[1][0],'EVAL');assert.match(String(calls[1][1]),/sourceUpdatedAt/);
 }finally{globalThis.fetch=original;process.env=saved;}
});
test('Local Sandbox does not overwrite a newer payment state with a delayed event',async()=>{
 const saved={...process.env};try{
  process.env.SQUARE_ENVIRONMENT='sandbox';delete process.env.VERCEL;delete process.env.UPSTASH_REDIS_REST_URL;delete process.env.UPSTASH_REDIS_REST_TOKEN;
  const {writePaymentRecord,readRecord}=await import('../app/lib/commerce-store');const key='order:'+crypto.randomUUID();
  assert.equal(await writePaymentRecord(key,{status:'refunded'},200),true);assert.equal(await writePaymentRecord(key,{status:'paid'},100),false);assert.equal((await readRecord<{status:string}>(key))?.status,'refunded');
 }finally{process.env=saved;}
});

test('Signed webhooks reconcile payment/refund status and safely handle retries',async()=>{
 const saved={...process.env},original=globalThis.fetch;
 try{
  Object.assign(process.env,{SQUARE_ENVIRONMENT:'sandbox',SQUARE_ACCESS_TOKEN:'test-token',SQUARE_LOCATION_ID:'location',SQUARE_MERCHANT_ID:'merchant',SQUARE_WEBHOOK_SIGNATURE_KEY:'test-hook-key',SQUARE_WEBHOOK_URL:'https://shop.example/api/square/webhook'});
  delete process.env.VERCEL;delete process.env.UPSTASH_REDIS_REST_URL;delete process.env.UPSTASH_REDIS_REST_TOKEN;
  let refunded=0,calls=0;
  const orderId='test-'+crypto.randomUUID();
  globalThis.fetch=async input=>{calls++;const path=String(input);if(path.includes('/payments/'))return Response.json({payment:{id:'payment',order_id:orderId,status:'COMPLETED',amount_money:{amount:1200,currency:'USD'},refunded_money:{amount:refunded,currency:'USD'},updated_at:refunded?'2026-11-27T12:00:00Z':'2026-11-27T11:00:00Z'}});if(path.includes('/orders/'))return Response.json({order:{id:orderId,location_id:'location',reference_id:'reference',state:'OPEN',total_money:{amount:1200,currency:'USD'},tenders:[{payment_id:'payment'}],metadata:{website_order:'true',fulfillment_choice:'pickup'}}});throw Error('Unexpected request');};
  const {POST}=await import('../app/api/square/webhook/route');const {readRecord}=await import('../app/lib/commerce-store');
  function request(event:unknown,valid=true){const body=JSON.stringify(event);return new Request('https://shop.example/api/square/webhook',{method:'POST',body,headers:{'x-square-hmacsha256-signature':valid?createHmac('sha256','test-hook-key').update(process.env.SQUARE_WEBHOOK_URL+body).digest('base64'):'invalid'}});}
  const event={event_id:crypto.randomUUID(),merchant_id:'merchant',type:'payment.updated',data:{object:{payment:{id:'payment'}}}};
  assert.equal((await POST(request(event,false))).status,403);assert.equal(calls,0);
  assert.equal((await POST(request({...event,merchant_id:'wrong'}))).status,403);
  assert.equal((await POST(request(event))).status,200);assert.equal((await readRecord<{status:string}>('order:'+orderId))?.status,'paid');
  const before=calls;const repeated=await POST(request(event));assert.equal((await repeated.json()).duplicate,true);assert.equal(calls,before);
  refunded=1200;const refund={event_id:crypto.randomUUID(),merchant_id:'merchant',type:'refund.updated',data:{object:{refund:{id:'refund',payment_id:'payment'}}}};
  assert.equal((await POST(request(refund))).status,200);assert.equal((await readRecord<{status:string}>('order:'+orderId))?.status,'refunded');
  // If a durable backend fails, return retryable status instead of claiming receipt.
  process.env.UPSTASH_REDIS_REST_URL='https://test.upstash.io';process.env.UPSTASH_REDIS_REST_TOKEN='test';
  const retry=await POST(request({...event,event_id:crypto.randomUUID()}));assert.equal(retry.status,503);
 }finally{globalThis.fetch=original;process.env=saved;}
});
