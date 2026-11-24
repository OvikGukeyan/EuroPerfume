import { test } from 'node:test';
import assert from 'node:assert/strict';
import { publicBottle, withBottleOptions, fragranceName } from '../src/shared/lib/full-bottle';
import { cataloguePrice } from '../src/shared/lib/catalogue-price';
import { canOrderQuantity } from '../src/shared/lib/orderability';

const row=(id:number,ml:number,price:number)=>({id,volume:String(ml),price,imageUrl:[`https://example.com/${id}.png`],stockPieces:0,available:true,allowBackorder:true});
test('bottle-only canonical SKU remains selectable together with its child; IDs and photos survive',()=>{
 const parent={...row(656,100,125.5),name:'Gran Ballo · Originalflakon 100 ml',productGroupId:31,fullBottles:[row(657,30,60)]};
 const p=withBottleOptions(parent);
 assert.equal(p.name,'Gran Ballo');
 assert.deepEqual(p.bottles.map(b=>[b.id,b.ml,b.image]),[[657,30,'https://example.com/657.png'],[656,100,'https://example.com/656.png']]);
 assert.equal(p.price,125.5);
 assert.equal(cataloguePrice({...p,productGroup:{onTap:false}}).effective,60);
});
test('Guidance general card uses decant price; bottle section never uses decant price',()=>{
 const p={price:5,available:true,productGroup:{onTap:true},bottles:[publicBottle(row(586,100,350)),publicBottle(row(800,50,200))]};
 assert.equal(cataloguePrice(p).effective,11);
 assert.equal(cataloguePrice(p,true).effective,200);
 assert.equal(cataloguePrice(p,true).bottle?.id,800);
});
test('zero-stock supplier volume stays visible and orderable',()=>{
 const b=row(599,125,250);assert.equal(publicBottle(b).available,true);
 assert.equal(canOrderQuantity({...b,bottleParentId:598},1),true);
 assert.equal(canOrderQuantity({...b,bottleParentId:598},1,42),false);
});
test('minimum reflects each actual promotion without changing base price',()=>{
 const a={...publicBottle(row(1,50,100)),discountPrice:90};
 const b={...publicBottle(row(2,100,150)),discountPrice:80};
 const result=cataloguePrice({price:100,available:true,productGroup:{onTap:false},bottles:[a,b]});
 assert.equal(result.bottle?.id,2);assert.equal(result.effective,80);assert.equal(result.regular,150);
});
test('version names are preserved, only explicit imported size suffix is removed',()=>{
 assert.equal(fragranceName('Guidance 46 · Originalflakon 100 ml'),'Guidance 46');
 assert.equal(fragranceName('Layton Exclusif'),'Layton Exclusif');
});
