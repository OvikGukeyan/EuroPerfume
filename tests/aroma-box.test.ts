import assert from "node:assert/strict";
import { aromaBoxItems } from "../src/shared/lib/aroma-box";
const items=Array.from({length:8},(_,i)=>({id:100+i,productId:i+1,quantity:2,variationId:null}));
const marker="items:"+items.map(i=>i.id).join(",");
assert.equal(aromaBoxItems(undefined,items).length,0); // eight ordinary samples aren't a box
assert.equal(aromaBoxItems(marker,items).length,8);
assert.equal(aromaBoxItems(marker,items.slice(1)).length,0);
assert.equal(aromaBoxItems(marker,items.map((p,i)=>i? p:{...p,quantity:3})).length,0);
assert.equal(aromaBoxItems("items:100,100,100,100,100,100,100,100",items).length,0);
const duplicate={...items[0],id:900};
assert.deepEqual(aromaBoxItems(marker,[duplicate,...items]).map(i=>i.id),items.map(i=>i.id));
assert.equal(aromaBoxItems(items.map(i=>i.productId).join(","),items).length,8); // existing baskets remain supported
console.log("Aroma Box identity: exact rows, ordinary samples, edits, duplicate products and legacy baskets passed.");
