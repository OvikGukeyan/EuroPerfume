import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = Number((await params).id);
    if (isNaN(id)) {
      return NextResponse.json(
        { message: "Invalid texture ID" },
        { status: 400 }
      );
    }
    await prisma.texture.delete({
      where: { id },
    });

    const updatedTextures = await prisma.texture.findMany({
      orderBy: { id: "asc" },
    });

    return NextResponse.json(updatedTextures);
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong", error },
      { status: 500 }
    );
  }
}
