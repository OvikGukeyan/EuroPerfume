import { NextResponse } from "next/server";
import { discoveryCatalog } from "@/src/shared/server-lib/discovery-catalog";
export const dynamic = "force-dynamic";
export async function GET() {
  try { return NextResponse.json({ products: await discoveryCatalog(), syncedAt: new Date().toISOString() }, { headers: { "Cache-Control": "no-store" } }); }
  catch { return NextResponse.json({ error: "Каталог временно недоступен. Попробуйте ещё раз." }, { status: 503 }); }
}
