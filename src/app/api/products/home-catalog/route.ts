import { NextRequest, NextResponse } from "next/server";
import { getHomeCatalog } from "@/src/shared/server-lib/get-home-catalog";

export async function GET(request: NextRequest) {
  const value = request.nextUrl.searchParams.get("cursor");
  const cursor = value === null ? undefined : Number(value);
  if (cursor !== undefined && (!Number.isSafeInteger(cursor) || cursor <= 0)) {
    return NextResponse.json({ error: "Invalid cursor" }, { status: 400 });
  }
  try {
    return NextResponse.json(await getHomeCatalog(cursor, { sale: request.nextUrl.searchParams.get("sale") === "1" }), { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Home catalogue could not be loaded", error);
    return NextResponse.json({ error: "Catalogue unavailable" }, { status: 503 });
  }
}
