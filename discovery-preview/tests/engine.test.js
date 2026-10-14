import {test} from 'node:test';import assert from 'node:assert/strict';import {rank,selectEight,totals,questions} from '../public/engine.js';
const p=Array.from({length:20},(_,i)=>({id:i,name:'Test',price:1+i,gender:'UNISEX',notes:i===0?['Уд']:['Бергамот'],families:['Цитрусовые'],concentration:'EAU_DE_PARFUM'}));
test('10 questions, eight unique samples and exclusion',()=>{assert.equal(questions.length,10);const r=rank(p,[2,0,0,1,0,1,0,1,1,0]);assert(!r.some(p=>p.id===0));const s=selectEight(r,0);assert.equal(new Set(s.map(p=>p.id)).size,8);assert(s.reduce((s,p)=>s+p.price,0)<=50);});
test('shipping boundary and exact cents',()=>{assert.deepEqual(totals([{price:94.99}]),{samples:94.99,packaging:5,shipping:4.95,total:104.94});assert.equal(totals([{price:95}]).shipping,0);assert.equal(totals([{price:0.1},{price:0.2}]).samples,.3);});
test('insufficient candidates fail closed',()=>assert.deepEqual(selectEight(p.slice(0,7),0),[]));
