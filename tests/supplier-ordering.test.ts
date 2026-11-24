import {test} from 'node:test';
import assert from 'node:assert/strict';
import {canOrderQuantity} from '../src/shared/lib/orderability';
import {publicBottle} from '../src/shared/lib/full-bottle';

const owned={available:true,bottleParentId:335,stockPieces:2,allowBackorder:false};
const supplier={...owned,stockPieces:0,allowBackorder:true};
test('supplier bottles remain orderable at zero owned stock, including cumulative cart quantities',()=>{
  for(const quantity of [1,2,10]) assert.equal(canOrderQuantity(supplier,quantity),true);
  assert.equal(supplier.stockPieces,0);
  assert.equal(canOrderQuantity({...supplier,bottleParentId:null},3),true);
});
test('owned bottles retain stock limits; disabling supplier products still stops orders',()=>{
  assert.equal(canOrderQuantity(owned,2),true);
  assert.equal(canOrderQuantity(owned,3),false);
  assert.equal(canOrderQuantity({...owned,stockPieces:0},1),false);
  assert.equal(canOrderQuantity({...supplier,available:false},1),false);
});
test('supplier flag does not permit invalid quantities or a variation on a child bottle',()=>{
  for(const quantity of [0,-1,1.5,NaN,Infinity,Number.MAX_SAFE_INTEGER+1]) assert.equal(canOrderQuantity(supplier,quantity),false);
  assert.equal(canOrderQuantity(supplier,1,42),false);
});
test('public bottle availability distinguishes supplier ordering from owned stock',()=>{
  const row={id:591,volume:'75',price:209.59,imageUrl:[],available:true,stockPieces:0};
  assert.equal(publicBottle(row).available,false);
  assert.equal(publicBottle({...row,allowBackorder:true}).available,true);
  assert.equal(publicBottle({...row,allowBackorder:true}).allowBackorder,true);
  assert.equal(publicBottle({...row,allowBackorder:true,available:false}).available,false);
});
