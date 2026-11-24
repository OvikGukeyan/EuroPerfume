import {test} from "node:test";
import assert from "node:assert/strict";
import {bottleFields,publicBottle,unitPricePerLitre,withBottleOptions} from "../src/shared/lib/full-bottle";
import {capturePricing} from "../src/shared/lib/tax";

test("a bottle and a decant of the same fragrance retain separate prices and units",()=>{
  const common={name:"Example",discountPrice:null};
  const pricing=capturePricing([
    {productId:1,variationId:null,quantity:5,product:{...common,price:2,productGroup:{onTap:true}}},
    {productId:2,variationId:null,quantity:2,product:{...common,name:"Example · Originalflakon 50 ml",price:39,productGroup:{onTap:false}}}
  ],"DEU",0,new Date("2026-11-15T12:00:00Z"));
  assert.deepEqual(pricing.lines.map(l=>[l.productId,l.grossCents,l.onTap]),[[1,1100,true],[2,7800,false]]);
  assert.equal(pricing.shippingGrossCents,495);
  assert.equal(pricing.totalGrossCents,9395);
});
test("stock and volume are integral; prices accept a German decimal comma",()=>{
  assert.deepEqual(bottleFields("50","79,95","0"),{ml:50,price:"79.95",stock:0});
  for(const input of [["0","1","1"],["50","0","1"],["50","1.123","1"],["50","2","-1"],["50","2","1.5"]])
    assert.throws(()=>bottleFields(input[0],input[1],input[2]));
  assert.equal(publicBottle({id:1,volume:"50",price:120,imageUrl:[],stockPieces:0,available:true}).available,false);
});


test("unit prices use each selected format and its actual selling price",()=>{
  assert.equal(unitPricePerLitre(350,100),3500);
  assert.equal(unitPricePerLitre(300,100),3000);
  assert.equal(unitPricePerLitre(10.8,2),5400);
  assert.equal(unitPricePerLitre(79.95,50),1599);
  for(const ml of [0,-1,NaN,Infinity]) assert.equal(unitPricePerLitre(350,ml),null);
});
test("public variants preserve item identity, discount and stock without leaking Decimal rows",()=>{
  const result=withBottleOptions({id:369,name:"Guidance",productGroupId:1,volume:null,price:5,imageUrl:[],stockPieces:0,available:true,fullBottles:[{id:586,volume:"100",price:350,discountPrice:300,imageUrl:["bottle.webp"],stockPieces:2,available:true}]});
  assert.equal(result.id,369);
  assert.equal(result.name,"Guidance");
  assert.deepEqual(result.bottles.map(b=>({id:b.id,ml:b.ml,price:b.price,regularPrice:b.regularPrice,discountPrice:b.discountPrice,image:b.image,stock:b.stock,available:b.available})),[{id:586,ml:100,price:300,regularPrice:350,discountPrice:300,image:"bottle.webp",stock:2,available:true}]);
});
