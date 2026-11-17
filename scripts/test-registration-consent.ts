import assert from 'node:assert/strict';
import {registrationSchema,hasMarketingConsent,consentCopy} from '../src/shared/lib/registration-consent';
const base={fullName:'Alex Beispiel',email:'alex@example.com',password:'Strong-pass-123',confirmPassword:'Strong-pass-123',acceptPolicy:true,locale:'de' as const};
for(const locale of ['ru','de']){
 const schema=registrationSchema(locale);
 assert.ok(schema.safeParse({...base,locale}).success,'Registration must not require marketing opt-in');
 assert.equal(schema.parse({...base,locale}).marketingOptIn,false,'Advertising is off by default');
 assert.equal(schema.safeParse({...base,locale,acceptPolicy:false,marketingOptIn:true}).success,false,'Marketing cannot substitute for accepting terms');
 assert.equal(schema.safeParse({...base,locale,confirmPassword:'different'}).success,false);
 assert.equal(schema.safeParse({...base,locale,password:'123'}).success,false);
 assert.equal(schema.safeParse({...base,locale,email:'bad'}).success,false);
}
assert.equal(hasMarketingConsent(null),false);
assert.equal(hasMarketingConsent({marketingConfirmedAt:null,marketingWithdrawnAt:null}),false);
assert.equal(hasMarketingConsent({marketingConfirmedAt:new Date(),marketingWithdrawnAt:null}),true);
assert.equal(hasMarketingConsent({marketingConfirmedAt:new Date(),marketingWithdrawnAt:new Date()}),false);
assert.ok(!/[А-Яа-яЁё]/.test(Object.values(consentCopy.de).join(' ')));
console.log('Registration: required terms, optional marketing, localized validation and revoked/pending subscription checks passed');
