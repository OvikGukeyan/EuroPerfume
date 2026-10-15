import assert from 'node:assert/strict';
import {rank,selectEight,selectDiscovery,profile,conflicts,questions,totals,avoidOptions,exclusionMatches} from '../public/discovery/engine.js';
const make=(id,notes,extra={})=>({id,name:'Test '+id,brand:'Test',price:6,gender:'UNISEX',available:true,notes,families:[],notePyramid:notes.map(label=>({label,type:'HEART'})),...extra});
const a={gender:'any',liked:[],disliked:[],direction:'fresh',focus:'citrus',sweetness:'any',flowers:'any',base:['none'],avoid:['none'],notes:[],explore:'strict',budget:'80'};
const citrus=Array.from({length:12},(_,i)=>make(i+1,['Бергамот','Лимон','Мандарин'],{price:i<8?10:5}));
const dessert=Array.from({length:10},(_,i)=>make(i+30,['Ваниль','Карамель','Какао']));
const products=[...citrus,...dessert];
assert.equal(questions.length,13);
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
assert.equal(rank([make(999,['Ветивер','Древесные ноты','Тюльпан'],{families:['Цветочные']})],{...a,direction:'woody',focus:'wood'}).length,0);
const dominant=make(200,['Бергамот','Ваниль','Тонка','Карамель','Мёд','Табак','Ладан','Кожа','Роза','Жасмин'],{notePyramid:[{label:'Бергамот',type:'TOP'},...['Ваниль','Тонка','Карамель','Табак','Кожа','Роза'].map(label=>({label,type:'BASE'}))]});
assert.equal(rank([dominant],a).length,0); // a citrus opening doesn't make a heavy perfume fresh
assert.equal(totals([{price:24.3},{price:24.3}]).samples,48.6);
console.log('Discovery matching regression checks passed.');

const seasonFresh=make(601,['Кедр','Ветивер','Бергамот','Лимон']);
const seasonWarm=make(602,['Кедр','Ветивер','Амбра','Бензоин']);
const woody={...a,direction:'woody',focus:'wood'};
const seasonScore=(p,season)=>rank([p],{...woody,season})[0].score;
assert(seasonScore(seasonFresh,'summer')>seasonScore(seasonFresh,'winter'));
assert(seasonScore(seasonWarm,'winter')>seasonScore(seasonWarm,'summer'));
assert.equal(seasonScore(seasonWarm,'all'),rank([seasonWarm],woody)[0].score);
assert.equal(rank([make(603,['Кедр','Лимон','Уд'])],{...woody,season:'winter',avoid:['oud']}).length,0);
console.log('Season preference refines scoring without relaxing exclusions.');

assert(avoidOptions.length>=25);
for(const [key,note] of Object.entries({sweet:'Бурбонская ваниль',citrus:'Лимон',sour:'Ревень',fruit:'Манго',green:'Мята',bitter:'Полынь',tea:'Черный чай',aquatic:'Морская соль',floral:'Жасмин',rose:'Болгарская роза',whitefloral:'Тубероза',softfloral:'Пион',powder:'Ирис',vanilla:'Бобы тонка',gourmand:'Карамель',cream:'Молоко',amber:'Бензоин',musk:'Белый мускус',wood:'Кедр',earth:'Дубовый мох',spice:'Кардамон',smoke:'Табак',leather:'Замша',oud:'Уд',animalic:'Циветта',boozy:'Коньяк'})) {
 assert(exclusionMatches(make(800,[note]),{...a,avoid:[key]}).length, key+' note must be excluded');
}
for(const [key,family] of [['sweet','Гурманские'],['citrus','Цитрусовые'],['floral','Цветочные'],['wood','Древесные'],['amber','Амбровые'],['musk','Мускусные']])assert(exclusionMatches(make(801,['Шафран'],{families:[family]}),{...a,avoid:[key]}).length);
assert.equal(exclusionMatches(make(802,['Тубероза','Розовый перец']),{...a,avoid:['rose']}).length,0);
assert.equal(exclusionMatches(make(803,['Цветок апельсина']),{...a,avoid:['citrus']}).length,0);
assert.equal(exclusionMatches(make(804,['Лимон']),{...a,avoid:['none']}).length,0);
assert(conflicts({...a,focus:'vanilla',direction:'sweet',avoid:['sweet']}));
assert(conflicts({...a,focus:'rose',direction:'floral',avoid:['floral']}));
assert.equal(conflicts({...a,notes:['Розовый перец'],avoid:['rose']}),'');
assert.equal(rank([make(805,['Кедр','Ветивер','Лимон'])],{...woody,explore:'balanced',avoid:['citrus']}).length,0);
console.log('26 exclusions verified for catalog notes, families, compound groups and false matches.');

const repeatPool=Array.from({length:20},(_,i)=>({...make(900+i,['Лимон']),score:60-i*.2}));
const first=selectDiscovery(repeatPool,'80');
const second=selectDiscovery(repeatPool,'80',[first.items.map(p=>p.id)]);
assert.equal(first.items.length,8);assert.equal(second.items.length,8);
assert.equal(second.repeated,0);
assert(second.items.every(p=>!first.items.some(x=>x.id===p.id)));
const limited=selectDiscovery(repeatPool.slice(0,8),'80',[first.items.map(p=>p.id)]);
assert.equal(limited.repeated,8);
const expensive=repeatPool.map((p,i)=>({...p,price:i<8?5:20}));
assert(totals(selectDiscovery(expensive,'50',[first.items.map(p=>p.id)]).items).samples<=50);
const forbidden=rank(products,{...a,avoid:['citrus']});
assert.equal(selectDiscovery(forbidden,'80',[first.items.map(p=>p.id)]).items.length,0);
const originalScores=repeatPool.map(p=>p.score);selectDiscovery(repeatPool,'80',[first.items.map(p=>p.id)]);
assert.deepEqual(repeatPool.map(p=>p.score),originalScores);
console.log('Repeat selections rotate qualified matches, preserve budget and exclusions, and explain insufficient alternatives.');

assert.equal(selectDiscovery(repeatPool,'any',[first.items.map(p=>p.id)]).repeated,0);
