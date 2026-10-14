const SOURCE='https://euro-perfume-inky.vercel.app';
export async function loadCatalog(){
  async function page(n){const r=await fetch(`${SOURCE}/api/products?page=${n}`,{signal:AbortSignal.timeout(25000)});if(!r.ok)throw Error('Catalog unavailable');const d=await r.json();if(!Array.isArray(d.products)||!Number.isInteger(d.totalPages)||d.totalPages<1||d.totalPages>150)throw Error('Invalid catalog');return d;}
  const first=await page(1), rows=[...first.products];
  for(let n=2;n<=first.totalPages;n+=5){const batch=await Promise.all(Array.from({length:Math.min(5,first.totalPages-n+1)},(_,i)=>page(n+i)));for(const d of batch)rows.push(...d.products);}
  const products=rows.filter(p=>p.available===true&&p.productGroup?.onTap===true&&Number(p.discountPrice??p.price)>0).map(p=>({id:p.id,name:p.name.trim(),brand:p.brand?.name||'',gender:p.gender,image:p.imageUrl?.[0]||null,price:Math.round((Number(p.discountPrice??p.price)*2+1)*100)/100,notes:(p.productNotes||[]).map(n=>n.note?.labelRu).filter(Boolean),families:(p.aromas||[]).map(a=>a.labelRu),available:true,stockMl:p.stockMl,concentration:p.concentration}));
  if(products.length<8)throw Error('Not enough available samples');
  return {products,syncedAt:new Date().toISOString(),source:SOURCE,availabilityBasis:'available flag from main catalog',pricing:'2 × current price per ml + €1 atomizer'};
}
export default async function handler(req,res){if(req.method!=='GET')return res.status(405).json({error:'Method not allowed'});try{const data=await loadCatalog();res.setHeader('Cache-Control','no-store');res.status(200).json(data);}catch{res.status(503).json({error:'Каталог временно недоступен. Попробуйте ещё раз.'});}}
