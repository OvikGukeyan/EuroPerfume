import assert from "node:assert/strict";
import test from "node:test";
import {orderFulfillmentBlock} from "../src/shared/lib/order-fulfillment-shortcuts";

const eligible = {cancelled:false,hasInvoice:true,clubEligible:true,awardsEnabled:true,hasPricing:true};
test("eligible order requires the same invoice, award switch and pricing prerequisites",()=>{
 assert.equal(orderFulfillmentBlock(eligible),null);
 assert.equal(orderFulfillmentBlock({...eligible,hasInvoice:false}),"INVOICE_REQUIRED_BEFORE_LOYALTY_AWARD");
 assert.equal(orderFulfillmentBlock({...eligible,awardsEnabled:false}),"BONUS_AWARD_NOT_LIVE");
 assert.equal(orderFulfillmentBlock({...eligible,hasPricing:false}),"PRICING_SNAPSHOT_REQUIRED");
});
test("guest order can be marked after invoicing without depending on club points",()=>{
 const guest={...eligible,clubEligible:false,awardsEnabled:false,hasPricing:false};
 assert.equal(orderFulfillmentBlock(guest),null);
 assert.equal(orderFulfillmentBlock({...guest,cancelled:true}),"ORDER_CANCELLED");
 assert.equal(orderFulfillmentBlock({...guest,hasInvoice:false}),"INVOICE_REQUIRED_BEFORE_LOYALTY_AWARD");
});
