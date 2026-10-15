import { NextRequest, NextResponse } from "next/server";
import { discoveryCatalog, validDiscoveryIds } from "@/src/shared/server-lib/discovery-catalog";
export const dynamic = "force-dynamic";
export async function GET(req: NextRequest) {
  const ids = (req.nextUrl.searchParams.get("ids") || "").split(",").map(Number);
  if (!validDiscoveryIds(ids)) return NextResponse.json({ error: "Выберите восемь разных ароматов." }, { status: 400 });
  try { return NextResponse.json({ products: await discoveryCatalog(ids), checkedAt: new Date().toISOString() }, { headers: { "Cache-Control": "no-store" } }); }
  catch { return NextResponse.json({ error: "Не удалось проверить наличие. Попробуйте снова." }, { status: 503 }); }
}
