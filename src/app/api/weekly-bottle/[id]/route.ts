import {NextResponse} from "next/server";
import {prisma} from "@/prisma/prisma-client";
import sharp from "sharp";
import {removeConnectedLightBackground} from "@/src/shared/lib/bottle-background";

export const runtime="nodejs";
export const dynamic="force-dynamic";
const imageHost="thgjecpmxhqwfoknvjiu.supabase.co";
const privateCache={"Cache-Control":"public, max-age=300, s-maxage=900, stale-while-revalidate=3600","X-Content-Type-Options":"nosniff"};
function trustedImage(value:string):URL|null{
 try{
  const url=new URL(value);
  if(url.protocol!=="https:"||url.hostname!==imageHost||url.port||!url.pathname.startsWith("/storage/v1/object/public/images/")||url.username||url.password)return null;
  return url;
 }catch{return null;}
}
/**
 * Safely prepares a bottle image selected from our own catalog for the weekly
 * banner. The user does not provide an image URL; it is looked up by product ID.
 */
export async function GET(_request:Request,{params}:{params:Promise<{id:string}>}){
 const {id:rawId}=await params;
 if(!/^\d{1,10}$/.test(rawId))return NextResponse.json({error:"NOT_FOUND"},{status:404});
 const id=Number(rawId);
 try{
  const product=await prisma.product.findUnique({where:{id},select:{imageUrl:true}});
  const source=product?.imageUrl[0]&&trustedImage(product.imageUrl[0]);
  if(!source)return NextResponse.json({error:"IMAGE_NOT_AVAILABLE"},{status:404});
  const response=await fetch(source.toString(),{signal:AbortSignal.timeout(8000),cache:"force-cache"});
  if(!response.ok)return NextResponse.json({error:"IMAGE_UNAVAILABLE"},{status:502});
  const declared=Number(response.headers.get("content-length")||0);
  if(declared>7_000_000)return NextResponse.json({error:"IMAGE_TOO_LARGE"},{status:413});
  const array=Buffer.from(await response.arrayBuffer());
  if(array.length>7_000_000)return NextResponse.json({error:"IMAGE_TOO_LARGE"},{status:413});
  const image=sharp(array,{limitInputPixels:8_000_000}).rotate().resize({width:900,height:900,fit:"inside",withoutEnlargement:true}).ensureAlpha();
  const {data,info}=await image.raw().toBuffer({resolveWithObject:true});
  const rgba=new Uint8Array(data);
  // Existing PNG/WebP transparency should never be reprocessed.
  let existingTransparency=false;
  for(let i=3;i<rgba.length;i+=4){if(rgba[i]<242){existingTransparency=true;break;}}
  const cutout=existingTransparency?rgba:removeConnectedLightBackground(rgba,info.width,info.height);
  const rendered=await sharp(Buffer.from(cutout),{raw:{width:info.width,height:info.height,channels:4}})
   .webp({quality:93,alphaQuality:100,effort:4}).toBuffer();
  return new Response(new Uint8Array(rendered),{headers:{"Content-Type":"image/webp",...privateCache}});
 }catch(error){
  console.error("[WEEKLY_BOTTLE_CUTOUT]",id,error instanceof Error?error.message:"processing failed");
  return NextResponse.json({error:"IMAGE_PROCESSING_FAILED"},{status:503});
 }
}
