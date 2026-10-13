import { NextResponse } from "next/server";
import { TAX_SETTINGS } from "@/src/config/tax";
import { taxPolicyAt } from "@/src/shared/lib/tax";

export const dynamic = "force-dynamic";
export async function GET() {
  const now = new Date();
  return NextResponse.json({ ...taxPolicyAt(now), effectiveAt: TAX_SETTINGS.VAT_START_AT, remainingMs: Math.max(0, new Date(TAX_SETTINGS.VAT_START_AT).getTime() - now.getTime()) }, { headers: { "Cache-Control": "no-store" } });
}
