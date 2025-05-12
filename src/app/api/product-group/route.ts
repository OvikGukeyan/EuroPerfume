import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try{
    const data = await prisma.productGroup.findMany();
    return NextResponse.json(data);
  }catch(e: any) {
    console.error(e);
    return NextResponse.json({ message: e.message || "Internal Server Error" }, { status: 500 });
  }
 
}

export async function POST(req: NextRequest) {
  try{
    const { data } = await req.json();
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
  }catch (e: any) {
    console.error("Error [CREATE PRODUCT GROUP]:", e);
  
    return NextResponse.json(
      { message: e?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
  
};

