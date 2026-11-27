// Reports missing configuration without printing secret values or making payments.
const required=['SQUARE_ACCESS_TOKEN','SQUARE_LOCATION_ID','SQUARE_MERCHANT_ID','SQUARE_CATALOG_MAPPING','CHECKOUT_SIGNING_SECRET','SQUARE_WEBHOOK_URL','SQUARE_WEBHOOK_SIGNATURE_KEY','SITE_URL'];
const missing=required.filter(key=>!process.env[key]);
const explicit=process.env.UPSTASH_REDIS_REST_URL||process.env.UPSTASH_REDIS_REST_TOKEN;
if(explicit?!(process.env.UPSTASH_REDIS_REST_URL&&process.env.UPSTASH_REDIS_REST_TOKEN):!(process.env.KV_REST_API_URL&&process.env.KV_REST_API_TOKEN))missing.push('Redis REST URL and read/write token (UPSTASH_REDIS_REST_* or KV_REST_API_*)');
if(missing.length){console.log('Missing production configuration:',missing.join(', '));process.exitCode=1;}
else{console.log('Required configuration is present. Run catalog review and checkout/refund verification before launch.');}
console.log('Environment:',process.env.SQUARE_ENVIRONMENT||'unset');console.log('Live switch:',process.env.SQUARE_LIVE_ENABLED==='true'?'enabled':'disabled');
if(process.env.SQUARE_ENVIRONMENT!=='production')process.exitCode=1;
if(process.env.SQUARE_LIVE_ENABLED!=='true')console.log('Live payments remain disabled.');
