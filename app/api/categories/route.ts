import { prisma } from '@/prisma/prisma-client';
import { categories, productGroups } from './../../../prisma/constants';
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const data = await prisma.category.findMany({
        include: {
            productGroups: true
        }
    });
    return NextResponse.json(data);
}
