import { prisma } from "@/prisma/prisma-client";
import { getUserSession } from "@/src/shared/server-lib/get-user-session";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const user = await getUserSession();
    const isAdmin = user?.role === "ADMIN";

    const limit = req.nextUrl.searchParams.get("limit") || "5";
    const query = req.nextUrl.searchParams.get("query") || "";
    const products = await prisma.product.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            brand: {
              name: {
                contains: query,
                mode: "insensitive",
              },
            },
          },
        ],
        available: isAdmin ? undefined : true,
      },
      include: {
        variations: true,
        brand: true,
      },
      take: Number(limit),
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
