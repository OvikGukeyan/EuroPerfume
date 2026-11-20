import {renderToStaticMarkup} from "react-dom/server";
import {ProductIngredients} from "../src/shared/components/shared/product-ingredients";
import test from 'node:test';
import assert from 'node:assert/strict';
import {resolveIngredients,needsIngredientReview} from '../src/shared/lib/fragrance-ingredients';
test('INCI is shared across locales and saved packaging text takes precedence',()=>{
 assert.equal(resolveIngredients(369,[{language:'DE',activeIngredients:'Alcohol Denat., Parfum, Aqua'}],'ru').inci,'Alcohol Denat., Parfum, Aqua');
 assert.equal(resolveIngredients(369,[],'ru').source?.brand,'Amouage');
 assert.equal(resolveIngredients(999,[],'de').inci,'');
});
test('legacy ingredient lists are flagged without silently rewriting the formula',()=>{
 for(const text of ['Butylphenyl Methylpropional','Buty|phenyl Methylpropional','Hydroxyisohexyl 3-Cyclohexene Carboxaldehyde']) assert.equal(needsIngredientReview(text),true);
 assert.equal(needsIngredientReview('Alcohol Denat., Parfum, Limonene'),false);
});

test('La Cautiva saved INCI remains visible with explicit review warning on both storefront locales',()=>{
 const saved='Alcohol Denat., Parfum, Butylphenyl Methylpropional, Limonene';
 for(const locale of ['ru','de']){
  const html=renderToStaticMarkup(ProductIngredients({
   productId:581,translations:[{language:'RU',activeIngredients:saved},{language:'DE',activeIngredients:saved}],locale
  }));
  assert.ok(html.includes('Butylphenyl Methylpropional'),'existing list must not disappear');
  assert.ok(html.includes('role="status"'),'flagged list has a visible warning');
  assert.ok(html.includes(locale==='de'?'Inhaltsstoffe':'Состав'));
 }
});
test('missing INCI uses honest request-for-verification notice, not fabricated ingredients',()=>{
 const html=renderToStaticMarkup(ProductIngredients({productId:999999,translations:[],locale:'de'}));
 assert.ok(html.includes('Die vollständige Inhaltsstoffliste'));
 assert.equal(html.includes('role="status"'),false);
});
test('unflagged saved ingredient list remains visible in both languages',()=>{
 const saved='Alcohol Denat., Parfum, Aqua, Limonene';
 for (const locale of ['ru','de']){
  const html=renderToStaticMarkup(ProductIngredients({productId:581,translations:[{language:'DE',activeIngredients:saved}],locale}));
  assert.ok(html.includes(saved));
  assert.equal(html.includes('role="status"'),false);
 }
});
