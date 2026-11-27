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
test("guest/non-member cannot use bonus confirmations, even with an invoice",()=>{
 assert.equal(orderFulfillmentBlock({...eligible,clubEligible:false}),"ACCOUNT_NOT_VERIFIED_AT_ORDER");
 assert.equal(orderFulfillmentBlock({...eligible,cancelled:true}),"ORDER_CANCELLED");
});
