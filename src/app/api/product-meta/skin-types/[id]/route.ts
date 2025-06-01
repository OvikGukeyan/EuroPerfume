import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = Number((await params).id);
    if (isNaN(id)) {
      return NextResponse.json(
        { message: "Invalid skin type ID" },
        { status: 400 }
      );
    }
    await prisma.skinType.delete({
      where: { id },
    });

    const updatedSkinTypes = await prisma.skinType.findMany({
      orderBy: { id: "asc" },
    });

    return NextResponse.json(updatedSkinTypes);
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong", error },
      { status: 500 }
    );
  }
}
