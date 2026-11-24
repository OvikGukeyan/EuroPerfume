import {test} from "node:test";
import assert from "node:assert/strict";
import {generateKeyPairSync,verify} from "node:crypto";
import {getTraffic} from "../src/shared/server-lib/admin-insights-ga4.ts";
import {berlinHour,insightDays,pageNumber,promoKey} from "../src/shared/server-lib/admin-insights-metrics.ts";
const {privateKey,publicKey}=generateKeyPairSync("rsa",{modulusLength:2048});
const env={GA4_PROPERTY_ID:"1234567",GA4_SERVICE_ACCOUNT_JSON:JSON.stringify({
 client_email:"test@example.com",private_key_id:"key",private_key:privateKey.export({type:"pkcs8",format:"pem"}).toString()
})};
test("missing GA access never silently fabricates zeros or sends network requests",async()=>{
 let calls=0;
 const mock=async()=>{calls++;throw new Error("no");};
 assert.deepEqual(await getTraffic(7,{},mock),{status:"not_configured"});
 assert.deepEqual(await getTraffic(7,{...env,GA4_PROPERTY_ID:"../invalid"},mock),{status:"unavailable"});
 assert.equal(calls,0);
});
test("scoped, signed GA assertion and storefront-only date/host session aggregation",async()=>{
 let calls=0;
 const mock=async (url,options)=>{
  calls++;
  if(calls===1){
   assert.equal(url,"https://oauth2.googleapis.com/token");
   const [h,p,s]=options.body.get("assertion").split(".");
   assert.equal(verify("RSA-SHA256",Buffer.from(h+"."+p),publicKey,Buffer.from(s,"base64url")),true);
   const claims=JSON.parse(Buffer.from(p,"base64url"));
   assert.equal(claims.scope,"https://www.googleapis.com/auth/analytics.readonly");
   assert.equal(claims.exp-claims.iat,300);
   return Response.json({access_token:"fixture"});
  }
  assert.equal(url,"https://analyticsdata.googleapis.com/v1beta/properties/1234567:batchRunReports");
  assert.equal(options.headers.authorization,"Bearer fixture");
  const req=JSON.parse(options.body).requests;
  assert.deepEqual(req[0].dateRanges,[{startDate:"7daysAgo",endDate:"yesterday"}]);
  assert.deepEqual(req[0].dimensionFilter.andGroup.expressions.map(v=>v.filter.stringFilter.value),["euro-perfume-inky.vercel.app","session_start"]);
  const r=(k,v)=>({dimensionValues:[{value:k}],metricValues:[{value:String(v)}]});
  return Response.json({reports:[
   {metadata:{timeZone:"Europe/Berlin"},rows:[r("00",2),r("19",12),r("25",88)]},
   {metadata:{subjectToThresholding:true},rows:[r("instagram / social",3)]},
  ]});
 };
 const got=await getTraffic(7,env,mock);
 assert.equal(got.status,"ok");
 assert.equal(got.sessions,14);
 assert.equal(got.hours.length,24);
 assert.equal(got.hours[19],12);
 assert.equal(got.partial,true);
 assert.equal(got.sources[0].sessions,3);
});
test("provider rejection is unavailable, not a zero report",async()=>{
 assert.deepEqual(await getTraffic(7,env,async()=>Response.json({privateError:"do not forward"},{status:403})),{status:"unavailable"});
});
test("periods, paging, private coupon grouping and Berlin daylight saving",()=>{
 assert.equal(insightDays(["7","90"]),30);
 assert.equal(insightDays("90"),90);
 assert.equal(pageNumber("-755"),1);
 assert.equal(promoKey(" ep15-fixture"),"legacy15");
 assert.equal(promoKey("WELCOME10"),"WELCOME10");
 assert.equal(berlinHour(new Date("2026-01-01T23:25:00Z")),0);
 assert.equal(berlinHour(new Date("2026-07-01T23:25:00Z")),1);
});
