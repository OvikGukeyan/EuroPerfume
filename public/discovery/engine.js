// Recommendations use catalog evidence, never randomness or concentration as a proxy for projection.
const option=(id,label,detail='')=>({id,label,detail});
export const facets={
 citrus:['Цитрусы',/цитрус|бергамот|грейпфрут|лимон|лайм|юзу|мандарин|апельсин(?!.*цвет)|помело/i],
 green:['Зелень и травы',/зелен|зелён|лист|трава|базилик|мята|гальбанум|шалфей|лаванд|розмарин/i],
 tea:['Чай',/чай|мате|матча/i], aquatic:['Морские и водные ноты',/морск|водян|водн|озон|соль|солен|солён|калон/i],
 fruit:['Фрукты и ягоды',/фрукт|ягод|груш|яблок|персик|абрикос|манго|маракуй|ананас|слива|сливов|вишн|смород|малин|личи|инжир/i],
 rose:['Роза',/(?:^|[\s-])роз(?:а|ы|у|е|овый|овая|овые)?(?:$|[\s-])|(?:^|[\s-])rose(?:$|[\s-])/i],
 whitefloral:['Белые цветы',/жасмин|тубероз|гардени|самбак|флердоранж|цвет(?:ок|ы) апельсина|иланг|лили/i],
 softfloral:['Лёгкие цветы',/пион|фрези|ландыш|магноли|сирень|липа|цветоч/i],
 powder:['Пудровые ноты',/ирис|фиалк|пудр|гелиотроп/i], wood:['Древесина',/древес|кедр|сандал|гуаяк|кашмеран|cashmeran|iso e|ветивер|пачули|акигала|akigala/i],
 earth:['Ветивер, пачули и мох',/ветивер|пачули|мох|земл/i], cream:['Кремовые ноты',/сандал|молок|молоч|сливоч|кокос|лактон/i],
 musk:['Мускус',/мускус|moschus|musk/i], amber:['Амбра и смолы',/амбр(?!окс)|amber|лабданум|бензоин|смол|бальзам/i],
 vanilla:['Ваниль и тонка',/ванил|тонка/i], gourmand:['Десертные ноты',/карамел|шоколад|какао|пралине|сахар|мед|мёд|маршмеллоу|печень|марципан|кофе|фисташ/i],
 spice:['Пряности',/перец|кориц|кардамон|гвоздик|шафран|имбир|мускат/i], smoke:['Дым, ладан и табак',/дым|ладан|табак|копчен|копчён|березов.*дег|берёзов.*дег/i],
 leather:['Кожа и замша',/кожа|кожан|замш/i], oud:['Уд',/(?:^|[\s-])уд(?:$|[\s-])|удов|агар|oud/i], animalic:['Анималистические ноты',/цивет|кастореум|бобров|животн|анимал|костус|гибракс/i]
};
export const directions={
 fresh:['Свежий','Цитрусы, чай или морская вода',['citrus','green','tea','aquatic']],
 floral:['Цветочный','От пиона до розы и белых цветов',['rose','whitefloral','softfloral','powder']],
 woody:['Древесный','Сухой кедр, ветивер или сливочный сандал',['wood','earth','cream']],
 sweet:['Сладкий','Ваниль, десерты или сочные фрукты',['vanilla','gourmand','fruit']],
 warm:['Тёплый и пряный','Смолы, специи, табак или кожа',['amber','spice','smoke','leather','oud']],
 clean:['Чистый и мягкий','Мускус, пудра или зелёная свежесть',['musk','powder','green']]
};
const subtypes={
 fresh:[option('citrus','Цитрусовая кожура','Бергамот, грейпфрут, лимон — бодро и чуть горько'),option('tea','Зелёный чай','Чайные листья и спокойная зелёная свежесть'),option('green','Травы и листья','Мята, базилик, зелень — без морского аккорда'),option('aquatic','Морская свежесть','Вода, соль, прохладный воздух')],
 floral:[option('rose','Роза','Хочу именно розовое направление'),option('whitefloral','Жасмин и белые цветы','Более насыщенный цветочный характер'),option('softfloral','Пион и лёгкие цветы','Мягкий букет без выраженной пудры'),option('powder','Ирис и фиалка','Пудровое цветочное направление')],
 woody:[option('wood','Сухая древесина','Кедр и древесные ноты'),option('earth','Ветивер и мох','Землистое, зелёное направление'),option('cream','Сливочный сандал','Кремовое древесное направление'),option('oud','Уд','Тёмный, характерный древесный аккорд')],
 sweet:[option('vanilla','Ваниль и тонка','Тёплая ванильная основа'),option('gourmand','Карамель, какао, пралине','Именно десертные ноты'),option('fruit','Сочные фрукты','Груша, персик, ягоды или тропические фрукты')],
 warm:[option('amber','Амбра и смолы','Бальзамическое тепло'),option('spice','Пряности','Кардамон, перец, корица'),option('smoke','Табак и ладан','Дымное направление'),option('leather','Кожа и замша','Кожаный характер')],
 clean:[option('musk','Мускус','Ищу мускусную основу'),option('powder','Пудра','Ирис, фиалка, мягкая косметическая нота'),option('green','Зелёная чистота','Листья, травы и свежесть')]
};
export const questions=[
 {id:'gender',title:'В каком разделе вы обычно выбираете аромат?',hint:'Унисекс останется в подборе при любом ответе.',options:[option('FEMALE','Женские и унисекс'),option('MALE','Мужские и унисекс'),option('any','Не ограничивать по разделу')]},
 {id:'liked',type:'products',title:'Какие ароматы вам уже нравятся на коже?',hint:'Выберите до двух знакомых ароматов из каталога. Сравним их ноты и семейства с новыми рекомендациями. Если не нашли свой — пропустите.',max:2},
 {id:'direction',title:'Какой характер вы хотите в новом наборе?',hint:'Выберите одно главное направление. Дальше уточним его, чтобы не смешивать совсем разные вкусы.',options:Object.entries(directions).map(([id,[label,detail]])=>option(id,label,detail))},
 {id:'focus',title:'Что именно должно звучать в этом направлении?',hint:'Это главный ориентир подбора. Одной случайной ноты в начале аромата будет недостаточно.',options:a=>subtypes[a.direction]||[]},
 {id:'sweetness',title:'Какой сладости вам хочется?',hint:'Сладкий фрукт и ванильный десерт — разные вещи. Здесь уточняем ваше отношение к десертным нотам.',options:[option('dry','Без десертной сладости','Исключить ваниль, тонка, карамель, мёд и другие десертные ноты'),option('balanced','Сладость — только дополнение','Ваниль возможна, но не как главное направление'),option('sweet','Хочу сладкий характер','Ванильные или десертные ноты приветствуются'),option('any','Не принципиально')]},
 {id:'flowers',title:'Какие цветы вам комфортны?',hint:'Выберите предпочтение. Нежелательные отдельные ноты можно полностью исключить дальше.',options:[option('rose','Люблю розу'),option('whitefloral','Люблю жасмин и белые цветы'),option('powder','Люблю ирис и пудру'),option('softfloral','Скорее лёгкий цветочный букет'),option('none','Не хочу цветочное направление'),option('any','Нет предпочтения')]},
 {id:'base',type:'multi',max:2,title:'Что хочется ощущать после первого впечатления?',hint:'До двух вариантов. Сравним прежде всего с сердцем и базой аромата, а не только с верхними нотами.',options:['wood','earth','cream','musk','amber','vanilla','powder','green'].map(k=>option(k,facets[k][0])).concat(option('none','Пока не знаю'))},
 {id:'avoid',type:'multi',max:21,title:'Какие ноты вы точно не хотите?',hint:'Можно выбрать несколько. Исключим ароматы с этими нотами в каталоге. Это предпочтения по запаху, не проверка состава на аллергены.',options:['oud','rose','whitefloral','powder','musk','vanilla','gourmand','smoke','leather','animalic','earth','aquatic','spice'].map(k=>option(k,facets[k][0])).concat(option('none','Нет исключений'))},
 {id:'notes',type:'notes',max:3,title:'Есть ноты, которые особенно хочется попробовать?',hint:'До трёх конкретных нот из каталога. Это дополнительные пожелания; главное направление остаётся важнее. Можно пропустить.'},
 {id:'disliked',type:'products',max:2,title:'Какие ароматы вам не подошли на коже?',hint:'Их не предложим. Похожие сочетания нот понизим в подборе. Не знакомы с ними — пропустите.'},
 {id:'explore',title:'Насколько близко держаться ваших пожеланий?',hint:'Исключённые ноты не вернём ни при одном варианте.',options:[option('strict','Максимально близко','Только подтверждённые совпадения с главным аккордом'),option('balanced','Близко, но с разными оттенками','Допустим соседний аккорд в выбранном направлении')]},
 {id:'budget',title:'Сколько комфортно потратить на восемь проб?',hint:'Стоимость ароматов без доставки. Ради бюджета не будем подставлять неподходящие пробы.',options:[option('50','До 50 €'),option('80','До 80 €'),option('any','Без ограничения')]}
];
export const optionsFor=(q,a)=>typeof q.options==='function'?q.options(a):q.options||[];
const norm=s=>String(s).toLowerCase().replace(/ё/g,'е').trim();
const list=x=>Array.isArray(x)?x.filter(v=>v!=='none'):[];
export function profile(p){
 const pyramid=p.notePyramid?.length?p.notePyramid:(p.notes||[]).map(label=>({label,type:'UNKNOWN'}));
 const vector={},base={},evidence={},baseEvidence={};
 for(const [key,[,re]] of Object.entries(facets)){
  const hits=pyramid.filter(n=>re.test(n.label) && !(key==='citrus'&&/цвет|флер|нероли|лист/i.test(n.label)) && !(key==='rose'&&/перец|дерев/i.test(n.label)) && !(key==='aquatic'&&/жасмин|лили/i.test(n.label)));
  // Generic family labels support a match but never invent a specific note.
  const weight=hits.reduce((n,h)=>n+({TOP:.55,HEART:1,BASE:1.1,UNKNOWN:.75}[h.type]||.75),0);
  vector[key]=Math.min(2,weight);
  baseEvidence[key]=[...new Set(hits.filter(n=>n.type==='HEART'||n.type==='BASE').map(n=>n.label))];
  base[key]=Math.min(2,baseEvidence[key].length);
  evidence[key]=[...new Set(hits.map(n=>n.label))];
 }
 const family=(p.families||[]).join(' ');
 const familyMap={citrus:/цитрус/i,green:/зелен|зелён|фужер/i,aquatic:/водн|морск/i,fruit:/фрукт/i,softfloral:/цветоч/i,wood:/древес/i,amber:/восточ|амбров/i,gourmand:/гурман/i,leather:/кож/i,powder:/пудр/i};
 for(const [k,re] of Object.entries(familyMap))if(re.test(family))vector[k]+=1;
 return {vector,base,baseEvidence,evidence,notes:new Set((p.notes||[]).map(norm))};
}
function similarity(a,b){
 let dot=0,aa=0,bb=0;
 for(const k of Object.keys(facets)){dot+=a.vector[k]*b.vector[k];aa+=a.vector[k]**2;bb+=b.vector[k]**2;}
 const cosine=aa&&bb?dot/Math.sqrt(aa*bb):0;
 const shared=[...a.notes].filter(n=>b.notes.has(n)).length;
 const union=new Set([...a.notes,...b.notes]).size;
 return .55*cosine+.45*(union?shared/union:0);
}
export function conflicts(a){
 const blocked=new Set(list(a.avoid));
 if(a.sweetness==='dry'){blocked.add('vanilla');blocked.add('gourmand');}
 if(blocked.has(a.focus))return 'Главный аккорд одновременно исключён. Вернитесь к ответам и выберите, что важнее.';
 if(list(a.base).some(k=>blocked.has(k)))return 'Желаемая база есть и среди исключений. Уточните эти ответы перед подбором.';
 if(list(a.notes).some(n=>[...blocked].some(k=>facets[k]?.[1].test(n))))return 'Одна из желаемых нот одновременно исключена. Уточните ответы.';
 if(a.flowers==='none'&&['rose','whitefloral','softfloral','powder'].includes(a.focus))return 'Вы выбрали цветочный аккорд, но отказались от цветочного направления. Уточните ответ.';
 return '';
}
export function rank(products,a){
 if(conflicts(a)||!facets[a.focus]||!directions[a.direction])return [];
 const profiles=new Map(products.map(p=>[p.id,profile(p)]));
 const liked=list(a.liked).map(id=>({p:products.find(p=>p.id===id),f:profiles.get(id)})).filter(x=>x.f);
 const disliked=list(a.disliked).map(id=>profiles.get(id)).filter(Boolean);
 const blocked=new Set(list(a.avoid));if(a.sweetness==='dry'){blocked.add('vanilla');blocked.add('gourmand');}
 const dir= directions[a.direction][2];
 return products.flatMap(p=>{
  if(p.available===false||!Number.isFinite(p.price)||p.price<=0||list(a.disliked).includes(p.id)||list(a.liked).includes(p.id))return [];
  if(a.gender!=='any'&&['MALE','FEMALE'].includes(p.gender)&&p.gender!==a.gender)return [];
  const f=profiles.get(p.id);if(!f.notes.size||[...blocked].some(k=>f.evidence[k]?.length))return [];
  if([...blocked].some(k=>['gourmand','leather','aquatic','powder'].includes(k)&&f.vector[k]>0))return [];
  const total=Object.values(f.vector).reduce((x,y)=>x+y,0)||1;
  const focus=f.vector[a.focus]||0,share=focus/total;
  const directionShare=dir.reduce((s,k)=>s+f.vector[k],0)/total;
  const strongest=Math.max(...Object.values(f.vector));
  const exact=focus>=.75 && share>=.12 && focus>=strongest*.7;
  if(!exact && !(a.explore==='balanced'&&focus>=.55&&share>=.08&&directionShare>=.28))return [];
  if(a.flowers==='none'&&(p.families||[]).some(x=>/цветоч/i.test(x)))return [];
  let score=28*Math.min(1,focus/2)+30*share+12*directionShare;
  const reasons=[];
  if(f.evidence[a.focus].length)reasons.push('Ваш аккорд: '+f.evidence[a.focus].slice(0,3).join(', '));
  else reasons.push('Семейство из каталога: '+(p.families||[]).join(', '));
  const baseMatches=list(a.base).filter(k=>f.base[k]>0);
  if(baseMatches.length){score+=8*baseMatches.length;reasons.push('В сердце или базе: '+[...new Set(baseMatches.flatMap(k=>f.baseEvidence[k]))].slice(0,3).join(', '));}
  else if(list(a.base).length)score-=8;
  const sweet=(f.vector.vanilla+f.vector.gourmand)/total;
  if(a.sweetness==='sweet')score+=18*Math.min(1,sweet*3);
  if(a.sweetness==='balanced')score-=22*Math.max(0,sweet-.22);
  if(facets[a.flowers])score+=8*Math.min(1,f.vector[a.flowers]);
  const exactNotes=list(a.notes).filter(n=>f.notes.has(norm(n)));
  if(exactNotes.length){score+=10*exactNotes.length;reasons.push('Вы хотели попробовать: '+exactNotes.join(', '));}
  if(liked.length){const matches=liked.map(x=>({...x,sim:similarity(f,x.f)})).sort((x,y)=>y.sim-x.sim);score+=24*matches[0].sim;if(matches[0].sim>=.35){const shared=(p.notes||[]).filter(n=>matches[0].f.notes.has(norm(n)));if(shared.length)reasons.push('Общее с '+matches[0].p.name+': '+shared.slice(0,3).join(', '));}}
  if(disliked.length)score-=32*Math.max(...disliked.map(x=>similarity(f,x)));
  if(score<25)return [];
  return [{...p,score:Math.round(score*100)/100,reasons:reasons.slice(0,3),match:exact?'По главному аккорду':'Соседний оттенок',profile:f}];
 }).sort((a,b)=>b.score-a.score||a.name.localeCompare(b.name,'ru')||a.id-b.id);
}
export function selectEight(ranked,budget){
 const cap=budget==='any'?Infinity:Number(budget);
 if(ranked.length<8)return [];
 const cents=p=>Math.round(p.price*100);
 // Exact cardinality knapsack: optimise relevance under the budget, never add an unqualified perfume.
 if(!Number.isFinite(cap))return ranked.slice(0,8);
 const max=Math.round(cap*100),dp=Array.from({length:9},()=>new Map());dp[0].set(0,{score:0,items:[]});
 for(const p of ranked){const price=cents(p);for(let count=8;count>=1;count--){for(const [cost,state] of dp[count-1]){const next=cost+price;if(next>max)continue;const score=state.score+p.score;if(!dp[count].has(next)||score>dp[count].get(next).score)dp[count].set(next,{score,items:[...state.items,p]});}}}
 const best=[...dp[8]].sort((a,b)=>b[1].score-a[1].score||a[0]-b[0])[0];
 return best?best[1].items.sort((a,b)=>b.score-a.score||a.id-b.id):[];
}
export function totals(items){const samples=items.reduce((s,p)=>s+Math.round(p.price*100),0);const shipping=samples>=10000?0:495;return {samples:samples/100,packaging:0,shipping:shipping/100,total:(samples+shipping)/100};}
export function profileSummary(a){return [directions[a.direction]?.[0],facets[a.focus]?.[0],a.sweetness==='dry'?'Без десертных нот':a.sweetness==='sweet'?'Со сладкими нотами':'',...list(a.base).map(k=>facets[k]?.[0])].filter(Boolean).join(' · ');}
