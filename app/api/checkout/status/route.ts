import type {SquareOrder,SquarePaymentResponse} from '../../../lib/square';
import { squareConfig,squareRequest,validReceipt } from '../../../lib/square';
export const dynamic='force-dynamic';
export async function GET(request:Request){
 const headers={'Cache-Control':'no-store'};const params=new URL(request.url).searchParams;
 const reference=params.get('reference')||'',signature=params.get('signature')||'';
 if(!squareConfig().enabled||!/^[a-f0-9]{32}:\d+$/.test(reference)||!await validReceipt(reference,signature))return Response.json({status:'unverified'},{status:400,headers});
 const day=Number(reference.split(':')[1]);if(Math.abs(Math.floor(Date.now()/86400000)-day)>7)return Response.json({status:'expired'},{status:400,headers});
 try{
  const data=await squareRequest<{orders?:SquareOrder[]}>('/v2/orders/search',{location_ids:[squareConfig().locationId],query:{filter:{date_time_filter:{created_at:{start_at:new Date(day*86400000).toISOString()}}},sort:{sort_field:'CREATED_AT',sort_order:'DESC'}},limit:100,return_entries:false});
  // Only expose status for the signed reference, never customer or order details.
  const order=data.orders?.find((x:{reference_id:string})=>x.reference_id===reference);
  if(!order)return Response.json({status:'pending'},{headers});
  const payments=await Promise.all((order.tenders||[]).map((t:{payment_id?:string})=>t.payment_id?squareRequest<SquarePaymentResponse>('/v2/payments/'+encodeURIComponent(t.payment_id)):null));
  const paid=payments.filter((x):x is SquarePaymentResponse=>x!==null).filter(x=>x.payment?.status==='COMPLETED').reduce((sum,x)=>sum+(x.payment.amount_money?.amount||0)+(x.payment.tip_money?.amount||0),0);
  return Response.json({status:paid>=order.total_money.amount&&paid>0?'paid':order.state==='CANCELED'?'canceled':'pending',sandbox:squareConfig().environment==='sandbox'},{headers});
 }catch{return Response.json({status:'unverified'},{status:502,headers});}
}
