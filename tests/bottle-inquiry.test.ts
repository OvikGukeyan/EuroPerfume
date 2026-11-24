import assert from "node:assert/strict";
import { test } from "node:test";
import { bottleInquiry } from "../src/shared/lib/bottle-inquiry";
test("inquiry keeps exact bottle identity and safely encodes subject/body", () => {
  const link = bottleInquiry({id:123,name:"Test & scent\nBcc: nobody",ml:75,locale:"de"})!;
  assert.ok(link.startsWith("mailto:europerfumeshop@gmail.com?subject="));
  const params = new URLSearchParams(link.split("?")[1]);
  assert.deepEqual([...params.keys()], ["subject", "body"]);
  assert.ok(params.get("body")!.includes("75 ml (Artikel 123)"));
  assert.ok(!params.get("subject")!.includes("\n"));
});
test("invalid bottle identity cannot create inquiry", () => {
  for (const id of [0,-1,NaN,1.5]) assert.equal(bottleInquiry({id,name:"Test",ml:100,locale:"ru"}),null);
  assert.equal(bottleInquiry({id:1,name:"Test",ml:NaN,locale:"ru"}),null);
});
