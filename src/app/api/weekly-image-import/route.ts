import {NextResponse} from "next/server";
export const dynamic="force-dynamic";
export async function GET(){
 const res=await fetch("https://export-download.canva.com/1de18c21-52ae-4c2d-915f-e553a5c3c450/0/0001-2191523613437765102.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAQYCGKMUH4R7NKVBA%2F20261115%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20261115T230601Z&X-Amz-Expires=86408&X-Amz-Signature=793da4130b32c4c711b87402864600874baef142c22f4f7062ea49c55bc26504&X-Amz-SignedHeaders=host%3Bx-amz-expected-bucket-owner&response-expires=Mon%2C%2016%20Nov%202026%2023%3A06%3A09%20GMT",{cache:"no-store"});
 if(!res.ok)return NextResponse.json({status:res.status,reason:"Source not available"},{status:502});
 const sharp=(await import("sharp")).default;
 const bytes=Buffer.from(await res.arrayBuffer());
 const metadata=await sharp(bytes).metadata();
 const optimized=await sharp(bytes).webp({quality:84,effort:5}).toBuffer();
 return NextResponse.json({width:metadata.width,height:metadata.height,sourceBytes:bytes.length,bytes:optimized.length,base64:optimized.toString("base64")},{headers:{"Cache-Control":"no-store"}});
}