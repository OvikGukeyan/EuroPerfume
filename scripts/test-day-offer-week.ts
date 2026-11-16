import assert from "node:assert/strict";
import { offerWeekSlots } from "../src/shared/lib/day-offer-week";
import { dayOfferActive } from "../src/shared/lib/day-offer";

const current=offerWeekSlots(new Date("2026-11-16T19:00:00Z"));
assert.equal(current.current.start.toISOString(),"2026-11-15T23:00:00.000Z");
assert.equal(current.current.end.toISOString(),"2026-11-22T23:00:00.000Z");
assert.equal(current.next.start.toISOString(),current.current.end.toISOString());
assert.equal(current.next.end.toISOString(),"2026-11-29T23:00:00.000Z");
assert.equal(dayOfferActive({dayOfferStartsAt:current.current.start,dayOfferEndsAt:current.current.end},Date.parse("2026-11-22T22:59:59Z")),true);
assert.equal(dayOfferActive({dayOfferStartsAt:current.current.start,dayOfferEndsAt:current.current.end},Date.parse("2026-11-22T23:00:00Z")),false);
assert.equal(dayOfferActive({dayOfferStartsAt:current.next.start,dayOfferEndsAt:current.next.end},Date.parse("2026-11-22T23:00:00Z")),true);
const monday=offerWeekSlots(new Date("2026-11-22T23:00:00Z"));
assert.equal(monday.current.start.toISOString(),current.next.start.toISOString());
const spring=offerWeekSlots(new Date("2026-03-23T12:00:00Z"));
assert.equal((spring.current.end.getTime()-spring.current.start.getTime())/3600000,167,"Spring DST week has 167 hours");
const autumn=offerWeekSlots(new Date("2026-10-19T12:00:00Z"));
assert.equal((autumn.current.end.getTime()-autumn.current.start.getTime())/3600000,169,"Autumn DST week has 169 hours");
console.log("Weekly offer tests passed: Monday boundary, next-week continuity, DST spring/autumn.");
