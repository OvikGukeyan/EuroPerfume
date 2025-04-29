import { prisma } from "prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const data = await prisma.productGroup.findMany();
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const { data } = await req.json();
  const productGroup = await prisma.productGroup.create({
    data: {
      name: data.name,
      categoryId: data.categoryId,
    },
  });
  return NextResponse.json(productGroup);
}
