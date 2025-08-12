import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const slides = await prisma.slide.findMany({
        include: {
            images: true
        }
    });
    return NextResponse.json(slides);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const id = Number((await params).id);
    if(!id) {
        return NextResponse.json({ message: 'Id not found' }, { status: 400 });
    }
    await prisma.slide.delete({
        where: {
            id: Number(id)
        }
    })
    return NextResponse.json({ message: 'Slide deleted' }, { status: 200 });
}
