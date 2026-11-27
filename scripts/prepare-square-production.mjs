// Read-only live catalog validation. Run with Node --env-file=work/production-square.env.
// This script never creates products, changes inventory, enables payments or prints tokens.
import fs from 'node:fs';
import path from 'node:path';
const out=path.resolve('work');fs.mkdirSync(out,{recursive:true});
const env=process.env;
if(env.SQUARE_ENVIRONMENT!=='production'||!env.SQUARE_ACCESS_TOKEN)throw Error('Add a production token to the ignored work/production-square.env file first.');
const headers={Authorization:`Bearer ${env.SQUARE_ACCESS_TOKEN}`,'Square-Version':'2026-11-18','Content-Type':'application/json'};
async function get(endpoint){const response=await fetch('https://connect.squareup.com'+endpoint,{headers,signal:AbortSignal.timeout(20000)});if(!response.ok)throw Error(`Square read failed (${response.status}). Check account access.`);return response.json();}
const {locations=[]}=await get('/v2/locations');
const {merchant}=await get('/v2/merchants/me');
console.log('Available location IDs:',locations.map(x=>`${x.id} (${x.status})`).join(', '));
if(!env.SQUARE_LOCATION_ID||!locations.some(x=>x.id===env.SQUARE_LOCATION_ID&&x.status==='ACTIVE'))throw Error('Set SQUARE_LOCATION_ID to the active fulfillment location, then rerun.');
const location=locations.find(x=>x.id===env.SQUARE_LOCATION_ID);
let cursor,objects=[];
do{const data=await get('/v2/catalog/list?types=ITEM,TAX'+(cursor?'&cursor='+encodeURIComponent(cursor):''));objects.push(...(data.objects||[]));cursor=data.cursor;}while(cursor);
const products=JSON.parse(fs.readFileSync('app/data/storefront.json','utf8')).products;
const mapping={},review=[];
for(const p of products){mapping[p.id]={};for(const heat of p.spices){
 const candidates=[];
 for(const item of objects.filter(x=>x.type==='ITEM'&&!x.is_deleted&&!x.item_data?.is_archived)){
  const text=item.item_data.name.toLowerCase().replace(/[^a-z0-9]/g,'');
  const matches=p.slug==='laos-chile-paste'?text.includes('laoschilepaste')&&!text.includes('vegan')&&text.includes('6oz'):p.slug==='vegan-chile-paste'?text.includes('veganchilepaste')&&text.includes('6oz'):p.slug==='vegan-mango-salsa'?text.includes('veganmangosalsa'):text.includes('vegan')&&text.includes('tamarind');
  if(!matches)continue;
  for(const variation of item.item_data.variations||[]){
   if(variation.is_deleted)continue;
   const combined=(item.item_data.name+' '+(variation.item_variation_data?.name||'')).toLowerCase().replace(/(\d+\s*oz)(?=[a-z])/g,'$1 ');
   const exactHeat=heat==='X-Hot'?/extra\s*hot|x[ -]?hot/.test(combined):heat==='Hot'?/\bhot\b/.test(combined)&&!/extra\s*hot|x[ -]?hot/.test(combined):new RegExp('\\b'+heat+'\\b','i').test(combined);
   // The existing 6 oz original item has no heat label; website currently offers Hot only.
   if(exactHeat||(p.slug==='laos-chile-paste'&&p.spices.length===1))candidates.push({item,variation});
  }
 }
 if(candidates.length===1){const {item,variation}=candidates[0];mapping[p.id][heat]=variation.id;review.push({product:p.displayName,heat,itemId:item.id,variationId:variation.id,squareName:item.item_data.name,price:variation.item_variation_data.price_money,taxIds:item.item_data.tax_ids||[],locationEligible:!variation.absent_at_location_ids?.includes(location.id)&&(variation.present_at_all_locations!==false||variation.present_at_location_ids?.includes(location.id))});}
 else review.push({product:p.displayName,heat,requiresReview:true,candidates:candidates.map(x=>({itemId:x.item.id,variationId:x.variation.id,name:x.item.item_data.name}))});
}}
const report={readOnly:true,locationId:location.id,merchantId:merchant.id,mapping,review,taxes:objects.filter(x=>x.type==='TAX').map(x=>({id:x.id,name:x.tax_data.name,percentage:x.tax_data.percentage,enabled:x.tax_data.enabled}))};
fs.writeFileSync(path.join(out,'square-production-review.json'),JSON.stringify(report,null,2),{mode:0o600});
fs.writeFileSync(path.join(out,'square-production-mapping.json'),JSON.stringify(mapping),{mode:0o600});
console.log('Read-only report and proposed mapping saved under ignored work/.');
console.log('Automatically matched choices:',review.filter(x=>!x.requiresReview).length,'of',review.length);
console.log('Review all prices, taxes, location eligibility and unmatched choices before enabling live checkout.');
