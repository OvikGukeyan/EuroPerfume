import { prisma } from "@/prisma/prisma-client";
import { getUserSession } from "@/shared/lib/get-user-session";
import { UserRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const user = await getUserSession();
    if (!user || user.role !== UserRole.ADMIN) {
      throw new Error("Access denied");
    }

    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            variation: true,
          },
        },
      },
    });
    
    return NextResponse.json(orders);
  } catch (error) {
    console.log("[ORDERS_GET] Server error", error);
    return NextResponse.json(
      { message: "Failed to get orders" },
      { status: 500 }
    );
  }
}
