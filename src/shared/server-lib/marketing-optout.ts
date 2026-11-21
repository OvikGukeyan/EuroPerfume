import "server-only";
import {createHmac,timingSafeEqual} from "node:crypto";
const purpose="EURO-PERFUME:marketing-optout:v1";
function key(){const s=process.env.NEXTAUTH_SECRET;if(!s||s.length<16)throw new Error("Missing HMAC secret");return s;}
export function marketingOptOutToken(userId:number){
 if(!Number.isSafeInteger(userId)||userId<=0)throw new Error("Invalid user");
 const value=String(userId);
 const digest=createHmac("sha256",key()).update(purpose+":"+value).digest("hex");
 return Buffer.from(value+":"+digest).toString("base64url");
}
export function optOutUserId(token:string):number|null{
 try{
  if(!token||token.length>180)return null;
  const [id,actual]=Buffer.from(token,"base64url").toString("utf8").split(":");
  const userId=Number(id);
  if(!Number.isSafeInteger(userId)||userId<=0||!actual||!/^[a-f0-9]{64}$/.test(actual))return null;
  const expected=createHmac("sha256",key()).update(purpose+":"+id).digest();
  const supplied=Buffer.from(actual,"hex");
  return timingSafeEqual(expected,supplied)?userId:null;
 }catch{return null;}
}
