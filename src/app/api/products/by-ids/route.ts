import { fullBottleInclude, withBottleOptions, isCatalogDraftProduct } from "@/src/shared/lib/full-bottle";
import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const ids = req.nextUrl.searchParams.get("ids")?.split(",").map(Number).filter(id => Number.isSafeInteger(id) && !isCatalogDraftProduct(id)) ?? [];
    if (!ids.length) return NextResponse.json([]);
    const products = await prisma.product.findMany({
        where: {
            bottleParentId:null,
            OR:[{id:{in:ids}},{fullBottles:{some:{id:{in:ids}}}}],
        },
        include: {
            variations: {
                where: {
                    available: true
                }
            },
            fullBottles:fullBottleInclude,
            brand: true,
            productGroup: true,
        },
    });
    return NextResponse.json(products.map(p=>({...withBottleOptions(p),price:p.price.toNumber(),discountPrice:p.discountPrice?.toNumber()??null})));
}