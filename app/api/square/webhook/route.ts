import {verifySquareSignature} from '../../../lib/square-security';
import {squareConfig,squareRequest,orderPaymentSummary,type SquareOrder,type SquarePaymentResponse} from '../../../lib/square';
import {readRecord,writeRecord,writePaymentRecord} from '../../../lib/commerce-store';
export const runtime='nodejs';export const dynamic='force-dynamic';export const maxDuration=60;
type Event={event_id?:string;merchant_id?:string;type?:string;created_at?:string;data?:{object?:{payment?:{id?:string};refund?:{id?:string;payment_id?:string}}}};
export async function POST(request:Request){
 const key=process.env.SQUARE_WEBHOOK_SIGNATURE_KEY,url=process.env.SQUARE_WEBHOOK_URL;
 if(!key||!url)return new Response('Webhook is not configured.',{status:503});
 const raw=await request.text();if(raw.length>1000000)return new Response('Payload too large.',{status:413});
 if(!verifySquareSignature(raw,request.headers.get('x-square-hmacsha256-signature')||'',url,key))return new Response('Invalid signature.',{status:403});
 let event:Event;try{event=JSON.parse(raw);}catch{return new Response('Invalid event.',{status:400});}
 if(!event.event_id||event.event_id.length>200)return new Response('Invalid event.',{status:400});
 if(!process.env.SQUARE_MERCHANT_ID||event.merchant_id!==process.env.SQUARE_MERCHANT_ID)return new Response('Merchant mismatch.',{status:403});
 const supported=['payment.created','payment.updated','refund.created','refund.updated'];
 if(!event.type||!supported.includes(event.type))return Response.json({received:true,ignored:true});
 try{
  if(await readRecord('event:'+event.event_id))return Response.json({received:true,duplicate:true});
  let paymentId=event.data?.object?.payment?.id||event.data?.object?.refund?.payment_id;
  if(!paymentId&&event.data?.object?.refund?.id){const data=await squareRequest<{refund:{payment_id?:string}}>('/v2/refunds/'+encodeURIComponent(event.data.object.refund.id));paymentId=data.refund.payment_id;}
  if(!paymentId)return new Response('Missing payment reference.',{status:400});
  const {payment}=await squareRequest<SquarePaymentResponse>('/v2/payments/'+encodeURIComponent(paymentId));
  if(payment.order_id){
   const {order}=await squareRequest<{order:SquareOrder}>('/v2/orders/'+encodeURIComponent(payment.order_id));
   if(order.location_id===squareConfig().locationId&&order.metadata?.website_order==='true'){
    const {status,sourceUpdatedAt}=await orderPaymentSummary(order);
    // Events are acknowledged only after a durable write. Current Square state is
    // reconciled again on every event; delayed/retried notifications do not cause fulfillment.
    await writePaymentRecord('order:'+order.id,{reference:order.reference_id,status,totalCents:order.total_money.amount,fulfillment:order.metadata.fulfillment_choice,updatedAt:new Date().toISOString(),lastEventId:event.event_id},sourceUpdatedAt);
   }
  }
  await writeRecord('event:'+event.event_id,{processedAt:new Date().toISOString()},30*86400);
  return Response.json({received:true});
 }catch{console.error('Square webhook reconciliation failed');return new Response('Please retry this notification.',{status:503});}
}
