import assert from "node:assert/strict";
import test from "node:test";
import {fragranceBrandContact} from "../src/shared/lib/fragrance-brand-contacts";

test("exact normalized catalog brand links to its public contact",()=>{
 const value=fragranceBrandContact("  Dries  Van Noten ");
 assert.equal(value?.email,"contact@driesvannoten.com");
 assert.equal(new URL(value!.website).hostname,"www.driesvannoten.com");
});
test("no invented contacts or fallback to a similarly named house",()=>{
 assert.equal(fragranceBrandContact("Other Xerjoff"),undefined);
 assert.equal(fragranceBrandContact("Tiziana Terenzi")?.email,undefined);
});
