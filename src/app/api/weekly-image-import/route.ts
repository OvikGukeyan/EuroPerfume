import {NextResponse} from "next/server";
export const dynamic="force-dynamic";
export async function GET(){
 const requests=[["canva","https://media.canva.com/v2/document-image/hash:-1941411142/height:387/id:DAHbHRSm1fA/type:B/width:516?brand=BADLCiy7iwM&csig=AAAAAAAAAAAAAAAAAAAAAEW_XvwkWeed5C0Lre3Vzer5RZrisX75PO30APE-Oi7X&exp=1794869937&fallback=https%3A%2F%2Fs3.amazonaws.com%2Fdocument-export.canva.com%2FSm1fA%2FDAHbHRSm1fA%2F1%2Fthumbnail%2F0001.png%3FX-Amz-Algorithm%3DAWS4-HMAC-SHA256%26X-Amz-Credential%3DAKIAQYCGKMUHW27RK5IK%252F20261115%252Fus-east-1%252Fs3%252Faws4_request%26X-Amz-Date%3D20261115T215606Z%26X-Amz-Expires%3D88401%26X-Amz-Signature%3D6d21a9efbe8a504bc811ea113ca9445b7f5ea90acb0b591877049b6666067bd0%26X-Amz-SignedHeaders%3Dhost%26response-expires%3DMon%252C%252016%2520Nov%25202026%252022%253A29%253A27%2520GMT&osig=AAAAAAAAAAAAAAAAAAAAAA9PAeefISVcQh_VT6DEQ2_7WtGXHCNQ29eRhGmOYYax&page=1&signed=brand%2Cfallback%2Cpage%2Cversion&signer=document-rpc&version=1"],["original","https://s3.amazonaws.com/document-export.canva.com/Sm1fA/DAHbHRSm1fA/1/thumbnail/0001.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAQYCGKMUHW27RK5IK%2F20261115%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20261115T215606Z&X-Amz-Expires=88401&X-Amz-Signature=6d21a9efbe8a504bc811ea113ca9445b7f5ea90acb0b591877049b6666067bd0&X-Amz-SignedHeaders=host&response-expires=Mon%2C%2016%20Nov%202026%2022%3A29%3A27%20GMT"]] as const;
 const results=[];
 const sharp=(await import("sharp")).default;
 for(const [name,url] of requests){
  try{
   const res=await fetch(url,{cache:"no-store"});
   if(!res.ok){results.push({name,status:res.status});continue;}
   const b=Buffer.from(await res.arrayBuffer());
   const m=await sharp(b).metadata();
   results.push({name,status:res.status,width:m.width,height:m.height,size:b.length});
  }catch(e){results.push({name,error:String(e).slice(0,300)});}
 }
 return NextResponse.json(results);
}