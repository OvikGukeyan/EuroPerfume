import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const newProducts = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
      include: {
        variations: true,
        productGroup: true,
      },
    });

    return NextResponse.json(newProducts);
  } catch (error) {
    console.error("Error fetching new products:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
