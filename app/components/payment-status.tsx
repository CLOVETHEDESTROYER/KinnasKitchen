'use client';
import {useEffect,useState} from 'react';
export default function PaymentStatus(){
 const [status,setStatus]=useState('checking'),[sandbox,setSandbox]=useState(false);
 useEffect(()=>{const controller=new AbortController();const params=new URLSearchParams(window.location.search);let timer:ReturnType<typeof setTimeout>;let tries=0;
 async function check(){try{
  const query=new URLSearchParams({reference:params.get('reference')||'',signature:params.get('signature')||''});
  const response=await fetch('/api/checkout/status?'+query,{signal:controller.signal});const data=await response.json() as {status:string;sandbox?:boolean};
  setStatus(data.status||'unverified');setSandbox(!!data.sandbox);
  if(data.status==='paid'){try{const original=sessionStorage.getItem('kinnas-checkout-bag');if(original&&localStorage.getItem('kinnas-demo-bag')===original)localStorage.removeItem('kinnas-demo-bag');sessionStorage.removeItem('kinnas-checkout-bag');}catch{}}
  else if(data.status==='pending'&&++tries<5)timer=setTimeout(check,3000);
 }catch(e){if(!controller.signal.aborted)setStatus('unverified');}}
 check();return()=>{controller.abort();clearTimeout(timer);};},[]);
 const paid=status==='paid';
 return <div aria-live="polite"><h1>{paid?(sandbox?'Test payment confirmed.':'Thank you for your order.'):status==='checking'?'Checking your payment.':status==='canceled'?'Checkout canceled.':'Payment not yet confirmed.'}</h1><p>{paid?(sandbox?'Square confirmed the Sandbox test payment. This is not a real order.':'Square has confirmed your payment. Please keep your Square receipt for your records.'):status==='checking'?'Please wait while we check with Square.':status==='canceled'?'This checkout was canceled. Your bag is still available.':'We haven’t confirmed a completed payment. Check your Square receipt before trying again, or contact kinnaskitchen@gmail.com for help.'}</p></div>;
}
