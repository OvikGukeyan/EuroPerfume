import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const data = await prisma.productGroup.findMany();
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const { data } = await req.json();
  console.log(data);
  const productGroup = await prisma.productGroup.create({
    data: {
      labelRu: data.labelRu,
      labelDe: data.labelDe,
      category: {
        connect: {
          id: data.categoryId,
        },
      }
    },
  });
  return NextResponse.json(productGroup);
}
