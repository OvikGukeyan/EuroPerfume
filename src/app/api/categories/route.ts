import { prisma } from '@/prisma/prisma-client';
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const data = await prisma.category.findMany({
        include: {
            productGroups: true
        },
        orderBy: {
            id: 'asc'
        }
    
    });
    return NextResponse.json(data);
}
