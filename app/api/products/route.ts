import { findProducts, GetSearchParams } from "@/shared/lib/find-products";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const params = Object.fromEntries(req.nextUrl.searchParams.entries())
  const data = await findProducts(params as GetSearchParams)
  return NextResponse.json(data);
}
