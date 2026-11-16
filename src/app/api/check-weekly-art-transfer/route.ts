import {NextResponse} from "next/server";
export const dynamic="force-dynamic";
export async function GET(){
 const results=[];
 for(const [name,url] of [["thumbnail","https://media.canva.com/v2/image-resize/format:PNG/height:150/quality:100/uri:ifs%3A%2F%2FM%2Fd31190f4-82a6-468d-a49c-08b81e5a2122/watermark:F/width:200?csig=AAAAAAAAAAAAAAAAAAAAADJ5kp3F5iIU0NdhAgvCOJthbZqWx2zNm8_K7HyT5ihY&exp=1794876990&osig=AAAAAAAAAAAAAAAAAAAAADKLzXAinHu5hNO10VXgIQROtJM7fCKK9gkncxSKQG3W&signer=media-rpc&token=AAIAAU0AJGQzMTE5MGY0LTgyYTYtNDY4ZC1hNDljLTA4YjgxZTVhMjEyMgAAAAABoecBYjBL_fPcbLPrm8WwshjodKAj7b995PBtZLWhw5a--VuZFA&x-canva-quality=thumbnail"],["full","https://media.canva.com/v2/image-resize/format:PNG/height:1086/quality:100/uri:ifs%3A%2F%2FM%2Fd31190f4-82a6-468d-a49c-08b81e5a2122/watermark:F/width:1448?csig=AAAAAAAAAAAAAAAAAAAAADJ5kp3F5iIU0NdhAgvCOJthbZqWx2zNm8_K7HyT5ihY&exp=1794876990&osig=AAAAAAAAAAAAAAAAAAAAADKLzXAinHu5hNO10VXgIQROtJM7fCKK9gkncxSKQG3W&signer=media-rpc&token=AAIAAU0AJGQzMTE5MGY0LTgyYTYtNDY4ZC1hNDljLTA4YjgxZTVhMjEyMgAAAAABoecBYjBL_fPcbLPrm8WwshjodKAj7b995PBtZLWhw5a--VuZFA&x-canva-quality=thumbnail"]] as const){
  try{
   const res=await fetch(url,{cache:"no-store"});
   if(!res.ok){results.push({name,status:res.status});continue;}
   const bytes=Buffer.from(await res.arrayBuffer());
   const sharp=(await import("sharp")).default;
   const meta=await sharp(bytes).metadata();
   results.push({name,status:res.status,width:meta.width,height:meta.height,length:bytes.length});
  }catch(e){results.push({name,error:String(e).slice(0,400)});}
 }
 return NextResponse.json(results);
}