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
