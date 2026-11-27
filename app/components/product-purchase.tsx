'use client';
import {useState} from 'react';
import type {Product} from '../lib/products';
export default function ProductPurchase({product}:{product:Product}){
 const [spice,setSpice]=useState(product.spices[0]),[quantity,setQuantity]=useState(1),[error,setError]=useState('');
 function add(){try{
  let lines=JSON.parse(localStorage.getItem('kinnas-demo-bag')||'[]');
  if(!Array.isArray(lines))lines=[];
  lines=lines.filter((x:{id?:string;spice?:string;quantity?:number})=>typeof x?.id==='string'&&typeof x?.spice==='string'&&Number.isInteger(x?.quantity)&&Number(x.quantity)>0&&Number(x.quantity)<=99);
  const existing=lines.find((x:{id:string;spice:string})=>x.id===product.id&&x.spice===spice);
  if(existing)existing.quantity=Math.min(99,existing.quantity+quantity);else lines.push({id:product.id,spice,quantity});
  localStorage.setItem('kinnas-demo-bag',JSON.stringify(lines));window.location.assign('/#bag');
 }catch{setError('Your browser could not save this bag. Please add your jars from the homepage.');}}
 return <div><label className="form-label">Choose your heat<select value={spice} onChange={e=>setSpice(e.target.value)}>{product.spices.map(s=><option key={s}>{s}</option>)}</select></label><label className="form-label">Quantity<input type="number" min="1" max="99" value={quantity} onChange={e=>setQuantity(Math.max(1,Math.min(99,parseInt(e.target.value)||1)))}/></label><button className="button primary full" onClick={add}>Add to bag</button>{error&&<p role="alert">{error}</p>}</div>;
}
