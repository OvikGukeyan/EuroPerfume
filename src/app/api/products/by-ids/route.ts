import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const ids = req.nextUrl.searchParams.get("ids")?.split(",").map(Number);
    const products = await prisma.product.findMany({
        where: {
            id: {
                in: ids,
            },
        },
        include: {
            variations: true,
        },
    });
    return NextResponse.json(products);
}