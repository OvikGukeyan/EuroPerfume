/**
 * Flood-fill only the near-white connected background on a catalogue packshot.
 * Preserve non-white bottle pixels and enclosed white details/labels. Existing
 * transparency is respected by the caller and never processed by this method.
 *
 * Operates on RGBA pixels, including anti-alias edge softening. No network or DOM.
 */
export function removeConnectedLightBackground(pixels:Uint8Array,width:number,height:number):Uint8Array{
 if(!Number.isSafeInteger(width)||!Number.isSafeInteger(height)||width<1||height<1||pixels.length!==width*height*4)throw new Error("INVALID_IMAGE");
 const total=width*height;
 const output=new Uint8Array(pixels);
 const corners:number[][]=[];
 const radius=Math.max(1,Math.min(8,Math.round(Math.min(width,height)*.015)));
 for(const [cx,cy] of [[0,0],[width-1,0],[0,height-1],[width-1,height-1]]){
  let rs=0,gs=0,bs=0,count=0;
  for(let dy=0;dy<radius;dy++)for(let dx=0;dx<radius;dx++){
   const x=cx===0?dx:cx-dx,y=cy===0?dy:cy-dy,i=(y*width+x)*4;
   if(pixels[i+3]<230)continue;
   rs+=pixels[i];gs+=pixels[i+1];bs+=pixels[i+2];count++;
  }
  if(count){const c=[rs/count,gs/count,bs/count];if(Math.min(...c)>=190&&Math.max(...c)-Math.min(...c)<60)corners.push(c);}
 }
 if(corners.length<2)return output; // Non-light or ambiguous photo: do not destructively guess.
 const avg=[0,1,2].map(ch=>corners.reduce((s,c)=>s+c[ch],0)/corners.length);
 const seen=new Uint8Array(total),queue=new Int32Array(total);
 let head=0,tail=0;
 const distance=(index:number)=>{
  const i=index*4,r=pixels[i],g=pixels[i+1],b=pixels[i+2];
  const brightness=Math.min(r,g,b),chroma=Math.max(r,g,b)-brightness;
  const delta=Math.max(Math.abs(r-avg[0]),Math.abs(g-avg[1]),Math.abs(b-avg[2]));
  return {brightness,chroma,delta};
 };
 // Interior pixels of a white bottle must not be removed: only pixels connected
 // from an exterior edge are eligible.
 const qualifies=(index:number)=>{
  if(pixels[index*4+3]<20)return true;
  const {brightness,chroma,delta}=distance(index);
  return brightness>=180&&chroma<=65&&delta<=83;
 };
 const push=(index:number)=>{
  if(seen[index]||!qualifies(index))return;
  seen[index]=1;queue[tail++]=index;
 };
 for(let x=0;x<width;x++){push(x);push((height-1)*width+x);}
 for(let y=1;y<height-1;y++){push(y*width);push(y*width+width-1);}
 while(head<tail){
  const index=queue[head++],x=index%width,y=Math.floor(index/width);
  if(x>0)push(index-1);
  if(x<width-1)push(index+1);
  if(y>0)push(index-width);
  if(y<height-1)push(index+width);
 }
 // A large connected light region means a genuine studio background.
 // A handful of edge pixels could instead be highlights/white glass.
 if(tail<total*.055)return output;
 for(let index=0;index<total;index++){
  if(!seen[index])continue;
  const {brightness,delta}=distance(index);
  const i=index*4,originalAlpha=output[i+3];
  // Fully eliminate bright background. Feather only its less-bright edge/shadow.
  // This produces a transparent image rather than a rectangular patch.
  const opacity=brightness>=225&&delta<42?0:Math.min(0.42,Math.max(0,(225-brightness)/110));
  output[i+3]=Math.min(originalAlpha,Math.round(opacity*255));
 }
 return output;
}
