import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {removeConnectedLightBackground} from "../src/shared/lib/bottle-background";

const width=32,height=32;
function photo(background:[number,number,number]){
 const pixels=new Uint8Array(width*height*4);
 for(let i=0;i<width*height;i++){pixels.set([...background,255],i*4);}
 for(let y=6;y<27;y++)for(let x=9;x<24;x++){
  const i=(y*width+x)*4;
  pixels.set([61,25,110,255],i);
 }
 // Bright perfume logo: isolated inside the dark bottle, must survive.
 for(let y=14;y<=17;y++)for(let x=14;x<=19;x++){
  const i=(y*width+x)*4;pixels.set([255,248,244,255],i);
 }
 return pixels;
}
const alpha=(x:Uint8Array,px:number,py:number)=>x[(py*width+px)*4+3];
for(const bg of [[255,255,255],[247,247,247],[239,233,229]] as [number,number,number][]){
 const result=removeConnectedLightBackground(photo(bg),width,height);
 assert.equal(alpha(result,0,0),0,"Exterior white background should become alpha transparent");
 assert.equal(alpha(result,31,31),0,"All connected exterior edges should be clear");
 assert.equal(alpha(result,12,12),255,"Bottle body must be opaque");
 assert.equal(alpha(result,16,15),255,"White bottle labels must remain opaque");
}
const dark=new Uint8Array(width*height*4);
for(let i=0;i<width*height;i++)dark.set([29,20,18,255],i*4);
assert.deepEqual(removeConnectedLightBackground(dark,width,height),dark,"Do not remove dark backgrounds");
assert.throws(()=>removeConnectedLightBackground(new Uint8Array(2),width,height),/INVALID_IMAGE/);
const root=(p:string)=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const route=root("src/app/api/weekly-bottle/[id]/route.ts");
const hero=root("src/shared/components/shared/weekly-luxury-artwork.tsx");
const css=root("src/shared/components/shared/storefront-hero.css");
assert.match(route,/imageHost="thgjecpmxhqwfoknvjiu\.supabase\.co"/);
assert.match(route,/await prisma\.product\.findUnique/);
assert.match(route,/removeConnectedLightBackground/);
assert.match(route,/existingTransparency\?rgba/);
assert.match(route,/image\/webp/);
assert.match(hero,/api\/weekly-bottle/);
assert.match(hero,/productId/);
assert.match(css,/\.weekly-luxury-bottle\{mix-blend-mode:normal;-webkit-mask-image:none;mask-image:none\}/);
console.log("Bottle cutouts: pure white/off-white backgrounds removed; opaque colored glass and bright labels preserved; image route + normal blend PASS");
