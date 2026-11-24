import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { planPilot } from "../src/shared/lib/supplier-pilot-plan";

const [source, destination] = process.argv.slice(2);
if (!source || !destination || resolve(source) === resolve(destination)) {
  throw new Error("Provide distinct private source and output JSON paths");
}
const bundle = JSON.parse(readFileSync(source, "utf8"));
// Both inputs are review snapshots, not authority to create or update Product records.
const plan = planPilot(bundle.candidates, bundle.catalog);
writeFileSync(destination, JSON.stringify(plan, null, 2), { encoding: "utf8", flag: "wx" });
console.log(`Saved ${plan.proposals.length} draft proposals. No database writes.`);
