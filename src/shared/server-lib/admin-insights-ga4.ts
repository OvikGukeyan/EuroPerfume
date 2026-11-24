import {sign} from "node:crypto";

const tokenUrl = "https://oauth2.googleapis.com/token";
const scope = "https://www.googleapis.com/auth/analytics.readonly";
const defaultHost = "euro-perfume-inky.vercel.app";

type Row = {dimensionValues?: {value?: string}[]; metricValues?: {value?: string}[]};
type Report = {rows?: Row[]; metadata?: {timeZone?: string; subjectToThresholding?: boolean}};
type Credential = {email: string; key: string; kid?: string};
export type Traffic =
  | {status: "not_configured" | "unavailable"}
  | {status: "ok"; hours: number[]; sessions: number; sources: {name: string; sessions: number}[]; timezone: string; partial: boolean};

function credential(raw: string): Credential {
  const config = JSON.parse(raw);
  if (typeof config.client_email !== "string" || typeof config.private_key !== "string") throw new Error("Invalid GA4 service account");
  return {email: config.client_email, key: config.private_key, kid: typeof config.private_key_id === "string" ? config.private_key_id : undefined};
}

function assertion({email,key,kid}: Credential, now: number) {
  const encode = (o: object) => Buffer.from(JSON.stringify(o)).toString("base64url");
  const payload = [encode({alg:"RS256",typ:"JWT",kid}),encode({iss:email,scope,aud:tokenUrl,iat:now,exp:now+300})].join(".");
  return payload + "." + sign("RSA-SHA256", Buffer.from(payload), key).toString("base64url");
}

export async function getTraffic(days: 7 | 30 | 90, env: NodeJS.ProcessEnv = process.env, request = fetch, now = Date.now()): Promise<Traffic> {
  const id = env.GA4_PROPERTY_ID?.trim();
  const raw = env.GA4_SERVICE_ACCOUNT_JSON;
  if (!id || !raw) return {status:"not_configured"};
  const host = env.GA4_STOREFRONT_HOST || defaultHost;
  if (!/^\d{4,20}$/.test(id) || !/^[a-z0-9.-]+$/i.test(host)) return {status:"unavailable"};
  try {
    const tokenResponse = await request(tokenUrl, {method:"POST", body:new URLSearchParams({
      grant_type:"urn:ietf:params:oauth:grant-type:jwt-bearer", assertion:assertion(credential(raw),Math.floor(now/1000))
    }), cache:"no-store", signal:AbortSignal.timeout(3500)});
    if (!tokenResponse.ok) return {status:"unavailable"};
    const {access_token: token} = await tokenResponse.json();
    if (typeof token !== "string" || !token) return {status:"unavailable"};
    const exact = (fieldName: string, value: string) => ({filter:{fieldName,stringFilter:{matchType:"EXACT",value}}});
    const common = {
      dateRanges:[{startDate:days+"daysAgo",endDate:"yesterday"}],
      metrics:[{name:"eventCount"}],
      dimensionFilter:{andGroup:{expressions:[exact("hostName",host),exact("eventName","session_start")]}}
    };
    const endpoint = "https://analyticsdata.googleapis.com/v1beta/properties/"+id+":batchRunReports";
    const response = await request(endpoint,{method:"POST",headers:{authorization:"Bearer "+token,"content-type":"application/json"},body:JSON.stringify({requests:[
      {...common,dimensions:[{name:"hour"}],limit:"24"},
      {...common,dimensions:[{name:"sessionSourceMedium"}], orderBys:[{metric:{metricName:"eventCount"},desc:true}],limit:"10"}
    ]}),cache:"no-store",signal:AbortSignal.timeout(3500)});
    if (!response.ok) return {status:"unavailable"};
    const data = await response.json() as {reports?: Report[]};
    if (data.reports?.length !== 2 || !data.reports[0]?.metadata?.timeZone) return {status:"unavailable"};
    const [byHour,bySource] = data.reports;
    const timezone = byHour.metadata?.timeZone;
    if (!timezone) return {status:"unavailable"};
    const hours = Array<number>(24).fill(0);
    const rowCount = (r: Row) => Math.max(0, Number(r.metricValues?.[0]?.value) || 0);
    for (const row of byHour.rows ?? []) {
      const rawHour = row.dimensionValues?.[0]?.value;
      if (rawHour && /^(0[0-9]|1[0-9]|2[0-3])$/.test(rawHour)) hours[Number(rawHour)] += rowCount(row);
    }
    const sources = (bySource.rows ?? []).map(r => ({name:r.dimensionValues?.[0]?.value || "(not set)",sessions:rowCount(r)}));
    return {status:"ok",hours,sessions:hours.reduce((a,b)=>a+b,0),sources,timezone,partial:data.reports.some(r=>r.metadata?.subjectToThresholding)};
  } catch {
    // No provider payload, credential content, or request details belong in logs or the page.
    return {status:"unavailable"};
  }
}
