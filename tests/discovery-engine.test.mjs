import assert from 'node:assert/strict';
import {rank,selectEight,profile,conflicts,questions,totals} from '../public/discovery/engine.js';
const make=(id,notes,extra={})=>({id,name:'Test '+id,brand:'Test',price:6,gender:'UNISEX',available:true,notes,families:[],notePyramid:notes.map(label=>({label,type:'HEART'})),...extra});
const a={gender:'any',liked:[],disliked:[],direction:'fresh',focus:'citrus',sweetness:'any',flowers:'any',base:['none'],avoid:['none'],notes:[],explore:'strict',budget:'80'};
const citrus=Array.from({length:12},(_,i)=>make(i+1,['Бергамот','Лимон','Мандарин'],{price:i<8?10:5}));
const dessert=Array.from({length:10},(_,i)=>make(i+30,['Ваниль','Карамель','Какао']));
const products=[...citrus,...dessert];
assert.equal(questions.length,12);
assert(rank(products,a).every(p=>p.id<30));
assert(rank(products,{...a,direction:'sweet',focus:'gourmand',sweetness:'sweet'}).every(p=>p.id>=30));
assert.equal(rank([make(90,['Бергамот','Лимон','Уд'])],{...a,avoid:['oud']}).length,0);
assert.equal(rank([make(90,['Бергамот','Лимон','Ваниль'])],{...a,sweetness:'dry'}).length,0);
assert.equal(profile(make(1,['Тубероза'])).evidence.rose.length,0);
assert.equal(profile(make(1,['Роза'])).evidence.rose.length,1);
assert.equal(profile(make(1,['Розовый перец'])).evidence.rose.length,0);
assert.equal(profile(make(1,['Цветок апельсина'])).evidence.citrus.length,0);
assert.equal(profile(make(1,['Водяной жасмин'])).evidence.aquatic.length,0);
assert.equal(rank([make(1,['Бергамот','Лимон'],{available:false})],a).length,0);
assert.equal(rank([make(1,[])],a).length,0);
assert.equal(rank([make(1,['Бергамот','Лимон'],{gender:'MALE'})],{...a,gender:'FEMALE'}).length,0);
assert(conflicts({...a,avoid:['citrus']}));
assert(conflicts({...a,notes:['Ваниль'],sweetness:'dry'}));
assert.equal(selectEight(rank(products,a),'50').length,0); // cheapest qualifying eight cost 60; dessert cannot fill it.
assert.equal(selectEight(rank(products,a),'80').length,8);
assert(totals(selectEight(rank(products,a),'80')).samples<=80);
const ranked=Array.from({length:9},(_,i)=>({...make(i,['Лимон']),score:i===0?100:90,price:i===0?30:5}));
assert.equal(selectEight(ranked,'50').length,8);
assert(!selectEight(ranked,'50').some(p=>p.id===0)); // feasible optimum rather than over-budget output
const reference=make(100,['Бергамот','Лимон','Ветивер']);
const p1=make(101,['Бергамот','Лимон','Ветивер']);const p2=make(102,['Бергамот','Лимон','Мускус']);
assert.equal(rank([reference,p1,p2],{...a,liked:[100]})[0].id,101);
assert.equal(rank([reference,p1,p2],{...a,disliked:[100]})[0].id,102);
assert.equal(rank([p1,p2],{...a,notes:['Мускус']})[0].id,102);
assert.equal(rank([p1,p2],{...a,base:['earth']})[0].id,101);
assert.deepEqual(rank(products,a).map(p=>p.id),rank([...products].reverse(),a).map(p=>p.id));
const dominant=make(200,['Бергамот','Ваниль','Тонка','Карамель','Мёд','Табак','Ладан','Кожа','Роза','Жасмин'],{notePyramid:[{label:'Бергамот',type:'TOP'},...['Ваниль','Тонка','Карамель','Табак','Кожа','Роза'].map(label=>({label,type:'BASE'}))]});
assert.equal(rank([dominant],a).length,0); // a citrus opening doesn't make a heavy perfume fresh
assert.equal(totals([{price:24.3},{price:24.3}]).samples,48.6);
console.log('Discovery matching regression checks passed.');
