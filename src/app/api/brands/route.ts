import { prisma } from "@/prisma/prisma-client";
import { getUserSession } from "@/src/shared/lib/get-user-session";
import { UserRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const brands = await prisma.brand.findMany();
  return NextResponse.json(brands);
}

export async function POST(req: NextRequest) {
  const user = await getUserSession();
  if (!user || user.role !== UserRole.ADMIN) {
    throw new Error("Access denied");
  }
  const { data } = await req.json();
  const brand = await prisma.brand.create({
    data,
  });
  return NextResponse.json(brand);
}
