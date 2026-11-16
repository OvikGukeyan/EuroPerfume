import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function GET() {
  const response=await fetch("https://cdn.shopify.com/s/files/1/1010/3875/2079/files/euro-perfume-aromat-nedeli-initio-approved.png?v=1794859777",{cache:"no-store"});
  if(!response.ok)return NextResponse.json({error:"Artwork unavailable"},{status:502});
  const source=Buffer.from(await response.arrayBuffer());
  const sharp=(await import("sharp")).default;
  const optimized=await sharp(source).resize({width:1086,withoutEnlargement:true}).webp({quality:88,effort:5}).toBuffer();
  return new NextResponse(optimized.toString("base64"),{headers:{"Content-Type":"text/plain; charset=utf-8","Cache-Control":"no-store"}});
}
