'use client';
import {useRef,useState} from 'react';
import type {BagLine} from '../lib/square';
export default function SquareCheckout({lines,sandbox}:{lines:BagLine[];sandbox:boolean}){
 const [busy,setBusy]=useState(false),[error,setError]=useState(''),[fulfillment,setFulfillment]=useState('');
 const attempt=useRef<{bag:string;id:string}|null>(null);
 async function checkout(){
  if(busy)return;if(!fulfillment){setError('Choose delivery or local pickup.');return;}setBusy(true);setError('');
  try{
   const bag=JSON.stringify({lines,fulfillment});
   if(attempt.current?.bag!==bag)attempt.current={bag,id:crypto.randomUUID()};
   const response=await fetch('/api/checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({lines,fulfillment,attempt:attempt.current!.id})});
   const data=await response.json() as {error?:string;url:string};if(!response.ok)throw Error(data.error||'Checkout could not be opened.');
   try{sessionStorage.setItem('kinnas-checkout-bag',JSON.stringify(lines));}catch{}
   window.location.assign(data.url);
  }catch(e){setError(e instanceof Error?e.message:'Please try checkout again.');setBusy(false);}
 }
 return <><div className="checkout-summary"><fieldset className="fulfillment-options" disabled={busy}><legend>How would you like your order?</legend><label><input type="radio" name="fulfillment" value="delivery" checked={fulfillment==='delivery'} onChange={e=>{setFulfillment(e.target.value);setError('');}}/><span>Delivery</span><strong>$9.99</strong></label><label><input type="radio" name="fulfillment" value="pickup" checked={fulfillment==='pickup'} onChange={e=>{setFulfillment(e.target.value);setError('');}}/><span>Local pickup</span><strong>Free</strong></label></fieldset>{fulfillment==='pickup'&&<p>Contact us after ordering to arrange your pickup time and location. Please wait for confirmation before arriving.</p>}<p>Sales tax is added in Square. Review your final total before paying.</p>{sandbox&&<p className="sandbox-note"><strong>Test checkout only.</strong> No real payment will be taken. Use Square’s Sandbox test details.</p>}</div><button className="button primary full" disabled={busy||!lines.length||!fulfillment} onClick={checkout}>{busy?'Opening Square…':sandbox?'Open test checkout':'Checkout with Square'}</button>{error&&<p className="checkout-error" role="alert">{error}</p>}</>;
}
