import assert from 'node:assert/strict';
import {deliveryStage,trackingUrl,demoAccount} from '../src/shared/lib/customer-account';
assert.equal(deliveryStage({status:'NEW',tracking:null,shipmentStatus:null}),0);
assert.equal(deliveryStage({status:'PENDING',tracking:null,shipmentStatus:null}),0);
assert.equal(deliveryStage({status:'SUCCEEDED',tracking:'123',shipmentStatus:'CREATED'}),1,'a shipping label alone is not a dispatched parcel');
assert.equal(deliveryStage({status:'SUCCEEDED',tracking:'123',shipmentStatus:'IN_TRANSIT'}),2);
assert.equal(deliveryStage({status:'SUCCEEDED',tracking:'123',shipmentStatus:'DELIVERED'}),3);
assert.equal(deliveryStage({status:'CENCELLED',tracking:'123',shipmentStatus:'DELIVERED'}),-1);
assert.equal(trackingUrl('unknown','123'),null);
assert.equal(trackingUrl('DHL',null),null);
assert.ok(trackingUrl('DHL','a&b')?.endsWith('a%26b'));
for(const order of demoAccount().orders){assert.equal(Math.round(((order.subtotal||0)+(order.shipping||0)-(order.discount||0))*100),Math.round(order.total*100));assert.equal(Math.round(order.items.reduce((sum,i)=>sum+(i.total||0),0)*100),Math.round((order.subtotal||0)*100));}
console.log('Customer account status, tracking and demo totals passed');
