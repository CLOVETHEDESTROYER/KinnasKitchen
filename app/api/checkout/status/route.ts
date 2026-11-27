import type {SquareOrder} from '../../../lib/square';
import {squareConfig,squareRequest,validReceipt,orderPaymentState} from '../../../lib/square';
import {readRecord,writeRecord,receiptLifetime,type CheckoutRecord} from '../../../lib/commerce-store';
export const dynamic='force-dynamic';export const runtime='nodejs';
export async function GET(request:Request){
 const headers={'Cache-Control':'no-store'};const params=new URL(request.url).searchParams;
 const reference=params.get('reference')||'',signature=params.get('signature')||'';
 if(!squareConfig().credentialsReady||!/^[a-f0-9]{32}:\d{5,6}$/.test(reference)||!await validReceipt(reference,signature))return Response.json({status:'unverified'},{status:400,headers});
 const day=Number(reference.split(':')[1]);if(Math.abs(Math.floor(Date.now()/86400000)-day)>7)return Response.json({status:'expired'},{status:400,headers});
 try{
  const record=await readRecord<CheckoutRecord>('receipt:'+reference);
  if(!record?.orderId)return Response.json({status:'pending'},{headers});
  const {order}=await squareRequest<{order:SquareOrder}>('/v2/orders/'+encodeURIComponent(record.orderId));
  if(order.location_id!==squareConfig().locationId||order.reference_id!==reference)throw Error('Order mismatch');
  const status=await orderPaymentState(order);
  await writeRecord('status:'+record.orderId,{status,updatedAt:new Date().toISOString()},receiptLifetime);
  return Response.json({status,sandbox:squareConfig().environment==='sandbox'},{headers});
 }catch{return Response.json({status:'unverified'},{status:502,headers});}
}
