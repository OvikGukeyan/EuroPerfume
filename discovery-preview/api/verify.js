export default async function handler(req,res){
 if(req.method!=='GET')return res.status(405).json({error:'Method not allowed'});
 const ids=String(req.query.ids||'').split(',').map(Number);
 if(ids.length!==8||new Set(ids).size!==8||ids.some(id=>!Number.isInteger(id)||id<1))return res.status(400).json({error:'Набор должен содержать восемь разных ароматов.'});
 try{const r=await fetch('https://euro-perfume-inky.vercel.app/api/products/by-ids?ids='+ids.join(','),{signal:AbortSignal.timeout(20000)});if(!r.ok)throw Error();const data=await r.json();if(!Array.isArray(data))throw Error();const products=data.filter(p=>p.available===true&&p.productGroup?.onTap===true&&Number(p.discountPrice??p.price)>0).map(p=>({id:p.id,price:Math.round((Number(p.discountPrice??p.price)*2+1)*100)/100}));res.setHeader('Cache-Control','no-store');res.status(200).json({products,checkedAt:new Date().toISOString()});}catch{res.status(503).json({error:'Не удалось подтвердить цены. Попробуйте ещё раз.'});}
}
