import { fragranceName } from "@/src/shared/lib/full-bottle";
import { prisma } from "@/prisma/prisma-client";
import { getUserSession } from "@/src/shared/server-lib/get-user-session";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const user = await getUserSession();
    const isAdmin = user?.role === "ADMIN";
    const includeVariants = isAdmin && req.nextUrl.searchParams.get("adminVariants")==="1";

    const limit = req.nextUrl.searchParams.get("limit") || "5";
    const query = req.nextUrl.searchParams.get("query") || "";
    const products = await prisma.product.findMany({
      where: {
        bottleParentId: includeVariants ? undefined : null,
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
        AND: isAdmin ? undefined : [{OR:[{available:true},{fullBottles:{some:{allowBackorder:true}}}]}],
      },
      include: {
        variations: true,
        brand: true,
      },
      take: Number(limit),
    });

    return NextResponse.json(products.map(p=>({...p,name:includeVariants ? p.name : fragranceName(p.name)})));
  } catch (error) {
    console.error("Error fetching products:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
